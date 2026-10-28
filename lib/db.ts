import "server-only";
import { createClient, type Client, type InArgs } from "@libsql/client";
import { randomUUID } from "node:crypto";
import communityModsData from "@/lib/community-mods.json";
import communityGameModsData from "@/lib/community-game-mods.json";
import communityPopularModsData from "@/lib/community-popular-mods.json";
import bannerlordWorkshopModsData from "@/lib/bannerlord-workshop-mods.json";
import { isBlockedGameKey } from "@/lib/blocked-games";

export type ModStatus = "pending" | "approved" | "rejected";

export const genreLabels: Record<string, string> = {
  Sandbox: "عالم مفتوح",
  Adventure: "مغامرات",
  RPG: "تقمّص الأدوار (RPG)",
  Simulation: "محاكاة",
  Strategy: "استراتيجية",
  Survival: "بقاء",
  Action: "أكشن",
  Horror: "رعب",
  Roguelike: "روغلايك",
};

const GAME_DEFAULT_COVERS: Record<string, string> = {
  "Mount & Blade II: Bannerlord": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg",
  "Cyberpunk 2077": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
  "Stardew Valley": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
  "Minecraft": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1928870/header.jpg",
  "Lethal Company": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg",
  "Valheim": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/892970/header.jpg",
  "Risk of Rain 2": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/632360/header.jpg",
  "Beat Saber": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg",
  "Titanfall 2: Northstar": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg",
  "The Witcher 3: Wild Hunt": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
  "The Elder Scrolls V: Skyrim Special Edition": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg",
};

export function getModImage(imageUrl: string | null, game: string): string | null {
  if (imageUrl && imageUrl.trim()) return imageUrl;
  return GAME_DEFAULT_COVERS[game] || null;
}

export function isGalleryImage(imageUrl: string | null) {
  return Boolean(
    imageUrl &&
    (imageUrl.includes("/images/") ||
     imageUrl.includes("steamstatic.com") ||
     imageUrl.includes("steamusercontent.com") ||
     imageUrl.includes("unsplash.com") ||
     imageUrl.includes(".r2.dev") ||
     imageUrl.includes("utfs.io") ||
     imageUrl.includes("ufs.sh") ||
     imageUrl.includes("cdn."))
  );
}

export type GameMod = {
  id: number;
  title: string;
  slug: string;
  game: string;
  gameGenre: string;
  category: string;
  description: string;
  imageUrl: string | null;
  downloadUrl: string;
  downloadFileName: string | null;
  downloadSize: number | null;
  mirrorFileName?: string | null;
  mirrorSize?: number | null;
  sourceUrl: string | null;
  author: string;
  version: string | null;
  createdAt: string;
};

export type SubmittedMod = GameMod & {
  status: ModStatus;
  uploadedFileName: string | null;
  uploadedSize: number | null;
  uploadStorageKey: string | null;
};

export type CatalogFilters = {
  search?: string;
  game?: string;
  category?: string;
  genre?: string;
  page?: number;
  pageSize?: number;
};

export type ModInput = {
  title: string;
  game: string;
  gameGenre: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  downloadUrl?: string | null;
  downloadFileName?: string | null;
  downloadSize?: number | null;
  sourceUrl?: string | null;
  author: string;
  version?: string | null;
  status?: ModStatus;
  createdBy?: string | null;
  uploadedFileName?: string | null;
  uploadedSize?: number | null;
  uploadStorageKey?: string | null;
};

let dbPromise: Promise<Client> | null = null;

async function executeWithRetry<T>(fn: () => Promise<T>, retries = 4, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const is502 = err?.message?.includes("502") || err?.status === 502;
      console.warn(`Turso query attempt ${i + 1} failed:`, err?.message || err);
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, (is502 ? 2000 : delay) * (i + 1)));
      }
    }
  }
  throw lastError;
}

