/**
 * AI Mod Code Generator
 * Intelligent code generation for gameplay mechanics:
 * Speed multipliers, Godmode/Health, Weapons/Damage, Inventory, Money/Gold, Fly/Gravity
 */

export interface GeneratedModCode {
  title: string;
  game: string;
  framework: string;
  language: string;
  fileName: string;
  code: string;
  installationGuide: string[];
  explanation: string;
}

// Extract multiplier from Arabic prompt (e.g. "دبل 6" -> 6, "دبل 2" -> 2, "10x" -> 10)
function extractMultiplier(prompt: string): number {
  const matchNum = prompt.match(/(?:دبل|ضعف|ضرب|x|\*)\s*(\d+(?:\.\d+)?)/i);
  if (matchNum) return parseFloat(matchNum[1]);
  const digitOnly = prompt.match(/\b(\d+)\b/);
  if (digitOnly) return parseFloat(digitOnly[1]);
  return 2.0; // default double
}

export function generateSmartModCode(
  prompt: string,
  gameType: "unity_bepinex" | "gmod_lua" | "stardew" | "minecraft" | "skyrim"
): GeneratedModCode {
  const clean = prompt.trim() || "تعديل بسيط";
  const lower = clean.toLowerCase();
  const mult = extractMultiplier(lower);

  // 1. SPEED / MOVEMENT
  if (lower.includes("سرع") || lower.includes("ركض") || lower.includes("مش") || lower.includes("speed")) {
    if (gameType === "gmod_lua") {
      const normalWalk = Math.round(200 * mult);
      const normalRun = Math.round(400 * mult);
      return {
        title: `مود زيادة سرعة اللاعب (${mult}x) لـ Garry's Mod`,
        game: "Garry's Mod",
        framework: "GLua (Garry's Mod Lua API)",
        language: "lua",
        fileName: "custom_speed_boost.lua",
        explanation: `مود مخصص يقوم بمضاعفة سرعة المشي إلى ${normalWalk} وسرعة الركض إلى ${normalRun} بمقدار ${mult} أضعاف عند دخول الخريطة أو عند الضغط على زر الركض.`,
        code: `--[[
  مود: ${clean}
  المطور: منصة mode للمودات
  مضاعف السرعة: ${mult}x
--]]

if SERVER then
    local SPEED_MULTIPLIER = ${mult}.0

    hook.Add("PlayerSpawn", "Mode_SpeedBoost_Spawn", function(ply)
        timer.Simple(0.1, function()
            if not IsValid(ply) then return end
            local defaultWalk = 200
            local defaultRun = 400

            ply:SetWalkSpeed(defaultWalk * SPEED_MULTIPLIER)
            ply:SetRunSpeed(defaultRun * SPEED_MULTIPLIER)
            ply:SetMaxSpeed(defaultRun * SPEED_MULTIPLIER)

            ply:PrintMessage(HUD_PRINTTALK, "[mode] تم تفعيل زيادة السرعة بمقدار: " .. SPEED_MULTIPLIER .. "x!")
        end)
    end)

    -- إعادة الضبط عند الموت أو التبديل
    hook.Add("PlayerDeath", "Mode_SpeedBoost_Reset", function(ply)
        ply:SetWalkSpeed(200)
        ply:SetRunSpeed(400)
    end)
end

if CLIENT then
    hook.Add("HUDPaint", "Mode_SpeedHUD", function()
        draw.SimpleText("⚡ مضاعف السرعة: ${mult}x", "DermaDefaultBold", 25, 25, Color(16, 185, 129), TEXT_ALIGN_LEFT)
    end)
end`,
        installationGuide: [
          "احفظ الملف باسم `custom_speed_boost.lua`.",
          "انقله إلى المجلد: `garrysmod/lua/autorun/server/` داخل ملفات لعبتك.",
          "شغل اللعبة وافتح أي خريطة Sandbox ستلاحظ السرعة الخارقة فوراً!"
        ]
      };
    }

    if (gameType === "stardew") {
      const addedSpeed = Math.round(mult * 3);
      return {
        title: `مود مضاعفة السرعة (${mult}x) لـ Stardew Valley`,
        game: "Stardew Valley",
        framework: "SMAPI 4.x / .NET 6+",
        language: "csharp",
        fileName: "SpeedModEntry.cs",
        explanation: `يقوم هذا المود بزيادة سرعة حركة المزارع داخل الحقول والمدينة بمقدار ${mult}x دبل مع مفتاح تبديل لتشغيل أو إيقاف الميزة.`,
        code: `/*
  مود: ${clean}
  منصة mode الذكية لمودات الألعاب
*/

using System;
using Microsoft.Xna.Framework.Input;
using StardewModdingAPI;
using StardewModdingAPI.Events;
using StardewValley;

namespace ModeSpeedMultiplierMod
{
    public class ModEntry : Mod
    {
        private const int SPEED_BOOST = ${addedSpeed};
        private bool isBoostActive = true;

        public override void Entry(IModHelper helper)
        {
            helper.Events.GameLoop.UpdateTicked += OnUpdateTicked;
            helper.Events.Input.ButtonPressed += OnButtonPressed;
            this.Monitor.Log("تم تحميل مود مضاعفة السرعة بنجاح (${mult}x).", LogLevel.Info);
        }

        private void OnButtonPressed(object sender, ButtonPressedEventArgs e)
        {
            if (!Context.IsWorldReady) return;

            // زر F4 لتبديل السرعة الخارقة
            if (e.Button == SButton.F4)
            {
                isBoostActive = !isBoostActive;
                string status = isBoostActive ? "مفعلة (${mult}x)" : "معطلة";
                Game1.addHUDMessage(new HUDMessage($"السرعة: {status}", HUDMessage.achievement_type));
            }
        }

        private void OnUpdateTicked(object sender, UpdateTickedEventArgs e)
        {
            if (!Context.IsWorldReady || !isBoostActive) return;

            if (Game1.player != null && Game1.player.addedSpeed < SPEED_BOOST)
            {
                Game1.player.addedSpeed = SPEED_BOOST;
            }
        }
    }
}`,
        installationGuide: [
          "ثبّت بيئة SMAPI للعبة Stardew Valley.",
          "قم بعمل Build للمشروع كـ Class Library وضعه مع `manifest.json` داخل مجلد `Mods/SpeedBoost/`.",
          "اضغط F4 داخل اللعبة لتبديل وتشغيل السرعة الخارقة."
        ]
      };
    }

    // Unity / BepInEx Default
    return {
      title: `مود مضاعفة سرعة الحركة (${mult}x) بمحرك Unity BepInEx & Harmony`,
      game: "Unity Engine (Valheim / Lethal Company / Bannerlord)",
      framework: "BepInEx 5.x + HarmonyLib",
      language: "csharp",
      fileName: "SpeedMultiplierPlugin.cs",
      explanation: `يقوم هذا المود بحقن كود في محرك الحركة ليضاعف سرعة اللاعب بمقدار ${mult}x مع قراءة ديناميكية للإدخال.`,
      code: `/*
  فكرة المود: ${clean}
  تم التوليد بواسطة: mode AI Mod Generator
  مضاعف السرعة المحسوب: ${mult}x
*/

using System;
using BepInEx;
using HarmonyLib;
using UnityEngine;

namespace ModePlayerSpeedMod
{
    [BepInPlugin("com.mode.speedboost", "Player Speed Multiplier", "1.0.0")]
    public class SpeedMultiplierPlugin : BaseUnityPlugin
    {
        public static float SpeedMultiplier = ${mult}.0f;
        private Harmony harmony;

        void Awake()
        {
            Logger.LogInfo($"[mode] جاري تفعيل مود زيادة السرعة بمقدار: {SpeedMultiplier}x");
            harmony = new Harmony("com.mode.speedboost");
            harmony.PatchAll();
            Logger.LogInfo("[mode] تم حقن وتطبيق المود بنجاح!");
        }

        void OnDestroy()
        {
            harmony?.UnpatchSelf();
        }
    }

    // مثال Harmony Patch لتعديل سرعة المشي والركض في كلاس اللاعب
    [HarmonyPatch(typeof(CharacterController))]
    public static class MovementSpeedPatch
    {
        [HarmonyPatch("Move")]
        [HarmonyPrefix]
        public static void PrefixMove(ref Vector3 motion)
        {
            // مضاعفة شعاع الحركة بالضرب في مضاعف السرعة
            motion.x *= SpeedMultiplierPlugin.SpeedMultiplier;
            motion.z *= SpeedMultiplierPlugin.SpeedMultiplier;
        }
    }
}`,
      installationGuide: [
        "أنشئ مشروع C# Class Library واختر إطار عمل `.NET Standard 2.1`.",
        "أضف مراجع مكتبات `0Harmony.dll` و `BepInEx.dll` و `UnityEngine.dll` من مجلد اللعبة.",
        "انسخ ملف الـ DLL الناتج إلى مجلد `BepInEx/plugins/`."
      ]
    };
  }

  // 2. GODMODE / HEALTH / DAMAGE
  if (lower.includes("دم") || lower.includes("خلود") || lower.includes("صحة") || lower.includes("طاقة") || lower.includes("god")) {
    return {
      title: "مود الخلود والصحة اللانهائية (GodMode)",
      game: "Unity / BepInEx (Lethal Company, Valheim)",
      framework: "BepInEx + Harmony",
      language: "csharp",
      fileName: "GodModePlugin.cs",
      explanation: "يمنع هذا المود اللاعب من استقبال أي ضرر بيئي أو هجوم من الأعداء مع تثبيت نقاط الصحة عند الحد الأقصى.",
      code: `using BepInEx;
using HarmonyLib;
using UnityEngine;

namespace ModeGodMode
{
    [BepInPlugin("com.mode.godmode", "Invincible Mod", "1.0.0")]
    public class GodModePlugin : BaseUnityPlugin
    {
        void Awake()
        {
            Logger.LogInfo("[mode] تم تفعيل مود الخلود وتثبيت الصحة اللانهائية!");
            new Harmony("com.mode.godmode").PatchAll();
        }
    }

    [HarmonyPatch]
    public static class HealthPatch
    {
        // اعتراض دالة تلقي الضرر
        [HarmonyPatch(typeof(PlayerControllerB), "DamagePlayer")]
        [HarmonyPrefix]
        public static bool PreventDamage()
        {
            // إرجاع false يمنع تنفيذ دالة الضرر الأصلية بالكامل
            Debug.Log("[mode] تم صد الضرر بالكامل عبر مود الخلود.");
            return false;
        }
    }
}`,
      installationGuide: [
        "قم بعمل Build للمشروع وضع ملف الـ dll داخل `BepInEx/plugins`.",
        "ستلاحظ أن اللاعب لا يتأثر بأي ضربات أو سقوط."
      ]
    };
  }

  // 3. MONEY / GOLD / CHEATS
  if (lower.includes("فلوس") || lower.includes("ذهب") || lower.includes("مال") || lower.includes("gold") || lower.includes("money")) {
    return {
      title: "مود إضافة الذهب والموارد غير المحدودة",
      game: "Mount & Blade II / Unity / C#",
      framework: "TaleWorlds C# SubModule / Harmony",
      language: "csharp",
      fileName: "MoneyCheatSubModule.cs",
      explanation: "يضيف هذا المود زر اختصار يمنح اللاعب 100,000 قطعة ذهبية فوراً عند ضغط زر الكيبورد.",
      code: `using System;
using TaleWorlds.Core;
using TaleWorlds.MountAndBlade;
using TaleWorlds.InputSystem;
using TaleWorlds.CampaignSystem;

namespace ModeUnlimitedGold
{
    public class SubModule : MBSubModuleBase
    {
        protected override void OnApplicationTick(float dt)
        {
            base.OnApplicationTick(dt);

            // عند الضغط على زر F10 يتم إيداع 100 ألف ذهب في رصيد العشيرة
            if (Input.IsKeyPressed(InputKey.F10))
            {
                if (Hero.MainHero != null)
                {
                    Hero.MainHero.Gold += 100000;
                    InformationManager.DisplayMessage(new InformationMessage("[mode] تم إضافة 100,000 دينار ذهبي لحسابك بنجاح!"));
                }
            }
        }
    }
}`,
      installationGuide: [
        "ضع ملف SubModule.xml في مجلد `Modules/ModeGold/`.",
        "ضع الـ dll الناتج في مجلد `bin/Win64_Shipping_Client`.",
        "شغل اللانشر وفعّل المود ثم اضغط F10 داخل اللعبة."
      ]
    };
  }

  // 4. FLY / VEHICLES
  if (lower.includes("طير") || lower.includes("فلاي") || lower.includes("fly") || lower.includes("مركب")) {
    return {
      title: "مود الطيران والتحليق الحر (Noclip / Fly Mod)",
      game: "Garry's Mod / Lua",
      framework: "GLua Engine",
      language: "lua",
      fileName: "simple_fly_noclip.lua",
      explanation: "يمنح اللاعب القدرة على الطيران في الهواء وتخطي الجاذبية عند الضغط مرتين على زر القفز (Space).",
      code: `--[[
  فكرة: ${clean}
  منصة mode الذكية
--]]

if SERVER then
    hook.Add("KeyPress", "Mode_FlyToggle", function(ply, key)
        if key == IN_JUMP and not ply:OnGround() then
            -- تفعيل وضع الطيران والتحليق
            if ply:GetMoveType() == MOVETYPE_WALK then
                ply:SetMoveType(MOVETYPE_FLY)
                ply:PrintMessage(HUD_PRINTTALK, "[mode] وضع الطيران مفعل 🚀")
            else
                ply:SetMoveType(MOVETYPE_WALK)
                ply:PrintMessage(HUD_PRINTTALK, "[mode] وضع الطيران معطل.")
            end
        end
    end)
end`,
      installationGuide: [
        "ضع الملف في: `garrysmod/lua/autorun/server/simple_fly_noclip.lua`.",
        "اقفز في الهواء واضغط Space مرة أخرى لتبدأ الطيران بحرية."
      ]
    };
  }

  // Generic Fallback with smart naming
  return {
    title: `قالب مخصص لفكرة: "${clean}"`,
    game: gameType === "gmod_lua" ? "Garry's Mod" : "Unity Game",
    framework: gameType === "gmod_lua" ? "GLua Scripting" : "BepInEx 5.x",
    language: gameType === "gmod_lua" ? "lua" : "csharp",
    fileName: gameType === "gmod_lua" ? "custom_mod.lua" : "Plugin.cs",
    explanation: `تم تصميم هذا الكود بناءً على طلبك (${clean}) ليوفر البنية التحتية البرمجية الجاهزة للتعديل السريع.`,
    code: gameType === "gmod_lua"
      ? `-- مود مخصص لفكرة: ${clean}
hook.Add("PlayerInitialSpawn", "Mode_Custom_Init", function(ply)
    ply:PrintMessage(HUD_PRINTTALK, "[mode] تم تفعيل مود: ${clean}")
end)`
      : `using BepInEx;
using HarmonyLib;
using UnityEngine;

namespace ModeCustomMod
{
    [BepInPlugin("com.mode.custom", "Custom Feature", "1.0.0")]
    public class CustomPlugin : BaseUnityPlugin
    {
        void Awake()
        {
            Logger.LogInfo("[mode] تم تفعيل ميزة: ${clean}");
            new Harmony("com.mode.custom").PatchAll();
        }
    }
}`,
    installationGuide: [
      "انسخ الكود واحفظه في مشروع المود الخاص بك.",
      "تأكد من استدعاء الدوال المتوافقة مع لعبتك داخل مجلد plugins."
    ]
  };
}
