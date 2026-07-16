import SiteHeader from "@/components/SiteHeader";
import SpaceFilters from "@/components/SpaceFilters";
import { spaces } from "@/lib/spaces";

export default function SpacesPage() {
  return (
    <main className="spaces-page">
      <SiteHeader active="spaces" />
      <section className="page-opening spaces-opening">
        <h1>Where time becomes culture.</h1>
        <p>Fifty digital, physical, and hybrid environments reveal different patterns of play, identity, friendship, discovery, making, and family life.</p>
      </section>
      <SpaceFilters spaces={spaces} />
    </main>
  );
}
