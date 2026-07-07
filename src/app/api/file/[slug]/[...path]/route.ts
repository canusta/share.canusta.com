import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getShare, getShareFilePath } from "@/lib/shares";

type Props = {
  params: Promise<{ slug: string; path: string[] }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { slug, path: pathSegments } = await params;

  if (pathSegments.length !== 1) {
    return new NextResponse(null, { status: 404 });
  }

  const filename = decodeURIComponent(pathSegments[0]);
  const share = await getShare(slug);

  if (!share) {
    return new NextResponse(null, { status: 404 });
  }

  const fileExists = share.files.some((f) => f.name === filename);
  if (!fileExists) {
    return new NextResponse(null, { status: 404 });
  }

  const filePath = getShareFilePath(slug, filename);
  if (!filePath) {
    return new NextResponse(null, { status: 404 });
  }

  const file = share.files.find((f) => f.name === filename)!;
  const data = await fs.readFile(filePath);

  return new NextResponse(data, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
