/**
 * Add The Witcher 3: Wild Hunt mods (real popular mods from Nexus Mods)
 */
import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

// Official Steam screenshots for Witcher 3 (Steam App ID: 292030)
const W3_IMAGES = [
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/ss_107600c1337accc09104f7a8aa7f275f23cad096.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/ss_848b5d2dd63efaa9ba27cf91694fc2cfe1038f1a.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/ss_8b6e17f98b813cd98c1bfdb7f14e4c4b7a3d3c04.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
];
function pickImage(i) { return W3_IMAGES[i % W3_IMAGES.length]; }

const WITCHER3_MODS = [
  { title: 'The Witcher 3 HD Reworked Project', author: 'HalkHogan', version: '12.0', description: 'Completely reworks textures and meshes in The Witcher 3 to provide maximum graphical quality with minimal performance impact.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/1021', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/1021' },
  { title: 'Script Merger', author: 'Partoutatix', version: '0.6.5', description: 'Essential tool for merging mod scripts to avoid conflicts. Required when using multiple script-based mods.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/484', category: 'Tools', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/484' },
  { title: 'All Quest Objectives On Map', author: 'icyd3mon', version: '2.0', description: 'Shows all quest objectives on the minimap and world map simultaneously, making navigation much easier.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/943', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/943' },
  { title: 'The Witcher 3 Better Torches', author: 'Wolfmark', version: '1.5', description: 'Overhauls torch lighting to look more realistic with dynamic shadows and better illumination radius.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/397', category: 'Visual', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/397' },
  { title: 'Nitpicker\'s Patch', author: 'Ranfixe', version: '1.2.5', description: 'Fixes hundreds of small visual bugs including clipping, floating objects, and misaligned textures throughout the game.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3580', category: 'Bugfix', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3580' },
  { title: 'Slots Slots SLOTS', author: 'M4sterDis4ster', version: '8.0', description: 'Adds additional equipment slots for armor, weapons, and accessories to allow more gear combinations.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/1795', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/1795' },
  { title: 'Auto Apply Oils', author: 'Wolfmark', version: '1.0', description: 'Automatically applies the correct oil to Geralt\'s sword before combat based on the enemy type.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/433', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/433' },
  { title: 'Immersive Cam', author: 'Tomatio', version: '2.4', description: 'Overhauls camera behavior for more immersive exploration, combat, and cutscenes with dynamic FOV.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/1086', category: 'Visual', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/1086' },
  { title: 'Fast Travel From Anywhere', author: 'Eldimarix', version: '1.2', description: 'Allows fast travel from any location, not just signposts, for more convenient travel across the map.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/209', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/209' },
  { title: 'Preparations', author: 'Aeltoth', version: '1.7.4', description: 'Completely overhauls the alchemy and crafting systems, adding new recipes, ingredients, and a preparation phase before quests.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3448', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3448' },
  { title: 'Over 9000 - Weight limit mod', author: 'Kol0bo1', version: '1.0', description: 'Increases the carry weight limit significantly so you never have to worry about encumbrance again.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/2', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/2' },
  { title: 'Primal Needs', author: 'AnotherWhiteRabbit', version: '1.5', description: 'Adds hunger, thirst, and sleep mechanics to The Witcher 3 for a more survival-oriented experience.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3567', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3567' },
  { title: 'W3EE Redux', author: 'erxv1', version: '2.3', description: 'A comprehensive gameplay overhaul that reworks combat, progression, signs, and more for a challenging experience.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/5802', category: 'Overhaul', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/5802' },
  { title: 'Ghost Mode', author: 'Amadaun', version: '4.0.7', description: 'A massive balance overhaul that tweaks virtually every aspect of the game for a more polished experience.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3624', category: 'Overhaul', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3624' },
  { title: 'FCR3 - Friendly Config Randomizer', author: 'Kolaris', version: '1.8', description: 'A huge collection of gameplay tweaks that makes the game more challenging and rewarding.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/2889', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/2889' },
  { title: 'Better Combat Enhanced', author: 'Lazaros Melas', version: '1.0', description: 'Overhauls Geralt\'s combat with new moves, finishing animations, and more fluid swordsmanship.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3406', category: 'Combat', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3406' },
  { title: 'Gwent Redux', author: 'Wolfmark', version: '1.3', description: 'Completely overhauls the Gwent card game with rebalanced cards, new mechanics, and improved AI.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/5287', category: 'Gwent', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/5287' },
  { title: 'No Ugly Enemy Respawn', author: 'ElderScrollsOblivion', version: '1.0', description: 'Prevents enemies from respawning in areas you have already cleared for a more consistent world.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/1053', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/1053' },
  { title: 'Reasonable Stash', author: 'Grafter', version: '1.0', description: 'Adds a stash system that lets you access stored items from any inn or hideout without traveling to Novigrad.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/2659', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/2659' },
  { title: 'Indestructible Items', author: 'Wolfmark', version: '1.0', description: 'Prevents equipment from losing durability over time, removing the need to constantly repair items.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/140', category: 'QoL', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/140' },
  { title: 'Friendly HUD', author: 'Wolfmark', version: '9.4', description: 'A customizable HUD that allows you to show/hide UI elements individually and configure their appearance.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/91', category: 'UI', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/91' },
  { title: 'Topsy Turvy - World Map Revamp', author: 'RBIS7', version: '1.3', description: 'Completely redesigns the world map UI for The Witcher 3 with cleaner icons, better readability, and new features.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/6152', category: 'UI', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/6152' },
  { title: 'ReShade Ultra', author: 'SweetFX_Author', version: '4.0', description: 'A post-processing preset that enhances colors, adds realistic ambient occlusion, and sharpens textures.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/3724', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/3724' },
  { title: 'Volumes and Sounds', author: 'Wolfmark', version: '3.1', description: 'Fine-grained audio controls to balance music, ambient sounds, dialogue, and combat sounds independently.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/259', category: 'Audio', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/259' },
  { title: 'The Beast of Toussaint', author: 'Walrus', version: '1.1', description: 'Adds a new creature boss encounter inspired by Blood and Wine, with unique rewards and lore.', downloadUrl: 'https://www.nexusmods.com/witcher3/mods/5481', category: 'New Content', sourceUrl: 'https://www.nexusmods.com/witcher3/mods/5481' },
];

async function slugify(title, existing) {
  let base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  let slug = base;
  let i = 2;
  while (existing.has(slug)) { slug = `${base}-${i++}`; }
  existing.add(slug);
  return slug;
}

async function main() {
  const game = 'The Witcher 3: Wild Hunt';
  const existingRows = await db.execute(`SELECT slug, title FROM mods WHERE game = '${game}'`);
  const existingSlugs = new Set(existingRows.rows.map(r => r.slug));
  const existingTitles = new Set(existingRows.rows.map(r => r.title?.toLowerCase()));
  
  console.log(`Existing ${game} mods: ${existingRows.rows.length}`);
  
  let added = 0;
  for (let i = 0; i < WITCHER3_MODS.length; i++) {
    const mod = WITCHER3_MODS[i];
    if (existingTitles.has(mod.title.toLowerCase())) {
      console.log(`Skip (exists): ${mod.title}`);
      continue;
    }
    const slug = await slugify(mod.title, existingSlugs);
    const image = pickImage(i);
    try {
      await db.execute({
        sql: `INSERT INTO mods (title, slug, game, game_genre, category, description, image_url, download_url, source_url, author, version, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: [mod.title, slug, game, 'RPG', mod.category, mod.description, image, mod.downloadUrl, mod.sourceUrl, mod.author, mod.version]
      });
      console.log(`✅ Added: ${mod.title}`);
      added++;
    } catch (e) {
      console.log(`❌ Failed: ${mod.title} - ${e.message}`);
    }
  }
  console.log(`\nDone! Added ${added} ${game} mods.`);
}

main().catch(console.error);
