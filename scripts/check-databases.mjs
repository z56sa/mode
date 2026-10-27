import fs from "node:fs";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

const env = dotenv.parse(fs.readFileSync(".env.local"));
console.log("Current DB URL:", env.TURSO_DATABASE_URL);

const oldUrl = "libsql://mode-z56sa.aws-ap-northeast-1.turso.io";
const oldToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTI5MzMzNTMsImlkIjoiMDFhMTczMWItMzQwMS03MzM3LWEyNDQtYmRkNTdlMjIxYjhhIiwia2lkIjoiSjllZ0sxR0d5WjNjZXpqTGpCbUZuS2hhMUlFa2JGZ25meDdtLUY3TWtXayIsInJpZCI6IjZlNjQ5ZDY3LWJiYTQtNDY2ZC05N2M4LTdiZmQ2MzgxNzgzMSJ9.4W_d0-eUKaeM50u2Q4SmvVq0d2fFihtd64-U-EiiayYTAin1A16qhJsEMCk105PVmu4SHxyd8L3SqvSg8sPdAw";

async function checkDbs() {
  const currentClient = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
  const oldClient = createClient({ url: oldUrl, authToken: oldToken });

  try {
    const curRes = await currentClient.execute("SELECT count(*) as c FROM mods");
    console.log("Current DB count:", curRes.rows[0].c);
  } catch (e) {
    console.log("Current DB error (table probably not created):", e.message);
  }

  try {
    const oldRes = await oldClient.execute("SELECT count(*) as c FROM mods");
    console.log("Old DB count (mode-z56sa):", oldRes.rows[0].c);
  } catch (e) {
    console.log("Old DB error:", e.message);
  }
}

checkDbs();
