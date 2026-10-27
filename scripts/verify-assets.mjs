import fs from 'fs';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

async function verify() {
  const content = fs.readFileSync('app/games/page.tsx', 'utf-8');
  const r = await db.execute('SELECT DISTINCT game FROM mods');
  const missing = [];
  for (const row of r.rows) {
    const game = String(row.game);
    if (!content.includes(`"${game}":`)) {
      missing.push(game);
    }
  }
  console.log('Missing count:', missing.length);
  console.log('Missing games:', missing);
}
verify();
