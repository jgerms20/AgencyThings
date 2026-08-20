import InfluencerFilters from "@/components/InfluencerFilters";
import SiteHeader from "@/components/SiteHeader";
import { cultureShapers } from "@/lib/content/culture-shapers";

export default function PeoplePage() {
  return (
    <main className="people-page">
      <SiteHeader active="influencers" />
      <section className="page-opening influencer-opening">
        <h1>People shaping what Gen Alpha watches, plays, and copies.</h1>
        <p>Browse creators, artists, athletes, and screen properties by name, platform, age, and topic — then open a profile to see who they reach and why they matter.</p>
      </section>

      <InfluencerFilters shapers={cultureShapers} />
    </main>
  );
}
