import { notFound } from "next/navigation";
import InfluencerDetail from "@/components/InfluencerDetail";
import { cultureShapers, getCultureShaper, getCultureShaperPublicIds } from "@/lib/content/culture-shapers";

export function generateStaticParams() {
  return cultureShapers.flatMap((shaper) =>
    getCultureShaperPublicIds(shaper).map((influencerId) => ({ influencerId })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ influencerId: string }> }) {
  const { influencerId } = await params;
  const shaper = getCultureShaper(influencerId);
  return {
    title: shaper ? `${shaper.name} | Gen Alpha Intelligence Lab` : "Influencer | Gen Alpha Intelligence Lab",
    description: shaper?.summary,
  };
}

export default async function InfluencerRoute({ params }: { params: Promise<{ influencerId: string }> }) {
  const { influencerId } = await params;
  const shaper = getCultureShaper(influencerId);
  if (!shaper) notFound();
  return <InfluencerDetail influencer={shaper} />;
}
