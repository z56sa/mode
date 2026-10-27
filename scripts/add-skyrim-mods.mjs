/**
 * Add The Elder Scrolls V: Skyrim Special Edition mods (real popular Nexus mods)
 */
import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

// Official Steam screenshots for Skyrim SE (Steam App ID: 489830)
const SKYRIM_IMAGES = [
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_6f0b67c3a45fc59a7d077f2ca7d9c82e4e028b9b.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_b0c0b3a1748ee65e3b8d5a63da4c0b5c8a3e7c9d.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_c6e0b9cba18e62ca6a3f9ec67c1e98fbd35e21a9.jpg',
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
];
function pickImage(i) { return SKYRIM_IMAGES[i % SKYRIM_IMAGES.length]; }

const SKYRIM_MODS = [
  { title: 'SKSE64', author: 'Ian Patterson & Stephen Abel', version: '2.2.6', description: 'Skyrim Script Extender - essential framework for most mods. Extends the scripting capabilities of the game engine.', downloadUrl: 'https://skse.silverlock.org/', category: 'Libraries & Utilities', sourceUrl: 'https://skse.silverlock.org/' },
  { title: 'SkyUI', author: 'SkyUI Team', version: '5.2.2', description: 'Overhauls the inventory and menu system with a much better PC-friendly UI design with sorting and filtering.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/12604', category: 'UI', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/12604' },
  { title: 'Unofficial Skyrim Special Edition Patch', author: 'Arthmoor', version: '4.3.7', description: 'Fixes thousands of bugs left in the game by the developers. Essential for every Skyrim installation.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/266', category: 'Bugfix', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/266' },
  { title: 'Alternate Start - Live Another Life', author: 'Arthmoor', version: '4.1.7', description: 'Provides alternative starts to the game, letting you skip the intro and begin as a different character with a unique backstory.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/272', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/272' },
  { title: 'Realistic Water Two', author: 'isoku', version: '5.6.0', description: 'A complete overhaul of all water in Skyrim including rivers, lakes, and the ocean with realistic waves and reflections.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2182', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2182' },
  { title: 'Enhanced Lights and FX', author: 'anamorfus', version: '3.0', description: 'Enhances all lighting effects in Skyrim, adding shadows, improving interior lighting, and making torches and fires look real.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2424', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2424' },
  { title: 'Static Mesh Improvement Mod (SMIM)', author: 'Brumbek', version: '2.08', description: 'Dramatically improves hundreds of 3D models for items, architecture, and world objects throughout Skyrim.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/659', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/659' },
  { title: 'Immersive Armors', author: 'hothtrooper44', version: '8.1', description: 'Adds 55 new sets of armor to the game, lore-friendly and integrated into the leveled lists naturally.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/3479', category: 'New Content', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/3479' },
  { title: 'Immersive Weapons', author: 'hothtrooper44', version: '1.6.2', description: 'Adds 230 new weapons to Skyrim fully integrated into the leveled lists with lore-friendly designs.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/16788', category: 'New Content', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/16788' },
  { title: 'A Quality World Map', author: 'IcePenguin', version: '9.0.1', description: 'Replaces the default world map with a high resolution version showing roads, mountains, and details clearly.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/5804', category: 'UI', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/5804' },
  { title: 'Convenient Horses', author: 'Alek', version: '5.0', description: 'Dramatically improves horse riding in Skyrim with better AI, inventory access, and immersive horse management.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/9519', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/9519' },
  { title: 'iNeed - Food Water and Sleep', author: 'isoku', version: '1.9.5', description: 'Adds realistic survival needs - hunger, thirst, and fatigue - that affect your character\'s stats and abilities.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/645', category: 'Survival', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/645' },
  { title: 'Campfire - Complete Camping System', author: 'Chesko', version: '1.12.1', description: 'A comprehensive camping system with fire building, skill progression, gear crafting, and cold weather survival mechanics.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/667', category: 'Survival', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/667' },
  { title: 'Frostfall - Hypothermia Camping Survival', author: 'Chesko', version: '3.4.1', description: 'Adds a temperature and exposure survival system where you must manage cold weather with gear and shelter.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/671', category: 'Survival', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/671' },
  { title: 'Ordinator - Perks of Skyrim', author: 'EnaiSiaion', version: '9.31.0', description: 'Completely overhauls the perk system with 400+ new perks that create unique and interesting character builds.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1137', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1137' },
  { title: 'Apocalypse - Magic of Skyrim', author: 'EnaiSiaion', version: '9.45.0', description: 'Adds 155 new spells that are fun, balanced, and fully voiced to Skyrim.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1090', category: 'Magic', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1090' },
  { title: 'Imperious - Races of Skyrim', author: 'EnaiSiaion', version: '7.23.0', description: 'Overhauls racial abilities to make each race unique and interesting with new passive and active powers.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1315', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1315' },
  { title: 'Wildcat - Combat of Skyrim', author: 'EnaiSiaion', version: '7.0.3', description: 'Overhauls combat to be more dynamic, impactful, and challenging with stamina management and new attacks.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1368', category: 'Combat', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1368' },
  { title: 'Inigo', author: 'Smartbluecat', version: '2.4c', description: 'Adds Inigo, a fully voiced Khajiit follower companion with over 7000 lines of dialogue and a unique questline.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1461', category: 'Companions', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1461' },
  { title: 'Interesting NPCs', author: '3DNPC Project', version: '4.5.10', description: 'Adds over 250 fully voiced NPCs to Skyrim with complex backstories, unique dialogue, and some as companions.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/29194', category: 'NPCs', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/29194' },
  { title: 'Cutting Room Floor', author: 'Arthmoor', version: '3.1.13', description: 'Restores deleted and hidden content from Skyrim that was cut during development but still exists in the game data.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/276', category: 'Content Restoration', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/276' },
  { title: 'JK\'s Skyrim', author: 'jkrojmal', version: '1.6.0', description: 'Overhauls all the cities and towns of Skyrim with new buildings, decorations, and NPCs for a more lively world.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/6289', category: 'World', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/6289' },
  { title: 'Skyrim Flora Overhaul', author: 'vurt', version: '2.72b', description: 'Replaces all trees and plants in Skyrim with much more detailed and realistic 3D models.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2154', category: 'Graphics', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/2154' },
  { title: 'Dynamic Weather and Time Based Detection', author: 'powerofthree', version: '1.1.0', description: 'Makes NPC detection dependent on weather conditions, time of day, and light sources for more realistic stealth.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/62546', category: 'Gameplay', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/62546' },
  { title: 'The Forgotten City', author: 'Nick Pearce', version: '1.0.0', description: 'An award-winning DLC-sized quest mod with a unique murder mystery storyline set in an underground Dwemer city.', downloadUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1179', category: 'Quest', sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/1179' },
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
  const game = 'The Elder Scrolls V: Skyrim Special Edition';
  const existingRows = await db.execute(`SELECT slug, title FROM mods WHERE game = '${game}'`);
  const existingSlugs = new Set(existingRows.rows.map(r => r.slug));
  const existingTitles = new Set(existingRows.rows.map(r => r.title?.toLowerCase()));
  
  console.log(`Existing ${game} mods: ${existingRows.rows.length}`);
  
  let added = 0;
  for (let i = 0; i < SKYRIM_MODS.length; i++) {
    const mod = SKYRIM_MODS[i];
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
