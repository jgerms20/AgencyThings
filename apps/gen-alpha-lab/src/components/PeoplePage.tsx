import InfluencerFilters from "@/components/InfluencerFilters";
import SiteHeader from "@/components/SiteHeader";
import { cultureShapers } from "@/lib/content/culture-shapers";

export default function PeoplePage() {
  return (
    <main className="people-page">
      <SiteHeader active="influencers" />
      <section className="page-opening influencer-opening">
        <h1>Influence has a face, a format, and an audience.</h1>
        <p>Creators, artists, athletes, screen properties, and franchises reveal the formats Gen Alpha copies, carries, and reshapes.</p>
      </section>

      <InfluencerFilters shapers={cultureShapers} />
    </main>
  );
}
