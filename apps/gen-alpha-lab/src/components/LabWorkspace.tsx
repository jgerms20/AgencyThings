"use client";

import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileText,
  Headphones,
  ImageUp,
  MessageSquareText,
  Upload
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { findings, findingTopics, getSupportingRecords } from "@/lib/findings";
import { getBrowserStorage, readStoredRecords, writeStoredRecords } from "@/lib/local-records";
import { buildRecordFromUpload, normalizeTags } from "@/lib/research-records";
import type { ResearchRecord, SourceClass } from "@/lib/types";

type LabWorkspaceProps = {
  initialRecords: ResearchRecord[];
};

type InterviewIntake = {
  title: string;
  source: string;
  tags: string;
  transcript: string;
};

const sourceClasses: SourceClass[] = [
  "primary research",
  "peer reviewed",
  "journalism",
  "video",
  "community",
  "owned"
];

const blankIntake: InterviewIntake = {
  title: "",
  source: "",
  tags: "interview, media diary",
  transcript: ""
};

export default function LabWorkspace({ initialRecords }: LabWorkspaceProps) {
  const [customRecords, setCustomRecords] = useState<ResearchRecord[]>([]);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const [intake, setIntake] = useState<InterviewIntake>(blankIntake);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [activeSourceClass, setActiveSourceClass] = useState<SourceClass | "all">("all");
  const intakeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isCurrent = true;
    setCustomRecords(readStoredRecords(getBrowserStorage()));
    setIsStorageHydrated(true);

    void fetch("/api/lab-records")
      .then(async (response) => {
        if (!response.ok) return [];
        const payload: { records?: ResearchRecord[] } = await response.json();
        return Array.isArray(payload.records)
          ? payload.records.filter((record) => record.kind === "interview")
          : [];
      })
      .then((persistentInterviews) => {
        if (!isCurrent || persistentInterviews.length === 0) return;
        setCustomRecords((current) => mergeRecords(current, persistentInterviews));
      })
      .catch(() => {
        // Local records remain available when the shared collection cannot be reached.
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!isStorageHydrated) return;
    writeStoredRecords(getBrowserStorage(), customRecords);
  }, [customRecords, isStorageHydrated]);

  const records = useMemo(
    () => mergeRecords(initialRecords, customRecords),
    [customRecords, initialRecords]
  );
  const interviewRecords = useMemo(
    () => records.filter((record) => record.kind === "interview"),
    [records]
  );
  const featuredFindings = useMemo(() => findings.filter((finding) => finding.featured), []);
  const podcast = useMemo(
    () => records.find((record) => record.id === "owned-podcast-093"),
    [records]
  );
  const sourcebookRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          record.kind !== "interview" &&
          (activeSourceClass === "all" || record.sourceClass === activeSourceClass)
      ),
    [activeSourceClass, records]
  );

  function openUpload() {
    setIsUploadOpen(true);
    window.setTimeout(() => {
      if (typeof intakeRef.current?.scrollIntoView === "function") {
        intakeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  }

  async function submitInterview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const uploadedTranscript = await readTranscriptPreview(selectedFile);
    const submission = {
      title: intake.title,
      kind: "interview" as const,
      source: intake.source,
      tags: intake.tags,
      transcript: intake.transcript || uploadedTranscript,
      fileName: selectedFile?.name
    };
    const record = buildRecordFromUpload({ ...submission, sourceClass: "owned" });

    setCustomRecords((current) => [record, ...current]);
    setIntake(blankIntake);
    setSelectedFile(null);
    setFileInputKey((current) => current + 1);
    setSavedMessage("Interview saved to this field guide.");

    try {
      const response = selectedFile
        ? await fetch("/api/uploads", { method: "POST", body: createUploadFormData(record, selectedFile) })
        : await fetch("/api/lab-records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...record, tags: normalizeTags(record.tags) })
          });
      if (!response.ok) {
        setSavedMessage("Interview saved in this browser. The shared copy could not be reached.");
      }
    } catch {
      setSavedMessage("Interview saved in this browser. The shared copy could not be reached.");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gen Alpha Intelligence Lab home">
          Gen Alpha Intelligence Lab
        </a>
        <nav aria-label="Primary navigation">
          {findingTopics.map((topic) => (
            <a href={`#${topic.id}`} key={topic.id}>
              {topic.label}
            </a>
          ))}
        </nav>
        <button className="button upload-button" type="button" onClick={openUpload}>
          Upload interview
          <Upload aria-hidden="true" size={17} />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Understanding the first AI-native childhood.</h1>
          <p>
            Real conversations and direct evidence reveal how Gen Alpha connects, consumes,
            learns, plays, creates, and navigates a world shaped by AI.
          </p>
        </div>
        <div className="featured-grid" aria-label="Featured findings">
          {featuredFindings.map((finding) => (
            <article className="featured-finding" key={finding.id}>
              {finding.heroImage ? <img src={finding.heroImage} alt={finding.heroAlt} /> : null}
              <span>{findingTopics.find((topic) => topic.id === finding.topicId)?.label}</span>
              <h2>{finding.title}</h2>
              <p>{finding.summary}</p>
              <Link href={`/findings/${finding.id}`} aria-label={`Read ${finding.title} in full`}>
                Read finding <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="world-map" aria-labelledby="world-map-heading">
        <div className="section-intro">
          <h2 id="world-map-heading">How their world fits together</h2>
          <p>Seven themes. One interconnected system.</p>
        </div>
        <div className="map-layout">
          <div className="map-lenses" aria-label="Gen Alpha cultural lenses">
            {findingTopics.map((topic) => (
              <a href={`#${topic.id}`} key={topic.id}>
                <strong>{topic.label}</strong>
                <span>{topic.description}</span>
                <ChevronRight aria-hidden="true" size={16} />
              </a>
            ))}
          </div>
          <figure className="culture-map">
            <img src="/gen-alpha-culture-map.png" alt="Collage illustrating Gen Alpha culture around gaming, AI, video, creators, and family." />
          </figure>
        </div>
      </section>

      <section className="findings-section" aria-labelledby="findings-heading">
        <div className="section-intro">
          <h2 id="findings-heading">More findings from real conversations.</h2>
          <p>Explore what the evidence suggests, then inspect the records behind each claim.</p>
        </div>
        {findingTopics.map((topic) => (
          <section className="topic-band" id={topic.id} key={topic.id}>
            <div className="topic-heading">
              <p>{topic.label}</p>
              <h3>{topic.description}</h3>
            </div>
            <div className="topic-findings">
              {findings
                .filter((finding) => finding.topicId === topic.id)
                .map((finding) => {
                  const support = getSupportingRecords(finding, records);
                  return (
                    <article className="finding-story" key={finding.id}>
                      <div>
                        <h4>{finding.title}</h4>
                        <p>{finding.summary}</p>
                        <p className="interpretation">{finding.interpretation}</p>
                        <Link className="finding-detail-link" href={`/findings/${finding.id}`}>
                          Open editorial finding <ArrowUpRight aria-hidden="true" size={15} />
                        </Link>
                      </div>
                      <div className="finding-support">
                        <span>Evidence behind this finding</span>
                        {support.map((record) => (
                          <a href={record.url} target="_blank" rel="noreferrer" key={record.id}>
                            <small>{record.sourceClass}</small>
                            <strong>{record.title}</strong>
                            <ExternalLink aria-hidden="true" size={16} />
                          </a>
                        ))}
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </section>

      {podcast ? (
        <section className="owned-media" aria-labelledby="owned-media-heading">
          <div>
            <Headphones aria-hidden="true" size={24} />
            <p>Owned media</p>
            <h2 id="owned-media-heading">{podcast.title}</h2>
            <p>{podcast.summary}</p>
          </div>
          <div className="podcast-action">
            <span>{podcast.synthesisStatus}</span>
            <a className="button light" href={podcast.url} target="_blank" rel="noreferrer">
              Open Spotify <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </section>
      ) : null}

      <section className="sourcebook" id="sourcebook" aria-labelledby="sourcebook-heading">
        <div className="section-intro sourcebook-intro">
          <div>
            <h2 id="sourcebook-heading">Sourcebook</h2>
            <p>Direct records grouped by what they are, not dressed up as one kind of evidence.</p>
          </div>
          <div className="source-filters" aria-label="Filter sourcebook">
            <button type="button" aria-pressed={activeSourceClass === "all"} className={activeSourceClass === "all" ? "active" : ""} onClick={() => setActiveSourceClass("all")}>All</button>
            {sourceClasses.map((sourceClass) => (
              <button
                type="button"
                aria-pressed={activeSourceClass === sourceClass}
                className={activeSourceClass === sourceClass ? "active" : ""}
                onClick={() => setActiveSourceClass(sourceClass)}
                key={sourceClass}
              >
                {sourceClass}
              </button>
            ))}
          </div>
        </div>
        <div className="sourcebook-list">
          {sourcebookRecords.map((record) => (
            <article className="sourcebook-row" key={record.id}>
              <span>{record.sourceClass}</span>
              <div>
                <h3>{record.title}</h3>
                <p>{record.summary}</p>
              </div>
              <p>{record.source}</p>
              {record.url ? (
                <a aria-label={`Open ${record.title}`} href={record.url} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" size={18} />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="interview-section" id="interviews" aria-labelledby="interviews-heading">
        <div className="section-intro">
          <h2 id="interviews-heading">Interview archive</h2>
          <p>Private working material that can later become qualified qualitative support.</p>
        </div>
        <div className="interview-grid">
          {interviewRecords.map((record) => (
            <article key={record.id}>
              <MessageSquareText aria-hidden="true" size={22} />
              <h3>{record.title}</h3>
              <p>{record.summary}</p>
              <span>{record.source}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={`intake-section ${isUploadOpen ? "open" : ""}`} ref={intakeRef} aria-labelledby="upload-heading">
        <div className="intake-copy">
          <ImageUp aria-hidden="true" size={26} />
          <h2 id="upload-heading">Upload interview</h2>
          <p>Keep names private. Add an alias, context, notes or transcript, and an optional recording or document.</p>
        </div>
        <form className="intake-form" onSubmit={submitInterview}>
          <div className="form-grid">
            <label>
              Interview title
              <input value={intake.title} onChange={(event) => setIntake((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Participant alias
              <input value={intake.source} onChange={(event) => setIntake((current) => ({ ...current, source: event.target.value }))} placeholder="Optional alias" />
            </label>
          </div>
          <label>
            Relationship or context
            <input value={intake.tags} onChange={(event) => setIntake((current) => ({ ...current, tags: event.target.value }))} placeholder="Cousin, neighbor, school, gaming group" />
          </label>
          <label>
            Interview file
            <input key={fileInputKey} type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.mp3,.m4a,.wav,.mp4" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
            <small>{selectedFile ? `${selectedFile.name} ready to attach` : "Optional transcript, notes, audio, video, or document."}</small>
          </label>
          <label>
            Notes or transcript
            <textarea value={intake.transcript} onChange={(event) => setIntake((current) => ({ ...current, transcript: event.target.value }))} placeholder="What did they say, show, or make?" />
          </label>
          <div className="form-actions">
            <p aria-live="polite">{savedMessage}</p>
            <button className="button upload-button" type="submit">Save interview <FileText aria-hidden="true" size={17} /></button>
          </div>
        </form>
      </section>
    </main>
  );
}

function createUploadFormData(record: ResearchRecord, file: File) {
  const formData = new FormData();
  formData.set("id", record.id);
  formData.set("createdAt", record.createdAt);
  formData.set("title", record.title);
  formData.set("kind", record.kind);
  formData.set("source", record.source);
  formData.set("tags", record.tags.join(","));
  formData.set("transcript", record.transcript ?? "");
  formData.set("file", file);
  return formData;
}

function mergeRecords(
  baseRecords: ResearchRecord[],
  additionalRecords: ResearchRecord[]
): ResearchRecord[] {
  const recordsById = new Map(baseRecords.map((record) => [record.id, record]));
  for (const record of additionalRecords) recordsById.set(record.id, record);
  return Array.from(recordsById.values());
}

async function readTranscriptPreview(file: File | null) {
  if (!file || file.size > 1_000_000) return "";
  if (!file.type.startsWith("text/") && !/\.(txt|md|csv|json)$/i.test(file.name)) return "";
  try {
    return await file.text();
  } catch {
    return "";
  }
}
