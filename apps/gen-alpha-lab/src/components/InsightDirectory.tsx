"use client";

import { ChevronDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { getFeaturedInsightsForTheme, getInsightsForTheme, themes } from "@/lib/content/insights";

const toneByTheme = {
  "play-belonging": "acid",
  "media-influence": "coral",
  "time-routines": "cyan",
  "learning-becoming": "violet",
} as const;

export default function InsightDirectory() {
  const [openInsightIds, setOpenInsightIds] = useState<Set<string>>(() => new Set());

  const toggleInsight = (insightId: string) => {
    setOpenInsightIds((current) => {
      const next = new Set(current);
      if (next.has(insightId)) {
        next.delete(insightId);
      } else {
        next.add(insightId);
      }
      return next;
    });
  };

  return (
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
          <div className="insight-cluster-list">
            {getFeaturedInsightsForTheme(theme.id).map((insight) => {
              const isOpen = openInsightIds.has(insight.id);
              const triggerId = `insight-trigger-${insight.id}`;
              const titleId = `insight-title-${insight.id}`;
              const panelId = `insight-panel-${insight.id}`;

              return (
                <article data-testid="insight-directory-item" key={insight.id}>
                  <h3>
                    <button
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      aria-labelledby={titleId}
                      className="insight-directory-trigger"
                      id={triggerId}
                      onClick={() => toggleInsight(insight.id)}
                      type="button"
                    >
                      <span>{String(insight.sequence).padStart(2, "0")}</span>
                      <span id={titleId}>{insight.title}</span>
                      <ChevronDown aria-hidden="true" size={22} />
                    </button>
                  </h3>
                  <div
                    aria-labelledby={titleId}
                    className="insight-directory-detail"
                    hidden={!isOpen}
                    id={panelId}
                    role="region"
                  >
                    <p className="insight-directory-lede">{insight.interpretation}</p>
                    <Link href={`/insights/${insight.id}` as Route} aria-label={`Explore full detail: ${insight.title}`}>
                      Explore full detail <ArrowUpRight aria-hidden="true" size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
            <aside className="insight-cluster-pocket" aria-label={`${theme.title} further reading`}>
              <p>Also in this theme</p>
              <ul>
                {getInsightsForTheme(theme.id).filter((insight) => !insight.featured).map((insight) => (
                  <li data-testid="insight-directory-pocket" key={insight.id}>
                    <Link href={`/insights/${insight.id}` as Route}>{insight.title}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      ))}
    </div>
  );
}