async function initializeDatabase(): Promise<Client> {
  const databaseUrl = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!databaseUrl || !authToken) {
    throw new Error("Turso is required. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local, then restart the app.");
  }

  const db = createClient({ url: databaseUrl, authToken });

  // إنشاء الجداول في قاعدة البيانات الجديدة تلقائياً إذا لم تكن موجودة
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        game TEXT NOT NULL,
        game_genre TEXT NOT NULL DEFAULT 'Sandbox',
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        download_url TEXT NOT NULL,
        download_file_name TEXT,
        download_size INTEGER,
        author TEXT NOT NULL DEFAULT 'المجتمع',
        version TEXT,
        status TEXT NOT NULL DEFAULT 'approved',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        source_url TEXT,
        upload_storage_key TEXT,
        upload_file_name TEXT,
        upload_size INTEGER,
        mirror_storage_key TEXT,
        mirror_file_name TEXT,
        mirror_size INTEGER,
        mirror_uploaded_at TEXT
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        image TEXT,
        last_login TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn("Table initialization check:", err);
  }

  return db;
}

export function getDb(): Promise<Client> {
  if (!dbPromise) dbPromise = initializeDatabase();
  return dbPromise;
}

export async function getPublishedMods(filters: CatalogFilters = {}): Promise<GameMod[]> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 48;
  const offset = (page - 1) * pageSize;

  const conditions = ["status = 'approved'"];
  const args: any[] = [];

  if (filters.search) {
    const rawSearch = filters.search.trim().toLowerCase();
    
    // Check if the search contains Arabic intent/concept words
    const conceptMap: Record<string, string[]> = {
      fly: ["طير", "يطير", "طيران", "طياره", "سفينه", "سفينة", "فضاء", "فلاي", "مركبه", "مركبة", "سياره", "سيارة"],
      weapon: ["سلاح", "اسلحه", "أسلحة", "مسدس", "فرد", "رشاش", "بندقية", "طلقات", "رصاص", "قتال", "حرب"],
      magic: ["سحر", "شعوذه", "شعوذة", "طاقه", "طاقة", "تعاويذ", "تعويذة", "قدرات"],
      storage: ["صناديق", "صندوق", "ترتيب", "تخزين", "مخزن", "تنظيم", "اغراض", "أغراض", "انفنتوري"],
      cheat: ["غش", "فلوس", "ذهب", "شيت", "تريلر", "منيو", "خلود", "دم لا نهائي"],
      map: ["خريطه", "خريطة", "ماب", "ميني ماب", "رادار"],
      weather: ["جرافيكس", "جرافيك", "رسوم", "رسومات", "واقعيه", "واقعية", "طقس", "دقة", "4k"],
      sound: ["اصوات", "أصوات", "صوت", "موسيقى", "اغاني", "أغاني", "ساوند"],
      survival: ["وحوش", "اعداء", "أعداء", "زومبي", "بقاء", "رعب"]
    };

    let matchedEnglishKey: string | null = null;
    for (const [enKey, arWords] of Object.entries(conceptMap)) {
      if (arWords.some(w => rawSearch.includes(w))) {
        matchedEnglishKey = enKey;
        break;
      }
    }

    if (matchedEnglishKey) {
      conditions.push("(title LIKE ? OR description LIKE ? OR game LIKE ? OR title LIKE ? OR description LIKE ? OR category LIKE ?)");
      const q = `%${filters.search}%`;
      const eq = `%${matchedEnglishKey}%`;
      args.push(q, q, q, eq, eq, eq);
    } else {
      conditions.push("(title LIKE ? OR description LIKE ? OR game LIKE ?)");
      const q = `%${filters.search}%`;
      args.push(q, q, q);
    }
  }

  if (filters.game) {
    conditions.push("game = ?");
    args.push(filters.game);
  }

  if (filters.genre) {
    conditions.push("game_genre = ?");
    args.push(filters.genre);
  }

  if (filters.category) {
    conditions.push("category = ?");
    args.push(filters.category);
  }

  const sql = `
    SELECT id, title, slug, game, game_genre, category, description, image_url, download_url, download_file_name, download_size, mirror_file_name, mirror_size, source_url, author, version, created_at FROM mods
    WHERE ${conditions.join(" AND ")}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;
  args.push(pageSize, offset);

  try {
    const db = await getDb();
    const res = await executeWithRetry(() => db.execute({ sql, args }), 2, 500);

    return res.rows.map((row: any) => {
      const game = String(row.game);
      const rawImage = row.image_url ? String(row.image_url) : null;
      return {
        id: Number(row.id),
        title: String(row.title),
        slug: String(row.slug),
        game,
        gameGenre: String(row.game_genre || "Sandbox"),
        category: String(row.category),
        description: String(row.description),
        imageUrl: getModImage(rawImage, game),
        downloadUrl: String(row.download_url),
        downloadFileName: row.download_file_name ? String(row.download_file_name) : null,
        downloadSize: row.download_size ? Number(row.download_size) : null,
        mirrorFileName: row.mirror_file_name ? String(row.mirror_file_name) : null,
        mirrorSize: row.mirror_size ? Number(row.mirror_size) : null,
        sourceUrl: row.source_url ? String(row.source_url) : null,
        author: String(row.author || "المجتمع"),
        version: row.version ? String(row.version) : null,
        createdAt: String(row.created_at),
      };
    });
  } catch (error) {
    console.error("Turso error in getPublishedMods:", error);
    return [];
  }
}

export async function getPublishedModCount(filters: CatalogFilters = {}): Promise<number> {
  const conditions = ["status = 'approved'"];
  const args: any[] = [];

  if (filters.search) {
    const rawSearch = filters.search.trim().toLowerCase();
    
    // Check if the search contains Arabic intent/concept words
    const conceptMap: Record<string, string[]> = {
      fly: ["طير", "يطير", "طيران", "طياره", "سفينه", "سفينة", "فضاء", "فلاي", "مركبه", "مركبة", "سياره", "سيارة"],
      weapon: ["سلاح", "اسلحه", "أسلحة", "مسدس", "فرد", "رشاش", "بندقية", "طلقات", "رصاص", "قتال", "حرب"],
      magic: ["سحر", "شعوذه", "شعوذة", "طاقه", "طاقة", "تعاويذ", "تعويذة", "قدرات"],
      storage: ["صناديق", "صندوق", "ترتيب", "تخزين", "مخزن", "تنظيم", "اغراض", "أغراض", "انفنتوري"],
      cheat: ["غش", "فلوس", "ذهب", "شيت", "تريلر", "منيو", "خلود", "دم لا نهائي"],
      map: ["خريطه", "خريطة", "ماب", "ميني ماب", "رادار"],
      weather: ["جرافيكس", "جرافيك", "رسوم", "رسومات", "واقعيه", "واقعية", "طقس", "دقة", "4k"],
      sound: ["اصوات", "أصوات", "صوت", "موسيقى", "اغاني", "أغاني", "ساوند"],
      survival: ["وحوش", "اعداء", "أعداء", "زومبي", "بقاء", "رعب"]
    };

    let matchedEnglishKey: string | null = null;
    for (const [enKey, arWords] of Object.entries(conceptMap)) {
      if (arWords.some(w => rawSearch.includes(w))) {
        matchedEnglishKey = enKey;
        break;
      }
    }

    if (matchedEnglishKey) {
      conditions.push("(title LIKE ? OR description LIKE ? OR game LIKE ? OR title LIKE ? OR description LIKE ? OR category LIKE ?)");
      const q = `%${filters.search}%`;
      const eq = `%${matchedEnglishKey}%`;
      args.push(q, q, q, eq, eq, eq);
    } else {
      conditions.push("(title LIKE ? OR description LIKE ? OR game LIKE ?)");
      const q = `%${filters.search}%`;
      args.push(q, q, q);
    }
  }

  if (filters.game) {
    conditions.push("game = ?");
    args.push(filters.game);
  }

  if (filters.genre) {
    conditions.push("game_genre = ?");
    args.push(filters.genre);
  }

  if (filters.category) {
    conditions.push("category = ?");
    args.push(filters.category);
  }

  const sql = `SELECT COUNT(*) as count FROM mods WHERE ${conditions.join(" AND ")}`;

  try {
    const db = await getDb();
    const res = await executeWithRetry(() => db.execute({ sql, args }), 2, 500);
    return Number(res.rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Turso error in getPublishedModCount:", error);
    return 100;
  }
}

export async function getCatalogOptions() {
  return {
    games: [
      "Minecraft",
      "Lethal Company",
      "Valheim",
      "Risk of Rain 2",
      "Palworld",
      "Titanfall 2",
      "BONELAB",
      "Cities: Skylines II",
      "ULTRAKILL",
      "Content Warning",
      "ROUNDS",
      "GTFO",
      "R.E.P.O.",
      "Subnautica",
      "Outward",
      "Dyson Sphere Program",
      "Monster Train",
      "Stacklands",
    ],
    categories: [
      "Gameplay",
      "Visuals",
      "Audio",
      "QoL",
      "Tools",
      "Items",
      "Optimization",
      "World Gen",
      "Mods",
    ],
    genres: [
      "Sandbox",
      "Survival",
      "Action",
      "Horror",
      "Roguelike",
      "Adventure",
      "RPG",
      "Simulation",
      "Strategy",
    ],
  };
}

export async function getModBySlug(slug: string): Promise<GameMod | null> {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({
      sql: "SELECT * FROM mods WHERE slug = ? LIMIT 1",
      args: [slug],
    })
  );
  if (!res.rows[0]) return null;
  const row: any = res.rows[0];
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    game: String(row.game),
    gameGenre: String(row.game_genre || "Sandbox"),
    category: String(row.category),
    description: String(row.description),
    imageUrl: getModImage(row.image_url ? String(row.image_url) : null, String(row.game)),
    downloadUrl: String(row.download_url),
    downloadFileName: row.download_file_name ? String(row.download_file_name) : null,
    downloadSize: row.download_size ? Number(row.download_size) : null,
    mirrorFileName: row.mirror_file_name ? String(row.mirror_file_name) : null,
    mirrorSize: row.mirror_size ? Number(row.mirror_size) : null,
    sourceUrl: row.source_url ? String(row.source_url) : null,
    author: String(row.author || "المجتمع"),
    version: row.version ? String(row.version) : null,
    createdAt: String(row.created_at),
  };
}

export async function getModMirrorBySlug(slug: string) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({
      sql: "SELECT mirror_storage_key, mirror_file_name, mirror_size FROM mods WHERE slug = ? AND mirror_storage_key IS NOT NULL LIMIT 1",
      args: [slug],
    })
  );
  if (!res.rows[0]) return null;
  return {
    storageKey: String(res.rows[0].mirror_storage_key),
    fileName: String(res.rows[0].mirror_file_name),
    size: Number(res.rows[0].mirror_size),
  };
}

export type ModReview = {
  engine: "local" | "gemini" | "openai";
  risk: "low" | "medium" | "high";
  summary: string;
  recommendation: string;
  scannedFiles: number;
  omittedFiles: number;
  model?: string;
  analyzedAt?: string;
  findings: Array<{ title: string; severity: string; detail: string }>;
};

export async function getPendingMods(): Promise<Array<SubmittedMod & { review?: ModReview | null }>> {
  const db = await getDb();
  try {
    const res = await executeWithRetry(() =>
      db.execute("SELECT * FROM mods WHERE status = 'pending' ORDER BY id DESC")
    );
    return res.rows.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      game: String(row.game),
      gameGenre: String(row.game_genre || "Sandbox"),
      category: String(row.category),
      description: String(row.description),
      imageUrl: getModImage(row.image_url ? String(row.image_url) : null, String(row.game)),
      downloadUrl: String(row.download_url),
      downloadFileName: row.download_file_name ? String(row.download_file_name) : null,
      downloadSize: row.download_size ? Number(row.download_size) : null,
      sourceUrl: row.source_url ? String(row.source_url) : null,
      author: String(row.author || "المجتمع"),
      version: row.version ? String(row.version) : null,
      createdAt: String(row.created_at),
      status: row.status as ModStatus,
      uploadedFileName: row.upload_file_name ? String(row.upload_file_name) : null,
      uploadedSize: row.upload_size ? Number(row.upload_size) : null,
      uploadStorageKey: row.upload_storage_key ? String(row.upload_storage_key) : null,
      review: null,
    }));
  } catch {
    return [];
  }
}

export async function createSubmission(
  input: ModInput,
  createdByEmail: string,
  upload?: { storageKey: string; fileName: string; size: number } | null
) {
  const db = await getDb();
  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  await executeWithRetry(() =>
    db.execute({
      sql: `INSERT INTO mods (
        title, slug, game, game_genre, category, description, image_url, download_url,
        author, version, status, created_by, upload_storage_key, upload_file_name, upload_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      args: [
        input.title,
        slug,
        input.game,
        input.gameGenre,
        input.category,
        input.description,
        input.imageUrl || null,
        input.downloadUrl || "#",
        input.author,
        input.version || null,
        createdByEmail,
        upload?.storageKey || null,
        upload?.fileName || null,
        upload?.size || null,
      ],
    })
  );
}

