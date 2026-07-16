import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getInsightsForTheme, themes } from "@/lib/content/insights";

const toneByTheme = {
  "play-belonging": "acid",
  "media-influence": "coral",
  "time-routines": "cyan",
  "learning-becoming": "violet",
} as const;

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Forty sourced insights shaping Gen Alpha now.</h1>
        <p>Four connected systems organize the evidence, limits, comparisons, and responsible agency implications.</p>
      </section>

      <div className="insight-directory">
        {themes.map((theme) => (
          <section
            className={`insight-cluster insight-cluster-${toneByTheme[theme.id]}`}
            id={theme.id}
            key={theme.id}
          >
            <header>
              <h2>{theme.title}</h2>
              <p>{theme.description}</p>
            </header>
            <div>
              {getInsightsForTheme(theme.id).map((insight) => (
                <article data-testid="insight-directory-item" key={insight.id}>
                  <span>{String(insight.sequence).padStart(2, "0")}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.interpretation}</p>
                  <Link href={`/insights/${insight.id}` as Route} aria-label={`Explore ${insight.title}`}>
                    <ArrowUpRight aria-hidden="true" size={20} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

    </main>
  );
}
