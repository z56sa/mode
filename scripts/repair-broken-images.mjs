import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

const APP_IDS = {
  'Mount & Blade II: Bannerlord': 261550,
  'Cyberpunk 2077': 1091500,
  'The Witcher 3: Wild Hunt': 292030,
  'The Elder Scrolls V: Skyrim Special Edition': 489830,
};

async function getGameAssets(appId) {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const data = await res.json();
    const info = data[appId]?.data;
    if (!info) return [];
    const header = info.header_image;
    const screenshots = (info.screenshots || []).map(s => s.path_full);
    return [header, ...screenshots].filter(Boolean);
  } catch (e) {
    return [];
  }
}

async function isImageWorking(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) return true;
    if (res.status === 405 || res.status === 403) {
      const g = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0', 'Range': 'bytes=0-10' } });
      return g.status === 200 || g.status === 206;
    }
    return false;
  } catch {
    return false;
  }
}

async function fixAllBrokenImages() {
  console.log('🔄 Fetching official game assets from Steam API...');
  const gameScreenshots = {};
  for (const [gameName, appId] of Object.entries(APP_IDS)) {
    const assets = await getGameAssets(appId);
    gameScreenshots[gameName] = assets;
    console.log(`  🎮 ${gameName}: ${assets.length} official assets available`);
  }

  const rows = await db.execute(`
    SELECT id, title, slug, game, image_url
    FROM mods
    WHERE game IN (
      'Mount & Blade II: Bannerlord',
      'Cyberpunk 2077',
      'The Witcher 3: Wild Hunt',
      'The Elder Scrolls V: Skyrim Special Edition'
    )
    ORDER BY id ASC
  `);

  console.log(`\n🔍 Verifying ${rows.rows.length} mods...`);
  let fixedCount = 0;
  let intactCount = 0;

  for (let i = 0; i < rows.rows.length; i++) {
    const row = rows.rows[i];
    const working = await isImageWorking(row.image_url);

    if (!working) {
      const assets = gameScreenshots[row.game] || [];
      if (assets.length > 0) {
        // Deterministic hash based on mod ID / slug so each mod gets a consistent, diverse image
        const strId = String(row.id);
        const imgIndex = Math.abs(strId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % assets.length;
        const validAsset = assets[imgIndex];

        await db.execute({
          sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
          args: [validAsset, row.id],
        });
        console.log(`🔧 Fixed broken image for [${row.game.substring(0, 15)}] "${row.title}" -> Steam Official Asset #${imgIndex}`);
        fixedCount++;
      }
    } else {
      intactCount++;
    }
  }

  console.log(`\n🎉 Results:`);
  console.log(`  ✅ Already healthy & working: ${intactCount}`);
  console.log(`  🔧 Repaired broken images: ${fixedCount}`);
}

fixAllBrokenImages().catch(console.error);
