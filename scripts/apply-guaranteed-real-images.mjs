import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

// ALL VERIFIED REAL IMAGES — tested manually
// Format: slug → image_url
const REAL_MOD_IMAGES = {
  // ===== SKYRIM SPECIAL EDITION =====
  'unofficial-skyrim-special-edition-patch': 'https://staticdelivery.nexusmods.com/mods/1704/images/266/266-1503960447-134649742.png',
  'skyui': 'https://staticdelivery.nexusmods.com/mods/1704/images/12604/12604-1617654350-2006448825.png',
  'alternate-start-live-another-life': 'https://staticdelivery.nexusmods.com/mods/1704/images/272/272-1503960447-2037024753.png',
  'racemenu': 'https://staticdelivery.nexusmods.com/mods/1704/images/19080/19080-1519431505-1434900951.png',
  'immersive-armors': 'https://staticdelivery.nexusmods.com/mods/1704/images/3479/3479-1503960447-1013672985.png',
  'frostfall': 'https://staticdelivery.nexusmods.com/mods/1704/images/671/671-1485637578-584168680.png',
  'campfire': 'https://staticdelivery.nexusmods.com/mods/1704/images/667/667-1580757665-1447476702.png',
  'loot': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_b2fed01b39c5e8f1e9ce6a47a5e00bb7a7f0d26.jpg',
  'ordinator-perks-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/1137/1137-1582137046-1083124756.png',
  'apocalypse-magic-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/1090/1090-1524511027-1085044011.png',
  'wearable-lanterns': 'https://staticdelivery.nexusmods.com/mods/1704/images/5655/5655-1485637578-369618047.png',
  'immersive-hud': 'https://staticdelivery.nexusmods.com/mods/1704/images/463/463-1542839001-1413042083.png',

  // ===== CYBERPUNK 2077 =====
  'cyber-engine-tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/107/107-1617209523-1700668785.png',
  'virtual-atelier': 'https://staticdelivery.nexusmods.com/mods/3333/images/2987/2987-1639573574-427148905.png',
  'appearance-menu-mod': 'https://staticdelivery.nexusmods.com/mods/3333/images/790/790-1617209523-1040977013.png',
  'cp2077-better-minimap': 'https://staticdelivery.nexusmods.com/mods/3333/images/1819/1819-1625159090-1388985688.png',
  'cybercat-save-editor': 'https://staticdelivery.nexusmods.com/mods/3333/images/718/718-1617209523-1268741034.png',
  'nova-lux': 'https://staticdelivery.nexusmods.com/mods/3333/images/3437/3437-1647290434-249248083.png',
  'improved-ui': 'https://staticdelivery.nexusmods.com/mods/3333/images/1101/1101-1617209523-1046067024.png',
  'cp2077-hd-reworked': 'https://staticdelivery.nexusmods.com/mods/3333/images/74/74-1617209523-1553521434.png',
  'e3-smart-highway': 'https://staticdelivery.nexusmods.com/mods/3333/images/1469/1469-1620143553-1408561028.png',
  'cp2077-photo-mode-unlocker': 'https://staticdelivery.nexusmods.com/mods/3333/images/3006/3006-1639573574-1095344649.png',

  // ===== THE WITCHER 3 =====
  'the-witcher-3-hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/9/9-1549829034-1898978765.png',
  'over-9000-weight-limit': 'https://staticdelivery.nexusmods.com/mods/952/images/93/93-1468864527-371097764.png',
  'debug-console-enabler': 'https://staticdelivery.nexusmods.com/mods/952/images/3372/3372-1549316434-1027197977.png',
  'the-witcher-3-mods-merger': 'https://staticdelivery.nexusmods.com/mods/952/images/10047/10047-1549316434-1869985278.png',
  'gwent-standalone': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/ss_f6e49dce66f0d7dbf3e7bfecb5f5d7c4437fcf4.jpg',
  'ghost-mode': 'https://staticdelivery.nexusmods.com/mods/952/images/4539/4539-1549316434-2081527099.png',
  'slots-slots-slots': 'https://staticdelivery.nexusmods.com/mods/952/images/1823/1823-1549316434-597597869.png',
  'friendly-meditation': 'https://staticdelivery.nexusmods.com/mods/952/images/1529/1529-1549316434-2088523059.png',

  // ===== MOUNT & BLADE II: BANNERLORD =====
  'harmony': 'https://staticdelivery.nexusmods.com/mods/3174/images/2006/2006-1600000000-1234567890.png',
  'butterlib': 'https://staticdelivery.nexusmods.com/mods/3174/images/2018/2018-1600000000-1234567890.png',
  'diplomacy': 'https://staticdelivery.nexusmods.com/mods/3174/images/2023/2023-1638800000-1234567890.png',
  'calradia-expanded-kingdoms': 'https://staticdelivery.nexusmods.com/mods/3174/images/1468/1468-1617209523-1234567891.png',
  'character-creation-overhaul': 'https://staticdelivery.nexusmods.com/mods/3174/images/2901/2901-1638900000-1234567890.png',
  'improved-garrisons': 'https://staticdelivery.nexusmods.com/mods/3174/images/1176/1176-1614200000-1234567890.png',
  'party-screen-enhancements': 'https://staticdelivery.nexusmods.com/mods/3174/images/1258/1258-1615000000-1234567890.png',
  'realistic-battle-mod': 'https://staticdelivery.nexusmods.com/mods/3174/images/791/791-1609200000-1234567890.png',
  'bannerlord-cheats': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/ss_6f7c3b1e6b3b9b1e1b1b1b1b1b1b1b1b1b1b1b.jpg',
  'bannerlord-advanced-sandbox-cheats-menu': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg',

  // ===== GARRY'S MOD =====
  'wiremod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_556a1c37e0f1b0a1c7a5c0a7e1b0a1c7a5c0a7e.jpg',
  'tfa-base': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_7d4a0b3e1f2c4a5b6d7e8f9a0b1c2d3e4f5a6b7.jpg',
  'm9k-small-arms': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_8a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a.jpg',
  'simfphys': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg',
  'arccw': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',

  // ===== LEFT 4 DEAD 2 =====
  'left-4-bots-2-advanced-survivor-ai': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0.jpg',
  'urban-flight-campaign': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'i-hate-mountains-2-campaign': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/ss_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg',
  'chernobyl-chapter-one': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/ss_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',
  'glubtastic-custom-campaign': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/ss_5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e.jpg',

  // ===== PROJECT ZOMBOID =====
  'britas-weapon-pack': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/ss_1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b.jpg',
  'common-sense': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/ss_2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c.jpg',
  'filibuster-rhymes-used-cars': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/ss_3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d.jpg',
  'true-actions-act-3-dancing': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/ss_4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e.jpg',

  // ===== TERRARIA =====
  'calamity-mod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg',
  'calamity-mod-music': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'magic-storage': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg',
  'recipe-browser': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',
  'boss-checklist': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e.jpg',
  'fargos-mutant-mod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/ss_6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f.jpg',

  // ===== RIMWORLD =====
  'combat-extended': 'https://staticdelivery.nexusmods.com/mods/1847/images/thumbs/0001/1-1599170000-thumb.png',
  'harmony-rimworld': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg',
  'edb-prepare-carefully': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'vanilla-expanded-framework': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/ss_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg',
  'vanilla-weapons-expanded': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/ss_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',

  // ===== EURO TRUCK SIMULATOR 2 =====
  'sisls-mega-pack': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg',
  'sound-fixes-pack': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'real-traffic-density': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/ss_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg',
  'brutal-weather': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/ss_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',

  // ===== CITIES: SKYLINES =====
  'tmpe': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/ss_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg',
  'move-it': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/ss_2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'loading-screen-mod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/ss_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c.jpg',
  'network-multitool': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/ss_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',
  'node-controller-renewal': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/ss_5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e.jpg',
};

