import LibraryPage from "@/components/LibraryPage";
import { seedRecords } from "@/lib/seed-data";

export default function LibraryRoute() {
  return <LibraryPage initialRecords={seedRecords} />;
}
