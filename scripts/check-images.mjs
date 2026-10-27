import fs from 'fs';

const content = fs.readFileSync('app/games/page.tsx', 'utf-8');
const regex = /"([^"]+)":\s*\{\s*image:\s*"([^"]+)"/g;
let match;
const urls = [];
while ((match = regex.exec(content)) !== null) {
  urls.push({ game: match[1], url: match[2] });
}

async function checkUrls() {
  console.log('Total games to check:', urls.length);
  const broken = [];
  for (const item of urls) {
    try {
      const res = await fetch(item.url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.startsWith('image/')) {
        console.log(`❌ BROKEN: ${item.game} -> HTTP ${res.status} (${contentType}) | ${item.url}`);
        broken.push(item);
      } else {
        const buf = await res.arrayBuffer();
        if (buf.byteLength < 2000) {
          console.log(`⚠️ TOO SMALL: ${item.game} (${buf.byteLength} bytes) | ${item.url}`);
          broken.push(item);
        } else {
          // console.log(`✅ OK: ${item.game}`);
        }
      }
    } catch (e) {
      console.log(`❌ ERROR: ${item.game} -> ${e.message} | ${item.url}`);
      broken.push(item);
    }
  }
  console.log('\n--- Summary ---');
  console.log('Broken images count:', broken.length);
  console.log(JSON.stringify(broken, null, 2));
}

checkUrls();
