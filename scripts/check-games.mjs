import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

const r = await db.execute("SELECT game, COUNT(*) as cnt FROM mods WHERE status='approved' GROUP BY game ORDER BY cnt DESC LIMIT 50");
console.log('=== الألعاب الحالية ===');
r.rows.forEach(row => console.log(`${row.cnt}\t${row.game}`));

const total = await db.execute("SELECT COUNT(*) as cnt FROM mods WHERE status='approved'");
console.log('\n=== الإجمالي ===');
console.log('Total approved:', total.rows[0].cnt);
process.exit(0);
