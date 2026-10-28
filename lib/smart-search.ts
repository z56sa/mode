import { getDb, GameMod } from "./db";

export interface SemanticSearchResult {
  interpretedQuery: string;
  category: string;
  matchedKeywords: string[];
  explanation: string;
  mods: Array<{
    id: number;
    title: string;
    game: string;
    slug: string;
    category: string;
    description: string;
    imageUrl: string | null;
    author: string;
    version: string | null;
    matchReason: string;
  }>;
}

// Arabic to English semantic dictionary for gaming terms
const ARABIC_CONCEPT_DICTIONARY: Array<{
  arabicKeywords: string[];
  englishTerms: string[];
  category: string;
  explanation: string;
  reason: string;
}> = [
  {
    arabicKeywords: ["طير", "يطير", "طيران", "طياره", "سفينه", "سفينة", "فضاء", "فلاي", "مركبه", "مركبة", "سياره", "سيارة", "سواقه", "سواقة", "قياده", "قيادة"],
    englishTerms: ["fly", "flight", "plane", "vehicle", "car", "drive", "ship", "space", "simfphys", "traffic"],
    category: "مركبات وتنقل وطيران",
    explanation: "المودات الخاصة بالطيران، قيادة المركبات، السفن، والتحليق:",
    reason: "يتيح قيادة أو طيران أو تحكم متقدم في المركبات"
  },
  {
    arabicKeywords: ["سلاح", "اسلحه", "أسلحة", "مسدس", "فرد", "رشاش", "بندقية", "طلقات", "رصاص", "قتال", "حرب", "معارك", "دروع", "دم"],
    englishTerms: ["weapon", "gun", "arm", "rifle", "pistol", "combat", "battle", "war", "damage", "bullet", "armor", "sword"],
    category: "أسلحة ومعارك",
    explanation: "المودات التي تضيف أو تطور الأسلحة، الرصاص، والأنظمة القتالية:",
    reason: "يضيف ترسانة أسلحة واقعية وأنظمة قتال متطورة"
  },
  {
    arabicKeywords: ["سحر", "شعوذه", "شعوذة", "طاقه", "طاقة", "تعاويذ", "تعويذة", "مانا", "خوارق"],
    englishTerms: ["magic", "spell", "mana", "wizard", "sorcery", "apocalypse", "enchant"],
    category: "سحر وقدرات خارقة",
    explanation: "المودات المتعلقة بتعاويذ السحر والقوى الخارقة:",
    reason: "يمنحك تعاويذ سحرية وقدرات خارقة جديدة"
  },
  {
    arabicKeywords: ["صناديق", "صندوق", "ترتيب", "تخزين", "مخزن", "تنظيم", "اغراض", "أغراض", "انفنتوري", "حقيبه", "حقيبة"],
    englishTerms: ["storage", "inventory", "chest", "organize", "sort", "magic storage", "weight", "carry"],
    category: "تخزين وتنظيم الحقيبة",
    explanation: "المودات التي تساعد في ترتيب الصناديق وتوسيع مساحة التخزين:",
    reason: "يسهّل إدارة الموارد وترتيب الصناديق بشكل تلقائي"
  },
  {
    arabicKeywords: ["غش", "فلوس", "ذهب", "فلوس لا نهائية", "شيت", "تريلر", "منيو", "خلود", "دم لا نهائي", "قائمة تحكم", "قائمه"],
    englishTerms: ["cheat", "menu", "trainer", "money", "gold", "sandbox", "unlimited", "godmode"],
    category: "أدوات تحكم وغش وتسهيل",
    explanation: "مودات التحكم، الغش، وتسهيل تجربة اللعب وإضافة الموارد:",
    reason: "يمنحك لوحة تحكم كاملة لإضافة الذهب وتعديل الخصائص بحرية"
  },
  {
    arabicKeywords: ["خريطه", "خريطة", "ماب", "ميني ماب", "رادار", "طرق", "مواقع"],
    englishTerms: ["map", "minimap", "radar", "navigation", "gps", "waypoint", "location"],
    category: "خرائط وملاحة",
    explanation: "مودات الخرائط والملاحة والرادار المصغر:",
    reason: "يعرض خريطة مصغرة ورادار لتسهيل الملاحة والاستكشاف"
  },
  {
    arabicKeywords: ["جرافيكس", "جرافيك", "رسوم", "رسومات", "واقعيه", "واقعية", "اضاءه", "إضاءة", "طقس", "جمال", "دقة", "4k"],
    englishTerms: ["graphic", "visual", "weather", "texture", "hd", "rework", "enb", "shader", "light", "realistic"],
    category: "تحسين الجرافيكس والطقس",
    explanation: "مودات تحسين المظهر الرسومي، الطقس، والإضاءة الواقعية:",
    reason: "يرفع دقة الرسوميات ويضيف مؤثرات بصرية وطقس واقعي"
  },
  {
    arabicKeywords: ["اصوات", "أصوات", "صوت", "موسيقى", "اغاني", "أغاني", "ساوند"],
    englishTerms: ["sound", "audio", "music", "fix", "track", "voice", "radio"],
    category: "أصوات ومؤثرات صوتية",
    explanation: "مودات تعديل وتحسين المؤثرات الصوتية والموسيقى:",
    reason: "يحسن جودة ونقاء المؤثرات الصوتية والموسيقى التصويرية"
  },
  {
    arabicKeywords: ["وحوش", "اعداء", "أعداء", "زومبي", "بقاء", "صعوبة", "تحدي", "مرعب", "رعب"],
    englishTerms: ["zombie", "horror", "monster", "enemy", "survival", "difficult", "hardcore", "creature"],
    category: "بقاء ورعب وتحدي",
    explanation: "مودات البقاء وإضافة أعداء وتحديات جديدة:",
    reason: "يضيف عناصر رعب وبقاء وتحديات جديدة للعبة"
  }
];

