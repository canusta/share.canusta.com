/** Folder slug: name-8hex e.g. wallpaper-a1b2c3d4 */
export const FOLDER_SLUG_PATTERN = /^[a-z][a-z0-9-]*-[a-f0-9]{8}$/;

/** File slug: 1-7chars e.g. 1-doa93ks */
export const FILE_SLUG_PATTERN = /^[0-9]+-[a-z0-9]{6,8}$/;

export function isValidFolderSlug(slug: string): boolean {
  return FOLDER_SLUG_PATTERN.test(slug);
}

export function isValidFileSlug(slug: string): boolean {
  return FILE_SLUG_PATTERN.test(slug);
}

export function isSafeFilename(filename: string): boolean {
  if (!filename || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  if (filename === "." || filename === ".." || filename.startsWith(".")) {
    return false;
  }
  return true;
}
