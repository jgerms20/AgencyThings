"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { type RefObject } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useCountUp } from "@/components/useCountUp";
import {
  humorHeadlineStats,
  humorStudy,
  humorTiming,
  snapchatHumor,
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
  const sendStat = snapchatHumor[0];

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

      <section className="humor-timing" aria-label="Goldilocks moment">
        <header>
          <p className="humor-section-label">The move that actually matters</p>
          <h2>Timing is the whole joke.</h2>
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

      <section className="humor-snap humor-snap-tight" aria-label="Where Snapchat is actually different">
        <article>
          <CountStat
            value={sendStat.value}
            suffix={sendStat.suffix}
            decimals={"decimals" in sendStat ? sendStat.decimals : 0}
          />
          <p>{sendStat.label}</p>
        </article>
        <p>Not where they find it. Where they send it.</p>
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
        </div>
      </footer>
    </main>
  );
}
