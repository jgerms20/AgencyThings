"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { type RefObject } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useCountUp } from "@/components/useCountUp";
import {
  humorHeadlineStats,
  humorLifecycle,
  humorMechanics,
  humorPlaybook,
  humorQuotes,
  humorStudy,
  humorTiming,
  snapchatHumor,
  snapchatTabs,
} from "@/lib/content/humor";

function CountStat({
  value,
  suffix = "",
  display,
  decimals = 0,
  className = "",
}: {
  value: number;
  suffix?: string;
  display?: string;
  decimals?: number;
  className?: string;
}) {
  const { value: current, ref } = useCountUp({ end: value, duration: 1600, decimals });
  const isComplete = current >= value - (decimals ? 0.05 : 0.5);
  const visible = isComplete && display ? display : `${decimals ? current.toFixed(decimals) : Math.round(current)}${suffix}`;

  return (
    <strong ref={ref as RefObject<HTMLElement>} className={className}>
      {visible}
    </strong>
  );
}

export default function HumorPage() {
  return (
    <main className="humor-page">
      <SiteHeader active="humor" />

      <section className="page-opening humor-opening">
        <div>
          <p className="humor-kicker">{humorStudy.kicker}</p>
          <h1>{humorStudy.title}</h1>
          <p>{humorStudy.lede}</p>
        </div>
        <p className="humor-sample">{humorStudy.sample}</p>
      </section>

      <section className="humor-stats" aria-label="Headline findings">
        {humorHeadlineStats.map((stat) => (
          <article key={stat.label}>
            <CountStat value={stat.value} suffix={stat.suffix} display={"display" in stat ? stat.display : undefined} />
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="humor-quotes" aria-label="How they describe their own humor">
        {humorQuotes.map((item) => (
          <blockquote key={item.voice}>
            <p>{item.quote}</p>
            <footer>{item.voice}</footer>
          </blockquote>
        ))}
      </section>

      <section className="humor-mechanics" aria-label="The mechanics of funny">
        <header>
          <p className="humor-section-label">What this study adds</p>
          <h2>The joke has rules. They just are not the ones adults were taught.</h2>
        </header>
        <div className="humor-mechanic-grid">
          {humorMechanics.map((mechanic) => (
            <article key={mechanic.number}>
              <span>{mechanic.number}</span>
              <CountStat value={Number.parseFloat(mechanic.stat)} suffix="%" className="humor-mechanic-stat" />
              <h3>{mechanic.title}</h3>
              <p>{mechanic.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="humor-timing" aria-label="Goldilocks moment">
        <header>
          <h2>Timing is the whole joke.</h2>
          <p>91% say the same joke can feel funny in one place and awkward in another. Brands are never a neutral participant.</p>
        </header>
        <div className="humor-timing-grid">
          {humorTiming.map((moment) => (
            <article key={moment.id} data-moment={moment.id}>
              <p>{moment.title}</p>
              <h3>{moment.line}</h3>
              <p>{moment.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="humor-lifecycle" aria-label="Joke social lifecycle">
        <h2>Every joke has a social life.</h2>
        <ol>
          {humorLifecycle.map((step) => (
            <li key={step.stage}>
              <strong>{step.stage}</strong>
              <span>{step.line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="humor-snap" aria-label="Where Snapchat is actually different">
        <header>
          <p className="humor-section-label">Snapchat’s job in the joke</p>
          <h2>Not where they find it. Where they send it.</h2>
          <p>
            Spaces already covers what Snapchat is. This is the behavior the study measured: private sharing, AR play, and creator collaboration.
          </p>
        </header>
        <div className="humor-snap-stats">
          {snapchatHumor.map((stat) => (
            <article key={stat.label}>
              <CountStat
                value={stat.value}
                suffix={stat.suffix}
                decimals={"decimals" in stat ? stat.decimals : 0}
                display={"display" in stat ? stat.display : undefined}
              />
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
        <ul className="humor-snap-tabs">
          {snapchatTabs.map((tab) => (
            <li key={tab.action}>
              <strong>{tab.share}</strong>
              <span>{tab.action}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="humor-playbook" aria-label="Zoomer humor playbook">
        <h2>Four moves. Not forty slides.</h2>
        <div>
          {humorPlaybook.map((item, index) => (
            <article key={item.step}>
              <span>0{index + 1}</span>
              <h3>{item.step}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="humor-source">
        <p>{humorStudy.caveat}</p>
        <div>
          <a href={humorStudy.sourceUrl} rel="noreferrer" target="_blank">
            Snapchat for Business write-up <ArrowUpRight aria-hidden="true" size={16} />
          </a>
          <a href={humorStudy.pdfUrl} rel="noreferrer" target="_blank">
            Full study PDF <ArrowUpRight aria-hidden="true" size={16} />
          </a>
          <Link href={"/library/snap-omnicom-humor-2026" as Route}>
            Open the source record <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <Link href={"/spaces#snapchat" as Route}>
            Snapchat as a space <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </footer>
    </main>
  );
}
