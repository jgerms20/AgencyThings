import LabWorkspace from "@/components/LabWorkspace";
import { seedRecords, signals } from "@/lib/seed-data";

export default function Home() {
  return <LabWorkspace initialRecords={seedRecords} signals={signals} />;
}
