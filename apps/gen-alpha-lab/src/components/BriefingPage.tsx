"use client";

import { ArrowUpRight, Presentation, Printer } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { briefingSlides, validityLadder } from "@/lib/briefing";

export default function BriefingPage() {
  return (
    <main className="briefing-page research-page">
      <SiteHeader active="briefing" />
      <section className="research-opening briefing-opening">
        <div>
          <p className="research-kicker">Presentation mode / six conclusions</p>
          <h1>The room, in six briefing slides.</h1>
        </div>
        <div className="briefing-opening-copy">
          <p>A talk-ready synthesis of what the objects reveal, with a sentence to say aloud and a direct path back to the underlying insight.</p>
          <button type="button" onClick={() => window.print()} aria-label="Print or save briefing">
            <Printer aria-hidden="true" size={18} /> Print / save PDF
          </button>
        </div>
      </section>

      <section className="briefing-deck" aria-label="Six headline insights">
        {briefingSlides.map((slide) => (
          <article className="briefing-slide" data-testid="briefing-slide" key={slide.number}>
            <div className="briefing-slide-number">
              <span>{slide.number}</span>
              <Presentation aria-hidden="true" size={22} />
            </div>
            <div className="briefing-slide-copy">
              <p>{slide.title}</p>
              <h2>{slide.headline}</h2>
              <p>{slide.explanation}</p>
              <blockquote><span>Say it this way</span>“{slide.sayIt}”</blockquote>
            </div>
            <aside className="briefing-slide-proof">
              <dl>
                <div><dt>Confidence</dt><dd>{slide.confidence}</dd></div>
                <div><dt>Evidence class</dt><dd>{slide.evidence}</dd></div>
                <div><dt>Source anchors</dt><dd>{slide.sourceNames.join(" + ")}</dd></div>
              </dl>
              <Link href={`/insights/${slide.insightId}`} aria-label={`Open exact insight: ${slide.headline}`}>
                Open exact insight <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            </aside>
          </article>
        ))}
      </section>

      <section className="validity-ladder" role="region" aria-label="Evidence validity ladder">
        <header>
          <p>Source discipline / validity versus opinion</p>
          <h2>Not every source gets the same weight.</h2>
          <p>Web opinion is never treated as evidence. It may surface a question, but a claim enters the briefing only when its population, method, scope, and limitations can be shown.</p>
        </header>
        <ol>
          {validityLadder.map((level) => (
            <li key={level.level}>
              <span>{level.level}</span>
              <strong>{level.name}</strong>
              <p>{level.use}</p>
            </li>
          ))}
        </ol>
        <footer>
          <p><strong>Language rule:</strong> “shows” for direct evidence, “suggests” for bounded proxies, “signals” for industry data, and “we interpret” for synthesis.</p>
          <Link href="/library">Audit the source library <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </footer>
      </section>
    </main>
  );
}
