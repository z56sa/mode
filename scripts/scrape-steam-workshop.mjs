async function run() {
  const res = await fetch('https://steamcommunity.com/sharedfiles/filedetails/?id=2882352820', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const matches = [...html.matchAll(/https:\/\/images\.steamusercontent\.com\/ugc\/[a-zA-Z0-9_\/]+/g)];
  console.log('Steam UGC matches:', matches.map(m => m[0]));
}

run();
