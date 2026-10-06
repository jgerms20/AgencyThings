import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import AnimatedShareBars from "@/components/AnimatedShareBars";
import PopulationCount from "@/components/PopulationCount";
import {
  demographicHeadlineFacts,
  demographicSources,
  demographicSynthesis,
  deeperRoutes,
  generationBoundaryCopy,
  getDemographicSource,
  globalCoverageNote,
  globalRegions,
  globalYouthHeadline,
  usEthnicityContext,
  usPopulationHeadline,
  usRaceAlone,
  usRegions,
  usSexSplit,
  usTopStates,
  youthPopulationHistory,
  youthHistorySource,
} from "@/lib/demographics";

function SourceLink({ sourceId, children }: { sourceId: string; children: React.ReactNode }) {
  const source = getDemographicSource(sourceId);
  if (!source) return null;

  return (
    <a className="demographic-source-link" href={source.url} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight aria-hidden="true" size={15} />
    </a>
  );
}

export default function DemographicOverview() {
  return (
    <>
      <section className="demographic-opening">
        <div className="demographic-opening-copy">
          <p className="demographic-opening-kicker">Gen Alpha Intelligence Lab</p>
          <h1>Who is Gen Alpha?</h1>
          <p>A generation growing up across games, group chats, and shared culture. Understand the people, the places, and the patterns behind their everyday.</p>
          <div className="overview-start"><Link href="/insights">Explore the findings <ArrowUpRight size={18} /></Link><Link href="/summary">The short version <ArrowUpRight size={18} /></Link></div>
        </div>
      </section>
      <section className="overview-context" aria-label="Generation at a glance">
        <div className="demographic-headline-grid">
          {demographicHeadlineFacts.map((fact) => (
            <article data-testid="demographic-headline-fact" key={fact.label}>
              <strong>{fact.value}</strong>
              <h2>{fact.label}</h2>
              <p>{fact.detail}</p>
            </article>
          ))}
        </div>
        <details className="overview-method"><summary>{generationBoundaryCopy.kicker}</summary><p>{generationBoundaryCopy.opening}</p></details>
      </section>

      <section className="demographic-section us-demographic-section" aria-label="U.S. demographic portrait">
        <header className="demographic-us-hero">
          <p className="demographic-section-label">United States</p>
          <PopulationCount
            value={usPopulationHeadline.value}
            display={usPopulationHeadline.display}
            data-testid="us-population-count"
          />
          <p className="demographic-population-disclaimer">{usPopulationHeadline.disclaimer}</p>
        </header>

        <details className="overview-demographic-detail"><summary>Explore the U.S. demographic portrait <ArrowUpRight size={18} /></summary><div className="demographic-us-grid">
          <article className="demographic-measure demographic-measure-sex">
            <header>
              <h3>Sex</h3>
              <p>Census binary sex categories in the July 2024 ages 0–14 estimate.</p>
            </header>
            <AnimatedShareBars items={usSexSplit} color="acid" />
            <SourceLink sourceId="census-age-sex">Census age and sex data</SourceLink>
          </article>

          <article className="demographic-measure demographic-measure-regions">
            <header>
              <h3>Where they live</h3>
              <p>Share of the U.S. ages 0–14 population by Census region.</p>
            </header>
            <AnimatedShareBars items={usRegions} color="cyan" />
            <div className="demographic-state-pair">
              {usTopStates.map((state) => (
                <div key={state.label}>
                  <span>{state.label}</span>
                  <strong>{state.value}</strong>
                  <p>{state.share}% of the U.S. under-15 population</p>
                </div>
              ))}
            </div>
            <p className="demographic-measure-note">California and Texas together account for about 22% of the U.S. under-15 population.</p>
            <SourceLink sourceId="census-states">Census state data</SourceLink>
          </article>

          <article className="demographic-measure demographic-measure-race">
            <header>
              <h3>Race alone</h3>
              <p>Six mutually exclusive race-alone categories that add to 100% after rounding.</p>
            </header>
            <AnimatedShareBars items={usRaceAlone} color="violet" />
            <SourceLink sourceId="census-race">Census race and Hispanic-origin data</SourceLink>
          </article>

          <article className="demographic-measure demographic-measure-ethnicity">
            <header>
              <h3>Hispanic origin</h3>
              <p>Reported separately from race — these figures do not form another 100% split.</p>
            </header>
            <AnimatedShareBars items={usEthnicityContext} color="coral" />
            <p className="demographic-measure-note">Keep race and Hispanic origin separate when presenting this portrait.</p>
          </article>
        </div></details>
      </section>

      <section className="demographic-section global-demographic-section" aria-label="Global snapshot">
        <header className="global-demographic-opening">
          <div>
            <p className="demographic-section-label">Global</p>
            <h2>Put the geography in perspective.</h2>
          </div>
          <div className="global-total">
            <PopulationCount
              value={globalYouthHeadline.value}
              display={globalYouthHeadline.display}
              className="global-population-count"
              data-testid="global-population-count"
            />
            <span>{globalYouthHeadline.detail}</span>
            <strong className="global-youth-share">24.7% <small>of the world</small></strong>
          </div>
        </header>
        <div className="global-age-comparison" aria-label="World population by age in 2024">
          <div className="global-age-bar" aria-hidden="true"><i /><i /><i /></div>
          <div className="global-age-legend">
            <span><b>0–14</b><strong>24.7%</strong></span>
            <span><b>15–64</b><strong>65.1%</strong></span>
            <span><b>65+</b><strong>10.2%</strong></span>
          </div>
          <p>Age bands, not exact generations. <a href="https://data.worldbank.org/indicator/SP.POP.0014.TO.ZS" target="_blank" rel="noreferrer">World Bank 2024 data <ArrowUpRight size={14} aria-hidden="true" /></a></p>
        </div>
        <section className="population-history" aria-label="North American share of children over time">
          <h3>North America's share of the world's children</h3>
          <p>Ages 0–14 in each year. Same age range, different points in history.</p>
          <div className="population-history-chart">{youthPopulationHistory.map((point) => {
            const share = point.northAmerica / point.world * 100;
            return <div key={point.year}><span>{point.year}</span><div className="history-track" aria-hidden="true"><i style={{ width: `${share / 6 * 100}%` }} /></div><strong>{share.toFixed(2)}%</strong></div>;
          })}</div>
          <p className="history-reading">The recent difference is modest: <strong>0.25 percentage points since 2010.</strong> Most of the long-run change predates Gen Alpha.</p>
          <details><summary>How this compares with past generations</summary><p>The 1965 snapshot covers births roughly 1951–1965, the 1980 snapshot roughly 1966–1980, 1995 roughly 1981–1995, 2010 roughly 1996–2010, and 2024 roughly 2010–2024. These overlap familiar generation labels but are fixed-age snapshots, not exact cohort totals.</p><p>World Bank North America means the U.S., Canada, and Bermuda; Mexico is in Latin America and the Caribbean. Share = regional under-15 population divided by the world under-15 population.</p><a href={youthHistorySource} target="_blank" rel="noreferrer">View the historical data <ArrowUpRight size={15} /></a></details>
        </section>
        <details className="overview-demographic-detail"><summary>See the regional breakdown <ArrowUpRight size={18} /></summary><div className="global-demographic-body">
          <AnimatedShareBars
            items={globalRegions}
            color="acid"
            showCounts
            highlightLabel="North America"
            variant="global"
          />
          <aside>
            <h3>What is intentionally absent</h3>
            <p>{globalCoverageNote}</p>
            <SourceLink sourceId="world-population">World Bank age 0–14 data</SourceLink>
          </aside>
        </div></details>
      </section>

      <section className="demographic-section demographic-synthesis" aria-label="Demographic insight">
        <div className="demographic-synthesis-box">
          <p className="demographic-section-label">Insight</p>
          <h2>{demographicSynthesis.title}</h2>
          <p>{demographicSynthesis.body}</p>
        </div>
      </section>

      <section className="demographic-section demographic-next" aria-label="Continue into the Lab">
        <header>
          <h2>From who they are to how they live.</h2>
          <p>Demographics establish the population. The rest of the Lab handles behavior, culture, comparison, and evidence.</p>
        </header>
        <div className="demographic-next-grid">
          {deeperRoutes.map((route) => (
            <Link data-testid="deeper-route" href={route.href as Route} key={route.href} aria-label={route.action}>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <span>{route.action}<ArrowUpRight aria-hidden="true" size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="demographic-source-index">
        <p>Demographic sources used on this page</p>
        <div>
          {demographicSources.map((source) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
              <span>{source.publisher} / {source.date}</span>
              <strong>{source.title}</strong>
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
