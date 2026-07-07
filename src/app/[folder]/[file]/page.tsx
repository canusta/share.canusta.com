import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageShareView } from "@/components/ImageShareView";
import { getImageShare } from "@/lib/shares";

type Props = {
  params: Promise<{ folder: string; file: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { folder, file } = await params;
  const share = await getImageShare(folder, file);

  return {
    title: share ? " " : ":)",
    robots: { index: false, follow: false },
  };
}

export default async function ImageSharePage({ params }: Props) {
  const { folder, file } = await params;
  const share = await getImageShare(folder, file);

  if (!share) notFound();

  return <ImageShareView share={share} />;
}
