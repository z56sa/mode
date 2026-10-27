const ids = [
  '3025574678', // The Old Realms
  '2829284496', // Open Source Armory
  '2882352820', // Better Time
];

async function getWorkshopImages(idList) {
  for (const id of idList) {
    try {
      const res = await fetch(`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      const m = html.match(/https:\/\/images\.steamusercontent\.com\/ugc\/[a-zA-Z0-9_\/]+/);
      console.log(id, '->', m ? m[0] : 'not found');
    } catch (e) {
      console.log(id, 'err', e.message);
    }
  }
}

getWorkshopImages(ids);
