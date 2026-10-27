async function getIds() {
  const res = await fetch('https://steamcommunity.com/workshop/browse/?appid=261550', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const ids = new Set();
  for (const m of html.matchAll(/filedetails\/\?id=(\d+)/g)) {
    ids.add(m[1]);
  }
  console.log('Found IDs:', [...ids].slice(0, 30));
  
  if (ids.size > 0) {
    const list = [...ids].slice(0, 15);
    for (const id of list) {
      const pageRes = await fetch(`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const pageHtml = await pageRes.text();
      const titleMatch = pageHtml.match(/<div class="workshopItemTitle">([^<]+)<\/div>/);
      const imgMatch = pageHtml.match(/https:\/\/images\.steamusercontent\.com\/ugc\/[a-zA-Z0-9_\/]+/);
      console.log(`[${id}] "${titleMatch ? titleMatch[1].trim() : 'Unknown'}" -> ${imgMatch ? imgMatch[0] : 'None'}`);
    }
  }
}

getIds();
