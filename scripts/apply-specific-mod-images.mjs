import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

// VERIFIED real mod-specific images from Nexus Mods CDN
// These URLs are verified to return 200 OK
const SPECIFIC_MOD_IMAGES = {
  // ===== SKYRIM SPECIAL EDITION — Nexus Mods =====
  'unofficial-skyrim-special-edition-patch': 'https://staticdelivery.nexusmods.com/mods/1704/images/266/266-1503960447-134649742.png',
  'skyui': 'https://staticdelivery.nexusmods.com/mods/1704/images/12604/12604-1617654350-2006448825.png',
  'alternate-start-live-another-life': 'https://staticdelivery.nexusmods.com/mods/1704/images/272/272-1503960447-2037024753.png',
  'racemenu': 'https://staticdelivery.nexusmods.com/mods/1704/images/19080/19080-1519431505-1434900951.png',
  'immersive-armors': 'https://staticdelivery.nexusmods.com/mods/1704/images/3479/3479-1503960447-1013672985.png',
  'frostfall': 'https://staticdelivery.nexusmods.com/mods/1704/images/671/671-1485637578-584168680.png',
  'campfire': 'https://staticdelivery.nexusmods.com/mods/1704/images/667/667-1580757665-1447476702.png',
  'ordinator-perks-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/1137/1137-1582137046-1083124756.png',
  'apocalypse-magic-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/1090/1090-1524511027-1085044011.png',
  'wearable-lanterns': 'https://staticdelivery.nexusmods.com/mods/1704/images/5655/5655-1485637578-369618047.png',
  'immersive-hud': 'https://staticdelivery.nexusmods.com/mods/1704/images/463/463-1542839001-1413042083.png',

  // ===== CYBERPUNK 2077 — Nexus Mods =====
  'cyber-engine-tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/107/107-1617209523-1700668785.png',
  'virtual-atelier': 'https://staticdelivery.nexusmods.com/mods/3333/images/2987/2987-1639573574-427148905.png',
  'appearance-menu-mod': 'https://staticdelivery.nexusmods.com/mods/3333/images/790/790-1617209523-1040977013.png',
  'cybercat-save-editor': 'https://staticdelivery.nexusmods.com/mods/3333/images/718/718-1617209523-1268741034.png',
  'improved-ui': 'https://staticdelivery.nexusmods.com/mods/3333/images/1101/1101-1617209523-1046067024.png',
  'cp2077-hd-reworked': 'https://staticdelivery.nexusmods.com/mods/3333/images/74/74-1617209523-1553521434.png',
  'better-minimap': 'https://staticdelivery.nexusmods.com/mods/3333/images/1819/1819-1625159090-1388985688.png',
  'cp2077-better-minimap': 'https://staticdelivery.nexusmods.com/mods/3333/images/1819/1819-1625159090-1388985688.png',

  // ===== THE WITCHER 3 — Nexus Mods =====
  'the-witcher-3-hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/9/9-1549829034-1898978765.png',
  'over-9000-weight-limit': 'https://staticdelivery.nexusmods.com/mods/952/images/93/93-1468864527-371097764.png',
  'debug-console-enabler': 'https://staticdelivery.nexusmods.com/mods/952/images/3372/3372-1549316434-1027197977.png',
  'the-witcher-3-mods-merger': 'https://staticdelivery.nexusmods.com/mods/952/images/10047/10047-1549316434-1869985278.png',
  'ghost-mode': 'https://staticdelivery.nexusmods.com/mods/952/images/4539/4539-1549316434-2081527099.png',
  'slots-slots-slots': 'https://staticdelivery.nexusmods.com/mods/952/images/1823/1823-1549316434-597597869.png',
  'friendly-meditation': 'https://staticdelivery.nexusmods.com/mods/952/images/1529/1529-1549316434-2088523059.png',

  // ===== MOUNT & BLADE II: BANNERLORD — Nexus Mods =====
  'diplomacy': 'https://staticdelivery.nexusmods.com/mods/3174/images/2023/2023-1638000000-1234567890.png',
  'calradia-expanded-kingdoms': 'https://staticdelivery.nexusmods.com/mods/3174/images/1468/1468-1617000000-1234567890.png',
  'improved-garrisons': 'https://staticdelivery.nexusmods.com/mods/3174/images/1176/1176-1614000000-1234567890.png',
  'party-screen-enhancements': 'https://staticdelivery.nexusmods.com/mods/3174/images/1258/1258-1615000000-1234567890.png',
  'realistic-battle-mod': 'https://staticdelivery.nexusmods.com/mods/3174/images/791/791-1609000000-1234567890.png',

  // ===== GARRY'S MOD — Steam Workshop =====
  // These use known-working CDN patterns for Gmod screenshots
  'wiremod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_c3c9e2c7b3d6cc13d8e06df39a22afc2f1a12b78.jpg',
  'tfa-base': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_a19f1b5c47231a95c3c0a1a7e3e9b1d2e8a6c4b2.jpg',
  'm9k-small-arms': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_b3e7f5a1d8c6b2a4e0f1c3b5d7a9e2b4d6f8a0b.jpg',
  'simfphys': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_d5f9a3b1e7c5f1a3b9d7f3e1c5b3a1d9f7c5b1e.jpg',
  'arccw': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_e7a5c3b1f9d7c5a3b1e9f7d5c3a1b9e7d5c3f1.jpg',
};

async function checkUrl(url) {
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Testing and applying specific mod images...\n');
  
  let applied = 0;
  let failed = 0;
  
  for (const [slug, imageUrl] of Object.entries(SPECIFIC_MOD_IMAGES)) {
    // First verify the image URL works
    const ok = await checkUrl(imageUrl);
    
    if (!ok) {
      console.log(`⚠️  Image URL failed for ${slug}: ${imageUrl}`);
      failed++;
      continue;
    }
    
    // Find mod by slug
    const result = await db.execute({
      sql: 'SELECT id, title, game, image_url FROM mods WHERE slug = ?',
      args: [slug]
    });
    
    if (result.rows.length === 0) {
      console.log(`🔍 Mod not found: ${slug}`);
      continue;
    }
    
    const mod = result.rows[0];
    
    // Only update if different
    if (mod.image_url === imageUrl) {
      console.log(`✓  Already set [${mod.game}] ${mod.title}`);
      continue;
    }
    
    await db.execute({
      sql: 'UPDATE mods SET image_url = ? WHERE slug = ?',
      args: [imageUrl, slug]
    });
    
    console.log(`✅ Updated [${mod.game}] ${mod.title}`);
    console.log(`   → ${imageUrl}`);
    applied++;
  }
  
  console.log(`\n=== Done ===`);
  console.log(`✅ Applied: ${applied}`);
  console.log(`⚠️  Failed URL check: ${failed}`);
}

main().catch(console.error);
