import { notFound } from "next/navigation";
import InfluencerDetail from "@/components/InfluencerDetail";
import { getInfluencerById, influencers } from "@/lib/influencers";

export function generateStaticParams() {
  return influencers.map((influencer) => ({ influencerId: influencer.id }));
}

export default async function InfluencerRoute({ params }: { params: Promise<{ influencerId: string }> }) {
  const { influencerId } = await params;
  const influencer = getInfluencerById(influencerId);
  if (!influencer) notFound();
  return <InfluencerDetail influencer={influencer} />;
}
