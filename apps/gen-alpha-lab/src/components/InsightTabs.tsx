"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { getInsightsForTab, insightTabs, type InsightTabId } from "@/lib/editorial";

export default function InsightTabs() {
  const [activeTab, setActiveTab] = useState<InsightTabId>(insightTabs[0].id);
  const active = insightTabs.find((tab) => tab.id === activeTab) ?? insightTabs[0];
  const insights = getInsightsForTab(active.id);

  return (
    <section className={`insight-tabs insight-tabs-${active.tone}`} aria-label="Gen Alpha insight themes">
      <div className="insight-tab-list" role="tablist" aria-label="Insight themes">
        {insightTabs.map((tab) => (
          <button
            aria-controls={`insight-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            id={`insight-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
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
        <p className="insight-tab-thesis">{active.thesis}</p>
        <div className="insight-tab-items">
          {insights.map((insight) => (
            <article data-testid="editorial-insight" key={insight.id}>
              <span>{insight.number}</span>
              <h2>{insight.title}</h2>
              <p>{insight.interpretation}</p>
              <Link href={insight.href as Route} aria-label={`Explore ${insight.title}`}>
                <ArrowUpRight aria-hidden="true" size={20} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
