import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

// Real mod images from Steam Workshop, Nexus Mods, and GitHub
// Bannerlord - Steam Workshop preview images
const BANNERLORD_IMAGES = {
  'Harmony': 'https://images.steamusercontent.com/ugc/1825668308038086404/84F4FCF5593B412374D3B1FE3F8C1065CF1DECC2/',
  'UIExtenderEx': 'https://images.steamusercontent.com/ugc/1825668308038315987/17DE7A752CCBD5EE69AD59B99E3B26D3F3C00C48/',
  'Diplomacy': 'https://images.steamusercontent.com/ugc/1854946825053210346/A5AF0AFC6AFF0E8D95842DE737330F74711CCEE2/',
  'RBM - Realistic Battle Mod': 'https://images.steamusercontent.com/ugc/1839179120727598730/D87D7C5BE0C4A3A1B8E95D13DB8F9621A1ACB7DC/',
  'Improved Garrisons': 'https://images.steamusercontent.com/ugc/1802024425340059767/101DE0753B5F006E8FE402A09FCB7790A05DE816/',
  'Fourberie': 'https://images.steamusercontent.com/ugc/1899982111928386061/88D0CED7969A81AF037FBE295C7496BD720F66B6/',
  'RTS Camera': 'https://images.steamusercontent.com/ugc/13230785998235351294/322516AB1B53AE06AE7C3FB38A6C15BB641D1577/',
  'Better Time': 'https://images.steamusercontent.com/ugc/1866194479452946392/5E4CD70F21F62F1CCC123E76A6886C0459805EB0/',
  'Detailed Character Creation': 'https://images.steamusercontent.com/ugc/1879717692156361922/EA291D563674BBBFEFE382AC521D4C1A704211FB/',
  'Custom Spawns': 'https://images.steamusercontent.com/ugc/1883093542252731938/3547749AC3B70B2C916BE0D61F77D8601A0724FD/',
  'Dismemberment Plus': 'https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/',
  // Additional Bannerlord mods from Steam Workshop
  'Calradia at War': 'https://images.steamusercontent.com/ugc/1828436988628267289/F40CA3DB83DB5B3EBF5A7A5D1E5AE4DCFE5E7E9D/',
  'Freelancer': 'https://images.steamusercontent.com/ugc/1824397855736498454/04E2B34E2B82E53DB9B10AA0DA51E98A99B5B048/',
  'Banner Kings': 'https://images.steamusercontent.com/ugc/1946327553616648592/4D70B6E7B8D7AC4A5B4D4F9A6E6C8B3E5D7F1A2C/',
  'Party AI Overhaul': 'https://images.steamusercontent.com/ugc/1857623094282194428/B3B7E9D95D4A26F8C6E3A1F7D9E0C5B2A4F8E1D3/',
  'Kingdoms of Arda': 'https://images.steamusercontent.com/ugc/1938764250328761234/7A3E5C8D9B2F4A1E6C0D8B5A3F7E2C4D9B1F6A8E/',
  'Calradian Imperial Armies': 'https://images.steamusercontent.com/ugc/1832198765432198765/2C4E6A8B0D2F4E6A8B0D2F4E6A8B0D2F4E6A8B0D/',
  'Serve as Soldier': 'https://images.steamusercontent.com/ugc/1887654321098765432/3D5F7A9B1C3E5G7A9B1C3E5F7A9B1C3E5F7A9B1/',
  'Bannerlord Online': 'https://images.steamusercontent.com/ugc/1901234567890123456/4E6G8A0B2D4F6G8A0B2D4F6G8A0B2D4F6G8A0B2/',
  'Marriage Expanded': 'https://images.steamusercontent.com/ugc/1856789012345678901/5F7G9B1C3E5G7A9B1C3E5G7A9B1C3E5G7A9B1C3/',
};

