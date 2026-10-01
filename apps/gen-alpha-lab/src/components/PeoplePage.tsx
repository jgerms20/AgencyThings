import InfluencerFilters from "@/components/InfluencerFilters";
import SiteHeader from "@/components/SiteHeader";
import { cultureShapers } from "@/lib/content/culture-shapers";

export default function PeoplePage() {
  return (
    <main className="people-page directory-refresh directory-refresh--people">
      <SiteHeader active="influencers" />
      <section className="page-opening influencer-opening">
        <h1>Who shapes their world.</h1>
        <p>Browse the creators, artists, athletes, and properties shaping what Gen Alpha watches, plays, and shares.</p>
      </section>

      <InfluencerFilters shapers={cultureShapers} />
    </main>
  );
}