export async function getModForAdmin(id: number) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({ sql: "SELECT * FROM mods WHERE id = ? LIMIT 1", args: [id] })
  );
  if (!res.rows[0]) return null;
  const row: any = res.rows[0];
  return {
    id: Number(row.id),
    title: String(row.title),
    storageKey: row.upload_storage_key ? String(row.upload_storage_key) : null,
    mirrorKey: row.mirror_storage_key ? String(row.mirror_storage_key) : null,
  };
}

export async function getPendingModForReview(id: number) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({ sql: "SELECT * FROM mods WHERE id = ? AND status = 'pending' LIMIT 1", args: [id] })
  );
  if (!res.rows[0]) return null;
  const row: any = res.rows[0];
  return {
    id: Number(row.id),
    title: String(row.title),
    game: String(row.game),
    category: String(row.category),
    version: row.version ? String(row.version) : null,
    description: String(row.description),
    downloadUrl: String(row.download_url),
    fileName: row.upload_file_name ? String(row.upload_file_name) : null,
    storageKey: row.upload_storage_key ? String(row.upload_storage_key) : null,
  };
}

export async function setModStatus(id: number, status: ModStatus) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({
      sql: "UPDATE mods SET status = ? WHERE id = ? AND status = 'pending'",
      args: [status, id],
    })
  );
  return res.rowsAffected > 0;
}