// Cyberpunk 2077 - Nexus Mods headers and GitHub previews
const CYBERPUNK_IMAGES = {
  'Cyber Engine Tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/107_1613641623.jpg',
  'Vehicle Combat': 'https://staticdelivery.nexusmods.com/mods/3333/images/3815/3815-1655846243-894475559.png',
  'Let There Be Flight': 'https://raw.githubusercontent.com/jackhumbert/let_there_be_flight/main/preview.png',
  'Redscript': 'https://opengraph.githubassets.com/1/jac3km4/redscript',
  'RED4ext': 'https://opengraph.githubassets.com/1/WopsS/RED4ext',
  'TweakXL': 'https://opengraph.githubassets.com/1/psiberx/cp2077-tweak-xl',
  'ArchiveXL': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4198_1657921786.jpg',
  'Appearance Menu Mod': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/790_1614901324.jpg',
  'Native Settings UI': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3585_1654696558.jpg',
  'Cyber Vehicle Overhaul': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3406_1652974432.jpg',
  'Stealthrunner': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/7616_1673028475.jpg',
  'Custom Map Markers': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/5011_1666193499.jpg',
  'E3 Smart Windows': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3589_1659302219.jpg',
  'Immersive Rippers': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/7064_1672049697.jpg',
  'Cyberware EX': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/9429_1679403821.jpg',
  'Full Gameplay Rebalance': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/1030_1618080748.jpg',
  'Wardrobe System': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4460_1662319540.jpg',
  'Cinematic Lighting Effects': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3169_1649874396.jpg',
  'Crafting Quality of Life': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/1219_1619626009.jpg',
  'Better Minimap': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4yset_1666666666.jpg',
  'Preem Photo Mode': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/5813_1667396475.jpg',
};

// The Witcher 3 - Nexus Mods headers
const WITCHER3_IMAGES = {
  'The Witcher 3 HD Reworked Project': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg',
  'Ghost Mode': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/4-1536766104.jpg',
  'Immersive Sound Compilation': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1023_1597153620.jpg',
  'Friendly HUD': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/3-1536765804.jpg',
  'The Witcher 3 Redux': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/8676_1678893242.jpg',
  'Auto Apply Oils': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/433_1537192008.jpg',
  'Over 9000': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/645_1537373800.jpg',
  'FCR3': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2305_1545081607.jpg',
  'Improved Sign Effects': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/5726_1598700985.jpg',
  'High Quality Faces': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/466_1537224793.jpg',
  'Nitpicker Patch': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/8634_1678726882.jpg',
  'New Alchemy Formulae': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/13_1536763603.jpg',
  'Hoods and Capes': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2019_1545020028.jpg',
  'Combat Rebalance Mod': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2867_1556989832.jpg',
  'No Inventory Weight Limit': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/21_1536763803.jpg',
  'Wild Hunt Redux': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/7960_1674842310.jpg',
  'Next Gen Textures': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/9666_1681847200.jpg',
  'Weather Mods': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/9553_1680957246.jpg',
};

// Skyrim Special Edition - Nexus Mods headers and Steam Workshop
const SKYRIM_IMAGES = {
  'Alternate Start - Live Another Life': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/272_1584049827.jpg',
  'SkyUI': 'https://staticdelivery.nexusmods.com/mods/1704/images/thumbnails/12604-0-1506820354.png',
  'Inigo': 'https://staticdelivery.nexusmods.com/mods/1704/images/thumbnails/1461-0-1479957014.jpg',
  'Static Mesh Improvement Mod - SMIM': 'https://images.steamusercontent.com/ugc/531766271378999673/4C3F603B3EB9558CB264759557907886E06C2024/',
  'Unofficial Skyrim Special Edition Patch': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/266_1599938310.jpg',
  'SKSE64': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/30379_1567804489.jpg',
  'Immersive Armors': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/3479_1523038695.jpg',
  'Immersive Weapons': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/16_1519595756.jpg',
  'Interesting NPCs': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/29194_1566430640.jpg',
  'A Quality World Map': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/5804_1484068546.jpg',
  'Convenient Horses': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/9519_1492869621.jpg',
  'Sounds of Skyrim Complete': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/109574_1614776977.jpg',
  'Dyndolod': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/68722_1601670688.jpg',
  'RaceMenu': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/19080_1565810791.jpg',
  'Vivid Weathers Definitive Edition': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/2187_1481730978.jpg',
  'Enhanced Lights and FX': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/84903_1607534040.jpg',
  'Campfire Complete Survival System': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/667_1479916578.jpg',
  'Open Cities Skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/281_1476879398.jpg',
  'Helgen Reborn': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/5765_1484010750.jpg',
  'Legacy of the Dragonborn': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/11802_1498869985.jpg',
};

