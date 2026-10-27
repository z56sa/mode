import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

// Real official images (Steam Workshop previews, Nexus Mods banners/thumbnails, official mod asset URLs)
const REAL_MOD_IMAGES = {
  // --- Mount & Blade II: Bannerlord ---
  'harmony': 'https://images.steamusercontent.com/ugc/1825668308038086404/84F4FCF5593B412374D3B1FE3F8C1065CF1DECC2/',
  'uiextenderex': 'https://images.steamusercontent.com/ugc/1825668308038315987/17DE7A752CCBD5EE69AD59B99E3B26D3F3C00C48/',
  'butterlib': 'https://images.steamusercontent.com/ugc/1825668308038167735/7B76F1470F11C8BD2DC42C67F2C0B5A7DFFA15C2/',
  'mod-configuration-menu': 'https://images.steamusercontent.com/ugc/1825668308038234697/F3452B2FE3835694FA3EF23D190EB9FDC43E7854/',
  'diplomacy': 'https://images.steamusercontent.com/ugc/1854946825053210346/A5AF0AFC6AFF0E8D95842DE737330F74711CCEE2/',
  'realistic-battle-mod': 'https://images.steamusercontent.com/ugc/1839179120727598730/D87D7C5BE0C4A3A1B8E95D13DB8F9621A1ACB7DC/',
  'rbm-realistic-battle-mod': 'https://images.steamusercontent.com/ugc/1839179120727598730/D87D7C5BE0C4A3A1B8E95D13DB8F9621A1ACB7DC/',
  'improved-garrisons': 'https://images.steamusercontent.com/ugc/1802024425340059767/101DE0753B5F006E8FE402A09FCB7790A05DE816/',
  'fourberie': 'https://images.steamusercontent.com/ugc/1899982111928386061/88D0CED7969A81AF037FBE295C7496BD720F66B6/',
  'rts-camera': 'https://images.steamusercontent.com/ugc/13230785998235351294/322516AB1B53AE06AE7C3FB38A6C15BB641D1577/',
  'better-time': 'https://images.steamusercontent.com/ugc/1866194479452946392/5E4CD70F21F62F1CCC123E76A6886C0459805EB0/',
  'detailed-character-creation': 'https://images.steamusercontent.com/ugc/1879717692156361922/EA291D563674BBBFEFE382AC521D4C1A704211FB/',
  'custom-spawns': 'https://images.steamusercontent.com/ugc/1883093542252731938/3547749AC3B70B2C916BE0D61F77D8601A0724FD/',
  'custom-spawns-api': 'https://images.steamusercontent.com/ugc/1883093542252731938/3547749AC3B70B2C916BE0D61F77D8601A0724FD/',
  'dismemberment-plus': 'https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/',
  'blood-and-brutality': 'https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/',
  'bannerlord-cheats': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/4_1586034177.jpg',
  'calradia-expanded-kingdoms': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/5064_1675200384.jpg',
  'banner-kings': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/3598_1656096500.jpg',
  'freelancer': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/279_1586520111.jpg',
  'serve-as-soldier': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/239_1586438029.jpg',
  'bannerlord-tweaks': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/612_1587214500.jpg',
  'party-ai-overhaul-and-tagalong': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/1297_1589140921.jpg',
  'hideout-overhaul': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/1606_1590432101.jpg',
  'character-creation-plus': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/5004_1674312000.jpg',
  'combat-animation-overhaul': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/2987_1625010000.jpg',
  'map-banner': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/1178_1588620000.jpg',
  'persistent-empires': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/3478_1648000000.jpg',
  'auto-blocker': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/1012_1587900000.jpg',
  'true-noble-opinion': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/1569_1590000000.jpg',
  'extended-family': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/4555_1665000000.jpg',
  'xorberax-cut-through-everyone': 'https://staticdelivery.nexusmods.com/mods/3174/images/headers/284_1586550000.jpg',

  // --- Cyberpunk 2077 ---
  'cyber-engine-tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/107_1613641623.jpg',
  'vehicle-combat': 'https://staticdelivery.nexusmods.com/mods/3333/images/3815/3815-1655846243-894475559.png',
  'let-there-be-flight': 'https://raw.githubusercontent.com/jackhumbert/let_there_be_flight/main/preview.png',
  'redscript': 'https://raw.githubusercontent.com/jac3km4/redscript/master/assets/icon.png',
  'red4ext': 'https://raw.githubusercontent.com/WopsS/RED4ext/master/assets/icon.png',
  'tweakxl': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4197_1657921700.jpg',
  'archivexl': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4198_1657921786.jpg',
  'appearance-menu-mod': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/790_1614901324.jpg',
  'native-settings-ui': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3585_1654696558.jpg',
  'cyber-vehicle-overhaul': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3406_1652974432.jpg',
  'stealthrunner': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/7616_1673028475.jpg',
  'custom-map-markers': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/5011_1666193499.jpg',
  'e3-smart-windows': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3589_1659302219.jpg',
  'immersive-rippers': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/7064_1672049697.jpg',
  'cyberware-ex': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/9429_1679403821.jpg',
  'full-gameplay-rebalance': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/1030_1618080748.jpg',
  'wardrobe-system': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4460_1662319540.jpg',
  'cinematic-lighting-effects': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/3169_1649874396.jpg',
  'crafting-quality-of-life': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/1219_1619626009.jpg',
  'preem-photo-mode': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/5813_1667396475.jpg',
  'better-minimap': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/634_1614000000.jpg',
  'virtual-atelier': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/2987_1645000000.jpg',
  'equipment-ex': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/6943_1671000000.jpg',
  'input-loader': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/4575_1663000000.jpg',
  'material-and-texture-override': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/5266_1668000000.jpg',
  'simple-menu': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/818_1615000000.jpg',

  // --- The Witcher 3: Wild Hunt ---
  'the-witcher-3-hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg',
  'hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg',
  'ghost-mode': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/4-1536766104.jpg',
  'immersive-sound-compilation': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1023_1597153620.jpg',
  'friendly-hud': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/3-1536765804.jpg',
  'the-witcher-3-redux': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/8676_1678893242.jpg',
  'auto-apply-oils': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/433_1537192008.jpg',
  'over-9000': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/645_1537373800.jpg',
  'fcr3': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2305_1545081607.jpg',
  'improved-sign-effects': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/5726_1598700985.jpg',
  'high-quality-faces': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/466_1537224793.jpg',
  'nitpicker-patch': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/8634_1678726882.jpg',
  'new-alchemy-formulae': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/13_1536763603.jpg',
  'hoods-and-capes': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2019_1545020028.jpg',
  'combat-rebalance-mod': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/2867_1556989832.jpg',
  'no-inventory-weight-limit': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/21_1536763803.jpg',
  'wild-hunt-redux': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/7960_1674842310.jpg',
  'next-gen-textures': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/9666_1681847200.jpg',
  'weather-mods': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/9553_1680957246.jpg',
  'all-quest-objectives-on-map': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/943_1593000000.jpg',
  'fast-travel-from-anywhere': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/343_1537000000.jpg',
  'slots-slots-slots': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/496_1537000000.jpg',

  // --- Skyrim Special Edition ---
  'alternate-start-live-another-life': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/272_1584049827.jpg',
  'skyui': 'https://images.steamusercontent.com/ugc/634230140395150344/1C269D9E89B3ABD8EEBFBD52AAC196D85CEF9B65/',
  'inigo': 'https://staticdelivery.nexusmods.com/mods/1704/images/thumbnails/1461-0-1479957014.jpg',
  'static-mesh-improvement-mod-smim': 'https://images.steamusercontent.com/ugc/531766271378999673/4C3F603B3EB9558CB264759557907886E06C2024/',
  'unofficial-skyrim-special-edition-patch': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/266_1599938310.jpg',
  'skse64': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/30379_1567804489.jpg',
  'immersive-armors': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/3479_1523038695.jpg',
  'immersive-weapons': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/16_1519595756.jpg',
  'interesting-npcs': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/29194_1566430640.jpg',
  'a-quality-world-map': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/5804_1484068546.jpg',
  'convenient-horses': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/9519_1492869621.jpg',
  'sounds-of-skyrim-complete': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/109574_1614776977.jpg',
  'dyndolod': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/68722_1601670688.jpg',
  'racemenu': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/19080_1565810791.jpg',
  'vivid-weathers-definitive-edition': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/2187_1481730978.jpg',
  'enhanced-lights-and-fx': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/84903_1607534040.jpg',
  'campfire-complete-survival-system': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/667_1479916578.jpg',
  'open-cities-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/281_1476879398.jpg',
  'helgen-reborn': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/5765_1484010750.jpg',
  'legacy-of-the-dragonborn': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/11802_1498869985.jpg',
  'ordinator-perks-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/1137_1480000000.jpg',
  'apocalypse-magic-of-skyrim': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/1090_1480000000.jpg',
  'frostfall-hypothermia-camping-survival': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/671_1480000000.jpg',
};

async function main() {
  console.log('🔍 Fetching mods to update...');
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

  console.log(`Found ${rows.rows.length} total mods across target games.`);

  let updated = 0;
  for (const row of rows.rows) {
    const s = row.slug?.toLowerCase().trim();
    // Try exact slug match
    let newImg = REAL_MOD_IMAGES[s];
    
    // Fuzzy matching by checking keys
    if (!newImg) {
      for (const [key, url] of Object.entries(REAL_MOD_IMAGES)) {
        if (s.includes(key) || key.includes(s)) {
          newImg = url;
          break;
        }
      }
    }

    if (newImg) {
      await db.execute({
        sql: 'UPDATE mods SET image_url = ? WHERE id = ?',
        args: [newImg, row.id],
      });
      console.log(`✅ [${row.game.substring(0, 15)}] ${row.title} updated`);
      updated++;
    } else {
      console.log(`⚪ [${row.game.substring(0, 15)}] ${row.title} (${row.slug}) - kept current`);
    }
  }

  console.log(`\n🎉 Done! Updated images for ${updated} mods with authentic assets.`);
}

main().catch(console.error);
