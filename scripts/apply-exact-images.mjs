import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

// Verified Real Mod Images directly from Steam Workshop CDN
const VERIFIED_REAL_MOD_IMAGES = {
  // --- Mount & Blade II: Bannerlord ---
  'better-time': 'https://images.steamusercontent.com/ugc/1904486276735516400/5840015E63E02BD0A258237D37EEC089D9C8B189/',
  'mb2-better-time': 'https://images.steamusercontent.com/ugc/1904486276735516400/5840015E63E02BD0A258237D37EEC089D9C8B189/',
  'harmony': 'https://images.steamusercontent.com/ugc/1825668308038086404/84F4FCF5593B412374D3B1FE3F8C1065CF1DECC2/',
  'gh-mount-blade-ii-bannerlord-bannerlord-harmony': 'https://images.steamusercontent.com/ugc/1825668308038086404/84F4FCF5593B412374D3B1FE3F8C1065CF1DECC2/',
  'uiextenderex': 'https://images.steamusercontent.com/ugc/17278947949401270265/17DE7A752CCBD5EE69AD59B99E3B26D3F3C00C48/',
  'gh-mount-blade-ii-bannerlord-bannerlord-uiextenderex': 'https://images.steamusercontent.com/ugc/17278947949401270265/17DE7A752CCBD5EE69AD59B99E3B26D3F3C00C48/',
  'diplomacy': 'https://images.steamusercontent.com/ugc/1854946825053210346/A5AF0AFC6AFF0E8D95842DE737330F74711CCEE2/',
  'gh-mount-blade-ii-bannerlord-bannerlord-diplomacy': 'https://images.steamusercontent.com/ugc/1854946825053210346/A5AF0AFC6AFF0E8D95842DE737330F74711CCEE2/',
  'realistic-battle-mod': 'https://images.steamusercontent.com/ugc/1839179120727598730/D87D7C5BE0C4A3A1B8E95D13DB8F9621A1ACB7DC/',
  'rbm-realistic-battle-mod': 'https://images.steamusercontent.com/ugc/1839179120727598730/D87D7C5BE0C4A3A1B8E95D13DB8F9621A1ACB7DC/',
  'improved-garrisons': 'https://images.steamusercontent.com/ugc/1802024425340059767/101DE0753B5F006E8FE402A09FCB7790A05DE816/',
  'fourberie': 'https://images.steamusercontent.com/ugc/1899982111928386061/88D0CED7969A81AF037FBE295C7496BD720F66B6/',
  'mb2-fourberie': 'https://images.steamusercontent.com/ugc/1899982111928386061/88D0CED7969A81AF037FBE295C7496BD720F66B6/',
  'rts-camera': 'https://images.steamusercontent.com/ugc/13230785998235351294/322516AB1B53AE06AE7C3FB38A6C15BB641D1577/',
  'gh-mount-blade-ii-bannerlord-bannerlord-rtscamera': 'https://images.steamusercontent.com/ugc/13230785998235351294/322516AB1B53AE06AE7C3FB38A6C15BB641D1577/',
  'dismemberment-plus': 'https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/',
  'mb2-dismemberment-plus': 'https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/',
  'mb2-the-old-realms': 'https://images.steamusercontent.com/ugc/17765109140977154608/047E809D9A505732564F7CD436CF447EEB7BD336/',
  'the-old-realms': 'https://images.steamusercontent.com/ugc/17765109140977154608/047E809D9A505732564F7CD436CF447EEB7BD336/',
  'mb2-open-source-armory': 'https://staticdelivery.nexusmods.com/mods/3174/images/thumbnails/2829/2829-1617496450-185194831.png',
  'battle-cheats': 'https://images.steamusercontent.com/ugc/11576046800623151757/EF12B3B48BF674E160358E67600363F0C1581DA4/',
  'bannerlord-cheats': 'https://images.steamusercontent.com/ugc/11576046800623151757/EF12B3B48BF674E160358E67600363F0C1581DA4/',
  'gh-mount-blade-ii-bannerlord-bannerlord-cheats': 'https://images.steamusercontent.com/ugc/11576046800623151757/EF12B3B48BF674E160358E67600363F0C1581DA4/',

  // --- Cyberpunk 2077 ---
  'cyber-engine-tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/107_1613641623.jpg',
  'gh-cyberpunk-2077-cyber-engine-tweaks': 'https://staticdelivery.nexusmods.com/mods/3333/images/headers/107_1613641623.jpg',
  'vehicle-combat': 'https://staticdelivery.nexusmods.com/mods/3333/images/3815/3815-1655846243-894475559.png',
  'cp2077-vehicle-combat': 'https://staticdelivery.nexusmods.com/mods/3333/images/3815/3815-1655846243-894475559.png',
  'let-there-be-flight': 'https://raw.githubusercontent.com/jackhumbert/let_there_be_flight/main/preview.png',
  'cp2077-let-there-be-flight': 'https://raw.githubusercontent.com/jackhumbert/let_there_be_flight/main/preview.png',

  // --- Skyrim Special Edition ---
  'skyui': 'https://images.steamusercontent.com/ugc/634230140395150344/1C269D9E89B3ABD8EEBFBD52AAC196D85CEF9B65/',
  'static-mesh-improvement-mod-smim': 'https://images.steamusercontent.com/ugc/531766271378999673/4C3F603B3EB9558CB264759557907886E06C2024/',
  'smim': 'https://images.steamusercontent.com/ugc/531766271378999673/4C3F603B3EB9558CB264759557907886E06C2024/',
  'inigo': 'https://staticdelivery.nexusmods.com/mods/1704/images/thumbnails/1461-0-1479957014.jpg',
  'alternate-start-live-another-life': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/272_1584049827.jpg',
  'alternate-start': 'https://staticdelivery.nexusmods.com/mods/1704/images/headers/272_1584049827.jpg',

  // --- The Witcher 3 ---
  'the-witcher-3-hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg',
  'hd-reworked-project': 'https://staticdelivery.nexusmods.com/mods/952/images/headers/1021_1600548208.jpg'
};

async function applyExactImages() {
  console.log('🎯 Updating exact real mod preview images...');
  for (const [slug, imgUrl] of Object.entries(VERIFIED_REAL_MOD_IMAGES)) {
    const res = await db.execute({
      sql: 'UPDATE mods SET image_url = ? WHERE slug = ? OR slug LIKE ?',
      args: [imgUrl, slug, `%${slug}%`]
    });
    console.log(`Updated ${slug} -> ${res.rowsAffected} rows affected`);
  }
}

applyExactImages();
