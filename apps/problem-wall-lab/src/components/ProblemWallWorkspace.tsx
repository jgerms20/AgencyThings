"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Download, FileText, Filter, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { clientBriefs, seedSignals } from "../lib/seed-data";
import { formatProblemSlideText, generateWeeklyWall } from "../lib/problem-wall";
import type { ClientBrief, ProblemCandidate, SourceSignal } from "../lib/types";
import { buildWeeklyWorkflow } from "../lib/workflow";

const WEEK_OF = "2026-07-13";
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
];

export default function ProblemWallWorkspace() {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sourceDraft, setSourceDraft] = useState("");
  const [signals, setSignals] = useState<SourceSignal[]>(seedSignals);
  const [candidates, setCandidates] = useState<ProblemCandidate[]>(() =>
    generateWeeklyWall({ weekOf: WEEK_OF, clients: clientBriefs, signals: seedSignals, limit: 8 })
  );
  const [selectedId, setSelectedId] = useState(candidates[0]?.id ?? "");
  const [exportState, setExportState] = useState("Ready");

  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0];
  const workflow = useMemo(() => buildWeeklyWorkflow(WEEK_OF), []);
  const approvedCount = candidates.filter((candidate) => candidate.status === "approved").length;
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesClient = selectedClient === "all" || candidate.clientId === selectedClient;
    const searchable = `${candidate.problem} ${candidate.opportunity} ${candidate.details} ${candidate.clientName}`.toLowerCase();
    return matchesClient && (!query || searchable.includes(query.toLowerCase()));
  });

  function generatePool() {
    const clients = selectedClient === "all" ? clientBriefs : clientBriefs.filter((client) => client.id === selectedClient);
    const next = generateWeeklyWall({ weekOf: WEEK_OF, clients, signals, limit: 8 });
    setCandidates(next);
    setSelectedId(next[0]?.id ?? "");
    setExportState("Pool refreshed");
  }

  function approveCandidate(id: string) {
    setCandidates((current) =>
      current.map((candidate) => (candidate.id === id ? { ...candidate, status: "approved" } : candidate))
    );
    setExportState("Approved for wall");
  }

  function rejectCandidate(id: string) {
    setCandidates((current) =>
      current.map((candidate) => (candidate.id === id ? { ...candidate, status: "rejected" } : candidate))
    );
    setExportState("Moved out of pool");
  }

  function addSignal() {
    const trimmed = sourceDraft.trim();
    if (!trimmed) return;

    const manualSignal: SourceSignal = {
      id: `manual-${Date.now()}`,
      title: trimmed.slice(0, 92),
      source: "Manual strategy note",
      sourceType: "field-note",
      publishedAt: new Date().toISOString().slice(0, 10),
      audience: inferAudience(trimmed),
      behavior: inferBehavior(trimmed),
      tension: inferTension(trimmed),
      stat: trimmed.match(/\d+%|\d+\s?in\s?\d+|\d+x|\$[\d,.]+/i)?.[0],
      urgency: "a strategist flagged this as relevant for the current wall",
      whyItMatters: "manual signals often capture lived friction before it appears in formal research",
      tags: ["manual", "strategy-note"]
    };

    const nextSignals = [manualSignal, ...signals];
    const nextCandidates = generateWeeklyWall({
      weekOf: WEEK_OF,
      clients: selectedClient === "all" ? clientBriefs : clientBriefs.filter((client) => client.id === selectedClient),
      signals: nextSignals,
      limit: 8
    });
    setSignals(nextSignals);
    setCandidates(nextCandidates);
    setSelectedId(nextCandidates[0]?.id ?? "");
    setSourceDraft("");
    setExportState("Signal added");
  }

  async function copyDeckText() {
    const approved = candidates.filter((candidate) => candidate.status === "approved");
    const exportCandidates = approved.length > 0 ? approved : candidates.slice(0, 4);
    const text = exportCandidates.map(formatProblemSlideText).join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setExportState("Copied deck copy");
    } catch {
      setExportState("Copy unavailable");
    }
  }

  function downloadJson() {
    const payload = JSON.stringify(
      {
        weekOf: WEEK_OF,
        workflow,
        candidates,
        signals: signals.slice(0, 12)
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `problem-wall-${WEEK_OF}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportState("Downloaded JSON");
  }

  return (
    <main className="lab-shell">
      <aside className="side-rail" aria-label="Problem Wall sections">
        <div className="brand-lockup">
          <span className="brand-mark">PW</span>
          <span>Strategy Dept</span>
        </div>
        <nav className="rail-nav">
          {["Weekly Wall", "Sources", "Clients", "Scoring", "Exports"].map((item) => (
            <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <div className="workflow-chip">
          <span>Weekly workflow</span>
          <strong>{workflow.cron}</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="command-bar">
          <div>
            <h1>Problem Wall Lab</h1>
            <p>Week of Jul 13</p>
          </div>
          <div className="command-actions">
            <button type="button" className="icon-button ghost" aria-label="Refresh sources" onClick={generatePool}>
              <RefreshCw aria-hidden="true" size={17} />
              Refresh
            </button>
            <button type="button" className="icon-button primary" onClick={generatePool}>
              <Sparkles aria-hidden="true" size={17} />
              Generate pool
            </button>
            <button type="button" className="icon-button" onClick={copyDeckText}>
              <Clipboard aria-hidden="true" size={17} />
              Export deck
            </button>
          </div>
        </header>

        <section className="workflow-strip" aria-label="Workflow status">
          {workflow.steps.map((step, index) => (
            <div className="workflow-step" key={step.id}>
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <small>{step.owner}</small>
            </div>
          ))}
        </section>

        <section className="tool-grid">
          <div className="wall-column" id="weekly-wall">
            <div className="filter-row">
              <label className="search-box">
                <Search aria-hidden="true" size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search wall" />
              </label>
              <label className="select-box">
                <Filter aria-hidden="true" size={16} />
                <select value={selectedClient} onChange={(event) => setSelectedClient(event.target.value)}>
                  <option value="all">All clients</option>
                  {clientBriefs.map((client) => (
                    <option value={client.id} key={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={downloadJson} className="icon-only" aria-label="Download workflow JSON">
                <Download aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="source-intake" id="sources">
              <textarea
                value={sourceDraft}
                onChange={(event) => setSourceDraft(event.target.value)}
                placeholder="Paste a new signal, stat, Reddit observation, or client friction..."
              />
              <button type="button" onClick={addSignal}>
                Add signal
              </button>
            </div>

            <div className="card-stack">
              {filteredCandidates.map((candidate, index) => (
                <article
                  className={`problem-card ${selectedCandidate?.id === candidate.id ? "selected" : ""}`}
                  key={candidate.id}
                  style={{ "--card-image": `url(${CARD_IMAGES[index % CARD_IMAGES.length]})` } as React.CSSProperties}
                  onClick={() => setSelectedId(candidate.id)}
                >
                  <div className="card-shade" />
                  <div className="card-content">
                    <span className="field-label">Problem</span>
                    <h2>{candidate.problem}</h2>
                    <span className="field-label">Opportunity</span>
                    <p>{candidate.opportunity}</p>
                    <div className="card-meta">
                      <span>{candidate.clientName}</span>
                      <span>B.U.R.S.T. {candidate.score?.total ?? 0}</span>
                      <span className={candidate.status}>{candidate.status}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button type="button" onClick={(event) => { event.stopPropagation(); approveCandidate(candidate.id); }}>
                      <Check aria-hidden="true" size={15} />
                      Approve
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); rejectCandidate(candidate.id); }}>
                      <X aria-hidden="true" size={15} />
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="inspector" aria-label="Selected problem inspector">
            {selectedCandidate ? (
              <>
                <div className="inspector-status">
                  <span>{exportState}</span>
                  <strong>{approvedCount} approved</strong>
                </div>
                <section>
                  <span className="field-label">B.U.R.S.T.</span>
                  <h3>{selectedCandidate.score?.grade ?? "needs work"}</h3>
                  <div className="score-list" id="scoring">
                    {Object.entries(selectedCandidate.score?.breakdown ?? {}).map(([key, value]) => (
                      <div className="score-row" key={key}>
                        <span>{scoreLabel(key)}</span>
                        <meter min={0} max={5} value={value} />
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </section>
                <section id="clients">
                  <span className="field-label">Client fit</span>
                  <h3>{selectedCandidate.clientName}</h3>
                  <p>{clientBriefs.find((client) => client.id === selectedCandidate.clientId)?.positioning}</p>
                </section>
                <section>
                  <span className="field-label">Evidence</span>
                  <p>{selectedCandidate.details}</p>
                  <a href={selectedCandidate.sources[0]?.url ?? "#"}>{selectedCandidate.sources[0]?.source ?? "Source"}</a>
                </section>
                <section>
                  <span className="field-label">Strategist to reach out to</span>
                  <h3>{selectedCandidate.strategist}</h3>
                  <p>{selectedCandidate.email}</p>
                </section>
                <section id="exports">
                  <span className="field-label">Slide copy</span>
                  <pre>{formatProblemSlideText(selectedCandidate)}</pre>
                </section>
              </>
            ) : (
              <div className="empty-state">
                <FileText aria-hidden="true" />
                <p>No candidate selected.</p>
              </div>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function scoreLabel(key: string): string {
  return {
    biggerReason: "Bigger reason",
    unexpectedness: "Unexpected",
    relevancy: "Urgent",
    specificity: "Specific",
    targetedCause: "Solvable"
  }[key] ?? key;
}

function inferAudience(note: string): string {
  const lower = note.toLowerCase();
  if (lower.includes("student")) return "college students";
  if (lower.includes("small business") || lower.includes("sbo")) return "small business owners";
  if (lower.includes("neurodivergent") || lower.includes("adhd")) return "neurodivergent people";
  if (lower.includes("gamer")) return "women gamers";
  if (lower.includes("worker")) return "workers";
  return "people closest to the behavior";
}

function inferBehavior(note: string): string {
  return note
    .replace(/\s+/g, " ")
    .replace(/[.?!]$/, "")
    .slice(0, 120)
    .toLowerCase();
}

function inferTension(note: string): string {
  const because = note.split(/\bbecause\b/i)[1];
  if (because) return because.trim().replace(/[.?!]$/, "").slice(0, 140);
  return "the behavior is showing up before brands have a useful response";
}
