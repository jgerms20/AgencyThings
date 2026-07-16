"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useRef, useState } from "react";
import { getEvidenceForInsight } from "@/lib/content/selectors";
import {
  getOverviewInsightsForTheme,
  overviewTabs,
  type OverviewThemeId,
} from "@/lib/editorial";

export default function InsightTabs() {
  const [activeTab, setActiveTab] = useState<OverviewThemeId>(overviewTabs[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = overviewTabs.find((tab) => tab.id === activeTab) ?? overviewTabs[0];
  const insights = getOverviewInsightsForTheme(active.id);
  const leadInsight = insights[0];
  const leadEvidence = getEvidenceForInsight(leadInsight.id)[0];
  const supportingInsights = insights.slice(1, 5);
  const evidenceCount = insights.reduce(
    (count, insight) => count + getEvidenceForInsight(insight.id).length,
    0,
  );

  const selectTab = (index: number) => {
    const nextIndex = (index + overviewTabs.length) % overviewTabs.length;
    const nextTab = overviewTabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className={`insight-tabs insight-tabs-${active.tone}`} aria-label="Gen Alpha insight themes">
      <div className="insight-tab-list" role="tablist" aria-label="Insight themes">
        {overviewTabs.map((tab, index) => (
          <button
            aria-controls={`insight-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            id={`insight-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") selectTab(index + 1);
              else if (event.key === "ArrowLeft") selectTab(index - 1);
              else if (event.key === "Home") selectTab(0);
              else if (event.key === "End") selectTab(overviewTabs.length - 1);
              else return;
              event.preventDefault();
            }}
            ref={(node) => { tabRefs.current[index] = node; }}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`insight-tab-${active.id}`}
        className="insight-tab-panel"
        id={`insight-panel-${active.id}`}
        role="tabpanel"
      >
        <p className="insight-tab-thesis">{leadInsight.title}</p>
        <div className="insight-tab-items">
          <article data-testid="lead-evidence">
            <span>Lead</span>
            <h2>{leadEvidence.claim}</h2>
            <p>{leadInsight.interpretation}</p>
            <Link href={leadInsight.href as Route} aria-label={`Explore ${leadInsight.title}`}>
              <ArrowUpRight aria-hidden="true" size={20} />
            </Link>
          </article>
          {supportingInsights.map((insight) => (
            <article data-testid="supporting-insight" key={insight.id}>
              <span>{insight.number}</span>
              <h2>{insight.title}</h2>
              <p>{insight.interpretation}</p>
              <Link href={insight.href as Route} aria-label={`Explore ${insight.title}`}>
                <ArrowUpRight aria-hidden="true" size={20} />
              </Link>
            </article>
          ))}
        </div>
        <p>{evidenceCount} evidence items across 10 insights.</p>
        <Link className="text-link" href={`/insights#${active.id}`}>
          View all 10 {active.label} insights <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
