import fs from "fs/promises";
import path from "path";
import { isSafeFilename, isValidSlug } from "./security";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ShareMeta = {
  title?: string;
  description?: string;
};

export type ShareFile = {
  name: string;
  size: number;
  mimeType: string;
};

export type Share = {
  slug: string;
  meta: ShareMeta;
  files: ShareFile[];
};

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".txt": "text/plain",
  ".json": "application/json",
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/") && mimeType !== "image/svg+xml";
}

function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function isAudio(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

export function getFileKind(
  mimeType: string
): "image" | "video" | "audio" | "pdf" | "other" {
  if (isImage(mimeType)) return "image";
  if (isVideo(mimeType)) return "video";
  if (isAudio(mimeType)) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  return "other";
}

async function readMeta(dir: string): Promise<ShareMeta> {
  try {
    const raw = await fs.readFile(path.join(dir, "meta.json"), "utf-8");
    return JSON.parse(raw) as ShareMeta;
  } catch {
    return {};
  }
}

export async function getShare(slug: string): Promise<Share | null> {
  if (!isValidSlug(slug)) return null;

  const dir = path.join(CONTENT_DIR, slug);
  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) return null;
  } catch {
    return null;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: ShareFile[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || entry.name === "meta.json") continue;
    if (!isSafeFilename(entry.name)) continue;

    const fileStat = await fs.stat(path.join(dir, entry.name));
    files.push({
      name: entry.name,
      size: fileStat.size,
      mimeType: getMimeType(entry.name),
    });
  }

  if (files.length === 0) return null;

  files.sort((a, b) => a.name.localeCompare(b.name));
  const meta = await readMeta(dir);

  return { slug, meta, files };
}

export function getShareFilePath(slug: string, filename: string): string | null {
  if (!isValidSlug(slug) || !isSafeFilename(filename)) return null;
  return path.join(CONTENT_DIR, slug, filename);
}

export function fileUrl(slug: string, filename: string): string {
  return `/api/file/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`;
}