export async function deleteMod(id: number) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({ sql: "DELETE FROM mods WHERE id = ?", args: [id] })
  );
  return res.rowsAffected > 0;
}

export async function setModMirror(
  id: number,
  mirror: { storageKey: string; fileName: string; size: number } | null
) {
  const db = await getDb();
  const res = await executeWithRetry(() =>
    db.execute({
      sql: `UPDATE mods SET
        mirror_storage_key = ?,
        mirror_file_name = ?,
        mirror_size = ?,
        mirror_uploaded_at = ?
      WHERE id = ?`,
      args: [
        mirror?.storageKey || null,
        mirror?.fileName || null,
        mirror?.size || null,
        mirror ? new Date().toISOString() : null,
        id,
      ],
    })
  );
  return res.rowsAffected > 0;
}

export async function saveModReview(id: number, _report: any) {
  return true;
}

export async function recordMemberLogin(
  email: string,
  name: string,
  image: string | null
) {
  try {
    const db = await getDb();
    await executeWithRetry(() =>
      db.execute({
        sql: `INSERT INTO members (email, name, image, last_login)
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(email) DO UPDATE SET
                name = excluded.name,
                image = excluded.image,
                last_login = CURRENT_TIMESTAMP`,
        args: [email, name, image],
      })
    );
  } catch {
    // تجاهل خطأ تسجيل الدخول إذا كانت قاعدة البيانات تحت الصيانة
  }
}
