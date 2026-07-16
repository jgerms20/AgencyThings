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

const directoryTitleByTheme = {
  "play-belonging": "Play and belonging",
  "media-influence": "Media and influence",
  "time-routines": "Time & Routines",
  "learning-becoming": "Learning & Becoming",
} as const;

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Ten truths shaping Gen Alpha now.</h1>
        <p>That concise synthesis opens into 40 sourced insights across four systems, each with evidence, limits, comparison, and a responsible agency implication.</p>
      </section>

      <div className="insight-directory">
        {themes.map((theme) => (
          <section
            className={`insight-cluster insight-cluster-${toneByTheme[theme.id]}`}
            id={theme.id}
            key={theme.id}
          >
            <header>
              <h2>{directoryTitleByTheme[theme.id]}</h2>
              <p>{theme.description}</p>
            </header>
            <div>
              {getInsightsForTheme(theme.id).map((insight) => (
                <article
                  data-testid={theme.id === "play-belonging" ? "insight-directory-item" : undefined}
                  key={insight.id}
                >
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

      <div className="insight-bands" aria-label="Cross-theme lenses">
        <section className="insight-band insight-band-cyan">
          <span>Cross-theme bridge</span>
          <div>
            <h2>Time and learning</h2>
            <p>Routines shape when help is needed, while learning changes what screen time is for.</p>
          </div>
          <Link href="/insights#time-routines" aria-label="Open Time & Routines insights">
            <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </section>
        <section className="insight-band insight-band-violet">
          <span>Cross-cutting tag</span>
          <div>
            <h2>AI and agency</h2>
            <p>AI appears inside media, routines, and learning; judgment, verification, privacy, and adult guidance travel with it.</p>
          </div>
          <Link href="/insights#learning-becoming" aria-label="Open AI-tagged learning insights">
            <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </section>
      </div>
    </main>
  );
}
