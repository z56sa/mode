async function testImgs() {
  const res = await fetch('https://2game.info/cyberpunk2077/detail.php?id=4198', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    console.log(m[1]);
  }
}
testImgs();
