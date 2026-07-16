"use client";

import { ChevronDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { getInsightsForTheme, themes } from "@/lib/content/insights";
import type { Theme } from "@/lib/content/types";

const toneByTheme = {
  "play-belonging": "acid",
  "media-influence": "coral",
  "time-routines": "cyan",
  "learning-becoming": "violet",
} as const;

export default function InsightDirectory() {
  const [openInsightByTheme, setOpenInsightByTheme] = useState<Partial<Record<Theme["id"], string>>>({});

  const toggleInsight = (themeId: Theme["id"], insightId: string) => {
    setOpenInsightByTheme((current) => ({
      ...current,
      [themeId]: current[themeId] === insightId ? undefined : insightId,
    }));
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
            {getInsightsForTheme(theme.id).map((insight) => {
              const isOpen = openInsightByTheme[theme.id] === insight.id;
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
                      onClick={() => toggleInsight(theme.id, insight.id)}
                      type="button"
                    >
                      <span>{String(insight.sequence).padStart(2, "0")}</span>
                      <span id={titleId}>{insight.title}</span>
                      <ChevronDown aria-hidden="true" size={22} />
                    </button>
                  </h3>
                  {isOpen ? (
                    <div aria-labelledby={titleId} className="insight-directory-detail" id={panelId} role="region">
                      <p>{insight.interpretation}</p>
                      <p><strong>Nuance:</strong> {insight.nuance}</p>
                      <p><strong>Confidence:</strong> {insight.confidence}</p>
                      <Link href={`/insights/${insight.id}` as Route} aria-label={`Explore full detail: ${insight.title}`}>
                        Explore full detail <ArrowUpRight aria-hidden="true" size={18} />
                      </Link>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
