/**
 * Advanced Crash Analyzer Engine
 * High-accuracy multi-engine log parser for gaming mods
 */

export interface CrashAnalysisResult {
  gameDetected: string | null;
  severity: "critical" | "warning" | "info";
  culpritMod: string | null;
  probableCause: string;
  solutionSteps: string[];
  extractedErrors: string[];
  crashType: string;
  technicalDetails?: string;
  fileHint?: string | null;
}

interface CrashRule {
  id: string;
  game: string;
  category: string;
  regex: RegExp;
  extractMod: (match: RegExpMatchArray, log: string) => string | null;
  extractHint?: (match: RegExpMatchArray, log: string) => string | null;
  cause: (mod: string | null, match: RegExpMatchArray) => string;
  solutions: (mod: string | null) => string[];
}

const CRASH_RULES: CrashRule[] = [
  // 1. Missing DLL / TypeLoad / MethodNotFound (Unity / BepInEx / SMAPI / Bannerlord)
  {
    id: "missing_dll_or_type",
    game: "Unity / BepInEx / C#",
    category: "ملف مفقود أو متطلب ناقص (Missing Dependency / Assembly)",
    regex: /(?:Could not load (?:file or assembly|type) ['"]([^'"]+)['"]|System\.TypeLoadException|System\.MissingMethodException:\s*(.+)|System\.IO\.FileNotFoundException:\s*Could not load file or assembly '([^']+)')/i,
    extractMod: (m) => {
      const raw = m[1] || m[3] || m[2];
      if (!raw) return null;
      const clean = raw.split(",")[0].trim().replace(/\.dll$/i, "");
      return clean;
    },
    extractHint: (_m, log) => {
      const match = log.match(/in\s+([a-zA-Z0-9_\.\-]+):line\s+\d+/i);
      return match ? match[1] : null;
    },
    cause: (mod) => mod
      ? `المود يحتاج إلى مكتبة أو إضافة أساسية (${mod}.dll) غير مثبتة أو أن إصدارها قديم وغير متوافق.`
      : "حدث خطأ بسبب دالة أو مكتبة برمجية مفقودة (Missing Method / Assembly).",
    solutions: (mod) => [
      mod ? `تأكد من تنزيل وتثبيت المود أو المكتبة التابعة: (${mod}).` : "تأكد من تثبيت جميع المودات الأساسية (Core Mods).",
      "تحقق من تثبيت أحدث إصدار من بيئة المودات (مثل BepInEx أو Harmony أو SMAPI).",
      "إذا كنت قد قمت بتحديث اللعبة مؤخراً، فالمود يحتاج إلى تحديث ليتطابق مع رقم الإصدار الجديد."
    ]
  },

  // 2. Harmony Patch Collision (Mount & Blade II, RimWorld, Valheim, Lethal Company)
  {
    id: "harmony_conflict",
    game: "Harmony Patching Engine",
    category: "تعارض حقن كود بين مودين (Harmony Patch Collision)",
    regex: /(?:HarmonyLib\.HarmonyException|Failed to patch|Could not execute method .*Harmony|HarmonyTranspilerException)/i,
    extractMod: (_m, log) => {
      const modMatch = log.match(/at\s+([a-zA-Z0-9_]+)\.(?:Plugin|Mod|Main|Patch|SubModule)/i);
      if (modMatch) return modMatch[1];
      const pkg = log.match(/(?:at\s+)([a-zA-Z0-9_\.]+)\./i);
      return pkg ? pkg[1].split(".")[0] : null;
    },
    cause: (mod) => mod
      ? `المود (${mod}) يحاول تعديل دالة في اللعبة قام مود آخر بتعديلها مسبقاً، أو تم حذفها في تحديث اللعبة.`
      : "تعارض بين مودين يحاولان حقن وتعديل نفس الدالة البرمجية داخل محرك اللعبة.",
    solutions: (mod) => [
      "ضع مود Harmony (وButterLib إن وجد) في قمة ترتيب المودات (Top of Load Order).",
      mod ? `جرّب تعطيل مود (${mod}) للتأكد من زوال المشكلة.` : "عطّل آخر مود تم تثبيته مؤخراً.",
      "تأكد من أن جميع مودات Harmony محدثة لنفس إصدار اللعبة الحالي."
    ]
  },

  // 3. NullReferenceException (SMAPI / Unity / C#)
  {
    id: "null_reference",
    game: "Unity / C# Engine",
    category: "خطأ مرجعي فارغ (NullReferenceException)",
    regex: /System\.NullReferenceException:\s*Object reference not set to an instance of an object/i,
    extractMod: (_m, log) => {
      const lineMatch = log.match(/at\s+([a-zA-Z0-9_]+)\..*in\s+([a-zA-Z0-9_]+):line/i);
      if (lineMatch) return lineMatch[2] || lineMatch[1];
      const smapiMatch = log.match(/\[SMAPI\]\s+An error occurred.*in\s+([a-zA-Z0-9_\.]+):/i);
      if (smapiMatch) return smapiMatch[1];
      const traceMatch = log.match(/at\s+([a-zA-Z0-9_]+)\.[a-zA-Z0-9_]+\(/i);
      return traceMatch ? traceMatch[1] : null;
    },
    cause: (mod) => mod
      ? `المود (${mod}) حاول استدعاء عنصر أو تخزينة غير موجودة في اللعبة في هذه اللحظة مما أدى لتوقفه.`
      : "المود حاول الوصول إلى عنصر مفقود أو غير مهيأ داخل ذاكرة اللعبة.",
    solutions: (mod) => [
      mod ? `تأكد من تنزيل أحدث إصدار لمود (${mod}).` : "تحقق من سلامة ملفات اللعبة.",
      "إذا ظهر الخطأ أثناء الدخول لتخزينة قديمة، فقد تكون التخزينة تحتوي على عناصر مود محذوف.",
      "جرّب بدء لعبة جديدة للتحقق مما إذا كان الخطأ متعلقاً بالتخزينة فقط."
    ]
  },

  // 4. Skyrim / Bethesda (Papyrus script crash & Missing master)
  {
    id: "bethesda_missing_master",
    game: "Skyrim / Fallout 4 (Bethesda)",
    category: "ملف ماستر مفقود (Missing Master / DLC)",
    regex: /(?:Master file\s+['"]?([^'"]+\.(?:esm|esp|esl))['"]?\s+is missing|Missing master|Cannot find master)/i,
    extractMod: (m) => m[1] || null,
    cause: (mod) => mod
      ? `المود يطلب الملف الأساسي (${mod}) وهو غير موجود أو معطل في قائمة المودات.`
      : "أحد المودات يعتمد على إضافة DLC أو مود ماستر غير مفعل.",
    solutions: (mod) => [
      mod ? `قم بتحميل وتفعيل الملف المطلوب: ${mod}` : "فعّل إضافات اللعبة الرسمية (DLCs).",
      "استخدم أداة LOOT لترتيب ملفات ESM و ESP بشكل تلقائي وصحيح.",
      "ضع ملفات Master (.esm) دائماً قبل ملفات الإضافات (.esp)."
    ]
  },

  // 5. Papyrus Script Error
  {
    id: "papyrus_error",
    game: "Skyrim / Fallout (Papyrus Engine)",
    category: "تعليق سكريبت اللعبة (Papyrus Script Binding Error)",
    regex: /(?:error:\s+Property\s+(\w+)\s+on\s+script\s+(\w+)\s+cannot be bound|Cannot call\s+(\w+)\(\)\s+on a None object)/i,
    extractMod: (m) => m[2] ? `Script: ${m[2]}` : null,
    cause: (_mod, m) => `السكريبت (${m[2] || m[1]}) لا يجد الكائنات المرتبطة به في عالم اللعبة.`,
    solutions: () => [
      "استخدم أداة تنظيف ملفات الحفظ (Resaver / FallrimTools) لتنظيف السكريبتات المعلقة.",
      "تأكد من تثبيت Unofficial Skyrim Special Edition Patch (USSEP).",
      "لا تقم بإلغاء تثبيت مودات السكريبتات الكبيرة في منتصف التختيم."
    ]
  },

  // 6. Out of Memory / Direct3D / Vulkan crash
  {
    id: "memory_or_gpu",
    game: "محرك الرسوميات / الذاكرة",
    category: "نقص ذاكرة كرت الشاشة أو الرام (VRAM / RAM Exhausted)",
    regex: /(?:Out of memory|OutOfMemoryException|DXGI_ERROR_DEVICE_REMOVED|DXGI_ERROR_DEVICE_HUNG|VK_ERROR_OUT_OF_DEVICE_MEMORY|CreateTexture2D failed)/i,
    extractMod: () => null,
    cause: () => "اللعبة استنفدت كامل سعة كرت الشاشة (VRAM) أو ذاكرة النظام، غالباً بسبب مودات الرسوم العالية (4K/8K Textures) أو الشيدرات الثقيلة.",
    solutions: () => [
      "اختر نُسخ 1K أو 2K من حزم التكستشر بدلاً من 4K/8K.",
      "قم بتعطيل أو تخفيف إعدادات ENB أو ReShade داخل اللعبة.",
      "قم بزيادة حجم الذاكرة الافتراضية (Paging File / Virtual Memory) في إعدادات Windows."
    ]
  },

  // 7. Minecraft (Forge / Fabric / Mixin Collision)
  {
    id: "minecraft_mixin",
    game: "Minecraft (Forge / Fabric)",
    category: "تعارض Mixin بين مودات ماينكرافت",
    regex: /(?:org\.spongepowered\.asm\.mixin\.transformer\.throwables|Mixin apply failed\s+([a-zA-Z0-9_\.\-]+)|The mod\s+([a-zA-Z0-9_\-]+)\s+has failed)/i,
    extractMod: (m) => m[1] || m[2] || null,
    cause: (mod) => mod
      ? `المود (${mod}) يتعارض مع مود آخر في تعديل كود ماينكرافت الداخلي (Mixin Injection).`
      : "تعارض في تعديل ملفات اللعبة الداخلية بين مودين لماينكرافت.",
    solutions: (mod) => [
      mod ? `قم بتحديث أو إزالة مود (${mod}) مؤقتاً.` : "راجع مجلد mods وتأكد من أن جميع المودات لنفس إصدار ماينكرافت بدقة.",
      "تأكد من تثبيت إصدار Java المتوافق (Java 17 أو Java 21 حسب إصدار اللعبة).",
      "لا تخلط بين مودات Forge ومودات Fabric."
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

  // Check matching rules
  for (const rule of CRASH_RULES) {
    const match = trimmed.match(rule.regex);
    if (match) {
      const culprit = rule.extractMod(match, trimmed);
      const hint = rule.extractHint ? rule.extractHint(match, trimmed) : null;

      // Extract error preview
      const lines = trimmed.split("\n");
      const errorLines = lines
        .filter(l => /error|exception|failed|fatal|critical|crash/i.test(l))
        .slice(0, 5)
        .map(l => l.trim().slice(0, 160));

      return {
        gameDetected: rule.game,
        severity: "critical",
        culpritMod: culprit,
        probableCause: rule.cause(culprit, match),
        solutionSteps: rule.solutions(culprit),
        extractedErrors: errorLines.length > 0 ? errorLines : [match[0].slice(0, 160)],
        crashType: rule.category,
        fileHint: hint
      };
    }
  }

  // Heuristic analysis: extract file/mod names near errors
  const modFileMatch = trimmed.match(/([a-zA-Z0-9_\-\.]{3,35}\.(?:dll|esp|esm|jar|pak|lua|cs))/i);
  const potentialMod = modFileMatch ? modFileMatch[1] : null;

  const lines = trimmed.split("\n");
  const errorLines = lines
    .filter(l => /exception|error|failed|fault|crash|fatal/i.test(l))
    .slice(0, 4)
    .map(l => l.trim().slice(0, 150));

  return {
    gameDetected: "فحص ذكي متعدد المحركات",
    severity: errorLines.length > 0 ? "warning" : "info",
    culpritMod: potentialMod,
    probableCause: errorLines.length > 0
      ? (potentialMod ? `تم رصد خطأ تشغيلي مرتبط بالملف (${potentialMod}).` : "تم رصد تعارض في ملفات المودات أو عدم توافق مع إصدار التحديث.")
      : "لم يتم العثور على أخطاء كراش قاتلة واضحة في التقرير المعطى.",
    solutionSteps: [
      potentialMod ? `عطّل أو حدّث المود المتعلق بالملف: ${potentialMod}` : "عطّل آخر 3 مودات قمت بتثبيتها مؤخراً وجرّب تشغيل اللعبة.",
      "تأكد من مطابقة إصدارات المودات مع رقم تحديث اللعبة الحالي.",
      "تأكد من تثبيت المكتبات الداعمة الأساسية (مثل Visual C++ Redistributable أو .NET Framework)."
    ],
    extractedErrors: errorLines,
    crashType: errorLines.length > 0 ? "خطأ تشغيلي مستخلص (Extracted Exception)" : "فحص عام"
  };
}
