async function searchWorkshop(appId, query) {
  const url = `https://steamcommunity.com/workshop/browse/?appid=${appId}&searchtext=${encodeURIComponent(query)}&browsesort=textsearch&section=readytouseitems`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  
  // Extract workshop item cards
  const regex = /<div class="workshopItem">[\s\S]*?<a href="[^"]*?id=(\d+)"[\s\S]*?<img class="workshopItemPreviewImage" src="([^"]+)"[\s\S]*?<div class="workshopItemTitle ellipsis">([^<]+)<\/div>/g;
  const items = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({ id: match[1], img: match[2], title: match[3].trim() });
  }
  return items;
}

const queries = [
  'Custom Battle',
  'Party Screen Enhancements',
  'Bannerlord Cheats',
  'Better Time',
  'Calradia Expanded',
  'Open Source Armory',
  'Serve as Soldier',
  'Freelancer',
  'Banner Kings',
  'Xorberax',
  'The Old Realms',
  'Warhammer'
];

for (const q of queries) {
  const results = await searchWorkshop(261550, q);
  console.log(`\n🔎 Query: "${q}" (found ${results.length})`);
  for (const r of results.slice(0, 3)) {
    console.log(`   - [${r.id}] ${r.title}: ${r.img}`);
  }
}
