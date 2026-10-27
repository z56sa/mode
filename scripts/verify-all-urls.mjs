import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

async function checkUrl(url) {
  if (!url) return { ok: false, status: 0 };
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 405 || res.status === 403) {
      // try GET
      const getRes = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0', 'Range': 'bytes=0-10' } });
      return { ok: getRes.ok, status: getRes.status };
    }
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testAll() {
  const rows = await db.execute(`
    SELECT id, title, slug, game, image_url
    FROM mods
    WHERE game IN (
      'Mount & Blade II: Bannerlord',
      'Cyberpunk 2077',
      'The Witcher 3: Wild Hunt',
      'The Elder Scrolls V: Skyrim Special Edition'
    )
  `);

  console.log(`Checking ${rows.rows.length} mods...`);
  const broken = [];

  for (const r of rows.rows) {
    const res = await checkUrl(r.image_url);
    if (!res.ok) {
      console.log(`❌ Broken (${res.status || res.error}): [${r.game}] ${r.title}`);
      console.log(`   URL: ${r.image_url}`);
      broken.push({ id: r.id, game: r.game, title: r.title, url: r.image_url });
    }
  }

  console.log(`\nTotal broken images: ${broken.length} / ${rows.rows.length}`);
}

testAll();
