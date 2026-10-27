/**
 * AI Mod Helper Engine
 * 1. Semantic Idea-to-Mod Matcher (Search mods by natural Arabic concepts/ideas)
 * 2. Mod Code & Template Generator (Generate Lua, C# Harmony, JSON/Fabric structures from ideas)
 */

export interface IdeaSearchResult {
  keyword: string;
  category: string;
  relevanceExplanation: string;
  suggestedMods: {
    title: string;
    game: string;
    slug: string;
    why: string;
  }[];
}

export interface GeneratedModCode {
  title: string;
  game: string;
  framework: string;
  language: string;
  fileName: string;
  code: string;
  installationGuide: string[];
}

// Concept mapping for natural language search
const CONCEPT_MAPPINGS: Record<string, {
  keywords: string[];
  category: string;
  suggested: { title: string; game: string; slug: string; why: string }[];
}> = {
  "flying_travel": {
    keywords: ["طيران", "اطير", "طير", "طياره", "سفينه", "مركبه", "سياره", "مركبات", "قياده", "سواقه", "فضاء"],
    category: "مركبات وتنقل",
    suggested: [
      { title: "[simfphys] LUA Vehicles - Base", game: "Garry's Mod", slug: "simfphys", why: "يضيف فيزياء قيادة كاملة ومركبات قابلة للتخصيص والقيادة" },
      { title: "Filibuster Rhymes' Used Cars!", game: "Project Zomboid", slug: "filibuster-rhymes-used-cars", why: "يضيف أسطول سيارات وشاحنات واقعية قابلة للقيادة والإصلاح" },
      { title: "Real Traffic Density", game: "Euro Truck Simulator 2", slug: "real-traffic-density", why: "يحاكي كثافة وسرعة الشوارع وحركة المرور الواقعية" }
    ]
  },
  "combat_weapons": {
    keywords: ["سلاح", "اسلحه", "فرد", "رشاش", "مسدس", "قنبلة", "قتال", "دم", "رصاص", "حروب", "معارك", "دروع"],
    category: "أسلحة وقتال",
    suggested: [
      { title: "Brita's Weapon Pack", game: "Project Zomboid", slug: "britas-weapon-pack", why: "يحتوي على مئات الأسلحة النارية والبيضاء مع تعديلات دقيقة" },
      { title: "M9K Small Arms pack", game: "Garry's Mod", slug: "m9k-small-arms", why: "مجموعة أسلحة خفيفة ومتوسطة مع مؤثرات صوتية وبصرية واقعية" },
      { title: "Combat Extended", game: "RimWorld", slug: "combat-extended", why: "يعيد صياغة نظام المعارك بالكامل، الذخيرة، والدروع الواقية" },
      { title: "ArcCW Base: Arctic's Customizable Weapons", game: "Garry's Mod", slug: "arccw", why: "نظام أسلحة قابل للتعديل الفوري عبر تركيب قطع وملحقات" },
      { title: "Realistic Battle Mod", game: "Mount & Blade II: Bannerlord", slug: "realistic-battle-mod", why: "فيزياء قتال ومعارك تكتيكية واقعية لضربات السيوف وتأثير الدروع" }
    ]
  },
  "magic_skills": {
    keywords: ["سحر", "شعوذه", "طاقه", "مهارات", "تلفيل", "لفل", "شجرة مهارات", "قدرات", "خوارق"],
    category: "سحر وقدرات",
    suggested: [
      { title: "Apocalypse - Magic of Skyrim", game: "Skyrim Special Edition", slug: "apocalypse-magic-of-skyrim", why: "يضيف 155 تعويذة سحرية جديدة ومتوازنة للعبتك" },
      { title: "Ordinator - Perks of Skyrim", game: "Skyrim Special Edition", slug: "ordinator-perks-of-skyrim", why: "يعيد بناء وتوسيع شجرة المهارات بالكامل لخيارات لعب لامتناهية" },
      { title: "Calamity Mod", game: "Terraria", slug: "calamity-mod", why: "توسعة ضخمة بمئات الأسلحة والزعماء والأسحار الخارقة" }
    ]
  },
  "ui_quality_of_life": {
    keywords: ["ترتيب", "تخزين", "صناديق", "قوائم", "خريطه", "واجهه", "سهوله", "تسهيل", "مخزن", "تنظيم"],
    category: "تحسين جودة الحياة وواجهات",
    suggested: [
      { title: "Magic Storage", game: "Terraria", slug: "magic-storage", why: "نظام تخزين سحابي متطور يربط جميع الصناديق في واجهة واحدة للبحث والصناعة" },
      { title: "SkyUI", game: "Skyrim Special Edition", slug: "skyui", why: "تحويل واجهة اللعبة لقائمة سريعة وسهلة مخصصة للحاسب" },
      { title: "Common Sense", game: "Project Zomboid", slug: "common-sense", why: "إمكانية فتح الأبواب بالعتلة وحمل الأغراض بمنطقية وواقعية" },
      { title: "Recipe Browser", game: "Terraria", slug: "recipe-browser", why: "متصفح فوري للوصفات لمعرفة كيف تصنع أي عنصر بدون مغادرة اللعبة" },
      { title: "Move It", game: "Cities: Skylines", slug: "move-it", why: "أداة نقل وتعديل المباني والأشجار والطرق بحرية تامة" }
    ]
  },
  "cheats_sandbox": {
    keywords: ["فلوس", "ذهب", "غش", "تعديل شخصيه", "سرعه", "خلود", "منيو", "تريلر", "شيت"],
    category: "أدوات تحكم وغش وتعديل",
    suggested: [
      { title: "Bannerlord Cheats", game: "Mount & Blade II: Bannerlord", slug: "bannerlord-cheats", why: "قائمة متكاملة لإضافة الذهب، زيادة الخبرة، وتغيير سمات الشخصية بضغطة زر" },
      { title: "EdB Prepare Carefully", game: "RimWorld", slug: "edb-prepare-carefully", why: "تخصيص كامل للمستعمرين، المهارات، والمعدات قبل بدء اللعبة" },
      { title: "Appearance Menu Mod", game: "Cyberpunk 2077", slug: "appearance-menu-mod", why: "تغيير شكل الشخصيات، تبديل الملابس، وإعادة تشكيل البيئة" }
    ]
  }
};

