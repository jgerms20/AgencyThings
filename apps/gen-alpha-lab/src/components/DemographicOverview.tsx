import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import {
  demographicHeadlineFacts,
  demographicSources,
  deeperRoutes,
  getDemographicSource,
  globalCoverageNote,
  globalRegions,
  olderTeenIdentity,
  usEthnicityContext,
  usRaceAlone,
  usRegions,
  usSexSplit,
  usTopStates,
  type DemographicShare,
} from "@/lib/demographics";

type ProportionBarsProps = {
  items: readonly DemographicShare[];
  color?: "acid" | "cyan" | "coral" | "violet";
};

function ProportionBars({ items, color = "acid" }: ProportionBarsProps) {
  return (
    <div className={`demographic-bars demographic-bars-${color}`}>
      {items.map((item) => (
        <div className="demographic-bar-row" key={item.label}>
          <div className="demographic-bar-label">
            <span>{item.label}</span>
            <strong>{item.value.toFixed(item.value % 1 === 0 ? 0 : 1)}%</strong>
          </div>
          <div className="demographic-bar-track" aria-hidden="true">
            <span style={{ width: `${item.value}%` }} />
          </div>
          {item.detail ? <p>{item.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}

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
          <h1>Who is Gen Alpha?</h1>
          <p>
            This Lab uses 2010–2024 as a working definition. Generation boundaries are conventions, not an official Census category—so the cleanest opening portrait uses age-based population data and says exactly where each measure stops.
          </p>
        </div>

        <div className="demographic-age-rail" aria-label="Gen Alpha working birth-year range from 2010 to 2024">
          <div className="demographic-age-track" aria-hidden="true">
            <span />
            <i />
            <b />
          </div>
          <div className="demographic-age-labels">
            <p><strong>2010</strong><span>Oldest edge</span></p>
            <p><strong>2017</strong><span>Middle of the span</span></p>
            <p><strong>2024</strong><span>Youngest edge</span></p>
          </div>
        </div>

        <div className="demographic-headline-grid">
          {demographicHeadlineFacts.map((fact) => (
            <article data-testid="demographic-headline-fact" key={fact.label}>
              <strong>{fact.value}</strong>
              <h2>{fact.label}</h2>
              <p>{fact.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demographic-section us-demographic-section" aria-label="U.S. demographic portrait">
        <header className="demographic-section-heading">
          <div>
            <p className="demographic-section-label">United States / primary view</p>
            <h2>59.7 million young people, seen before interpreted.</h2>
          </div>
          <p>
            The July 2024 Census estimate counted 59,698,140 U.S. residents ages 0–14. That is the closest clean population proxy for the Lab’s 2010–2024 cohort at that date—not a custom official count of “Gen Alpha.”
          </p>
        </header>

        <div className="demographic-us-grid">
          <article className="demographic-measure demographic-measure-sex">
            <header>
              <h3>Sex in the population estimate</h3>
              <p>Census binary sex categories, not a complete measure of gender identity.</p>
            </header>
            <ProportionBars items={usSexSplit} color="acid" />
            <SourceLink sourceId="census-age-sex">Census age and sex data</SourceLink>
          </article>

          <article className="demographic-measure demographic-measure-regions">
            <header>
              <h3>Where they live</h3>
              <p>Share of the U.S. ages 0–14 population by Census region.</p>
            </header>
            <ProportionBars items={usRegions} color="cyan" />
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
              <h3>Race, shown as race alone</h3>
              <p>These six mutually exclusive race-alone categories add to 100% after rounding.</p>
            </header>
            <ProportionBars items={usRaceAlone} color="violet" />
            <SourceLink sourceId="census-race">Census race and Hispanic-origin data</SourceLink>
          </article>

          <article className="demographic-measure demographic-measure-ethnicity">
            <header>
              <h3>Hispanic origin is a separate lens</h3>
              <p>Hispanic or Latino origin can be reported with any race, so these figures do not form another 100% split.</p>
            </header>
            <ProportionBars items={usEthnicityContext} color="coral" />
            <p className="demographic-measure-note">Keep race and Hispanic origin separate when presenting this portrait.</p>
          </article>
        </div>
      </section>

      <section className="demographic-section demographic-identity-section" aria-label="Older edge identity data">
        <header className="demographic-section-heading compact">
          <div>
            <p className="demographic-section-label">Identity / careful scope</p>
            <h2>Identity data exists only for the older edge.</h2>
          </div>
          <p>{olderTeenIdentity.scope}. It should not be applied to younger children or treated as a full-generation estimate.</p>
        </header>

        <details className="demographic-disclosure">
          <summary>
            <span>
              <strong>Older edge only</strong>
              <small>Open the 2023 national YRBS snapshot</small>
            </span>
            <ChevronDown aria-hidden="true" size={24} />
          </summary>
          <div className="demographic-disclosure-content">
            <article>
              <h3>Sexual identity</h3>
              <ProportionBars items={olderTeenIdentity.sexualIdentity} color="coral" />
              <SourceLink sourceId="cdc-sexual-identity">CDC survey and methods</SourceLink>
            </article>
            <article>
              <h3>Gender identity</h3>
              <ProportionBars items={olderTeenIdentity.genderIdentity} color="cyan" />
              <SourceLink sourceId="cdc-gender-identity">CDC gender-identity analysis</SourceLink>
            </article>
          </div>
        </details>
      </section>

      <section className="demographic-section global-demographic-section" aria-label="Global snapshot">
        <header className="global-demographic-opening">
          <div>
            <p className="demographic-section-label">Global / separate universe</p>
            <h2>The global story is larger—and much younger in some regions.</h2>
          </div>
          <div className="global-total">
            <strong>2.01 billion</strong>
            <span>people ages 0–14 worldwide in 2024</span>
          </div>
        </header>
        <div className="global-demographic-body">
          <ProportionBars items={globalRegions} color="acid" />
          <aside>
            <h3>What is intentionally absent</h3>
            <p>{globalCoverageNote}</p>
            <SourceLink sourceId="world-population">World Bank age 0–14 data</SourceLink>
          </aside>
        </div>
      </section>

      <section className="demographic-section demographic-next" aria-label="Continue into the Lab">
        <header>
          <h2>Now move from who they are to how life feels.</h2>
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
