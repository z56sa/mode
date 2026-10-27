async function getMostPopularWorkshopMods(appId, count = 50) {
  const url = `https://steamcommunity.com/workshop/browse/?appid=${appId}&browsesort=trend&section=readytouseitems&actualsort=trend&p=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  
  // Find each workshop item
  const regex = /<a class="ugc" href="https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)[^"]*">[\s\S]*?<div class="workshopItemTitle ellipsis">([^<]+)<\/div>[\s\S]*?<img class="workshopItemPreviewImage[^"]*" src="([^"]+)"/g;
  
  let match;
  const mods = [];
  while ((match = regex.exec(html)) !== null) {
    mods.push({ id: match[1], title: match[2].trim(), img: match[3] });
  }
  return mods;
}

const bannerlordMods = await getMostPopularWorkshopMods(261550);
console.log(`Found ${bannerlordMods.length} Bannerlord popular mods:`);
for (const m of bannerlordMods) {
  console.log(`- "${m.title}" -> ${m.img}`);
}
