#!/usr/bin/env node

import { mkdir } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "content");

const name = process.argv[2];

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage: npm run new-share <name>");
  console.error("Example: npm run new-share wallpaper");
  process.exit(1);
}

const hash = randomBytes(4).toString("hex");
const slug = `${name}-${hash}`;
const dir = path.join(contentDir, slug);

await mkdir(dir, { recursive: true });

console.log(`Created empty folder: content/${slug}/`);
console.log(`Add images with: npm run new-image ${slug} path/to/image.jpg`);
