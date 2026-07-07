import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getImageFilePath, getImageShare } from "@/lib/shares";

type Props = {
  params: Promise<{ folder: string; file: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { folder, file } = await params;
  const share = await getImageShare(folder, file);

  if (!share) {
    return new NextResponse(null, { status: 404 });
  }

  const filePath = getImageFilePath(folder, share.filename);
  if (!filePath) {
    return new NextResponse(null, { status: 404 });
  }

  const data = await fs.readFile(filePath);
  const download = new URL(request.url).searchParams.has("download");

  const headers: Record<string, string> = {
    "Content-Type": share.mimeType,
    "Content-Length": String(share.size),
    "Cache-Control": "private, max-age=3600",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
  };

  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${share.filename}"`;
  }

  return new NextResponse(data, { headers });
}
