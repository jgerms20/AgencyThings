import InsightDirectory from "@/components/InsightDirectory";
import SiteHeader from "@/components/SiteHeader";

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Four ways their days actually work.</h1>
        <p>Play, media, time, and learning — twenty featured reads from forty sourced insights. Each opens here; the rest stay on their detail pages.</p>
      </section>

      <InsightDirectory />
    </main>
  );
}
