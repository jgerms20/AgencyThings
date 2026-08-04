"use client";

import { ArrowUpRight, Pencil, Printer, RotateCcw, Save, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { summaryTakeaways, type SummaryTakeaway } from "@/lib/summary";
import { researchFrontier } from "@/lib/research-frontier";

const storageKey = "gen-alpha-summary-v1";

function loadSummary(): SummaryTakeaway[] {
  if (typeof window === "undefined") return summaryTakeaways;
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as { version?: number; items?: SummaryTakeaway[] } | null;
    if (stored?.version === 1 && stored.items?.length === summaryTakeaways.length) return stored.items;
  } catch {
    // A damaged local draft should never block the default summary.
  }
  return summaryTakeaways;
}

export default function SummaryPage() {
  const [items, setItems] = useState<SummaryTakeaway[]>(loadSummary);
  const [draft, setDraft] = useState<SummaryTakeaway[]>(items);
  const [editing, setEditing] = useState(false);

  const startEditing = () => {
    setDraft(items.map((item) => ({ ...item })));
    setEditing(true);
  };

  const updateDraft = (index: number, field: "headline" | "takeaway", value: string) => {
    setDraft((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const save = () => {
    const next = draft.map((item, index) => ({
      ...item,
      headline: item.headline.trim() || summaryTakeaways[index].headline,
      takeaway: item.takeaway.trim() || summaryTakeaways[index].takeaway,
    }));
    setItems(next);
    window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, items: next }));
    setEditing(false);
  };

  const reset = () => {
    setItems(summaryTakeaways);
    setDraft(summaryTakeaways);
    window.localStorage.removeItem(storageKey);
    setEditing(false);
  };

  return (
    <main className="summary-page research-page">
      <SiteHeader active="summary" />
      <section className="research-opening summary-opening">
        <div>
          <p className="research-kicker">Summary / six conclusions</p>
          <h1>The Gen Alpha summary.</h1>
        </div>
        <div className="summary-opening-copy">
          <p>Six bold conclusions. The evidence stays one click away, and the language can be edited for the room you are presenting to.</p>
          <div className="summary-actions">
            {editing ? (
              <>
                <button type="button" onClick={save} aria-label="Save changes"><Save aria-hidden="true" size={17} /> Save changes</button>
                <button type="button" className="secondary" onClick={() => setEditing(false)} aria-label="Cancel editing"><X aria-hidden="true" size={17} /> Cancel</button>
                <button type="button" className="secondary" onClick={reset} aria-label="Reset defaults"><RotateCcw aria-hidden="true" size={17} /> Reset defaults</button>
              </>
            ) : (
              <>
                <button type="button" onClick={startEditing} aria-label="Edit summary"><Pencil aria-hidden="true" size={17} /> Edit summary</button>
                <button type="button" className="secondary" onClick={() => window.print()} aria-label="Print or save summary"><Printer aria-hidden="true" size={17} /> Print / save</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="summary-list" aria-label="Six headline insights">
        {(editing ? draft : items).map((item, index) => (
          <article className="summary-item" data-testid="summary-takeaway" key={item.id}>
            <span className="summary-number">{item.number}</span>
            <div className="summary-copy">
              {editing ? (
                <>
                  <label htmlFor={`headline-${item.id}`}>Headline {index + 1}</label>
                  <input id={`headline-${item.id}`} value={item.headline} onChange={(event) => updateDraft(index, "headline", event.target.value)} />
                  <label htmlFor={`takeaway-${item.id}`}>Takeaway {index + 1}</label>
                  <textarea id={`takeaway-${item.id}`} rows={4} value={item.takeaway} onChange={(event) => updateDraft(index, "takeaway", event.target.value)} />
                </>
              ) : (
                <>
                  <h2>{item.headline}</h2>
                  <p className="summary-takeaway-copy">{item.takeaway}</p>
                </>
              )}
              <ul>{item.support.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <aside className="summary-proof">
              <Link href={`/insights/${item.insightId}`} aria-label={`Open exact insight: ${item.headline}`}>
                Open exact insight <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <div>
                {item.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" aria-label={`Open source: ${source.title}`}>
                    <span>{source.organization}</span>{source.title}<ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                ))}
              </div>
            </aside>
          </article>
        ))}
      </section>

      <section className="research-frontier" id="research-frontier" aria-label="Research frontier">
        <header>
          <p className="research-kicker">What comes next</p>
          <h2>The baseline gets us smart. The frontier gives us something to prove.</h2>
          <p>No invented originality here: the hunches are labeled, the gaps stay visible, and proprietary inputs have a place to land when they arrive.</p>
        </header>
        <div className="frontier-columns">
          <article><span>01</span><h3>Established baseline</h3><ul>{researchFrontier.established.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>02</span><h3>Working hunches</h3><ul>{researchFrontier.hunches.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>03</span><h3>Open questions</h3><ul>{researchFrontier.questions.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        <div className="frontier-inputs">
          <div><p className="research-kicker">Proprietary and network inputs</p><h3>Ready for the next source pass.</h3></div>
          <ul>{researchFrontier.pendingInputs.map((input) => <li key={input}><strong>{input}</strong><span>Pending internal input</span></li>)}</ul>
        </div>
        <div className="frontier-methods"><p>Next methods</p>{researchFrontier.nextMethods.map((method) => <span key={method}>{method}</span>)}</div>
      </section>
    </main>
  );
}
