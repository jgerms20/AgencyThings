import { notFound } from "next/navigation";
import FindingDetail from "@/components/FindingDetail";
import { getFindingById } from "@/lib/findings";

type FindingPageProps = {
  params: Promise<{ findingId: string }>;
};

export default async function FindingPage({ params }: FindingPageProps) {
  const { findingId } = await params;
  const finding = getFindingById(findingId);

  if (!finding) notFound();

  return <FindingDetail finding={finding} />;
}
