import SiteHeader from "@/components/SiteHeader";
import SpaceFilters from "@/components/SpaceFilters";
import { spaces } from "@/lib/spaces";

export default function SpacesPage() {
  return (
    <main className="spaces-page">
      <SiteHeader active="spaces" />
      <section className="page-opening spaces-opening">
        <h1>Where they actually spend time.</h1>
        <p>Twenty-five featured places anchor the directory. Every space still has a deep link for culture-shaper cross-references and filtered browsing.</p>
      </section>
      <SpaceFilters spaces={spaces} />
    </main>
  );
}
