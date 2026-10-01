import InsightDirectory from "@/components/InsightDirectory";
import SiteHeader from "@/components/SiteHeader";

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Inside their everyday.</h1>
        <p>How play, media, routines, and learning shape childhood. Start with a finding. Follow it to the evidence.</p>
      </section>

      <InsightDirectory />
    </main>
  );
}
