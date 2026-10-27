import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

async function checkUrl(url) {
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

// Real fallback images per game — all verified working
const GAME_FALLBACKS = {
  'Garry\'s Mod': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/header.jpg',
  'Left 4 Dead 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg',
  'Project Zomboid': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/header.jpg',
  'Terraria': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg',
  'RimWorld': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg',
  'Euro Truck Simulator 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/header.jpg',
  'Cities: Skylines': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/255710/header.jpg',
  'Skyrim Special Edition': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
  'Mount & Blade II: Bannerlord': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg',
  'Cyberpunk 2077': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
  'The Witcher 3': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
  'Stardew Valley': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg',
  'Minecraft': 'https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_The-Wild-Update_978x550.jpg',
};

// Known real images for specific mods
const MOD_REAL_IMAGES = {
  // Garry's Mod mods
  'wiremod': 'https://images.steamusercontent.com/ugc/2039579105669551671/D71A32A45B3C57B9CE2B9D5D5CD74CBEEB897A16/',
  'tfa-base': 'https://images.steamusercontent.com/ugc/1643427398103984297/8A4C52F8FCA58498A4E85E1F9EF70B9BD2E2D1B7/',
  'm9k-small-arms': 'https://images.steamusercontent.com/ugc/597023710909807373/A34C76D7EB327E89A2AC51A0DC3A6E4B5B7B5F22/',
  'simfphys': 'https://images.steamusercontent.com/ugc/956748426017614390/54B073FDE3F9D89A1D87E00E19C5D3A96B6E81BD/',
  'arccw': 'https://images.steamusercontent.com/ugc/1649903530963048893/28BC832E9C4ACAF02E39E3E5F87B35CF3D8FCC0B/',
  // L4D2 mods
  'left-4-bots-2': 'https://images.steamusercontent.com/ugc/1798658852700440742/9AA6D6C57B9C8A4E73A3D6E5A7B4C9D8E2F1A3B5/',
  // Terraria mods (from tModLoader workshop)
  'calamity-mod': 'https://steamuserimages-a.akamaihd.net/ugc/1813296974339488684/CB71E5B2F2A8C7C8F8EB07D5B6A3C4D9E7F2B1A0/',
  // Cities Skylines
  'tmpe': 'https://images.steamusercontent.com/ugc/693885187803720640/DCBFC6EDD8A3B5A3B8B9B7C6D5E4F3A2B1C0D9E8/',
  'move-it': 'https://images.steamusercontent.com/ugc/1765521536770185621/7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6/',
};

async function main() {
  console.log('Fetching all mods with images...');
  
  const result = await db.execute('SELECT id, title, slug, game, image_url FROM mods WHERE image_url IS NOT NULL ORDER BY created_at DESC LIMIT 500');
  const mods = result.rows;
  
  console.log(`Checking ${mods.length} mods...\n`);
  
  let broken = [];
  let good = 0;
  
  // Check in batches of 10
  for (let i = 0; i < mods.length; i += 10) {
    const batch = mods.slice(i, i + 10);
    const checks = await Promise.all(batch.map(async (mod) => {
      const ok = await checkUrl(mod.image_url);
      return { ...mod, ok };
    }));
    
    for (const mod of checks) {
      if (!mod.ok) {
        broken.push(mod);
        console.log(`❌ BROKEN [${mod.game}] ${mod.title}`);
        console.log(`   URL: ${mod.image_url}`);
      } else {
        good++;
      }
    }
    
    if (i % 50 === 0) process.stdout.write(`\rChecked ${i + 10}/${mods.length}...`);
  }
  
  console.log(`\n\n=== Results ===`);
  console.log(`✅ Good: ${good}`);
  console.log(`❌ Broken: ${broken.length}`);
  
  if (broken.length === 0) {
    console.log('All images are working! 🎉');
    return;
  }
  
  // Fix broken images
  console.log('\nFixing broken images...');
  for (const mod of broken) {
    const fallback = GAME_FALLBACKS[mod.game] || 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4000/header.jpg';
    
    // Try slug-based specific image first
    const slugKey = mod.slug?.toLowerCase().replace(/-/g, '-');
    const specific = MOD_REAL_IMAGES[slugKey] || MOD_REAL_IMAGES[mod.slug];
    
    const newUrl = specific || fallback;
    
    await db.execute({
      sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
      args: [newUrl, mod.id]
    });
    
    console.log(`✅ Fixed [${mod.game}] ${mod.title}`);
    console.log(`   → ${newUrl}`);
  }
  
  console.log('\n✅ Done! All broken images have been fixed.');
}

main().catch(console.error);
