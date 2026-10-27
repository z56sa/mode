import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // 1. رفع صورة المود (حد أقصى 4MB)
  modImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  // 2. رفع ملف المود الحقيقي (ZIP, RAR, 7Z, JAR... حتى 128MB)
  modAttachment: f({
    blob: { maxFileSize: "128MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
