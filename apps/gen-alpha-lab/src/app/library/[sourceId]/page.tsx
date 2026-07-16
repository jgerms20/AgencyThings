import { notFound } from "next/navigation";
import SourceDetail from "@/components/SourceDetail";
import { getSource } from "@/lib/content/selectors";
import { sources } from "@/lib/content/sources";

type SourcePageProps = {
  params: Promise<{ sourceId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { sourceId: string }[] {
  return sources.map((source) => ({ sourceId: source.id }));
}

export async function generateMetadata({ params }: SourcePageProps) {
  const { sourceId } = await params;
  const source = getSource(sourceId);

  return {
    title: source ? `${source.title} | Gen Alpha Intelligence Lab` : "Source | Gen Alpha Intelligence Lab",
    description: source?.summary,
  };
}

export default async function SourcePage({ params }: SourcePageProps) {
  const { sourceId } = await params;
  const source = getSource(sourceId);

  if (!source) notFound();

  return <SourceDetail source={source} />;
}
