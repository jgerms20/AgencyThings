"use client";

import { ArrowUpRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getCultureShaperImage, type CultureShaper } from "@/lib/content/culture-shapers";
import type { CultureShaperDirectoryType } from "@/lib/content/types";

type InfluencerFiltersProps = {
  shapers: CultureShaper[];
};

const typeOptions: Array<{ value: CultureShaperDirectoryType; label: string }> = [
  { value: "all", label: "All types" },
  { value: "creator", label: "Creator" },
  { value: "artist", label: "Artist" },
  { value: "athlete", label: "Athlete" },
  { value: "ip", label: "IP" },
];

const ageOptions = ["all", "1-5", "3-8", "6-9", "8-12", "10-14", "13-18"];

function optionsFor(shapers: CultureShaper[], key: "topics" | "platforms" | "formats" | "audienceSegments") {
  return [...new Set(shapers.flatMap((shaper) => shaper[key]))].sort((left, right) => left.localeCompare(right));
}

function overlapsAge(profileRange: string, selectedRange: string) {
  if (selectedRange === "all") return true;
  const profile = profileRange.match(/(\d+)-(\d+)/);
  const selected = selectedRange.match(/(\d+)-(\d+)/);
  if (!profile || !selected) return false;
  return Number(profile[1]) <= Number(selected[2]) && Number(selected[1]) <= Number(profile[2]);
}

function interleaveCultureTypes(shapers: CultureShaper[]) {
  const groups = new Map<string, CultureShaper[]>();
  for (const shaper of shapers) {
    const group = groups.get(shaper.type) ?? [];
    group.push(shaper);
    groups.set(shaper.type, group);
  }

  const result: CultureShaper[] = [];
  while ([...groups.values()].some((group) => group.length > 0)) {
    for (const type of ["creator", "artist", "athlete", "screen-ip", "franchise"]) {
      const next = groups.get(type)?.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

export default function InfluencerFilters({ shapers }: InfluencerFiltersProps) {
  const [type, setType] = useState<CultureShaperDirectoryType>("all");
  const [age, setAge] = useState("all");
  const [topic, setTopic] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [format, setFormat] = useState("all");
  const [segment, setSegment] = useState("all");

  const filtered = useMemo(
    () => interleaveCultureTypes(shapers.filter((shaper) =>
      (type === "all" || (type === "ip" ? shaper.type === "screen-ip" || shaper.type === "franchise" : shaper.type === type))
      && overlapsAge(shaper.audience.ageRange, age)
      && (topic === "all" || shaper.topics.includes(topic))
      && (platform === "all" || shaper.platforms.includes(platform))
      && (format === "all" || shaper.formats.includes(format))
      && (segment === "all" || shaper.audienceSegments.includes(segment)))),
    [age, format, platform, segment, shapers, topic, type],
  );

  const clear = () => {
    setType("all");
    setAge("all");
    setTopic("all");
    setPlatform("all");
    setFormat("all");
    setSegment("all");
  };

  const resultLabel = type === "all"
    ? `${filtered.length} culture shapers shown`
    : `${filtered.length} ${type === "ip" ? "IP profiles" : `${type}s`} shown`;

  return (
    <section className="culture-shaper-directory" aria-label="Culture shaper directory">
      <div className="influencer-filter-controls">
        <fieldset>
          <legend>Type</legend>
          <div>
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={type === option.value}
                onClick={() => setType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="influencer-filter-selects">
          <label>Audience age<select aria-label="Audience age" value={age} onChange={(event) => setAge(event.target.value)}>{ageOptions.map((value) => <option value={value} key={value}>{value === "all" ? "All ages" : value}</option>)}</select></label>
          <label>Topic<select aria-label="Topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">All topics</option>{optionsFor(shapers, "topics").map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label>Platform<select aria-label="Platform" value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="all">All platforms</option>{optionsFor(shapers, "platforms").map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label>Format<select aria-label="Format" value={format} onChange={(event) => setFormat(event.target.value)}><option value="all">All formats</option>{optionsFor(shapers, "formats").map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label>Audience segment<select aria-label="Audience segment" value={segment} onChange={(event) => setSegment(event.target.value)}><option value="all">All segments</option>{optionsFor(shapers, "audienceSegments").map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        </div>

        <div className="influencer-filter-summary">
          <p role="status" aria-live="polite">{resultLabel}</p>
          <button type="button" onClick={clear} aria-label="Clear all filters">
            <RotateCcw aria-hidden="true" size={16} /> Clear all
          </button>
        </div>
      </div>

      <div className="influencer-directory" aria-label="Influencers shaping Gen Alpha culture">
        {filtered.map((shaper, index) => (
          <article data-testid={shaper.type === "creator" ? "influencer-card" : "culture-shaper-card"} key={shaper.id}>
            <Link href={`/influencers/${shaper.id}`} aria-label={`Explore ${shaper.name}`}>
              {getCultureShaperImage(shaper) ? <img src={getCultureShaperImage(shaper)} alt={shaper.name} loading="lazy" decoding="async" /> : (
                <span className="culture-shaper-monogram" style={{ aspectRatio: "1 / 1", display: "grid", placeItems: "center" }} aria-hidden="true">
                  {shaper.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{shaper.type.replace("screen-ip", "Screen / IP")}</small>
                <h2>{shaper.name}</h2>
                <p>{shaper.role}</p>
                <small>{shaper.audience.center}</small>
                <ArrowUpRight aria-hidden="true" size={19} />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
