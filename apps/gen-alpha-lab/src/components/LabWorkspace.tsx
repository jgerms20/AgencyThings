import { ArrowUpRight, ChevronDown, Headphones } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import InsightTabs from "@/components/InsightTabs";
import MediaEmbed from "@/components/MediaEmbed";
import OverviewComparison from "@/components/OverviewComparison";
import SiteHeader from "@/components/SiteHeader";
import { cultureShapers, getCultureShaperImage } from "@/lib/content/culture-shapers";
import { spaces } from "@/lib/spaces";
import { alpha101Facts, knowledgeStages } from "@/lib/gen-alpha-101";
import type { ResearchRecord } from "@/lib/types";

type LabWorkspaceProps = { initialRecords: ResearchRecord[] };

const overviewCultureShaperIds = [
  "mrbeast",
  "kai-cenat",
  "bluey",
  "aphmau",
  "kpop-demon-hunters",
] as const;

const overviewSpaceIds = ["roblox", "school", "parks-playgrounds-pickup-play"] as const;

const reachPrinciples = [
  {
    number: "01",
    title: "Create value",
    summary: "Give children something worth making, learning, joining, or returning to.",
    detail: "Start with a useful role for the child, not a demand for attention. Participation should leave them with skill, expression, connection, or delight.",
  },
  {
    number: "02",
    title: "Fit the context",
    summary: "Work with the adults, rituals, places, and formats already shaping the moment.",
    detail: "Design for the real setting: family co-use, school rules, friendship groups, platform norms, and the time children actually have.",
  },
  {
    number: "03",
    title: "Apply guardrails",
    summary: "Make safety visible and measure the usefulness children actually receive.",
    detail: "Keep persuasion, data collection, purchase, and public sharing boundaries plain enough for both children and adults to understand.",
  },
] as const;

const shelfGroups = [
  { format: "Podcast", ids: ["owned-podcast-093", "future-report-alpha-mccrindle-2025"] },
  { format: "Video", ids: ["common-sense-media-youtube-2025", "mccrindle-inside-gen-alpha-video"] },
  { format: "Article", ids: ["generation-alpha-education-review-2024", "digital-wellbeing-review-2025"] },
  { format: "Book", ids: ["mccrindle-generation-alpha-book", "anxious-generation-book"] },
  { format: "Report", ids: ["pwc-alpha-2026", "nielsen-ai-discovery-2026"] },
] as const;

const displayCultureType = (type: string) => {
  if (type === "screen-ip" || type === "franchise") return "IP";
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
};

