import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareView } from "@/components/ShareView";
import { getShare } from "@/lib/shares";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const share = await getShare(slug);

  return {
    title: share?.meta.title ?? "Not found",
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({ params }: Props) {
  const { slug } = await params;
  const share = await getShare(slug);

  if (!share) notFound();

  return <ShareView share={share} />;
}
