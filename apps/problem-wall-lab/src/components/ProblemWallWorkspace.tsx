"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bookmark, Check, Clipboard, Download, ExternalLink, RefreshCw, Search, X } from "lucide-react";
import { deckInspiration } from "../lib/seed-data";
import { buildWeeklySummary } from "../lib/problem-wall";
import type { CandidateStatus, ProblemCandidate, SourceClass, WeeklyRefreshResult } from "../lib/types";

type View = "new" | "shortlist" | "reviewed" | "inspiration";
const STORAGE_KEY = "problem-wall:weekly-state:v4";

export default function ProblemWallWorkspace() {
  const [view, setView] = useState<View>("new");
  const [candidates, setCandidates] = useState<ProblemCandidate[]>([]);
  const [result, setResult] = useState<WeeklyRefreshResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Ready for this week's scan.");
  const weekOf = result?.weekOf ?? mondayOf(new Date());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCandidates(JSON.parse(saved) as ProblemCandidate[]);
    } catch { /* Local mode remains optional in restricted browsers. */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates)); } catch { /* no-op */ }
  }, [candidates]);

  const shortlist = candidates.filter((candidate) => candidate.status === "shortlisted");
  const reviewed = candidates.filter((candidate) => candidate.status === "reviewed" || candidate.status === "passed");
  const visible = view === "new" ? candidates.filter((candidate) => candidate.status === "new") : view === "shortlist" ? shortlist : reviewed;
  const sourceHealth = useMemo(() => countSources(result), [result]);
  const summary = useMemo(() => buildWeeklySummary(candidates), [candidates]);

  async function findNewProblems() {
    setIsLoading(true);
    setMessage("Scanning current news, studies, and community conversations...");
    try {
      const response = await fetch("/api/weekly-refresh", { method: "POST" });
      if (!response.ok) throw new Error(`Refresh failed (${response.status})`);
      const payload = await response.json() as WeeklyRefreshResult;
      setResult(payload);
      setCandidates((current) => mergeCandidates(payload.candidates, current));
      if (!payload.candidates.length) {
        setMessage(`No current problems met the evidence window. ${payload.refresh.failures.length} source${payload.refresh.failures.length === 1 ? "" : "s"} reported issues.`);
      } else if (payload.refresh.failures.length) {
        setMessage(`${payload.candidates.length} current problems found. Some sources were unavailable, so the run is partial.`);
      } else {
        setMessage(`${payload.candidates.length} current problems found across ${payload.refresh.sourcesSucceeded} source feeds.`);
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
    try { await navigator.clipboard.writeText(summary); setMessage("Weekly summary copied."); }
    catch { setMessage("Copy is unavailable in this browser."); }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify({ weekOf, refreshedAt: result?.refreshedAt, candidates: shortlist, summary }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `problem-wall-${weekOf}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Weekly JSON downloaded.");
  }

  function markReviewed() {
    setCandidates((current) => current.map((candidate) => candidate.status === "shortlisted" ? { ...candidate, status: "reviewed" } : candidate));
    setView("reviewed");
    setMessage("This week's shortlist is marked reviewed.");
  }

  return (
    <main className="problem-wall-shell">
      <header className="top-bar">
        <a href="https://jgerms20.github.io/AgencyThings/" className="back-link"><ArrowLeft size={17} aria-hidden="true" />Joshua&apos;s AgencyThings</a>
        <div className="title-lockup"><h1>Problem Wall</h1><p>Week of {formatWeek(weekOf)}</p></div>
        <button className="find-button" type="button" onClick={findNewProblems} disabled={isLoading}>
          <RefreshCw size={18} aria-hidden="true" className={isLoading ? "spin" : ""} />
          {isLoading ? "Finding problems" : "Find new problems"}
        </button>
      </header>

      <nav className="tabs" role="tablist" aria-label="Problem Wall views">
        {([
          ["new", "New this week"], ["shortlist", "Shortlist"], ["reviewed", "Reviewed"], ["inspiration", "Deck inspiration"]
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={view === id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>
        ))}
      </nav>

      <p className="run-message" role="status">{message}</p>

      {view === "inspiration" ? (
        <section className="inspiration-view">
          <div className="section-heading"><span>Reference only</span><h2>Deck inspiration</h2><p>Past examples for framing craft. They never enter New this week or affect the weekly count.</p></div>
          <div className="inspiration-list">{deckInspiration.map((item) => <article key={item.id}><h3>{item.problem}</h3><p>{item.biggerReason}</p><small>{item.details}</small></article>)}</div>
        </section>
      ) : view === "shortlist" ? (
        <section className="wrap-layout">
          <div className="wrap-main">
            <div className="section-heading"><span>Weekly review</span><h2>Wrap up the week</h2><p>{shortlist.length} problem{shortlist.length === 1 ? "" : "s"} shortlisted</p></div>
            {shortlist.length ? shortlist.map((candidate, index) => (
              <article className="wrap-row" key={candidate.id}>
                <strong className="rank">{index + 1}</strong>
                <div className="wrap-problem"><h3>{candidate.problem}</h3><p>{candidate.biggerReason}</p><SourceLinks candidate={candidate} /></div>
                <BurstScore candidate={candidate} compact />
                <label className="notes-field">Notes<textarea value={candidate.notes} onChange={(event) => setNotes(candidate.id, event.target.value)} placeholder="What deserves deeper validation?" /></label>
                <button className="icon-action" title="Remove from shortlist" aria-label="Remove from shortlist" type="button" onClick={() => setStatus(candidate.id, "new")}><X aria-hidden="true" /></button>
              </article>
            )) : <EmptyState title="Nothing shortlisted yet" copy="Return to New this week and keep the problems worth carrying forward." />}
          </div>
          <aside className="readout"><h2>Weekly readout</h2><textarea aria-label="Weekly readout" readOnly value={summary} />
            <button type="button" onClick={copySummary}><Clipboard aria-hidden="true" />Copy summary</button>
            <button type="button" onClick={downloadJson}><Download aria-hidden="true" />Download JSON</button>
            <button type="button" onClick={markReviewed} disabled={!shortlist.length}><Check aria-hidden="true" />Mark reviewed</button>
            <div className="next-run"><span>Next Monday</span><strong>{formatWeek(nextWeek(weekOf))}</strong><p>Fresh problems land from the same discovery pipeline.</p></div>
          </aside>
        </section>
      ) : (
        <section className="discovery-layout">
          <div className="problem-list">
            {visible.length ? visible.map((candidate, index) => (
              <article className="problem-row" key={candidate.id}>
                <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="problem-copy"><span className={`source-class ${candidate.sources[0]?.sourceClass}`}>{candidate.sources[0]?.sourceClass}</span><h2>{candidate.problem}</h2><p>{candidate.biggerReason}</p><SourceLinks candidate={candidate} /></div>
                <BurstScore candidate={candidate} />
                <div className="row-actions">
                  {candidate.status === "new" ? <><button type="button" title="Shortlist" aria-label="Shortlist problem" onClick={() => setStatus(candidate.id, "shortlisted")}><Bookmark aria-hidden="true" /></button><button type="button" title="Pass" aria-label="Pass on problem" onClick={() => setStatus(candidate.id, "passed")}><X aria-hidden="true" /></button></> : <button type="button" title="Return to shortlist" aria-label="Return to shortlist" onClick={() => setStatus(candidate.id, "shortlisted")}><Bookmark aria-hidden="true" /></button>}
                </div>
              </article>
            )) : <EmptyState title={view === "new" ? "No fresh problems yet" : "Nothing reviewed yet"} copy={view === "new" ? "Run the current-source scan. Empty and partial runs stay explicit; deck examples never fill this space." : "Shortlisted problems appear here after the weekly wrap-up."} />}
          </div>
          <aside className="week-rail">
            <h2>This week</h2>
            <dl><div><dt>Discovered</dt><dd>{candidates.length}</dd></div><div><dt>Shortlisted</dt><dd>{shortlist.length}</dd></div><div><dt>Reviewed</dt><dd>{reviewed.filter((item) => item.status === "reviewed").length}</dd></div></dl>
            <section className="source-health"><h3>Source health</h3>{(["news", "research", "community"] as SourceClass[]).map((source) => <div key={source}><span>{source}</span><strong>{sourceHealth[source]}</strong></div>)}</section>
            <p className="source-note">{result ? `${result.refresh.sourcesSucceeded}/${result.refresh.sourcesAttempted} feeds responded` : "Run discovery to see source health."}</p>
          </aside>
        </section>
      )}
    </main>
  );
}

function BurstScore({ candidate, compact = false }: { candidate: ProblemCandidate; compact?: boolean }) {
  const entries = Object.entries(candidate.score.breakdown);
  return <div className={`burst-score ${compact ? "compact" : ""}`} aria-label={`B.U.R.S.T. score ${candidate.score.total} out of 25`}>
    <div className="burst-bars">{entries.map(([key, value]) => <div key={key} title={candidate.score.reasons[key as keyof typeof candidate.score.reasons]}><span>{burstLetter(key)}</span><i style={{ "--score": value } as React.CSSProperties} /><small>{value}</small></div>)}</div>
    <div className="score-total"><span>Total</span><strong>{candidate.score.total}</strong><small>{candidate.score.grade}</small></div>
  </div>;
}

function SourceLinks({ candidate }: { candidate: ProblemCandidate }) {
  return <div className="source-links">{candidate.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.source}<ExternalLink size={13} aria-hidden="true" /><span>{source.publishedAt}</span></a>)}</div>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) { return <div className="empty-state"><Search aria-hidden="true" /><h2>{title}</h2><p>{copy}</p></div>; }
function burstLetter(key: string) { return ({ biggerReason: "B", unexpectedness: "U", relevancy: "R", specificity: "S", targetedCause: "T" } as Record<string, string>)[key] ?? key[0]; }
function mergeCandidates(next: ProblemCandidate[], current: ProblemCandidate[]) { const existing = new Map(current.map((candidate) => [candidate.id, candidate])); return next.map((candidate) => ({ ...candidate, status: existing.get(candidate.id)?.status ?? candidate.status, notes: existing.get(candidate.id)?.notes ?? candidate.notes })); }
function countSources(result: WeeklyRefreshResult | null): Record<SourceClass, number> { const counts = { news: 0, research: 0, community: 0 }; result?.refresh.signals.forEach((signal) => { counts[signal.sourceClass] += 1; }); return counts; }
function mondayOf(date: Date) { const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); copy.setUTCDate(copy.getUTCDate() - ((copy.getUTCDay() + 6) % 7)); return copy.toISOString().slice(0, 10); }
function nextWeek(weekOf: string) { const copy = new Date(`${weekOf}T12:00:00Z`); copy.setUTCDate(copy.getUTCDate() + 7); return copy.toISOString().slice(0, 10); }
function formatWeek(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
