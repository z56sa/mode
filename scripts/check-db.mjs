import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

const tables = await db.execute(`SELECT name FROM sqlite_master WHERE type='table'`);
console.log('Tables:', tables.rows.map(r => r.name));

const totalMods = await db.execute(`SELECT COUNT(*) as c FROM mods`);
console.log('Total mods:', totalMods.rows[0].c);

// Get distinct games
const games = await db.execute(`SELECT game, COUNT(*) as cnt FROM mods GROUP BY game ORDER BY cnt DESC`);
console.log('\nGames with mod counts:');
games.rows.forEach(r => console.log(r.game, ':', r.cnt));
