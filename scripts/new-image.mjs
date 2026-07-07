#!/usr/bin/env node

import { access, copyFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "content");

const folder = process.argv[2];
const imagePath = process.argv[3];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

if (!folder || !/^[a-z][a-z0-9-]*-[a-f0-9]{8}$/.test(folder)) {
  console.error("Usage: npm run new-image <folder> <image-path>");
  console.error("Example: npm run new-image wallpaper-a1b2c3d4 ~/Pictures/photo.jpg");
  process.exit(1);
}

if (!imagePath) {
  console.error("Missing image path.");
  process.exit(1);
}

const ext = path.extname(imagePath).toLowerCase();
if (!IMAGE_EXT.has(ext)) {
  console.error("Supported formats: jpg, png, gif, webp, avif");
  process.exit(1);
}

const folderDir = path.join(contentDir, folder);
try {
  await access(folderDir);
} catch {
  console.error(`Folder not found: content/${folder}/`);
  console.error(`Create one with: npm run new-share ${folder.split("-")[0]}`);
  process.exit(1);
}

const fileSlug = `1-${randomBytes(4).toString("hex").slice(0, 7)}`;
const filename = `${fileSlug}${ext}`;
const dest = path.join(folderDir, filename);

try {
  await access(imagePath);
} catch {
  console.error(`Image not found: ${imagePath}`);
  process.exit(1);
}

await copyFile(imagePath, dest);

console.log(`Added: content/${folder}/${filename}`);
console.log(`URL: https://share.canusta.com/${folder}/${fileSlug}`);
