import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getInsightsForTab, insightTabs } from "@/lib/editorial";

export default function InsightsPage() {
  return (
    <main className="insights-page">
      <SiteHeader active="insights" />
      <section className="page-opening insights-opening">
        <h1>Ten truths shaping Gen Alpha now.</h1>
        <p>Four connected systems explain more than a list of platforms ever could. Open any truth for its evidence and implications.</p>
      </section>

      <div className="insight-directory">
        {insightTabs.map((tab) => (
          <section className={`insight-cluster insight-cluster-${tab.tone}`} key={tab.id}>
            <header>
              <h2>{tab.label}</h2>
              <p>{tab.thesis}</p>
            </header>
            <div>
              {getInsightsForTab(tab.id).map((insight) => (
                <article data-testid="insight-directory-item" key={insight.id}>
                  <span>{insight.number}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.interpretation}</p>
                  <Link href={insight.href as Route} aria-label={`Explore ${insight.title}`}>
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