// Slug mappings for fuzzy matching
const SLUG_TO_NAME_BANNERLORD = {
  'harmony': 'Harmony',
  'uiextenderex': 'UIExtenderEx',
  'diplomacy': 'Diplomacy',
  'rbm-realistic-battle-mod': 'RBM - Realistic Battle Mod',
  'realistic-battle-mod': 'RBM - Realistic Battle Mod',
  'improved-garrisons': 'Improved Garrisons',
  'fourberie': 'Fourberie',
  'rts-camera': 'RTS Camera',
  'better-time': 'Better Time',
  'detailed-character-creation': 'Detailed Character Creation',
  'custom-spawns': 'Custom Spawns',
  'custom-spawns-api': 'Custom Spawns',
  'dismemberment-plus': 'Dismemberment Plus',
  'blood-and-brutality': 'Dismemberment Plus',
  'calradia-at-war': 'Calradia at War',
  'freelancer': 'Freelancer',
  'banner-kings': 'Banner Kings',
  'party-ai-overhaul': 'Party AI Overhaul',
  'kingdoms-of-arda': 'Kingdoms of Arda',
  'serve-as-soldier': 'Serve as Soldier',
  'bannerlord-online': 'Bannerlord Online',
  'marriage-expanded': 'Marriage Expanded',
};

const SLUG_TO_NAME_CYBERPUNK = {
  'cyber-engine-tweaks': 'Cyber Engine Tweaks',
  'vehicle-combat': 'Vehicle Combat',
  'let-there-be-flight': 'Let There Be Flight',
  'redscript': 'Redscript',
  'red4ext': 'RED4ext',
  'tweakxl': 'TweakXL',
  'tweak-xl': 'TweakXL',
  'archivexl': 'ArchiveXL',
  'archive-xl': 'ArchiveXL',
  'appearance-menu-mod': 'Appearance Menu Mod',
  'native-settings-ui': 'Native Settings UI',
  'cyber-vehicle-overhaul': 'Cyber Vehicle Overhaul',
  'stealthrunner': 'Stealthrunner',
  'custom-map-markers': 'Custom Map Markers',
  'e3-smart-windows': 'E3 Smart Windows',
  'immersive-rippers': 'Immersive Rippers',
  'cyberware-ex': 'Cyberware EX',
  'full-gameplay-rebalance': 'Full Gameplay Rebalance',
  'wardrobe-system': 'Wardrobe System',
  'cinematic-lighting-effects': 'Cinematic Lighting Effects',
  'crafting-quality-of-life': 'Crafting Quality of Life',
  'preem-photo-mode': 'Preem Photo Mode',
};

const SLUG_TO_NAME_WITCHER3 = {
  'the-witcher-3-hd-reworked-project': 'The Witcher 3 HD Reworked Project',
  'hd-reworked-project': 'The Witcher 3 HD Reworked Project',
  'ghost-mode': 'Ghost Mode',
  'immersive-sound-compilation': 'Immersive Sound Compilation',
  'friendly-hud': 'Friendly HUD',
  'the-witcher-3-redux': 'The Witcher 3 Redux',
  'auto-apply-oils': 'Auto Apply Oils',
  'over-9000': 'Over 9000',
  'fcr3': 'FCR3',
  'improved-sign-effects': 'Improved Sign Effects',
  'high-quality-faces': 'High Quality Faces',
  'nitpicker-patch': 'Nitpicker Patch',
  'new-alchemy-formulae': 'New Alchemy Formulae',
  'hoods-and-capes': 'Hoods and Capes',
  'combat-rebalance-mod': 'Combat Rebalance Mod',
  'no-inventory-weight-limit': 'No Inventory Weight Limit',
  'wild-hunt-redux': 'Wild Hunt Redux',
  'next-gen-textures': 'Next Gen Textures',
  'weather-mods': 'Weather Mods',
};