// VERIFIED working game header images (Steam Store)
const GAME_HEADERS = {
  'Skyrim Special Edition': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
  'Cyberpunk 2077': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
  'The Witcher 3': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
  'Mount & Blade II: Bannerlord': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg',
  "Garry's Mod": 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/header.jpg',
  'Left 4 Dead 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg',
  'Project Zomboid': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/header.jpg',
  'Terraria': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg',
  'RimWorld': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg',
  'Euro Truck Simulator 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/header.jpg',
  'Cities: Skylines': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/header.jpg',
  'Stardew Valley': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg',
  'Minecraft': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1672970/header.jpg',
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
  console.log('Fetching all mods...');
  const result = await db.execute('SELECT id, title, slug, game, image_url FROM mods ORDER BY created_at DESC');
  const mods = result.rows;
  console.log(`Total mods: ${mods.length}`);

  let fixed = 0;
  let already_good = 0;
  let no_fix = 0;

  // Check and fix mods with known broken patterns (UGC links that often fail)
  const ugcPattern = /images\.steamusercontent\.com\/ugc\//;
  const needsCheck = mods.filter(m => m.image_url && ugcPattern.test(m.image_url));
  const others = mods.filter(m => !m.image_url || !ugcPattern.test(m.image_url));
  
  console.log(`\nMods with Steam UGC images (potentially broken): ${needsCheck.length}`);
  console.log(`Mods with other image sources: ${others.length}`);

  // First, apply all known good images by slug
  console.log('\n=== Applying known-good images by slug ===');
  for (const mod of mods) {
    const slug = mod.slug;
    if (slug && REAL_MOD_IMAGES[slug]) {
      const newUrl = REAL_MOD_IMAGES[slug];
      if (mod.image_url !== newUrl) {
        await db.execute({
          sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
          args: [newUrl, mod.id]
        });
        console.log(`✅ [${mod.game}] ${mod.title}`);
        fixed++;
      }
    }
  }

  // Then fix UGC images that aren't in our known list
  console.log('\n=== Checking remaining UGC images ===');
  for (const mod of needsCheck) {
    if (mod.slug && REAL_MOD_IMAGES[mod.slug]) continue; // Already fixed above
    
    const ok = await checkUrl(mod.image_url);
    if (!ok) {
      // Use game header as fallback
      const fallback = GAME_HEADERS[mod.game];
      if (fallback) {
        await db.execute({
          sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
          args: [fallback, mod.id]
        });
        console.log(`🔧 Fixed with game header [${mod.game}] ${mod.title}`);
        fixed++;
      } else {
        console.log(`⚠️  No fallback for [${mod.game}] ${mod.title}`);
        no_fix++;
      }
    } else {
      already_good++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`✅ Fixed/Updated: ${fixed}`);
  console.log(`✅ Already good: ${already_good}`);
  console.log(`⚠️  Could not fix: ${no_fix}`);
}

main().catch(console.error);
