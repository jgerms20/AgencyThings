"use client";

import { Bookmark, BookOpen, CalendarDays, Check, ChevronRight, ExternalLink, FlaskConical, Globe2, Library, Menu, Mic2, Moon, Plus, RefreshCw, Search, Sparkles, Sun, Users, X } from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import { createInitialWorkspace, loadStories, loadWorkspace, reduceWorkspace, saveStories, saveWorkspace, selectStoriesForPersistence } from "@/lib/editorial-store";
import { connectorSeeds, seedStories } from "@/lib/seed-data";
import type { ConnectorStatus, CulturalDomain, MonthlySection, Story, WorkspaceState } from "@/lib/types";

type View = "today" | "saved" | "storylines" | "monthly";
const nav: Array<{ id: View; label: string }> = [{ id: "today", label: "Today" }, { id: "saved", label: "Saved" }, { id: "storylines", label: "Storylines" }, { id: "monthly", label: "Monthly" }];
const sections: Array<{ id: MonthlySection; label: string }> = [
  { id: "trends", label: "Trends to Watch" }, { id: "creative", label: "Creative That Matters" }, { id: "culture", label: "Culture Corner" }, { id: "pick", label: "Monthly Pick" }, { id: "provocation", label: "Provocation" }
];

export function HydrationRefreshApp() {
  const [view, setView] = useState<View>("today");
  const [workspace, dispatch] = useReducer(reduceWorkspace, undefined, createInitialWorkspace);
  const [stories, setStories] = useState<Story[]>(seedStories);
  const [statuses, setStatuses] = useState<ConnectorStatus[]>(connectorSeeds);
  const [domain, setDomain] = useState<CulturalDomain | "all">("all");
  const [sourceKind, setSourceKind] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(seedStories[0].id);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [storylineTitle, setStorylineTitle] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadWorkspace(globalThis.localStorage);
    const persistedStories = loadStories(globalThis.localStorage);
    setStories(mergeStories(persistedStories, seedStories));
    dispatch({ type: "hydrate", state: { ...loaded, feedStoryIds: loaded.feedStoryIds.length ? loaded.feedStoryIds : seedStories.map(({ id }) => id) } });
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveWorkspace(globalThis.localStorage, workspace); }, [workspace, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    const persisted = selectStoriesForPersistence(stories, new Set(Object.keys(workspace.saved)));
    if (!saveStories(globalThis.localStorage, persisted)) setNotice("Browser storage is full. Remove older unsaved signals before refreshing again.");
  }, [stories, workspace.saved, hydrated]);

  const filteredStories = useMemo(() => stories.filter((story) =>
    (domain === "all" || story.domain === domain) &&
    (sourceKind === "all" || story.sourceKind === sourceKind) &&
    `${story.headline} ${story.dek} ${story.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [stories, domain, sourceKind, query]);

  const savedStories = stories.filter(({ id }) => workspace.saved[id]);
  const selected = stories.find(({ id }) => id === selectedId) ?? filteredStories[0];

  async function refreshAll() {
    setRefreshing(true); setNotice("");
    setStatuses((current) => current.map((status) => status.status === "needs-credentials" ? status : { ...status, status: "refreshing", message: "Checking source" }));
    try {
      const response = await fetch("/api/refresh", { method: "POST" });
      if (!response.ok) throw new Error(`Refresh failed (${response.status})`);
      const data = await response.json() as { stories: Story[]; run: { statuses: ConnectorStatus[]; addedCount: number } };
      const merged = selectStoriesForPersistence(mergeStories(data.stories, stories), new Set(Object.keys(workspace.saved)));
      setStories(merged);
      setStatuses(data.run.statuses.length ? data.run.statuses : connectorSeeds);
      dispatch({ type: "replace-feed", storyIds: merged.map(({ id }) => id) });
      setNotice(data.run.addedCount ? `${data.run.addedCount} fresh signals added.` : "Refresh complete. No new signals this time.");
    } catch (error) {
      setStatuses(connectorSeeds.map((status) => status.status === "needs-credentials" ? status : { ...status, status: "stale", message: "Last good results preserved" }));
      setNotice(error instanceof Error ? error.message : "Refresh failed. Last good results preserved.");
    } finally { setRefreshing(false); }
  }

  function saveStory(storyId: string) { dispatch({ type: "toggle-save", storyId }); }

  return (
    <main className="app-shell" data-theme={theme}>
      <header className="topbar">
        <button className="mobile-menu" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
        <button className="wordmark" type="button" onClick={() => setView("today")}>The Hydration Refresh <span>↗</span></button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Workspace views">
          {nav.map((item) => <button key={item.id} type="button" className={view === item.id ? "is-active" : ""} onClick={() => { setView(item.id); setMenuOpen(false); }}>{item.label}</button>)}
        </nav>
        <div className="top-actions"><time>July 22, 2026</time><button type="button" className="theme-button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</button></div>
      </header>

      {view === "today" && <>
        <section className="hero-band">
          <div><h1>What culture is telling us today.</h1><p>Fresh signals across sport, wellness, entertainment, technology, creators, communities, and behavior.</p></div>
          <button className="primary-command" type="button" onClick={refreshAll} disabled={refreshing}><RefreshCw className={refreshing ? "is-spinning" : ""} />{refreshing ? "Refreshing sources" : "Refresh all sources"}</button>
        </section>
        <SourceStatus statuses={statuses} />
        {notice && <p className="refresh-notice" role="status">{notice}</p>}
        <section className="workspace-grid">
          <div className="feed-column">
            <div className="filterbar">
              <div className="domain-tabs" aria-label="Culture filters">{(["all", "sport", "wellness", "culture", "technology", "entertainment"] as const).map((item) => <button type="button" key={item} className={domain === item ? "is-active" : ""} onClick={() => setDomain(item)}>{item === "all" ? "All" : titleCase(item)}</button>)}</div>
              <label className="select-control"><span className="sr-only">Source type</span><select value={sourceKind} onChange={(event) => setSourceKind(event.target.value)}><option value="all">All types</option><option value="publication">Publications</option><option value="community">Community</option><option value="study">Studies</option><option value="podcast">Podcasts</option><option value="event">Events</option></select></label>
              <label className="search-control"><Search /><span className="sr-only">Search stories</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label>
            </div>
            <div className="story-list">{filteredStories.map((story) => <StoryRow key={story.id} story={story} selected={selected?.id === story.id} saved={Boolean(workspace.saved[story.id])} onSelect={() => setSelectedId(story.id)} onSave={() => saveStory(story.id)} />)}</div>
            {selected && <StoryDetail story={selected} saved={workspace.saved[selected.id]} storylines={workspace.storylines} onNotes={(notes) => dispatch({ type: "update-notes", storyId: selected.id, notes })} onSave={() => saveStory(selected.id)} onStoryline={(storylineId) => dispatch({ type: "assign-storyline", storyId: selected.id, storylineId })} onMonthly={(section) => dispatch({ type: "assign-monthly", storyId: selected.id, section })} />}
          </div>
          <MonthRail workspace={workspace} stories={stories} onOpenMonthly={() => setView("monthly")} />
        </section>
      </>}

      {view === "saved" && <SavedView stories={savedStories} workspace={workspace} onSelect={(id) => { setSelectedId(id); setView("today"); }} onRemove={saveStory} />}
      {view === "storylines" && <StorylinesView stories={stories} workspace={workspace} title={storylineTitle} setTitle={setStorylineTitle} onCreate={() => { dispatch({ type: "create-storyline", title: storylineTitle }); setStorylineTitle(""); }} />}
      {view === "monthly" && <MonthlyView stories={stories} workspace={workspace} dispatch={dispatch} />}
    </main>
  );
}

function SourceStatus({ statuses }: { statuses: ConnectorStatus[] }) {
  const icons = { news: Globe2, reddit: Users, podcasts: Mic2, studies: FlaskConical, events: CalendarDays, x: X };
  return <section className="source-strip" aria-label="Source refresh status"><div className="source-title"><strong>Source refresh status</strong><span>Coverage stays visible</span></div>{statuses.map((status) => { const Icon = icons[status.id as keyof typeof icons] ?? Globe2; return <div className="source-item" key={status.id}><Icon /><span><strong>{status.label}</strong><small data-status={status.status}>{status.status === "needs-credentials" ? "Connect API" : titleCase(status.status)}</small></span></div>; })}</section>;
}

function StoryRow({ story, selected, saved, onSelect, onSave }: { story: Story; selected: boolean; saved: boolean; onSelect: () => void; onSave: () => void }) {
  return <article className={selected ? "story-row is-selected" : "story-row"} onClick={onSelect}>
    <div className={`story-art domain-${story.domain}`} aria-hidden="true"><span>{story.sourceKind === "podcast" ? <Mic2 /> : story.sourceKind === "study" ? <FlaskConical /> : story.sourceKind === "event" ? <CalendarDays /> : <Sparkles />}</span></div>
    <div className="story-copy"><p className="story-meta">{story.sourceName}<span>{titleCase(story.sourceKind)}</span><span>{relativeDate(story.publishedAt)}</span></p><h2>{story.headline}</h2><p>{story.dek}</p><div className="tags">{story.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    <div className="why-watch"><strong>Why watch</strong><p>{story.whyItMatters}</p><a href={story.sourceUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{story.sourceName}<ExternalLink /></a></div>
    <button type="button" className={saved ? "save-button is-saved" : "save-button"} aria-label={`${saved ? "Remove" : "Save"} ${story.headline}`} onClick={(event) => { event.stopPropagation(); onSave(); }}>{saved ? <Check /> : <Bookmark />}</button>
  </article>;
}

function StoryDetail({ story, saved, storylines, onNotes, onSave, onStoryline, onMonthly }: { story: Story; saved?: { notes: string }; storylines: WorkspaceState["storylines"]; onNotes: (value: string) => void; onSave: () => void; onStoryline: (id: string) => void; onMonthly: (section: MonthlySection) => void }) {
  return <section className="story-detail"><div><h3>What happened</h3><p>{story.whatHappened}</p><h3>Source</h3><a href={story.sourceUrl} target="_blank" rel="noreferrer">Open original<ExternalLink /></a></div><div><h3>Why it matters</h3><p>{story.whyItMatters}</p>{story.gatoradeImplication && <><h3>Hydration implication</h3><p>{story.gatoradeImplication}</p></>}</div><div className="detail-actions"><label>Notes<textarea value={saved?.notes ?? ""} placeholder="Add your perspective..." onChange={(event) => onNotes(event.target.value)} /></label><div className="action-row"><button type="button" onClick={onSave}><Bookmark />{saved ? "Remove saved" : "Save story"}</button><select aria-label="Add to storyline" defaultValue="" onChange={(event) => { if (event.target.value) onStoryline(event.target.value); }}><option value="">Add to storyline</option>{storylines.map((line) => <option key={line.id} value={line.id}>{line.title}</option>)}</select><select aria-label="Add to monthly section" defaultValue="" onChange={(event) => { if (event.target.value) onMonthly(event.target.value as MonthlySection); }}><option value="">Add to monthly</option>{sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}</select></div></div></section>;
}

function MonthRail({ workspace, stories, onOpenMonthly }: { workspace: WorkspaceState; stories: Story[]; onOpenMonthly: () => void }) {
  const activeLines = workspace.storylines.slice(0, 3);
  return <aside className="month-rail"><div className="rail-heading"><h2>Building this month</h2><span>{Object.keys(workspace.saved).length} saved</span></div><div className="storyline-preview">{activeLines.length ? activeLines.map((line) => <div key={line.id}><Library /><span><strong>{line.title}</strong><small>{line.storyIds.length} stories</small></span><ChevronRight /></div>) : <p>Save stories and group them into a point of view.</p>}</div><div className="rail-heading"><h2>July draft</h2><span>Live</span></div><div className="section-progress">{sections.map((section) => <button type="button" key={section.id} onClick={onOpenMonthly}><span>{section.label}</span><strong>{workspace.monthly.sections[section.id].length}</strong><ChevronRight /></button>)}</div><button type="button" className="open-monthly" onClick={onOpenMonthly}><BookOpen />Open monthly builder<ChevronRight /></button></aside>;
}

function SavedView({ stories, workspace, onSelect, onRemove }: { stories: Story[]; workspace: WorkspaceState; onSelect: (id: string) => void; onRemove: (id: string) => void }) {
  return <section className="page-view"><header><h1>Your saved signals.</h1><p>A persistent reading list for the moments worth returning to.</p></header>{stories.length ? <div className="saved-list">{stories.map((story) => <article key={story.id}><div><p>{story.sourceName} · {titleCase(story.domain)}</p><h2>{story.headline}</h2><p>{workspace.saved[story.id]?.notes || story.whyItMatters}</p></div><div><button type="button" onClick={() => onSelect(story.id)}>Open<ChevronRight /></button><button type="button" aria-label={`Remove ${story.headline}`} onClick={() => onRemove(story.id)}><X /></button></div></article>)}</div> : <EmptyState title="Nothing saved yet" copy="Save the signals that deserve another look." />}</section>;
}

function StorylinesView({ stories, workspace, title, setTitle, onCreate }: { stories: Story[]; workspace: WorkspaceState; title: string; setTitle: (value: string) => void; onCreate: () => void }) {
  return <section className="page-view"><header><h1>Build the larger story.</h1><p>Connect individual moments until a sharper cultural pattern emerges.</p></header><form className="new-storyline" onSubmit={(event) => { event.preventDefault(); onCreate(); }}><label><span>Storyline title</span><input aria-label="Storyline title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Fast instincts beat big plans" /></label><button type="submit"><Plus />Create storyline</button></form><div className="storyline-list">{workspace.storylines.map((line) => <article key={line.id}><Library /><div><h2>{line.title}</h2><p>{line.storyIds.length ? line.storyIds.map((id) => stories.find((story) => story.id === id)?.headline).filter(Boolean).join(" · ") : "No stories assigned yet."}</p></div><strong>{line.storyIds.length}</strong></article>)}</div></section>;
}

function MonthlyView({ stories, workspace, dispatch }: { stories: Story[]; workspace: WorkspaceState; dispatch: React.Dispatch<Parameters<typeof reduceWorkspace>[1]> }) {
  return <section className="monthly-view"><header><div><h1>Shape the July issue.</h1><p>Move from accumulated signals to one ownable perspective.</p></div><div className="issue-date">July 2026</div></header><section className="theme-editor"><label>Monthly theme<textarea value={workspace.monthly.theme} onChange={(event) => dispatch({ type: "update-monthly-copy", field: "theme", value: event.target.value })} placeholder="What connects this month's strongest stories?" /></label><label>Gatorade learning<textarea value={workspace.monthly.learning} onChange={(event) => dispatch({ type: "update-monthly-copy", field: "learning", value: event.target.value })} placeholder="What should the brand understand or do differently?" /></label></section><div className="monthly-sections">{sections.map((section) => <section key={section.id}><header><h2>{section.label}</h2><strong>{workspace.monthly.sections[section.id].length}</strong></header>{workspace.monthly.sections[section.id].map((storyId) => { const story = stories.find(({ id }) => id === storyId); return story ? <article key={story.id}><span>{story.sourceName}</span><h3>{story.headline}</h3><p>{story.whyItMatters}</p></article> : null; })}{!workspace.monthly.sections[section.id].length && <p className="section-empty">Assign a saved signal from Today.</p>}{section.id === "pick" && <div className="pick-editor"><label>Prediction<textarea value={workspace.monthly.prediction} onChange={(event) => dispatch({ type: "update-monthly-copy", field: "prediction", value: event.target.value })} placeholder="What do you expect to happen next?" /></label><label>Why we are watching<textarea value={workspace.monthly.whyWatching} onChange={(event) => dispatch({ type: "update-monthly-copy", field: "whyWatching", value: event.target.value })} placeholder="What evidence would strengthen or challenge this call?" /></label><label className="confidence">Prediction confidence <input type="range" min="1" max="5" value={workspace.monthly.confidence} onChange={(event) => dispatch({ type: "update-confidence", value: Number(event.target.value) })} /><strong>{workspace.monthly.confidence}/5</strong></label></div>}{section.id === "provocation" && <textarea className="provocation-input" value={workspace.monthly.provocation} onChange={(event) => dispatch({ type: "update-monthly-copy", field: "provocation", value: event.target.value })} placeholder="What question should the client leave debating?" />}</section>)}</div></section>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) { return <div className="empty-view"><Bookmark /><h2>{title}</h2><p>{copy}</p></div>; }
function titleCase(value: string) { return value.replace(/(^|[-\s])\w/g, (match) => match.toUpperCase()); }
function relativeDate(value: string) { const days = Math.max(0, Math.round((Date.now() - Date.parse(value)) / 86_400_000)); return days === 0 ? "Today" : `${days}d ago`; }
function mergeStories(incoming: Story[], current: Story[]) { const map = new Map(current.map((story) => [story.sourceUrl, story])); incoming.forEach((story) => map.set(story.sourceUrl, story)); return [...map.values()]; }
