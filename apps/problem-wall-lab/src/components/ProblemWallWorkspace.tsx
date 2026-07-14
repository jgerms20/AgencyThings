"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Clipboard,
  Download,
  ExternalLink,
  Moon,
  RefreshCw,
  Search,
  Sun,
  X
} from "lucide-react";
import { deckInspiration } from "../lib/seed-data";
import { buildWeeklySummary } from "../lib/problem-wall";
import type { CandidateStatus, ProblemCandidate, SourceClass, WeeklyRefreshResult } from "../lib/types";

type View = "new" | "saved" | "deck";
type Theme = "dark" | "light";
const STORAGE_KEY = "problem-wall:weekly-state:v5";
const THEME_KEY = "problem-wall:theme";

export default function ProblemWallWorkspace() {
  const [view, setView] = useState<View>("new");
  const [candidates, setCandidates] = useState<ProblemCandidate[]>([]);
  const [result, setResult] = useState<WeeklyRefreshResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Run a scan when you want a fresh batch.");
  const [theme, setTheme] = useState<Theme>("dark");
  const [brandLens, setBrandLens] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | SourceClass>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [edge, setEdge] = useState(55);
  const weekOf = result?.weekOf ?? mondayOf(new Date());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCandidates(JSON.parse(saved) as ProblemCandidate[]);
      setTheme(localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark");
    } catch { /* Local mode remains optional in restricted browsers. */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* no-op */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates)); } catch { /* no-op */ }
  }, [candidates]);

  const saved = candidates.filter((candidate) => candidate.status === "shortlisted");
  const categories = useMemo(() => [...new Set(candidates.flatMap((candidate) => candidate.sources.flatMap((source) => source.tags)))].sort(), [candidates]);
  const fresh = useMemo(() => {
    const sourceWeight: Record<SourceClass, number> = edge >= 60
      ? { community: 3, news: 2, research: 1 }
      : { research: 3, news: 2, community: 1 };
    return candidates
      .filter((candidate) => candidate.status === "new")
      .filter((candidate) => sourceFilter === "all" || candidate.sources.some((source) => source.sourceClass === sourceFilter))
      .filter((candidate) => categoryFilter === "all" || candidate.sources.some((source) => source.tags.includes(categoryFilter)))
      .sort((a, b) => sourceWeight[b.sources[0]?.sourceClass ?? "news"] - sourceWeight[a.sources[0]?.sourceClass ?? "news"]);
  }, [candidates, categoryFilter, edge, sourceFilter]);
  const sourceHealth = useMemo(() => countSources(result), [result]);
  const summary = useMemo(() => buildWeeklySummary(candidates), [candidates]);

  async function findNewProblems() {
    setIsLoading(true);
    setMessage(`Scanning current reporting, research, and community conversations${brandLens.trim() ? ` through a ${brandLens.trim()} lens` : ""}...`);
    try {
      const response = await fetch("/api/weekly-refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brandLens: brandLens.trim(), excludeIds: candidates.map((candidate) => candidate.id), edge })
      });
      if (!response.ok) throw new Error(`Refresh failed (${response.status})`);
      const payload = await response.json() as WeeklyRefreshResult;
      setResult(payload);
      setCandidates((current) => mergeFreshBatch(payload.candidates, current));
      if (!payload.candidates.length) {
        setMessage("No unseen problems cleared the evidence window. Try another lens, or run again after sources update.");
      } else if (payload.refresh.failures.length) {
        setMessage(`${payload.candidates.length} unseen problems found. Some sources were unavailable, so this batch is partial.`);
      } else {
        setMessage(`${payload.candidates.length} unseen problems found across ${payload.refresh.sourcesSucceeded} live feeds.`);
      }
      setView("new");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The refresh could not be completed.");
    } finally { setIsLoading(false); }
  }

  function setStatus(id: string, status: CandidateStatus) {
    setCandidates((current) => current.map((candidate) => candidate.id === id ? { ...candidate, status } : candidate));
  }

  function setNotes(id: string, notes: string) {
    setCandidates((current) => current.map((candidate) => candidate.id === id ? { ...candidate, notes } : candidate));
  }

  async function copySummary() {
    try { await navigator.clipboard.writeText(summary); setMessage("Saved-problem summary copied."); }
    catch { setMessage("Copy is unavailable in this browser."); }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify({ weekOf, refreshedAt: result?.refreshedAt, candidates: saved, summary }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `problem-wall-${weekOf}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Saved problems downloaded.");
  }

  const socialLinks = buildSocialLinks(brandLens);

  return (
    <main className="problem-wall-shell">
      <header className="top-bar">
        <a href="https://jgerms20.github.io/AgencyThings/" className="back-link"><ArrowLeft size={17} aria-hidden="true" />Joshua&apos;s AgencyThings</a>
        <div className="title-lockup"><h1>Problem Wall</h1><p>Week of {formatWeek(weekOf)}</p></div>
        <div className="header-actions">
          <button className="theme-button" type="button" title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
          <button className="find-button" type="button" onClick={findNewProblems} disabled={isLoading}>
            <RefreshCw size={18} aria-hidden="true" className={isLoading ? "spin" : ""} />
            {isLoading ? "Scanning sources" : "Find new problems"}
          </button>
        </div>
      </header>

      <nav className="tabs" role="tablist" aria-label="Problem Wall views">
        {([ ["new", "New this week"], ["saved", `Saved (${saved.length})`], ["deck", "Already in the deck"] ] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={view === id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>
        ))}
      </nav>

      <p className="run-message" role="status">{message}</p>

      {view === "deck" ? (
        <section className="inspiration-view">
          <div className="section-heading"><span>Reference only</span><h2>Problems already in the deck</h2><p>Use these to remember the framing bar. They never appear in a fresh batch.</p></div>
          <div className="inspiration-list">{deckInspiration.map((item) => <article key={item.id}><h3>{item.problem}</h3><p>{item.biggerReason}</p></article>)}</div>
        </section>
      ) : view === "saved" ? (
        <section className="saved-layout">
          <div className="saved-main">
            <div className="section-heading"><span>Weekly wrap</span><h2>{saved.length} problem{saved.length === 1 ? "" : "s"} worth carrying forward</h2><p>Add a note, then copy or download the set.</p></div>
            {saved.length ? saved.map((candidate) => (
              <article className="saved-row" key={candidate.id}>
                <div><h3>{candidate.problem}</h3><p>{candidate.biggerReason}</p><SourceLinks candidate={candidate} /></div>
                <label>Notes<textarea value={candidate.notes} onChange={(event) => setNotes(candidate.id, event.target.value)} placeholder="What makes this worth exploring?" /></label>
                <button className="icon-action" title="Remove from saved" aria-label="Remove from saved" type="button" onClick={() => setStatus(candidate.id, "new")}><X aria-hidden="true" /></button>
              </article>
            )) : <EmptyState title="Nothing saved yet" copy="Keep the problems that feel useful. Everything else can leave the wall." />}
          </div>
          <aside className="readout"><h2>Wrap-up</h2><textarea aria-label="Saved-problem summary" readOnly value={summary} /><button type="button" onClick={copySummary}><Clipboard aria-hidden="true" />Copy summary</button><button type="button" onClick={downloadJson}><Download aria-hidden="true" />Download JSON</button></aside>
        </section>
      ) : (
        <>
          <section className="discovery-controls" aria-label="Discovery controls">
            <label className="brand-field">Brand lens <input aria-label="Brand lens" value={brandLens} onChange={(event) => setBrandLens(event.target.value)} placeholder="Optional, e.g. Gatorade" /></label>
            <label>Source <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as "all" | SourceClass)}><option value="all">All sources</option><option value="news">News</option><option value="research">Research</option><option value="community">Community</option></select></label>
            <label>Category <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category} value={category}>{capitalize(category)}</option>)}</select></label>
            <label className="edge-control"><span><b>Conventional</b><b>Frontier</b></span><input aria-label="Discovery edge" type="range" min="0" max="100" value={edge} onChange={(event) => setEdge(Number(event.target.value))} /></label>
          </section>
          <section className="discovery-layout">
            <div className="problem-list">
              {fresh.length ? fresh.map((candidate, index) => (
                <article className="problem-row" key={candidate.id}>
                  <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="problem-copy"><span className={`source-class ${candidate.sources[0]?.sourceClass}`}>{candidate.sources[0]?.sourceClass}</span><h2>{candidate.problem}</h2><p>{candidate.biggerReason}</p><SourceLinks candidate={candidate} /></div>
                  <div className="row-actions"><button type="button" title="Save" aria-label="Save problem" onClick={() => setStatus(candidate.id, "shortlisted")}><Bookmark aria-hidden="true" /></button><button type="button" title="Dismiss" aria-label="Dismiss problem" onClick={() => setStatus(candidate.id, "passed")}><X aria-hidden="true" /></button></div>
                </article>
              )) : <EmptyState title="No fresh problems on the wall" copy="Run a scan for an unseen batch, or loosen the active filters." />}
            </div>
            <aside className="week-rail">
              <h2>Live source mix</h2>
              <div className="source-health">{(["news", "research", "community"] as SourceClass[]).map((source) => <div key={source}><span>{source}</span><strong>{sourceHealth[source]}</strong></div>)}</div>
              <p className="source-note">{result ? `${result.refresh.sourcesSucceeded}/${result.refresh.sourcesAttempted} feeds responded` : "Run discovery to see source health."}</p>
              <section className="social-scouts"><h3>Social scouts</h3><p>Open live searches directly on each platform. These links do not pretend to be an API feed.</p>{socialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer">Search {link.label}<ExternalLink aria-hidden="true" /></a>)}</section>
            </aside>
          </section>
        </>
      )}
    </main>
  );
}

function SourceLinks({ candidate }: { candidate: ProblemCandidate }) {
  return <div className="source-links">{candidate.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.source}<ExternalLink size={13} aria-hidden="true" /><span>{source.publishedAt}</span></a>)}</div>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) { return <div className="empty-state"><Search aria-hidden="true" /><h2>{title}</h2><p>{copy}</p></div>; }
function mergeFreshBatch(next: ProblemCandidate[], current: ProblemCandidate[]) { const kept = current.filter((candidate) => candidate.status !== "new"); const existing = new Set(kept.map((candidate) => candidate.id)); return [...kept, ...next.filter((candidate) => !existing.has(candidate.id))]; }
function countSources(result: WeeklyRefreshResult | null): Record<SourceClass, number> { const counts = { news: 0, research: 0, community: 0 }; result?.refresh.signals.forEach((signal) => { counts[signal.sourceClass] += 1; }); return counts; }
function mondayOf(date: Date) { const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); copy.setUTCDate(copy.getUTCDate() - ((copy.getUTCDay() + 6) % 7)); return copy.toISOString().slice(0, 10); }
function formatWeek(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function buildSocialLinks(brandLens: string) { const query = encodeURIComponent(`${brandLens.trim() ? `${brandLens.trim()} ` : ""}frustration problem`); return [ { label: "Reddit", url: `https://www.reddit.com/search/?q=${query}&sort=new` }, { label: "X", url: `https://x.com/search?q=${query}&src=typed_query&f=live` }, { label: "TikTok", url: `https://www.tiktok.com/search?q=${query}` }, { label: "Instagram", url: `https://www.instagram.com/explore/search/keyword/?q=${query}` } ]; }
