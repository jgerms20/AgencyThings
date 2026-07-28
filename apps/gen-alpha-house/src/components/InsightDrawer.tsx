import { ArrowUpRight, X } from "lucide-react";
import type { RoomObject } from "@/lib/house-types";

type InsightDrawerProps = {
  object: RoomObject;
  onClose: () => void;
};

export default function InsightDrawer({ object, onClose }: InsightDrawerProps) {
  return (
    <aside
      className="insight-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={object.title}
      style={{ "--drawer-accent": object.accent } as React.CSSProperties}
    >
      <header className="drawer-header">
        <span>Object insight set</span>
        <button type="button" aria-label="Close insight" onClick={onClose} autoFocus>
          <X aria-hidden="true" size={20} />
        </button>
      </header>
      <div className="drawer-body">
        <div className="drawer-object">
          <span className="drawer-signal" aria-hidden="true" />
          {object.object}
        </div>
        <h2>{object.title}</h2>
        <p className="drawer-thesis">{object.thesis}</p>
        <p className="drawer-context">{object.context}</p>

        <section className="drawer-insights" aria-label={`${object.object} insights`}>
          {object.insights.map((insight, index) => (
            <article className="drawer-insight-card" key={`${object.id}-${insight.id}`}>
              <div className="insight-card-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{insight.confidence} confidence</span>
                <span>{insight.evidenceCount} evidence items</span>
              </div>
              <h3>{insight.title}</h3>
              <p>{insight.thesis}</p>
              <div className="insight-card-scope">{insight.scope}</div>
              <p className="insight-card-sources">{insight.sources.join(" · ")}</p>
              <a
                className="drawer-link"
                href={insight.labUrl}
                aria-label={insight.linkLabel ?? `Open ${insight.title} in the Intelligence Lab`}
              >
                {insight.linkLabel ?? "Open exact insight"}
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              <a
                className="drawer-source-link"
                href={insight.sourceUrl}
                rel="noreferrer"
                target="_blank"
                aria-label={`Read source for ${insight.title}`}
              >
                Read source
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            </article>
          ))}
        </section>
      </div>
    </aside>
  );
}
