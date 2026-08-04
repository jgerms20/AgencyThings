import DemographicOverview from "@/components/DemographicOverview";
import SiteHeader from "@/components/SiteHeader";
import type { ResearchRecord } from "@/lib/types";

type LabWorkspaceProps = { initialRecords: ResearchRecord[] };

export default function LabWorkspace({ initialRecords: _initialRecords }: LabWorkspaceProps) {
  return (
    <main className="overview-page demographic-overview-page">
      <SiteHeader active="overview" />
      <DemographicOverview />
    </main>
  );
}
