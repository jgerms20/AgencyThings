import { notFound } from "next/navigation";
import InfluencerDetail from "@/components/InfluencerDetail";
import { cultureShapers, getCultureShaper } from "@/lib/content/culture-shapers";

export function generateStaticParams() {
  return cultureShapers.map((shaper) => ({ influencerId: shaper.id }));
}

export default async function InfluencerRoute({ params }: { params: Promise<{ influencerId: string }> }) {
  const { influencerId } = await params;
  const shaper = getCultureShaper(influencerId);
  if (!shaper) notFound();
  return <InfluencerDetail influencer={shaper} />;
}