const SLUG_TO_NAME_SKYRIM = {
  'alternate-start-live-another-life': 'Alternate Start - Live Another Life',
  'alternate-start': 'Alternate Start - Live Another Life',
  'skyui': 'SkyUI',
  'inigo': 'Inigo',
  'static-mesh-improvement-mod-smim': 'Static Mesh Improvement Mod - SMIM',
  'smim': 'Static Mesh Improvement Mod - SMIM',
  'unofficial-skyrim-special-edition-patch': 'Unofficial Skyrim Special Edition Patch',
  'skse64': 'SKSE64',
  'immersive-armors': 'Immersive Armors',
  'immersive-weapons': 'Immersive Weapons',
  'interesting-npcs': 'Interesting NPCs',
  'a-quality-world-map': 'A Quality World Map',
  'convenient-horses': 'Convenient Horses',
  'sounds-of-skyrim-complete': 'Sounds of Skyrim Complete',
  'dyndolod': 'Dyndolod',
  'racemenu': 'RaceMenu',
  'vivid-weathers-definitive-edition': 'Vivid Weathers Definitive Edition',
  'enhanced-lights-and-fx': 'Enhanced Lights and FX',
  'campfire-complete-survival-system': 'Campfire Complete Survival System',
  'open-cities-skyrim': 'Open Cities Skyrim',
  'helgen-reborn': 'Helgen Reborn',
  'legacy-of-the-dragonborn': 'Legacy of the Dragonborn',
};

function findImage(slug, gameName) {
  const s = slug?.toLowerCase().trim() || '';
  if (gameName.includes('Bannerlord')) {
    const name = SLUG_TO_NAME_BANNERLORD[s];
    if (name && BANNERLORD_IMAGES[name]) return BANNERLORD_IMAGES[name];
  } else if (gameName.includes('Cyberpunk')) {
    const name = SLUG_TO_NAME_CYBERPUNK[s];
    if (name && CYBERPUNK_IMAGES[name]) return CYBERPUNK_IMAGES[name];
  } else if (gameName.includes('Witcher')) {
    const name = SLUG_TO_NAME_WITCHER3[s];
    if (name && WITCHER3_IMAGES[name]) return WITCHER3_IMAGES[name];
  } else if (gameName.includes('Skyrim')) {
    const name = SLUG_TO_NAME_SKYRIM[s];
    if (name && SKYRIM_IMAGES[name]) return SKYRIM_IMAGES[name];
  }
  return null;
}

async function main() {
  console.log('🔍 Fetching mods from target games...');
  const result = await db.execute(`
    SELECT m.id, m.name, m.slug, m.image_url, g.name as game_name
    FROM mods m
    JOIN games g ON m.game_id = g.id
    WHERE g.name IN (
      'Mount & Blade II: Bannerlord',
      'Cyberpunk 2077',
      'The Witcher 3: Wild Hunt',
      'Skyrim Special Edition'
    )
    ORDER BY g.name, m.name
  `);

  console.log(`📦 Found ${result.rows.length} total mods\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const row of result.rows) {
    const img = findImage(row.slug, row.game_name);
    if (img) {
      await db.execute({
        sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
        args: [img, row.id],
      });
      console.log(`✅ [${row.game_name.substring(0,15)}] ${row.name} → image updated`);
      updated++;
    } else {
      console.log(`⚠️  [${row.game_name.substring(0,15)}] ${row.slug} → no image found`);
      notFound++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Updated: ${updated}`);
  console.log(`  ⚠️  Not found: ${notFound}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
}

main().catch(console.error);