export async function smartSearchMods(query: string, limit: number = 24): Promise<SemanticSearchResult> {
  const normalized = query.toLowerCase().trim();
  const db = await getDb();

  // Find matching concept
  let matchedConcept = ARABIC_CONCEPT_DICTIONARY.find(c =>
    c.arabicKeywords.some(kw => normalized.includes(kw))
  );

  // If no direct concept match, split words and try partial match
  if (!matchedConcept) {
    const words = normalized.split(/\s+/).filter(w => w.length > 2);
    matchedConcept = ARABIC_CONCEPT_DICTIONARY.find(c =>
      c.arabicKeywords.some(kw => words.some(w => kw.includes(w) || w.includes(kw)))
    );
  }

  // Build SQL query based on concept or direct words
  let searchTerms: string[] = [];
  let category = "عام";
  let explanation = "نتائج البحث عن: " + query;
  let reason = "يطابق الكلمات المطلوبة في البحث";

  if (matchedConcept) {
    category = matchedConcept.category;
    explanation = matchedConcept.explanation;
    reason = matchedConcept.reason;
    searchTerms = matchedConcept.englishTerms;
  } else {
    // Fallback: use Arabic tokens and translated guesses
    searchTerms = normalized.split(/\s+/).filter(w => w.length > 1);
  }

  // Construct SQL matching with status='approved'
  const conditions: string[] = ["status = 'approved'"];
  const orClauses: string[] = [];
  const args: any[] = [];

  // Also include the original query in LIKE
  orClauses.push("title LIKE ? OR description LIKE ?");
  args.push(`%${query}%`, `%${query}%`);

  for (const term of searchTerms.slice(0, 8)) {
    orClauses.push("title LIKE ? OR description LIKE ? OR category LIKE ?");
    args.push(`%${term}%`, `%${term}%`, `%${term}%`);
  }

  conditions.push(`(${orClauses.join(" OR ")})`);

  const sql = `
    SELECT id, title, slug, game, game_genre, category, description, image_url, author, version
    FROM mods
    WHERE ${conditions.join(" AND ")}
    ORDER BY 
      CASE WHEN title LIKE ? THEN 1 ELSE 2 END,
      id DESC
    LIMIT ?
  `;
  args.unshift(`%${searchTerms[0] || query}%`);
  args.push(limit);

  try {
    const res = await db.execute({ sql, args });
    const mods = res.rows.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title),
      game: String(row.game),
      slug: String(row.slug),
      category: String(row.category),
      description: String(row.description),
      imageUrl: row.image_url ? String(row.image_url) : null,
      author: String(row.author || "المجتمع"),
      version: row.version ? String(row.version) : null,
      matchReason: reason
    }));

    return {
      interpretedQuery: query,
      category,
      matchedKeywords: matchedConcept ? matchedConcept.arabicKeywords.slice(0, 5) : [query],
      explanation,
      mods
    };
  } catch (err) {
    console.error("Smart search DB error:", err);
    return {
      interpretedQuery: query,
      category,
      matchedKeywords: [query],
      explanation,
      mods: []
    };
  }
}
