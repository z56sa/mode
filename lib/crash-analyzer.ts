/**
 * Crash Analyzer Engine for Game Mods
 * Analyzes crash logs from Bethesda, SMAPI, Unity/BepInEx, Unreal, RimWorld, Forge/Fabric, etc.
 */

export interface CrashAnalysisResult {
  gameDetected: string | null;
  severity: "critical" | "warning" | "info";
  culpritMod: string | null;
  probableCause: string;
  solutionSteps: string[];
  extractedErrors: string[];
  crashType: string;
}

interface SignatureRule {
  game: string;
  pattern: RegExp;
  extractMod?: (match: RegExpMatchArray, log: string) => string | null;
  crashType: string;
  probableCause: string;
  solutionSteps: string[];
}

const SIGNATURE_RULES: SignatureRule[] = [
  // 1. Missing DLL or Assembly Reference (Unity / BepInEx / SMAPI / Bannerlord)
  {
    game: "Unity / BepInEx / C#",
    pattern: /Could not load (?:file or assembly|type) ['"]([^'"]+)['"]/i,
    extractMod: (m) => m[1]?.split(",")[0] || null,
    crashType: "ملف مفقود أو متطلب ناقص (Missing Dependency / Assembly)",
    probableCause: "المود يحتاج إلى ملف مكتبة أو مود أساسي (Dependency/Core Mod) غير مثبت في مجلد اللعبة.",
    solutionSteps: [
      "تأكد من تثبيت المودات الأساسية المشتركة (مثل Harmony, BepInEx, ButterLib, SMAPI).",
      "تأكد من أن إصدار المود الأساسي مطابق لإصدار لعبتك الحالي.",
      "أعد تثبيت المود المذكور وتأكد من نسخ جميع ملفات الـ DLL المرفقة معه."
    ]
  },
  // 2. Harmony Patching Collision (Mount & Blade, RimWorld, Unity)
  {
    game: "Mount & Blade / RimWorld",
    pattern: /HarmonyLib\.HarmonyException|Failed to patch|Could not execute method .*Harmony/i,
    extractMod: (_m, log) => {
      const modMatch = log.match(/(?:at\s+)([a-zA-Z0-9_\.]+)\./i);
      return modMatch ? modMatch[1] : null;
    },
    crashType: "تعارض حقن كود (Harmony Patch Conflict)",
    probableCause: "مودان أو أكثر يحاولان تعديل نفس الدالة البرمجية في اللعبة في نفس الوقت، أو المود غير متوافق مع إصدار التحديث الأخير للعبة.",
    solutionSteps: [
      "ضع مود Harmony دائماً في أعلى قائمة ترتيب التحميل (Top of Load Order).",
      "راجع المودات التي تم تحديثها مؤخراً وعطّل آخر مود قمت بإضافته.",
      "تأكد من مطابقة إصدار المود مع رقم باتش لعبتك."
    ]
  },
  // 3. Papyrus / Bethesda (Skyrim / Fallout 4)
  {
    game: "Skyrim / Fallout 4",
    pattern: /error:\s+Property\s+(\w+)\s+on\s+script\s+(\w+)\s+cannot be bound|Cannot call\s+(\w+)\(\)\s+on a None object/i,
    extractMod: (m) => m[2] ? `Script: ${m[2]}` : null,
    crashType: "خطأ سكريبت بيثيسدا (Papyrus Script Exception)",
    probableCause: "السكريبت يشير إلى كائن محذوف من خريطة اللعبة أو تم فك ارتباط مود دون بدء تخزينة جديدة.",
    solutionSteps: [
      "استخدم أداة LOOT لفرز وترتيب المودات تلقائياً.",
      "إذا كنت قد حذفت موداً مؤخراً، استخدم أداة تنظيف الحفظ (FallrimTools / ReSaver) لتنظيف التخزينة من السكريبتات المعلقة.",
      "تأكد من تثبيت Unofficial Patch المناسب لنسختك."
    ]
  },
  // 4. Stardew Valley (SMAPI)
  {
    game: "Stardew Valley",
    pattern: /\[SMAPI\]\s+An error occurred in the overridden update loop:\s+.*in\s+([a-zA-Z0-9_\.]+):/i,
    extractMod: (m) => m[1] || null,
    crashType: "خطأ تحديث مود SMAPI (Update Loop Error)",
    probableCause: "المود يحتوي على خطأ برمجي عند محاولة تحديث بيانات المزرعة أو الشخصيات.",
    solutionSteps: [
      "حدّث SMAPI إلى أحدث إصدار متاح لـ Stardew Valley.",
      "تأكد من تحديث المود المسبب أو حذفه مؤقتاً لتجنب إتلاف ملف الحفظ.",
      "تحقق من صفحة المود على Nexus Mods للتأكد من عدم وجود باتش لإصدار 1.6+."
    ]
  },
  // 5. Minecraft (Forge / Fabric)
  {
    game: "Minecraft",
    pattern: /net\.minecraftforge|org\.spongepowered\.asm\.mixin|fabric-loader/i,
    extractMod: (_m, log) => {
      const mixin = log.match(/Mixin apply failed\s+([a-zA-Z0-9_\.\-]+)/i);
      if (mixin) return mixin[1];
      const forgeMod = log.match(/The mod\s+([a-zA-Z0-9_\-]+)\s+has failed/i);
      if (forgeMod) return forgeMod[1];
      return null;
    },
    crashType: "تعارض مكسن أو لودر (Mixin / Mod Loader Crash)",
    probableCause: "تعارض في تعديل ملفات اللعبة الداخلية بين مودين، أو عدم توافق إصدار الجافا (Java Runtime) أو اللودر.",
    solutionSteps: [
      "تحقق من أن جميع المودات مصممة لنفس لودر اللعبة بالضبط (Forge فقط أو Fabric فقط، لا تخلطهما).",
      "تأكد من تطابق إصدار ماينكرافت الفرعي (مثلاً 1.20.1 يختلف عن 1.20.4).",
      "عطّل المود المذكور في التقرير وأعد تشغيل اللعبة."
    ]
  },
  // 6. Out of Memory / VRAM (Texture packs / Heavy graphic mods)
  {
    game: "عام (جميع الألعاب)",
    pattern: /Out of memory|OutOfMemoryException|DirectX function ".*" failed|DXGI_ERROR_DEVICE_REMOVED|VK_ERROR_OUT_OF_DEVICE_MEMORY/i,
    extractMod: () => null,
    crashType: "امتلاء الذاكرة أو بطاقة الرسوميات (Out of Memory / VRAM Crash)",
    probableCause: "تثبيت حزم مودات بدقة عالية جداً (4K Textures) أو مودات رسومية كثيفة تتجاوز سعة كرت الشاشة (VRAM) أو الرام.",
    solutionSteps: [
      "اختر نُسخ 1K أو 2K من حزم التكستشر بدلاً من 4K/8K.",
      "قلل إعدادات جودة النسيج وتفاصيل الظلال داخل قائمة إعدادات اللعبة.",
      "تأكد من تفعيل Pagefile (الذاكرة الظاهرية الافتراضية) في نظام Windows."
    ]
  },
  // 7. Load Order / Missing Master ESM/ESP
  {
    game: "Bethesda / Load Order",
    pattern: /Master file\s+['"]?([^'"]+\.(?:esm|esp|esl))['"]?\s+is missing|Missing master/i,
    extractMod: (m) => m[1] || null,
    crashType: "ملف ماستر مفقود (Missing Master Plugin)",
    probableCause: "المود يعتمد على إضافة DLC أو مود آخر (Master File) غير مفعل أو غير موجود في قائمة الإضافات.",
    solutionSteps: [
      "حمّل الملف الأساسي أو الماستر المفقود الموضح في التقرير.",
      "تأكد من أن ملف الـ Master يسبق المود في ترتيب التحميل (Load Order) وليس بعده."
    ]
  }
];

