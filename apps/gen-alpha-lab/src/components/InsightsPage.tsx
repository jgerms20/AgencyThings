import InsightDirectory from "@/components/InsightDirectory";
import SiteHeader from "@/components/SiteHeader";

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Forty sourced insights shaping Gen Alpha now.</h1>
        <p>Four connected systems organize the evidence, limits, comparisons, and responsible agency implications.</p>
      </section>

      <InsightDirectory />
    </main>
  );
}