export function searchModsByIdea(idea: string): IdeaSearchResult | null {
  const normalized = idea.toLowerCase().trim();
  
  for (const [key, concept] of Object.entries(CONCEPT_MAPPINGS)) {
    const matched = concept.keywords.some(kw => normalized.includes(kw));
    if (matched) {
      return {
        keyword: key,
        category: concept.category,
        relevanceExplanation: `عثرنا على مودات تطابق فكرتك حول (${concept.category}):`,
        suggestedMods: concept.suggested
      };
    }
  }

  return null;
}

// Mod Code Generator Templates
export function generateModCode(prompt: string, gameType: "skyrim" | "stardew" | "unity_bepinex" | "gmod_lua" | "minecraft"): GeneratedModCode {
  const cleanPrompt = prompt.trim() || "تعديل بسيط";

  if (gameType === "gmod_lua") {
    return {
      title: "سكريبت Lua لـ Garry's Mod",
      game: "Garry's Mod",
      framework: "GLua (Garry's Mod Lua API)",
      language: "lua",
      fileName: "custom_speed_mod.lua",
      code: `--[[
  فكرة المود: ${cleanPrompt}
  تم الإنشاء بواسطة mode AI Mod Generator
--]]

if SERVER then
    util.AddNetworkString("CustomModSync")

    hook.Add("PlayerInitialSpawn", "CustomMod_OnSpawn", function(ply)
        -- تطبيق الخصائص المبدئية للاعب
        ply:ChatPrint("[mode] تم تفعيل المود بنجاح: ${cleanPrompt}")
    end)

    -- مثال على مراقبة حركة أو أحداث اللاعب
    hook.Add("KeyPress", "CustomMod_KeyPress", function(ply, key)
        if key == IN_SPEED then
            -- عند الضغط على زر الركض (Shift)
            ply:SetWalkSpeed(350)
            ply:SetRunSpeed(600)
        end
    end)
end

if CLIENT then
    hook.Add("HUDPaint", "CustomMod_HUDIndicator", function()
        draw.SimpleText("${cleanPrompt}", "DermaDefault", 20, 20, Color(0, 255, 128), TEXT_ALIGN_LEFT)
    end)
end`,
      installationGuide: [
        "انسخ الكود واحفظه في ملف باسم `custom_mod.lua`.",
        "ضعه في المسار: `garrysmod/lua/autorun/server/custom_mod.lua`.",
        "ابدأ لعبة جديدة (Sandbox) وافتح شاشة الكونسول للتأكد من رسالة التفعيل."
      ]
    };
  }

  if (gameType === "stardew") {
    return {
      title: "إضافة C# لـ Stardew Valley (SMAPI)",
      game: "Stardew Valley",
      framework: "SMAPI C# Modding API",
      language: "csharp",
      fileName: "ModEntry.cs",
      code: `/*
  فكرة المود: ${cleanPrompt}
  مولد مودات mode AI
*/

using System;
using Microsoft.Xna.Framework;
using StardewModdingAPI;
using StardewModdingAPI.Events;
using StardewValley;

namespace CustomIdeaMod
{
    public class ModEntry : Mod
    {
        public override void Entry(IModHelper helper)
        {
            // الاستماع لضغطة الأزرار
            helper.Events.Input.ButtonPressed += OnButtonPressed;
            this.Monitor.Log("تم تفعيل مود (${cleanPrompt}) بنجاح!", LogLevel.Info);
        }

        private void OnButtonPressed(object sender, ButtonPressedEventArgs e)
        {
            if (!Context.IsWorldReady) return;

            // عند الضغط على زر F5 لتفعيل الميزة
            if (e.Button == SButton.F5)
            {
                Game1.addHUDMessage(new HUDMessage("تم تطبيق فكرة: ${cleanPrompt}", HUDMessage.achievement_type));
                // كود الوظيفة هنا: زيادة الطاقة أو الحركة
                Game1.player.addedSpeed = 2;
            }
        }
    }
}`,
      installationGuide: [
        "أنشئ مشروع C# Class Library واختر .NET 6 أو .NET 8.",
        "ثبّت حزمة Nuget: `Pathoschild.Stardew.ModBuildConfig`.",
        "احفظ ملف `manifest.json` بجوار الكود وضعهما في مجلد `Stardew Valley/Mods/YourMod`."
      ]
    };
  }

  if (gameType === "unity_bepinex") {
    return {
      title: "مود C# BepInEx & Harmony (لألعاب Valheim, Lethal Company, Bannerlord)",
      game: "Unity Game (BepInEx / Harmony)",
      framework: "BepInEx 5.x + HarmonyLib",
      language: "csharp",
      fileName: "Plugin.cs",
      code: `/*
  فكرة المود: ${cleanPrompt}
  مولد كود المودات الذكي من منصة mode
*/

using BepInEx;
using HarmonyLib;
using UnityEngine;

namespace CustomUnityMod
{
    [BepInPlugin("com.mode.custommod", "Custom Mod", "1.0.0")]
    public class Plugin : BaseUnityPlugin
    {
        private readonly Harmony harmony = new Harmony("com.mode.custommod");

        void Awake()
        {
            Logger.LogInfo("تم تفعيل مود: ${cleanPrompt}");
            harmony.PatchAll();
        }

        void Update()
        {
            // مراقبة ضغط مفتاح تفعيل الفكرة
            if (Input.GetKeyDown(KeyCode.F9))
            {
                Logger.LogInfo("تم تشغيل وظيفة: ${cleanPrompt}");
            }
        }
    }

    // مثال على Harmony Patch لتعديل وظيفة أصلية في اللعبة
    [HarmonyPatch(typeof(PlayerController), "Awake")]
    class PlayerPatch
    {
        static void Postfix(PlayerController __instance)
        {
            Debug.Log("تم تعديل خصائص اللاعب بواسطة مود mode!");
        }
    }
}`,
      installationGuide: [
        "أنشئ مشروع Class Library مستهدفاً `.NET Standard 2.1`.",
        "أضف مراجع (References) لـ `BepInEx.dll` و `0Harmony.dll` و `UnityEngine.CoreModule.dll` من مجلد اللعبة.",
        "قم بعمل Build ثم ضع ملف الـ DLL الناتج داخل مجلد `BepInEx/plugins/`."
      ]
    };
  }

  // Default: Minecraft / JSON
  return {
    title: "هيكل حزمة بيانات / مود لماينكرافت (DataPack / Fabric)",
    game: "Minecraft",
    framework: "Minecraft DataPack Function",
    language: "mcfunction",
    fileName: "main.mcfunction",
    code: `## فكرة المود: ${cleanPrompt}
## منصة mode - دليل ومولد المودات

# إعطاء اللاعب قدرة أو تأثير عند الدخول
effect give @a[tag=!mod_active] minecraft:speed 99999 1 true
tag @a[tag=!mod_active] add mod_active

# إشعار اللاعب بتفعيل المود
tellraw @a {"text":"[mode] تم تشغيل المود: ${cleanPrompt}","color":"green"}

# تنفيذ دالة مستمرة
execute as @a at @s run particle minecraft:happy_villager ~ ~1 ~ 0.2 0.2 0.2 0.05 3`,
    installationGuide: [
      "أنشئ مجلداً باسم `data_pack` داخل مجلد `saves/YourWorld/datapacks/`.",
      "ضع ملف `pack.mcmeta` ثم ضع الدوال داخل مجلد `data/custom/functions/main.mcfunction`.",
      "اكتب الأمر `/reload` داخل اللعبة لتحديث الدوال فورياً."
    ]
  };
}
