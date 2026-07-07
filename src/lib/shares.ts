import fs from "fs/promises";
import path from "path";
import {
  isSafeFilename,
  isValidFileSlug,
  isValidFolderSlug,
} from "./security";

const CONTENT_DIR = path.join(process.cwd(), "content");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
]);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export type ImageShare = {
  folder: string;
  file: string;
  filename: string;
  size: number;
  mimeType: string;
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function isImageFile(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

export async function getImageShare(
  folder: string,
  file: string
): Promise<ImageShare | null> {
  if (!isValidFolderSlug(folder) || !isValidFileSlug(file)) return null;

  const dir = path.join(CONTENT_DIR, folder);
  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) return null;
  } catch {
    return null;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !isSafeFilename(entry.name)) continue;
    if (!isImageFile(entry.name)) continue;
    if (path.parse(entry.name).name !== file) continue;

    const fileStat = await fs.stat(path.join(dir, entry.name));
    return {
      folder,
      file,
      filename: entry.name,
      size: fileStat.size,
      mimeType: getMimeType(entry.name),
    };
  }

  return null;
}

export function getImageFilePath(
  folder: string,
  filename: string
): string | null {
  if (!isValidFolderSlug(folder) || !isSafeFilename(filename)) return null;
  return path.join(CONTENT_DIR, folder, filename);
}

export function imageUrl(
  folder: string,
  file: string,
  download = false
): string {
  const base = `/api/file/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
  return download ? `${base}?download=1` : base;
}
