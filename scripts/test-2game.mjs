async function get2gameImages() {
  const ids = [4198, 4197, 790, 107, 1511, 2380];
  for (const id of ids) {
    try {
      const res = await fetch(`https://2game.info/cyberpunk2077/detail.php?id=${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      const imgs = html.match(/https?:\/\/[^"'\s<>]+staticdelivery[^"'\s<>]+\.(?:jpg|png|webp)/gi);
      console.log(`ID ${id}:`, imgs || 'none');
    } catch (e) {
      console.log(`ID ${id} err:`, e.message);
    }
  }
}
get2gameImages();
