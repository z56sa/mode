import { UTApi } from "uploadthing/server";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const token = process.env.UPLOADTHING_TOKEN?.replace(/['"]/g, "");
console.log("Token detected:", !!token);

const utapi = new UTApi({ token });

async function run() {
  try {
    console.log("Uploading test file to Uploadthing project 'mode'...");
    const content = Buffer.from("mode Arabic Gaming Platform - Verified Storage Sync 2026", "utf-8");
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], "mode-platform-welcome.txt", { type: "text/plain" });

    const response = await utapi.uploadFiles([file]);
    console.log("\n🎉 Successfully uploaded to Uploadthing!");
    console.log("File Data:", response);
  } catch (err) {
    console.error("Upload error:", err);
  }
}

run();
