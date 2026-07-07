#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
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
await writeFile(
  path.join(dir, "meta.json"),
  JSON.stringify(
    {
      title: name.charAt(0).toUpperCase() + name.slice(1),
      description: "",
    },
    null,
    2
  ) + "\n"
);

console.log(`Created share: content/${slug}/`);
console.log(`URL: https://share.canusta.com/${slug}`);
console.log("Add your files to that folder, then deploy.");
