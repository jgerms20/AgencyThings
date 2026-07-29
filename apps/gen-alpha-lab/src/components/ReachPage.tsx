import { ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { insights } from "@/lib/content/insights";
import { sources } from "@/lib/content/sources";
import { strategyPlays } from "@/lib/content/strategy";

const insightById = new Map(insights.map((insight) => [insight.id, insight]));
const sourceById = new Map(sources.map((source) => [source.id, source]));
const resolveReferences = <T,>(ids: string[] | undefined, entityById: Map<string, T>): T[] =>
  Array.isArray(ids) ? ids.flatMap((id) => {
    const entity = entityById.get(id);
    return entity ? [entity] : [];
  }) : [];

const strategyStages = [
  {
    id: "create-value",
    number: "01",
    title: "Create value",
    description: "Give children something worth making, learning, joining, or returning to.",
    plays: strategyPlays.slice(0, 2),
  },
  {
    id: "fit-the-context",
    number: "02",
    title: "Fit the context",
    description: "Work with the adults, rituals, places, and formats already shaping the moment.",
    plays: strategyPlays.slice(2, 6),
  },
  {
    id: "apply-guardrails",
    number: "03",
    title: "Apply guardrails",
    description: "Make safety visible and measure the usefulness children actually receive.",
    plays: strategyPlays.slice(6, 8),
  },
] as const;

export default function ReachPage() {
  let playIndex = 0;

  return (
    <main className="reach-page">
      <SiteHeader />

      <section className="page-opening reach-opening">
        <p className="reach-kicker">Marketing 101 / established practice</p>
        <h1>Earn participation. Don&apos;t chase attention.</h1>
        <p>These are useful starting points, not our proprietary point of view. Make the value obvious, fit the real-world context, and put the guardrail where people can see it.</p>
      </section>

      <section className="reach-boundaries" aria-label="Non-negotiable privacy and safety boundaries">
        <header>
          <ShieldCheck aria-hidden="true" size={28} strokeWidth={1.8} />
          <div>
            <p className="reach-kicker">Four non-negotiables</p>
            <h2>Safety is part of the idea.</h2>
          </div>
        </header>
        <ul>
          <li>No covert persuasion</li>
          <li>No behavioral targeting of children</li>
          <li>No unnecessary collection of a child&apos;s data</li>
          <li>No child-only path to purchase or public sharing</li>
        </ul>
      </section>

      <div className="reach-stages">
        {strategyStages.map((stage) => (
          <section aria-labelledby={`${stage.id}-title`} className={`reach-stage reach-stage-${stage.id}`} key={stage.id}>
            <header className="reach-stage-heading">
              <span>{stage.number}</span>
              <div>
                <h2 id={`${stage.id}-title`}>{stage.title}</h2>
                <p>{stage.description}</p>
              </div>
              <p>{stage.plays.length} plays</p>
            </header>

            <ol className="reach-play-list">
              {stage.plays.map((play) => {
                const index = playIndex++;
                const relatedInsights = resolveReferences(play.insightIds, insightById).slice(0, 2);
                const relatedSources = resolveReferences(play.sourceIds, sourceById).slice(0, 2);
                const titleId = `${play.id}-title`;

                return (
                  <li key={play.id}>
                    <details
                      aria-labelledby={titleId}
                      className="strategy-play"
                      data-testid={`strategy-play-${play.id}`}
                      id={play.id}
                    >
                      <summary>
                        <span className="strategy-play-title-row">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <span id={titleId}>{play.title}</span>
                          <ChevronDown aria-hidden="true" size={24} />
                        </span>
                      </summary>

                      <div className="reach-play-expanded">
                        <div className="reach-play-summary-grid">
                          <span>
                            <strong>Value for the child</strong>
                            {play.directChildValue}
                          </span>
                          <span>
                            <strong>Best fit</strong>
                            {play.whenAppropriate}
                          </span>
                          <span>
                            <strong>Guardrail</strong>
                            {play.ethicalConstraints[0]}
                          </span>
                        </div>

                        <div className="reach-play-detail-grid">
                          <section>
                            <h3>Formats to try</h3>
                            <ul>
                              {play.formats.slice(0, 2).map((format) => <li key={format}>{format}</li>)}
                            </ul>
                          </section>
                          <section className="reach-play-evidence">
                            <h3>Evidence to open</h3>
                            <div>
                              {relatedInsights.map((insight) => (
                                <Link href={`/insights/${insight.id}` as Route} key={insight.id}>
                                  <span>{insight.title}</span>
                                  <ArrowUpRight aria-hidden="true" size={16} />
                                </Link>
                              ))}
                              {relatedSources.map((source) => (
                                <Link href={`/library/${source.id}` as Route} key={source.id}>
                                  <span>{source.organization}: {source.title}</span>
                                  <ArrowUpRight aria-hidden="true" size={16} />
                                </Link>
                              ))}
                            </div>
                          </section>
                          <section>
                            <h3>Safety check</h3>
                            <ul>
                              {play.ethicalConstraints.slice(0, 2).map((constraint) => <li key={constraint}>{constraint}</li>)}
                            </ul>
                          </section>
                        </div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <aside className="reach-close">
        <p className="reach-kicker">Working standard</p>
        <p>If the child value, adult context, data boundary, and evidence limit are not plain, the idea is not ready.</p>
      </aside>
    </main>
  );
}
