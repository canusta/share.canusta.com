/** Slug format: name-8hex e.g. wallpaper-a1b2c3d4 */
export const SLUG_PATTERN = /^[a-z][a-z0-9-]*-[a-f0-9]{8}$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
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
