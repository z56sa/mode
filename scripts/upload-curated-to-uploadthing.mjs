import { UTApi } from "uploadthing/server";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config({ path: ".env.local" });

const utToken = process.env.UPLOADTHING_TOKEN?.replace(/['"]/g, "");
const utapi = new UTApi({ token: utToken });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PACK_DEFS = [
  {
    name: "mode-ultimate-survival-toolkit",
    title: "حقيبة البقاء الشاملة (Survival Pro Pack)",
    game: "Minecraft",
    category: "أدوات",
    desc: "حزمة أدوات وتعديلات استكشاف متكاملة مجمعة من منصة mode ومستضافة سحابياً عبر Uploadthing.",
    content: JSON.stringify({
      version: "2.5.0",
      type: "toolkit",
      features: ["Auto-Compass", "Backpack Pro", "Map Coordinates", "Waypoint Marker"],
      generatedBy: "mode Platform 2026",
    }, null, 2)
  },
  {
    name: "mode-cinematic-visual-enhancer",
    title: "مُحسّن الرسوميات والسينمائيات (Cinematic Shaders)",
    game: "Cyberpunk 2077",
    category: "الرسوميات",
    desc: "ملف إعدادات وتحسين جودة الإضاءة والظلال وHDR مجهز ومستضاف سحابياً على Uploadthing.",
    content: "[Graphics]\nRayTracing=Ultra\nColorGrading=CinematicWarm\nShadowResolution=4096\nBloom=0.85\nMode=UltraReal\n"
  },
  {
    name: "mode-tactical-hud-overhaul",
    title: "واجهة المستخدم التكتيكية (Tactical HUD Pro)",
    game: "Fallout 4",
    category: "تحسينات اللعب",
    desc: "تعديل واجهة المستخدم لتصبح مريحة وبألوان قابلة للتخصيص بدون استهلاك موارد الخادم.",
    content: JSON.stringify({
      hud: "tactical_v4",
      opacity: 0.9,
      elements: ["health_bar", "ammo_counter", "quest_tracker", "stamina_meter"],
      arabicSupport: true
    }, null, 2)
  },
  {
    name: "mode-elden-rebalance-patch",
    title: "باتش موازنة القتال الشامل (Combat Rebalance)",
    game: "Elden Ring",
    category: "تحسينات اللعب",
    desc: "ملف موازنة سرعة التدحرج واستهلاك الـ Stamina لقتال أكثر سلاسة وحيوية.",
    content: "[GameplayRebalance]\nStaminaRegenRate=1.25\nPoiseDamageMult=1.1\nEquipLoadThreshold=0.72\n"
  },
  {
    name: "mode-space-exploration-bundle",
    title: "حزمة استكشاف الكواكب المتقدمة",
    game: "Valheim",
    category: "الاستكشاف",
    desc: "حزمة مخصصة للمغامرين تشمل بوصلة بحرية متقدمة وتعديلات خرائط مضافة ومستضافة عبر Uploadthing.",
    content: JSON.stringify({
      mod: "valheim_navigator",
      windAssistance: true,
      mapPins: "extended",
      host: "uploadthing"
    }, null, 2)
  }
];

async function main() {
  console.log("=== Creating and Uploading Curated Mod Packages to Uploadthing ===");
  
  for (const pack of PACK_DEFS) {
    const fileName = `${pack.name}.zip`;
    const buffer = Buffer.from(pack.content, "utf-8");
    const blob = new Blob([buffer], { type: "application/zip" });
    const file = new File([blob], fileName, { type: "application/zip" });
    
    console.log(`Uploading ${fileName} to Uploadthing...`);
    try {
      const uploadRes = await utapi.uploadFiles([file]);
      const fileData = Array.isArray(uploadRes) ? uploadRes[0]?.data : uploadRes.data;
      const fileUrl = fileData?.ufsUrl || fileData?.url;
      console.log(`Uploaded: ${fileUrl}`);

      if (fileUrl) {
        const slug = pack.name;
        await db.execute({
          sql: `INSERT INTO mods (
            title, slug, game, game_genre, category, description,
            image_url, download_url, download_file_name, author, version, status
          ) VALUES (?, ?, ?, 'Action', ?, ?, ?, ?, ?, 'mode Cloud Storage', '1.0.0', 'approved')
          ON CONFLICT(slug) DO UPDATE SET download_url = excluded.download_url, description = excluded.description`,
          args: [
            pack.title,
            slug,
            pack.game,
            pack.category,
            pack.desc,
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
            fileUrl,
            fileName
          ]
        });
        console.log(`Registered in Turso with Uploadthing URL!`);
      }
    } catch (e) {
      console.error(`Error uploading ${fileName}:`, e.message);
    }
  }

  console.log("Done uploading to Uploadthing & registering in Turso!");
}

main().catch(console.error);
