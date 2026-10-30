import { getDb } from "./db";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// ===== Gemini: يفهم الفكرة ويرجع كلمات بحث إنجليزية =====
async function extractSearchTermsWithGemini(query: string): Promise<{
  terms: string[];
  category: string;
  explanation: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `أنت محلل بحث متخصص في مودات ألعاب الفيديو. المستخدم يصف مودًا بالعربية.

فكرة المستخدم: "${query}"

أرجع JSON بالشكل التالي فقط (بدون أي نص إضافي):
{
  "terms": ["term1", "term2", "term3", "term4", "term5"],
  "category": "اسم الفئة بالعربية",
  "explanation": "جملة قصيرة تشرح ما فهمته من الفكرة"
}

قواعد:
- terms: 5-8 كلمات إنجليزية للبحث في قاعدة بيانات المودات (اسماء مودات شائعة، تقنيات، ميزات)
- category: فئة المود بالعربية (مثل: أسلحة، جرافيكس، شخصيات، خرائط، ...)
- explanation: جملة عربية قصيرة تشرح ما فهمته`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // استخرج JSON من الرد
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      terms: Array.isArray(parsed.terms) ? parsed.terms.slice(0, 8) : [query],
      category: parsed.category || "عام",
      explanation: parsed.explanation || `نتائج البحث عن: ${query}`,
    };
  } catch {
    // Fallback: كلمات مباشرة من الجملة
    return {
      terms: query.split(/\s+/).filter(w => w.length > 1).slice(0, 6),
      category: "عام",
      explanation: `نتائج البحث عن: ${query}`,
    };
  }
}

export async function smartSearchMods(query: string, limit: number = 48): Promise<SemanticSearchResult> {
  const db = await getDb();

  // استخدام Gemini لفهم الفكرة
  const { terms, category, explanation } = await extractSearchTermsWithGemini(query);

  // بناء SQL مع المصطلحات
  const conditions: string[] = ["status = 'approved'"];
  const orClauses: string[] = [];
  const args: any[] = [];

  // البحث بالجملة الأصلية دائماً
  orClauses.push("title LIKE ? OR description LIKE ?");
  args.push(`%${query}%`, `%${query}%`);

  // البحث بكل مصطلح من Gemini
  for (const term of terms.slice(0, 8)) {
    orClauses.push("title LIKE ? OR description LIKE ? OR category LIKE ?");
    args.push(`%${term}%`, `%${term}%`, `%${term}%`);
  }

  conditions.push(`(${orClauses.join(" OR ")})`);

  const firstTerm = terms[0] || query;
  const sql = `
    SELECT id, title, slug, game, game_genre, category, description, image_url, author, version
    FROM mods
    WHERE ${conditions.join(" AND ")}
    ORDER BY
      CASE WHEN title LIKE ? THEN 0
           WHEN title LIKE ? THEN 1
           ELSE 2 END,
      id DESC
    LIMIT ?
  `;

  // أولوية: المصطلح الأول من Gemini، ثم الجملة الأصلية
  args.unshift(`%${firstTerm}%`, `%${query}%`);
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
      matchReason: explanation,
    }));

    return {
      interpretedQuery: query,
      category,
      matchedKeywords: terms.slice(0, 5),
      explanation,
      mods,
    };
  } catch (err) {
    console.error("Smart search DB error:", err);
    return {
      interpretedQuery: query,
      category,
      matchedKeywords: terms,
      explanation,
      mods: [],
    };
  }
}
