import LabWorkspace from "@/components/LabWorkspace";
import { seedRecords } from "@/lib/seed-data";

export default function Home() {
  return <LabWorkspace initialRecords={seedRecords} />;
}