export default function LabWorkspace({ initialRecords }: LabWorkspaceProps) {
  const podcast = initialRecords.find((record) => record.id === "owned-podcast-093");
  const culturePreview = overviewCultureShaperIds.flatMap((id) => {
    const shaper = cultureShapers.find((candidate) => candidate.id === id);
    return shaper ? [shaper] : [];
  });
  const spacePreview = overviewSpaceIds.flatMap((id) => {
    const space = spaces.find((candidate) => candidate.id === id);
    return space ? [space] : [];
  });
  const shelf = shelfGroups.flatMap(({ format, ids }) => ids.flatMap((id) => {
    const record = initialRecords.find((candidate) => candidate.id === id);
    return record ? [{ format, record }] : [];
  }));

  return (
    <main className="overview-page">
      <SiteHeader active="overview" />

      <section className="overview-opening">
        <p className="overview-opening-kicker">Gen Alpha 101 / start here</p>
        <h1>Gen Alpha, from the beginning.</h1>
        <p>Gen Alpha is often defined as 2010 through 2024: roughly 1 to 16 years old in 2026. That span is huge, the boundary is debated, and every useful claim needs an age attached.</p>
        <Link className="text-link" href="/insights">Explore all 40 insights <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </section>

      <section className="alpha-101" aria-label="Ten things to know about Gen Alpha">
        <header className="section-line">
          <div>
            <p className="overview-opening-kicker">The fast orientation</p>
            <h2>Ten things to know before the deep dive.</h2>
          </div>
          <p>Baseline knowledge, written for the person who just asked, “Wait—how old are they?”</p>
        </header>
        <ol>
          {alpha101Facts.map((fact) => (
            <li data-testid="alpha-101-fact" key={fact.number}>
              <Link href={fact.href as Route}>
                <span>{fact.number}</span>
                <strong>{fact.title}</strong>
                <p>{fact.explanation}</p>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="knowledge-stages" aria-label="How to use this research">
        <header>
          <p className="overview-opening-kicker">What this is—and is not</p>
          <h2>A baseline first. An original point of view next.</h2>
          <p>This Lab gathers what is already known so the team can see where the evidence stops and the interesting questions begin.</p>
        </header>
        <div>
          {knowledgeStages.map((stage) => (
            <Link href={stage.href} key={stage.number} aria-label={stage.title}>
              <span>{stage.number}</span>
              <strong>{stage.title}</strong>
              <p>{stage.description}</p>
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <InsightTabs />

      <section className="overview-briefing-paths" aria-label="Research briefing paths">
        <Link href="/summary" aria-label="Open the summary">
          <span>Present the synthesis</span>
          <strong>Six editable conclusions, with the evidence one click away.</strong>
          <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
        <Link href="/gender" aria-label="Explore the gender lens">
          <span>Interrogate difference</span>
          <strong>Boys, girls, and the evidence gap around gender-diverse youth.</strong>
          <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </section>

      <section className="people-preview" aria-labelledby="people-preview-heading">
        <div className="section-line">
          <h2 id="people-preview-heading">Who shapes the culture</h2>
          <Link className="text-link" href="/influencers">Explore all {cultureShapers.length} culture shapers <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
        <div className="portrait-strip portrait-strip-five">
          {culturePreview.map((shaper) => (
            <Link href={`/influencers/${shaper.id}`} key={shaper.id}>
              {getCultureShaperImage(shaper) ? <img src={getCultureShaperImage(shaper)} alt={shaper.name} loading="lazy" decoding="async" /> : (
                <span className="culture-shaper-monogram" aria-hidden="true">
                  {shaper.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <strong>{shaper.name}</strong>
              <span>{displayCultureType(shaper.type)} / {shaper.role}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="spaces-preview" aria-labelledby="spaces-preview-heading">
        <div className="section-line">
          <h2 id="spaces-preview-heading">Where their days happen</h2>
          <Link className="text-link" href="/spaces">Explore all {spaces.length} spaces <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
        <div className="space-preview-list">
          {spacePreview.map((space) => (
            <Link href={`/spaces#${space.id}`} key={space.id}>
              <span>{space.environment}</span>
              <h3>{space.name}</h3>
              <p>{space.whatHappens}</p>
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      </section>

      {podcast ? (
        <section className="overview-podcast" aria-labelledby="overview-podcast-heading">
          <div className="overview-podcast-copy">
            <Headphones aria-hidden="true" size={30} />
            <p>Featured listening / Eclectic Polymath</p>
            <h2 id="overview-podcast-heading">{podcast.title}</h2>
            <a href={podcast.url} target="_blank" rel="noreferrer">Open the episode on Spotify <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
          <MediaEmbed title={podcast.title} url={podcast.url} />
        </section>
      ) : null}

      <section className="overview-reach" aria-labelledby="overview-reach-heading">
        <header>
          <h2 id="overview-reach-heading">Marketing 101: three established starting points.</h2>
          <p>Useful first. Context-aware second. Safe by design throughout. The original agency point of view comes after the baseline.</p>
        </header>
        <div className="overview-reach-list">
          {reachPrinciples.map((principle) => (
            <details data-testid="overview-reach-principle" key={principle.title}>
              <summary>
                <span className="overview-reach-number">{principle.number}</span>
                <strong>{principle.title}</strong>
                <span className="overview-reach-summary">{principle.summary}</span>
                <ChevronDown aria-hidden="true" size={24} />
              </summary>
              <div>
                <p>{principle.detail}</p>
                <Link href="/reach-them" aria-label={`Explore ${principle.title}`}>Explore the full guide <ArrowUpRight aria-hidden="true" size={17} /></Link>
              </div>
            </details>
          ))}
        </div>
      </section>

      <OverviewComparison />

      <section className="overview-media-shelf" aria-labelledby="overview-media-shelf-heading">
        <header className="section-line">
          <div>
            <h2 id="overview-media-shelf-heading">Curated media shelf</h2>
            <p>Ten starting points, balanced by format.</p>
          </div>
          <Link className="text-link" href="/library">Browse the full library <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </header>
        <ol>
          {shelf.map(({ format, record }, index) => (
            <li data-testid={`overview-media-${format.toLowerCase()}`} key={record.id}>
              <Link href={`/library/${record.id}`}>
                <span>{String(index + 1).padStart(2, "0")} / {format}</span>
                <strong>{record.title}</strong>
                <span>{record.source}</span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
