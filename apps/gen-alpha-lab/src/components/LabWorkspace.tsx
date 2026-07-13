"use client";

import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Database,
  Filter,
  MessageSquareText,
  Plus,
  Search,
  Upload
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  buildRecordFromUpload,
  filterRecords,
  normalizeTags,
  summarizeLibrary
} from "@/lib/research-records";
import { statusLabels, type Signal } from "@/lib/seed-data";
import type { FilterState, ResearchKind, ResearchRecord, ReviewStatus } from "@/lib/types";

type LabWorkspaceProps = {
  initialRecords: ResearchRecord[];
  signals: Signal[];
};

type IntakeState = {
  title: string;
  kind: ResearchKind;
  source: string;
  tags: string;
  transcript: string;
  url: string;
};

const kindLabels: Record<ResearchKind, string> = {
  report: "Report",
  article: "Article",
  podcast: "Podcast",
  interview: "Interview",
  "field-note": "Field note"
};

const blankIntake: IntakeState = {
  title: "Interview slot: cousin media diary",
  kind: "interview",
  source: "Field interview",
  tags: "interview, media diary, family",
  transcript: "",
  url: ""
};

const localStorageKey = "gen-alpha-lab-records";

export default function LabWorkspace({ initialRecords, signals }: LabWorkspaceProps) {
  const [customRecords, setCustomRecords] = useState<ResearchRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>({ kind: "all", status: "all", tag: "all" });
  const [intake, setIntake] = useState<IntakeState>(blankIntake);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<"demo" | "supabase">("demo");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(localStorageKey);
    if (stored) {
      setCustomRecords(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(customRecords));
  }, [customRecords]);

  const records = useMemo(
    () => [...customRecords, ...initialRecords],
    [customRecords, initialRecords]
  );
  const summary = useMemo(() => summarizeLibrary(records), [records]);
  const allTags = useMemo(
    () => Array.from(new Set(records.flatMap((record) => record.tags))).sort(),
    [records]
  );
  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters]);
  const interviewRecords = useMemo(
    () => filterRecords(records, { kind: "interview" }),
    [records]
  );

  function openForm() {
    setIsFormOpen(true);
    window.setTimeout(() => {
      if (typeof formRef.current?.scrollIntoView === "function") {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }

  async function submitRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const uploadedTranscript = await readTranscriptPreview(selectedFile);
    const record = buildRecordFromUpload({
      title: intake.title,
      kind: intake.kind,
      source: intake.source,
      tags: intake.tags,
      transcript: intake.transcript || uploadedTranscript,
      url: intake.url,
      fileName: selectedFile?.name
    });

    setCustomRecords((current) => [record, ...current]);
    setIntake(blankIntake);
    setSelectedFile(null);
    setFileInputKey((current) => current + 1);
    setIsFormOpen(false);

    try {
      const response = selectedFile
        ? await fetch("/api/uploads", {
            method: "POST",
            body: createUploadFormData(intake, selectedFile)
          })
        : await fetch("/api/lab-records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...record,
              tags: normalizeTags(record.tags)
            })
          });
      const payload = await response.json();
      if (payload.mode === "supabase") {
        setMode("supabase");
      }
    } catch {
      setMode("demo");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gen Alpha Intelligence Lab home">
          <span className="brand-mark">GA</span>
          <span>Gen Alpha Intelligence Lab</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#signals">Signals</a>
          <a href="#evidence">Evidence</a>
          <a href="#interviews">Interviews</a>
          <a href="#lab">Lab</a>
        </nav>
        <button className="button primary" type="button" onClick={openForm}>
          <Plus aria-hidden="true" size={18} />
          Add source
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>The first AI-native youth culture is already here.</h1>
          <p>
            A living agency research lab for mapping how Gen Alpha spends time,
            learns, shops, creates, and differs from Gen Z.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#signals">
              Map signals
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <button className="button ghost" type="button" onClick={openForm}>
              <Upload aria-hidden="true" size={18} />
              Upload interview
            </button>
          </div>
          <dl className="stat-strip" aria-label="Research library summary">
            <div>
              <dt>{summary.total}</dt>
              <dd>records</dd>
            </div>
            <div>
              <dt>{summary.reviewed}</dt>
              <dd>reviewed</dd>
            </div>
            <div>
              <dt>{summary.interviews}</dt>
              <dd>interviews</dd>
            </div>
          </dl>
        </div>

        <div className="evidence-wall" aria-label="Current signal wall">
          <div className="wall-header">
            <span>Live signal map</span>
            <span className={`mode-chip ${mode}`}>{mode === "supabase" ? "Persistent" : "Demo mode"}</span>
          </div>
          <figure className="culture-frame">
            <img
              src="/gen-alpha-culture-map.png"
              alt=""
              aria-hidden="true"
            />
            <figcaption>AI, games, video, creators, family influence</figcaption>
          </figure>
          <div className="signal-grid-mini">
            {signals.slice(0, 6).map((signal) => (
              <article className="signal-node" key={signal.id}>
                <span className={`confidence ${signal.confidence}`}>{signal.confidence}</span>
                <h2>{signal.title}</h2>
                <p>{signal.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="queue-panel" aria-label="Research queue">
          <div className="panel-title">
            <Database aria-hidden="true" size={18} />
            Research queue
          </div>
          {records.slice(0, 4).map((record) => (
            <article className="queue-item" key={record.id}>
              <span>{kindLabels[record.kind]}</span>
              <strong>{record.title}</strong>
            </article>
          ))}
        </aside>
      </section>

      <section className="section signal-section" id="signals">
        <div className="section-heading">
          <h2>Signal map</h2>
          <p>Working hypotheses for where Gen Alpha is already distinct from Gen Z.</p>
        </div>
        <div className="signal-map">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.id}>
              <div className="card-topline">
                <span className={`confidence ${signal.confidence}`}>{signal.confidence}</span>
                <span>{signal.evidenceIds.length} sources</span>
              </div>
              <h3>{signal.title}</h3>
              <p>{signal.summary}</p>
              <div className="comparison">
                <div>
                  <strong>Gen Alpha read</strong>
                  <span>{signal.genAlphaRead}</span>
                </div>
                <div>
                  <strong>Gen Z contrast</strong>
                  <span>{signal.genZContrast}</span>
                </div>
              </div>
              <div className="tag-row">
                {signal.tags.map((tag) => (
                  <button
                    className="tag"
                    type="button"
                    key={tag}
                    onClick={() => setFilters((current) => ({ ...current, tag }))}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section evidence-section" id="evidence">
        <div className="section-heading split">
          <div>
            <h2>Evidence library</h2>
            <p>Reports, articles, podcasts, and field notes with status and confidence attached.</p>
          </div>
          <button className="button primary" type="button" onClick={openForm}>
            <Plus aria-hidden="true" size={18} />
            Add source
          </button>
        </div>

        <div className="filters" aria-label="Evidence filters">
          <label className="search-box">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">Search records</span>
            <input
              placeholder="Search sources, tags, notes"
              value={filters.query ?? ""}
              onChange={(event) =>
                setFilters((current) => ({ ...current, query: event.target.value }))
              }
            />
          </label>
          <label>
            <Filter aria-hidden="true" size={16} />
            Evidence type
            <select
              value={filters.kind ?? "all"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  kind: event.target.value as FilterState["kind"]
                }))
              }
            >
              <option value="all">All</option>
              {Object.entries(kindLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={filters.status ?? "all"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as ReviewStatus | "all"
                }))
              }
            >
              <option value="all">All</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tag
            <select
              value={filters.tag ?? "all"}
              onChange={(event) => setFilters((current) => ({ ...current, tag: event.target.value }))}
            >
              <option value="all">All</option>
              {allTags.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="record-list">
          {filteredRecords.map((record) => (
            <article className="record-row" key={record.id}>
              <div className="record-kind">{kindLabels[record.kind]}</div>
              <div className="record-main">
                <h3>{record.title}</h3>
                <p>{record.summary}</p>
                <div className="tag-row">
                  {record.tags.map((tag) => (
                    <span className="tag passive" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="record-meta">
                <span className={`status ${record.status}`}>{statusLabels[record.status]}</span>
                <span className={`confidence ${record.confidence}`}>{record.confidence}</span>
                {record.url ? (
                  <a href={record.url} target="_blank" rel="noreferrer">
                    Open
                    <ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section interview-section" id="interviews">
        <div className="section-heading">
          <h2>Interview archive</h2>
          <p>Use this as the home for cousin interviews, notes, transcripts, and patterns.</p>
        </div>
        <div className="interview-grid">
          {interviewRecords.map((record) => (
            <article className="interview-card" key={record.id}>
              <MessageSquareText aria-hidden="true" size={22} />
              <h3>{record.title}</h3>
              <p>{record.summary}</p>
              <span>{record.source}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section lab-section" id="lab" ref={formRef}>
        <div className="lab-copy">
          <BookOpen aria-hidden="true" size={24} />
          <h2>Lab intake</h2>
          <p>
            Add interviews, source links, podcast leads, or field notes. When Supabase is configured on
            Vercel, these records persist for the shared team app.
          </p>
        </div>

        <form className={`intake-form ${isFormOpen ? "open" : ""}`} onSubmit={submitRecord}>
          <div className="form-grid">
            <label>
              Record title
              <input
                value={intake.title}
                onChange={(event) => setIntake((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </label>
            <label>
              Record type
              <select
                value={intake.kind}
                onChange={(event) =>
                  setIntake((current) => ({ ...current, kind: event.target.value as ResearchKind }))
                }
              >
                {Object.entries(kindLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Source name
              <input
                value={intake.source}
                onChange={(event) => setIntake((current) => ({ ...current, source: event.target.value }))}
              />
            </label>
            <label>
              Source tags
              <input
                value={intake.tags}
                onChange={(event) => setIntake((current) => ({ ...current, tags: event.target.value }))}
                placeholder="AI, Roblox, family"
              />
            </label>
          </div>
          <label>
            URL
            <input
              value={intake.url}
              onChange={(event) => setIntake((current) => ({ ...current, url: event.target.value }))}
              placeholder="https://"
            />
          </label>
          <label className="file-control">
            Interview file
            <input
              key={fileInputKey}
              type="file"
              accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.mp3,.m4a,.wav,.mp4"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <span>
              {selectedFile
                ? `${selectedFile.name} ready`
                : "Attach a transcript, note file, audio, video, or source document."}
            </span>
          </label>
          <label>
            Notes or transcript
            <textarea
              value={intake.transcript}
              onChange={(event) =>
                setIntake((current) => ({ ...current, transcript: event.target.value }))
              }
              placeholder="Paste interview notes, a transcript excerpt, or a source summary."
            />
          </label>
          <div className="form-actions">
            <div className="privacy-note">
              <Brain aria-hidden="true" size={16} />
              Private-by-default lab data; do not paste sensitive client material into public demos.
            </div>
            <button className="button primary" type="submit">
              Save to lab
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function createUploadFormData(intake: IntakeState, file: File) {
  const formData = new FormData();
  formData.set("title", intake.title);
  formData.set("kind", intake.kind);
  formData.set("source", intake.source);
  formData.set("tags", intake.tags);
  formData.set("url", intake.url);
  formData.set("transcript", intake.transcript);
  formData.set("file", file);
  return formData;
}

async function readTranscriptPreview(file: File | null) {
  if (!file || file.size > 1_000_000) {
    return "";
  }

  const readableTextFile = file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name);

  if (!readableTextFile) {
    return "";
  }

  try {
    return await file.text();
  } catch {
    return "";
  }
}
