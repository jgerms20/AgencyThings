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
          <p className="demographic-opening-kicker">{generationBoundaryCopy.kicker}</p>
          <h1>Who is Gen Alpha?</h1>
          <p>{generationBoundaryCopy.opening}</p>
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
        <header className="demographic-us-hero">
          <p className="demographic-section-label">United States</p>
          <PopulationCount
            value={usPopulationHeadline.value}
            display={usPopulationHeadline.display}
            data-testid="us-population-count"
          />
          <p className="demographic-population-disclaimer">{usPopulationHeadline.disclaimer}</p>
        </header>

        <div className="demographic-us-grid">
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
        </div>
      </section>

      <section className="demographic-section global-demographic-section" aria-label="Global snapshot">
        <header className="global-demographic-opening">
          <div>
            <p className="demographic-section-label">Global</p>
            <h2>The world’s youth population is larger — and unevenly distributed.</h2>
          </div>
          <div className="global-total">
            <PopulationCount
              value={globalYouthHeadline.value}
              display={globalYouthHeadline.display}
              className="global-population-count"
              data-testid="global-population-count"
            />
            <span>{globalYouthHeadline.detail}</span>
          </div>
        </header>
        <div className="global-demographic-body">
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
        </div>
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
