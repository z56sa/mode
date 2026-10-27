async function check() {
  const urls = [
    'https://www.nexusmods.com/mountandblade2bannerlord/mods/2006',
    'https://www.nexusmods.com/mountandblade2bannerlord/mods/355',
    'https://www.nexusmods.com/cyberpunk2077/mods/107'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      const match = text.match(/<meta property="og:image" content="([^"]+)"/i);
      console.log(url, '-->', match ? match[1] : 'NOT FOUND (status ' + res.status + ')');
    } catch (err) {
      console.log(url, '--> ERROR:', err.message);
    }
  }
}
check();
