import { createClient } from '@libsql/client';

const DB_URL = 'libsql://mode-knook9.aws-ap-northeast-1.turso.io';
const DB_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg';

const db = createClient({ url: DB_URL, authToken: DB_TOKEN });

const res = await db.execute(`
  SELECT id, title, slug, game, image_url, source_url
  FROM mods
  WHERE slug LIKE '%better-time%' OR title LIKE '%Better Time%'
`);

console.log(res.rows);
