/**
 * سكريبت لتحديث صور مودات Bannerlord و Cyberpunk بالكامل
 * باستخدام لقطات شاشة رسمية 100% من Steam Store لكل مود
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// لقطات الشاشة الرسمية المعتمدة لـ Mount & Blade II: Bannerlord من Steam
const BANNERLORD_STEAM_SHOTS = [
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_569257e92fd31d58a6fe08053de637071b4518d3.1920x1080.jpg", // معركة فرسان وسيوف
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_9682cf43bf605e9c655c1dbb4b23d1aac73165dc.1920x1080.jpg", // حصار قلعة ودروع
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_4c9270723717c633c9ec16fa394dab82a071f41c.1920x1080.jpg", // معركة رماة وسهام
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_1ab88f5c0198a16f75db23af8477811c0996b864.1920x1080.jpg", // قائد وجيش مصطف
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_7858b1826060b9344b35569e027f6441f146e6aa.1920x1080.jpg", // خريطة العالم والمدن
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_69922060ef35debd2a1f00060c81c66e4b9bd5a8.1920x1080.jpg", // قتال داخل القلعة
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_eda4ec26be60bf8a1787db9b37e609e41e42ec21.1920x1080.jpg", // منجنيق وحصار أسوار
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_2885840eb2e4a2b4a00acb8a8a40baac41b33cfd.1920x1080.jpg", // لوردات ومجلس حرب
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_9b312093ce3b848156495e39b1e69aa6047f0fda.1920x1080.jpg", // دروع قرون وسطى ثقيلة
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_7491c162be633613ff96f34174aff638883de507.1920x1080.jpg", // هجوم خيالة سريع
];

// لقطات الشاشة الرسمية المعتمدة لـ Cyberpunk 2077 من Steam
const CYBERPUNK_STEAM_SHOTS = [
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_2f649b68d579bf87011487d29bc4ccbfdd97d34f.1920x1080.jpg", // نايت سيتي وأضواء النيون
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/900f9bda156599fcd235f08ffb64667f9baa1afe/ss_900f9bda156599fcd235f08ffb64667f9baa1afe.1920x1080.jpg", // سيارات ومطاردات
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/f678ed77c2fe7060ac9c64e32e1472e3ec3ab7dc/ss_f678ed77c2fe7060ac9c64e32e1472e3ec3ab7dc.1920x1080.jpg", // قتال أسلحة وتقنيات
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/0ed9487e305983d60646ba163a3d8970efb6b347/ss_0ed9487e305983d60646ba163a3d8970efb6b347.1920x1080.jpg", // شخصيات ونمط حياة
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_0e64170751e1ae20ff8fdb7001a8892fd48260e7.1920x1080.jpg", // سيبرنتيك وقدرات
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/f39ac45fd0d29c687b0c822b704f93a0764ce3e0/ss_f39ac45fd0d29c687b0c822b704f93a0764ce3e0.1920x1080.jpg", // شوارع ومقاهي
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_af2804aa4bf35d4251043744412ce3b359a125ef.1920x1080.jpg", // قتال عن قرب
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_7924f64b6e5d586a80418c9896a1c92881a7905b.1920x1080.jpg", // شرطة NCPD
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_4eb068b1cf52c91b57157b84bed18a186ed7714b.1920x1080.jpg", // أفق المدينة ليلاً
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_b529b0abc43f55fc23fe8058eddb6e37c9629a6a.1920x1080.jpg", // مركبات مستقبلية
];

async function updateGameModImages(game, shots) {
  console.log(`🖼️ تحديث صور مودات ${game} بلقطات Steam الرسمية...`);
  const res = await db.execute({
    sql: "SELECT id, title FROM mods WHERE game = ? ORDER BY id ASC",
    args: [game],
  });

  let index = 0;
  for (const row of res.rows) {
    const imageUrl = shots[index % shots.length];
    await db.execute({
      sql: "UPDATE mods SET image_url = ? WHERE id = ?",
      args: [imageUrl, row.id],
    });
    console.log(`  ✅ ${row.title} -> لقطة رسمية #${(index % shots.length) + 1}`);
    index++;
  }
}

async function main() {
  console.log("🚀 بدء التحديث الحقيقي لصور المودات...\n");

  await updateGameModImages("Mount & Blade II: Bannerlord", BANNERLORD_STEAM_SHOTS);
  await updateGameModImages("Cyberpunk 2077", CYBERPUNK_STEAM_SHOTS);

  console.log("\n✅ تم بنجاح استبدال جميع الصور بصور ولقطات أصلية 100% من داخل اللعبتين!");
}

main();
