import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { cultureShapers } from "@/lib/content/culture-shapers";
import { insights } from "@/lib/content/insights";
import { sources } from "@/lib/content/sources";
import { spaces } from "@/lib/content/spaces";
import { strategyPlays } from "@/lib/content/strategy";

const insightById = new Map(insights.map((insight) => [insight.id, insight]));
const sourceById = new Map(sources.map((source) => [source.id, source]));
const spaceById = new Map(spaces.map((space) => [space.id, space]));
const cultureShaperById = new Map(cultureShapers.map((shaper) => [shaper.id, shaper]));
const resolveReferences = <T,>(ids: string[] | undefined, entityById: Map<string, T>): T[] =>
  Array.isArray(ids) ? ids.flatMap((id) => {
    const entity = entityById.get(id);
    return entity ? [entity] : [];
  }) : [];

export default function ReachPage() {
  return (
    <main className="reach-page">
      <SiteHeader />

      <section className="page-opening reach-opening">
        <p className="reach-kicker">Responsible agency strategy</p>
        <h1>Reach children responsibly, with value they can use.</h1>
        <p>Start with a real role for the child, a legible decision for the adult, and evidence that names its limits. Attention is not the value exchange.</p>
      </section>

      <section className="reach-boundaries" aria-label="Non-negotiable privacy and safety boundaries">
        <header>
          <ShieldCheck aria-hidden="true" size={32} strokeWidth={1.8} />
          <div>
            <p className="reach-kicker">Before any play</p>
            <h2>Boundaries are part of the proposition.</h2>
          </div>
        </header>
        <ul>
          <li><strong>No covert persuasion.</strong><span>Children should know when a brand, sponsor, or commercial interest is present.</span></li>
          <li><strong>No behavioral targeting of children.</strong><span>Contextual placement is not permission to build a persuasion profile.</span></li>
          <li><strong>No unnecessary collection of a child&apos;s data.</strong><span>Use the minimum needed, keep defaults private, and make deletion real.</span></li>
          <li><strong>No child-only path to purchase or public sharing.</strong><span>Put adult consent where the consequential decision actually happens.</span></li>
        </ul>
      </section>

      <nav className="reach-index" aria-label="Eight strategy plays">
        {strategyPlays.map((play, index) => (
          <a href={`#${play.id}`} key={play.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {play.title}
          </a>
        ))}
      </nav>

      <ol className="reach-play-list">
        {strategyPlays.map((play, index) => {
          const relatedInsights = resolveReferences(play.insightIds, insightById);
          const relatedSources = resolveReferences(play.sourceIds, sourceById);
          const relatedSpaces = resolveReferences(play.relatedSpaceIds, spaceById);
          const relatedShapers = resolveReferences(play.relatedCultureShaperIds, cultureShaperById);
          const titleId = `${play.id}-title`;

          return (
            <li key={play.id}>
              <article
                aria-labelledby={titleId}
                className="strategy-play"
                data-testid="strategy-play"
                id={play.id}
                role="region"
              >
                <header className="strategy-play-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="reach-kicker">Strategy play</p>
                    <h2 id={titleId}>{play.title}</h2>
                  </div>
                  <p><strong>When it fits</strong>{play.whenAppropriate}</p>
                </header>

                <div className="strategy-context">
                  <section>
                    <h3>Audience and age context</h3>
                    <p>{play.ageContext}</p>
                  </section>
                  <section className="strategy-child-value">
                    <h3>Direct value for the child</h3>
                    <p>{play.directChildValue}</p>
                  </section>
                  <section className="strategy-adult-context">
                    <h3>Adult and household decision context</h3>
                    <p>{play.adultDecisionContext}</p>
                  </section>
                </div>

                <section className="strategy-evidence">
                  <div>
                    <p className="reach-kicker">Evidence rationale</p>
                    <p>{play.evidenceRationale}</p>
                  </div>
                  <div className="strategy-evidence-links">
                    <h3>Supporting insights</h3>
                    {relatedInsights.map((insight) => (
                      <Link href={`/insights/${insight.id}` as Route} key={insight.id}>
                        <span>{insight.title}</span>
                        <ArrowUpRight aria-hidden="true" size={16} />
                      </Link>
                    ))}
                    <h3>Source records</h3>
                    {relatedSources.map((source) => (
                      <Link href={`/library/${source.id}` as Route} key={source.id}>
                        <span>{source.organization}: {source.title}</span>
                        <ArrowUpRight aria-hidden="true" size={16} />
                      </Link>
                    ))}
                  </div>
                </section>

                <div className="strategy-practice">
                  <section>
                    <h3>Useful formats</h3>
                    <ul>{play.formats.map((format) => <li key={format}>{format}</li>)}</ul>
                  </section>
                  <section>
                    <h3>Failure modes</h3>
                    <ul>{play.failureModes.map((failure) => <li key={failure}>{failure}</li>)}</ul>
                  </section>
                  <section className="strategy-ethics">
                    <h3>Ethical constraints</h3>
                    <ul>{play.ethicalConstraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
                  </section>
                </div>

                <footer className="strategy-relations">
                  <div>
                    <h3>Related spaces</h3>
                    <div>
                      {relatedSpaces.map((space) => (
                        <Link href={`/spaces#${space.id}` as Route} key={space.id}>
                          {space.name}<ArrowUpRight aria-hidden="true" size={15} />
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3>Related culture shapers</h3>
                    <div>
                      {relatedShapers.map((shaper) => (
                        <Link href={`/influencers/${shaper.id}` as Route} key={shaper.id}>
                          {shaper.name}<ArrowUpRight aria-hidden="true" size={15} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </footer>
              </article>
            </li>
          );
        })}
      </ol>

      <aside className="reach-close">
        <p className="reach-kicker">Working standard</p>
        <p>If the idea cannot explain its child value, adult decision context, data boundary, and evidence limit in plain language, it is not ready to reach them.</p>
      </aside>

      <style>{`
        .reach-page { min-height: 100vh; }
        .reach-kicker { color: var(--acid); font-size: .7rem; font-weight: 900; letter-spacing: 0; text-transform: uppercase; }
        .reach-opening { min-height: 500px; background: var(--violet); color: #090a09; }
        .reach-opening .reach-kicker { align-self: start; color: #090a09; }
        .reach-opening > p:last-child { color: #29232f; font-weight: 700; }
        .reach-boundaries { display: grid; grid-template-columns: minmax(260px, .65fr) minmax(0, 1.35fr); border-bottom: 1px solid var(--line); background: var(--paper); }
        .reach-boundaries > header { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 20px; align-content: start; padding: 42px 32px; border-right: 1px solid var(--line); }
        .reach-boundaries svg { color: var(--acid); }
        .reach-boundaries h2 { max-width: 520px; margin-top: 12px; font-size: 2.25rem; line-height: 1; }
        .reach-boundaries ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; }
        .reach-boundaries li { min-height: 155px; padding: 30px 32px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .reach-boundaries li:nth-child(2n) { border-right: 0; }
        .reach-boundaries li:nth-last-child(-n + 2) { border-bottom: 0; }
        .reach-boundaries strong, .reach-boundaries span { display: block; }
        .reach-boundaries strong { font-size: 1rem; }
        .reach-boundaries span { margin-top: 12px; color: var(--muted); font-size: .83rem; line-height: 1.45; }
        .reach-index { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--line); }
        .reach-index a { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 10px; min-height: 112px; padding: 22px 18px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: .78rem; font-weight: 900; line-height: 1.32; }
        .reach-index a:nth-child(4n) { border-right: 0; }
        .reach-index a:nth-last-child(-n + 4) { border-bottom: 0; }
        .reach-index span { color: var(--coral); font-size: .66rem; }
        .reach-index a:hover, .reach-index a:focus-visible { background: var(--acid); color: #090a09; outline: none; }
        .reach-play-list { margin: 0; padding: 0; list-style: none; }
        .strategy-play { scroll-margin-top: 74px; border-bottom: 1px solid #090a09; background: var(--acid); color: #090a09; }
        .reach-play-list > li:nth-child(4n + 2) .strategy-play { background: var(--cyan); }
        .reach-play-list > li:nth-child(4n + 3) .strategy-play { background: var(--coral); }
        .reach-play-list > li:nth-child(4n) .strategy-play { background: var(--violet); }
        .strategy-play-heading { display: grid; grid-template-columns: 54px minmax(260px, 1.25fr) minmax(260px, .75fr); gap: 26px; align-items: start; min-height: 290px; padding: 52px 32px; border-bottom: 1px solid #090a09; }
        .strategy-play-heading > span { font-size: .72rem; font-weight: 900; }
        .strategy-play-heading .reach-kicker { color: #090a09; }
        .strategy-play-heading h2 { max-width: 820px; margin-top: 18px; font-size: 3.75rem; line-height: .94; }
        .strategy-play-heading > p { max-width: 560px; font-size: 1rem; font-weight: 700; line-height: 1.5; }
        .strategy-play-heading > p strong { display: block; margin-bottom: 12px; font-size: .68rem; text-transform: uppercase; }
        .strategy-context { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid #090a09; }
        .strategy-context section { min-height: 245px; padding: 30px 32px; border-right: 1px solid #090a09; }
        .strategy-context section:last-child { border-right: 0; }
        .strategy-context h3, .strategy-practice h3, .strategy-relations h3, .strategy-evidence-links h3 { font-size: .68rem; text-transform: uppercase; }
        .strategy-context p { margin-top: 52px; font-size: 1rem; font-weight: 800; line-height: 1.48; }
        .strategy-child-value { background: #f5f5ec; }
        .strategy-adult-context { background: #090a09; color: #f5f5ec; }
        .strategy-evidence { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr); border-bottom: 1px solid #090a09; }
        .strategy-evidence > div { padding: 36px 32px; }
        .strategy-evidence > div:first-child { border-right: 1px solid #090a09; }
        .strategy-evidence .reach-kicker { color: #090a09; }
        .strategy-evidence > div:first-child > p:last-child { max-width: 900px; margin-top: 22px; font-size: 1.25rem; font-weight: 900; line-height: 1.4; }
        .strategy-evidence-links h3 { margin: 4px 0 10px; }
        .strategy-evidence-links h3:not(:first-child) { margin-top: 24px; }
        .strategy-evidence-links a { display: grid; grid-template-columns: minmax(0, 1fr) 18px; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid #090a09; font-size: .78rem; font-weight: 900; line-height: 1.35; }
        .strategy-evidence-links a:hover, .strategy-evidence-links a:focus-visible { background: #f5f5ec; outline: 4px solid #f5f5ec; }
        .strategy-practice { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid #090a09; }
        .strategy-practice section { min-height: 300px; padding: 32px; border-right: 1px solid #090a09; }
        .strategy-practice section:last-child { border-right: 0; }
        .strategy-practice ul { margin: 28px 0 0; padding: 0; list-style: none; }
        .strategy-practice li { padding: 11px 0; border-top: 1px solid #090a09; font-size: .88rem; font-weight: 800; line-height: 1.4; }
        .strategy-ethics { background: #090a09; color: #f5f5ec; }
        .strategy-ethics li { border-color: #696b61; }
        .strategy-relations { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .strategy-relations > div { padding: 26px 32px 32px; }
        .strategy-relations > div:first-child { border-right: 1px solid #090a09; }
        .strategy-relations > div > div { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 18px; }
        .strategy-relations a { display: inline-flex; gap: 5px; align-items: center; border-bottom: 1px solid #090a09; padding-bottom: 4px; font-size: .76rem; font-weight: 900; }
        .strategy-relations a:hover, .strategy-relations a:focus-visible { background: #f5f5ec; outline: 3px solid #f5f5ec; }
        .reach-close { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 42px; padding: 72px 32px 90px; }
        .reach-close > p:last-child { max-width: 1000px; font-size: 2rem; font-weight: 900; line-height: 1.25; }
        @media (max-width: 1000px) {
          .reach-index { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .reach-index a:nth-child(2n) { border-right: 0; }
          .reach-index a:nth-child(4n) { border-right: 0; }
          .reach-index a:nth-last-child(-n + 4) { border-bottom: 1px solid var(--line); }
          .reach-index a:nth-last-child(-n + 2) { border-bottom: 0; }
          .strategy-play-heading { grid-template-columns: 44px minmax(0, 1fr); }
          .strategy-play-heading > p { grid-column: 2; }
          .strategy-play-heading h2 { font-size: 3.2rem; }
        }
        @media (max-width: 700px) {
          .reach-opening { min-height: 430px; padding-top: 62px; padding-bottom: 44px; }
          .reach-boundaries { grid-template-columns: 1fr; }
          .reach-boundaries > header { border-right: 0; border-bottom: 1px solid var(--line); padding-right: 18px; padding-left: 18px; }
          .reach-boundaries ul { grid-template-columns: 1fr; }
          .reach-boundaries li, .reach-boundaries li:nth-child(2n), .reach-boundaries li:nth-last-child(-n + 2) { min-height: 0; border-right: 0; border-bottom: 1px solid var(--line); padding: 25px 18px; }
          .reach-boundaries li:last-child { border-bottom: 0; }
          .reach-index a { min-height: 120px; padding-right: 14px; padding-left: 14px; }
          .strategy-play-heading { grid-template-columns: 32px minmax(0, 1fr); gap: 16px; min-height: 0; padding: 42px 18px; }
          .strategy-play-heading > p { grid-column: 1 / -1; margin-top: 18px; }
          .strategy-play-heading h2 { font-size: 2.5rem; }
          .strategy-context, .strategy-practice, .strategy-evidence, .strategy-relations { grid-template-columns: 1fr; }
          .strategy-context section, .strategy-practice section, .strategy-evidence > div, .strategy-relations > div { min-height: 0; border-right: 0; border-bottom: 1px solid #090a09; padding: 28px 18px; }
          .strategy-context section:last-child, .strategy-practice section:last-child, .strategy-evidence > div:last-child, .strategy-relations > div:last-child { border-bottom: 0; }
          .strategy-evidence > div:first-child, .strategy-relations > div:first-child { border-right: 0; }
          .strategy-context p { margin-top: 24px; }
          .reach-close { grid-template-columns: 1fr; gap: 18px; padding: 58px 18px 72px; }
          .reach-close > p:last-child { font-size: 1.55rem; }
        }
        @media (max-width: 420px) {
          .reach-index { grid-template-columns: 1fr; }
          .reach-index a, .reach-index a:nth-child(2n), .reach-index a:nth-last-child(-n + 2) { min-height: 0; border-right: 0; border-bottom: 1px solid var(--line); }
          .reach-index a:last-child { border-bottom: 0; }
          .strategy-play-heading h2 { font-size: 2.15rem; }
        }
      `}</style>
    </main>
  );
}
