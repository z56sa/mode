async function fetchWorkshopMods(appId, searchText = '') {
  const url = searchText
    ? `https://steamcommunity.com/workshop/browse/?appid=${appId}&searchtext=${encodeURIComponent(searchText)}&browsesort=textsearch&section=readytouseitems`
    : `https://steamcommunity.com/workshop/browse/?appid=${appId}&browsesort=totaluniquesubscribers&section=readytouseitems`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  const html = await res.text();

  // Extract shared file details
  // Each workshop item has an ID and title
  const ids = [];
  const idMatches = html.matchAll(/id="sharedfile_(\d+)"/g);
  for (const m of idMatches) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }

  console.log(`Found ${ids.length} item IDs for ${appId} (search: "${searchText}")`);
  if (ids.length === 0) return [];

  // Query Steam API for details including titles and preview_url
  const body = new URLSearchParams();
  body.append('itemcount', String(Math.min(ids.length, 25)));
  ids.slice(0, 25).forEach((id, index) => {
    body.append(`publishedfileids[${index}]`, id);
  });

  const apiRes = await fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await apiRes.json();
  const items = data?.response?.publishedfiledetails || [];
  return items.map(item => ({
    id: item.publishedfileid,
    title: item.title,
    previewUrl: item.preview_url,
    subscriptions: item.subscriptions
  }));
}

async function test() {
  const bannerlordItems = await fetchWorkshopMods(261550);
  console.log('Top Bannerlord Workshop mods:');
  bannerlordItems.slice(0, 10).forEach(i => console.log(i.title, '==>', i.previewUrl));
}

test().catch(console.error);