export function analyzeCrashLog(rawLog: string): CrashAnalysisResult {
  const trimmed = rawLog.trim();
  if (!trimmed) {
    return {
      gameDetected: null,
      severity: "info",
      culpritMod: null,
      probableCause: "لم يتم تقديم نص تقرير لفحصه.",
      solutionSteps: ["انسخ محتوى ملف الكراش والصقه في الصندوق للتحليل."],
      extractedErrors: [],
      crashType: "تقرير فارغ"
    };
  }

  // Detect matching signature
  for (const rule of SIGNATURE_RULES) {
    const match = trimmed.match(rule.pattern);
    if (match) {
      const culprit = rule.extractMod ? rule.extractMod(match, trimmed) : null;
      
      // Extract top error lines for preview
      const lines = trimmed.split("\n");
      const errorLines = lines
        .filter(l => /error|exception|failed|fatal|critical|crash/i.test(l))
        .slice(0, 4)
        .map(l => l.trim().slice(0, 150));

      return {
        gameDetected: rule.game,
        severity: "critical",
        culpritMod: culprit,
        probableCause: rule.probableCause,
        solutionSteps: rule.solutionSteps,
        extractedErrors: errorLines.length > 0 ? errorLines : [match[0].slice(0, 150)],
        crashType: rule.crashType
      };
    }
  }

  // Generic heuristic analysis
  const lines = trimmed.split("\n");
  const errorLines = lines.filter(l => /exception|error|failed|fault|crash/i.test(l));
  
  // Try to find any .dll, .esp, or mod name mentioned around error
  const genericModMatch = trimmed.match(/([a-zA-Z0-9_\-\.]{3,30}\.(?:dll|esp|esm|pak|jar|zip))/i);
  const potentialMod = genericModMatch ? genericModMatch[1] : null;

  return {
    gameDetected: "غير محدد بدقة",
    severity: errorLines.length > 0 ? "warning" : "info",
    culpritMod: potentialMod,
    probableCause: errorLines.length > 0
      ? "تم رصد أخطاء تشغيل عامة. قد يكون هناك مود غير متوافق مع نسخة اللعبة أو ملف ناقص."
      : "لم يتم العثور على أخطاء كراش قاتلة واضحة في النص المعطى.",
    solutionSteps: [
      "عطّل آخر 3 مودات قمت بتثبيتها مؤخراً وجرّب تشغيل اللعبة.",
      "تأكد من ترتيب المودات الأساسية (Core Mods) في بداية التحميل.",
      "تحقق من تطابق رقم إصدار اللعبة مع ما يطلبه المود."
    ],
    extractedErrors: errorLines.slice(0, 3).map(l => l.trim().slice(0, 150)),
    crashType: errorLines.length > 0 ? "خطأ تشغيلي عام (General Exception)" : "فحص عام"
  };
}
