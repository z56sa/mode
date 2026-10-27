import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

async function main() {
  const games = ['Mount & Blade II: Bannerlord', 'Cyberpunk 2077', 'The Witcher 3: Wild Hunt', 'The Elder Scrolls V: Skyrim Special Edition'];
  for (const g of games) {
    const res = await db.execute({
      sql: `SELECT title, image_url, source_url FROM mods WHERE game = ? LIMIT 3`,
      args: [g]
    });
    console.log(`\n=== ${g} ===`);
    res.rows.forEach(r => console.log(r.title, '-->', r.image_url));
  }
}

main().catch(console.error);
