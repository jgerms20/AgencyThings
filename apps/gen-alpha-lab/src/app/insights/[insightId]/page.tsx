import { notFound } from "next/navigation";
import InsightDetail from "@/components/InsightDetail";
import { getInsight, insights } from "@/lib/content/insights";

type InsightPageProps = {
  params: Promise<{ insightId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { insightId: string }[] {
  return insights.map((insight) => ({ insightId: insight.id }));
}

export async function generateMetadata({ params }: InsightPageProps) {
  const { insightId } = await params;
  const insight = getInsight(insightId);

  return {
    title: insight ? `${insight.title} | Gen Alpha Intelligence Lab` : "Insight | Gen Alpha Intelligence Lab",
    description: insight?.thesis,
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { insightId } = await params;
  const insight = getInsight(insightId);

  if (!insight) notFound();

  return <InsightDetail insight={insight} />;
}
