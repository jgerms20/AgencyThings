"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import {
  humorHeadlineStats,
  humorMechanics,
  humorStudy,
  humorTiming,
} from "@/lib/content/humor";

export default function HumorPage() {
  return (
    <main className="humor-page">
      <SiteHeader active="humor" />

      <section className="page-opening humor-opening">
        <div>
          <p className="humor-kicker">{humorStudy.kicker}</p>
          <h1>Humor is social language.</h1>
          <p>For older Alpha and younger Gen Z, the joke is a way to belong. Context matters more than a punchline.</p>
        </div>
        <img className="humor-opening-image" src="/culture/humor-study.jpg" alt="Two young adults make a playful selfie in the Snap study artwork" />
      </section>

      <section className="humor-stats humor-key-stats" aria-label="Headline findings">
        {humorHeadlineStats.slice(0, 3).map((stat) => (
          <article key={stat.label}>
            <strong>{"display" in stat ? stat.display : `${stat.value}${stat.suffix}`}</strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="humor-mechanics humor-short-read" aria-label="The mechanics of funny">
        <header>
          <p className="humor-section-label">The read</p>
          <h2>Three things to know.</h2>
        </header>
        <div className="humor-mechanic-grid">
          {humorMechanics.slice(0, 3).map((mechanic, index) => (
            <article key={mechanic.number}>
              <img src={["/spaces/discord.jpg", "/spaces/snapchat.jpg", "/spaces/roblox.jpg"][index]} alt="" loading="lazy" />
              <strong className="humor-mechanic-stat">{mechanic.stat}</strong>
              <h3>{mechanic.title}</h3>
              <p>{["The reference is part of the joke.", "Absurd does not mean accidental.", "Something can be sincere and ironic at once."][index]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="humor-timing humor-short-timing" aria-label="When to join the joke">
        <header>
          <h2>Timing changes the meaning.</h2>
          <p>91% say the same joke can land in one place and miss in another.</p>
        </header>
        <div className="humor-timing-grid">
          {humorTiming.map((moment) => (
            <article key={moment.id} data-moment={moment.id}>
              <p>{moment.title}</p>
              <h3>{moment.line}</h3>
            </article>
          ))}
        </div>
      </section>

      <aside className="humor-takeaway"><strong>For brands</strong><p>Do not borrow a meme to prove you saw it. Give people a format they can make their own, or leave the joke to them.</p></aside>

      <footer className="humor-source">
        <p>{humorStudy.caveat} {humorStudy.sample}</p>
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
