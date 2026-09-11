"use client";

import { ArrowUpRight, RotateCcw, Search } from "lucide-react";
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

const platformOptions = [
  "YouTube",
  "TikTok",
  "Snapchat",
  "Twitch",
  "Instagram",
  "Roblox",
  "Minecraft",
  "Spotify",
  "Netflix",
] as const;

const ageOptions = [
  { value: "0-7", label: "Under 8" },
  { value: "8-12", label: "8–12" },
  { value: "13-17", label: "13–17" },
] as const;

const topicOptions = [
  "music",
  "gaming",
  "sports",
  "family",
  "fashion",
  "comedy",
  "learning",
  "fandom",
] as const;

type TopicFilter = (typeof topicOptions)[number];
type PlatformFilter = (typeof platformOptions)[number];

const platformAliases: Record<PlatformFilter, string[]> = {
  YouTube: ["youtube"],
  TikTok: ["tiktok"],
  Snapchat: ["snapchat"],
  Twitch: ["twitch"],
  Instagram: ["instagram"],
  Roblox: ["roblox"],
  Minecraft: ["minecraft"],
  Spotify: ["spotify"],
  Netflix: ["netflix"],
};

const topicKeywords: Record<TopicFilter, string[]> = {
  music: ["music", "song", "dance", "pop", "nursery rhyme", "sound"],
  gaming: ["gaming", "minecraft", "roblox", "game", "gameplay", "video game"],
  sports: ["sports", "basketball", "football", "gymnastics", "competition", "tennis", "basketball", "training", "athlete"],
  family: ["family", "siblings", "co-viewing", "parent", "household"],
  fashion: ["fashion", "beauty", "style", "dress-up", "costume"],
  comedy: ["comedy", "humor", "sketch", "prank", "funny"],
  learning: ["learning", "language", "education", "science", "lesson", "early learning"],
  fandom: ["fandom", "collecting", "identity", "fan", "fantasy", "franchise"],
};

function overlapsAge(profileRange: string, selectedRange: string) {
  const profile = profileRange.match(/(\d+)-(\d+)/);
  const selected = selectedRange.match(/(\d+)-(\d+)/);
  if (!profile || !selected) return false;
  return Number(profile[1]) <= Number(selected[2]) && Number(selected[1]) <= Number(profile[2]);
}

function matchesAnyAge(shaper: CultureShaper, selectedAges: string[]) {
  if (selectedAges.length === 0) return true;
  return selectedAges.some((age) => overlapsAge(shaper.audience.ageRange, age));
}

function matchesPlatform(shaper: CultureShaper, selectedPlatforms: PlatformFilter[]) {
  if (selectedPlatforms.length === 0) return true;
  const normalized = shaper.platforms.map((platform) => platform.toLowerCase());
  return selectedPlatforms.some((platform) => {
    const aliases = platformAliases[platform];
    return normalized.some((entry) => aliases.some((alias) => entry.includes(alias)));
  });
}

function matchesTopic(shaper: CultureShaper, selectedTopics: TopicFilter[]) {
  if (selectedTopics.length === 0) return true;
  const normalizedTopics = shaper.topics.map((topic) => topic.toLowerCase());
  return selectedTopics.some((topic) =>
    topicKeywords[topic].some((keyword) =>
      normalizedTopics.some((entry) => entry.includes(keyword) || keyword.includes(entry)),
    ),
  );
}

function matchesSearch(shaper: CultureShaper, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  return (
    shaper.name.toLowerCase().includes(trimmed)
    || shaper.role.toLowerCase().includes(trimmed)
    || shaper.category.toLowerCase().includes(trimmed)
    || shaper.topics.some((topic) => topic.toLowerCase().includes(trimmed))
  );
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

function toggleSelection<T extends string>(current: T[], value: T) {
  return current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
}

export default function InfluencerFilters({ shapers }: InfluencerFiltersProps) {
  const [type, setType] = useState<CultureShaperDirectoryType>("all");
  const [search, setSearch] = useState("");
  const [platforms, setPlatforms] = useState<PlatformFilter[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [topics, setTopics] = useState<TopicFilter[]>([]);

  const filtered = useMemo(
    () => interleaveCultureTypes(shapers.filter((shaper) =>
      (type === "all" || (type === "ip" ? shaper.type === "screen-ip" || shaper.type === "franchise" : shaper.type === type))
      && matchesSearch(shaper, search)
      && matchesAnyAge(shaper, ages)
      && matchesTopic(shaper, topics)
      && matchesPlatform(shaper, platforms))),
    [ages, platforms, search, shapers, topics, type],
  );

  const clear = () => {
    setType("all");
    setSearch("");
    setPlatforms([]);
    setAges([]);
    setTopics([]);
  };

  const resultLabel = type === "all"
    ? `${filtered.length} culture shapers shown`
    : `${filtered.length} ${type === "ip" ? "IP profiles" : `${type}s`} shown`;

  return (
    <section className="culture-shaper-directory" aria-label="Culture shaper directory">
      <div className="influencer-filter-controls">
        <div className="influencer-filter-primary">
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

          <label className="influencer-filter-search">
            Search
            <span>
              <Search aria-hidden="true" size={16} />
              <input
                aria-label="Search by name or topic"
                placeholder="Type a name or topic"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </span>
          </label>

          <div className="influencer-filter-summary">
            <p role="status" aria-live="polite">{resultLabel}</p>
            <button type="button" onClick={clear} aria-label="Clear all filters">
              <RotateCcw aria-hidden="true" size={16} /> Clear all
            </button>
          </div>
        </div>

        <details className="influencer-filter-more">
          <summary>More filters</summary>
          <div className="influencer-filter-more-body">
            <fieldset className="influencer-filter-chips">
              <legend>Platform</legend>
              <div>
                {platformOptions.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    aria-pressed={platforms.includes(platform)}
                    onClick={() => setPlatforms((current) => toggleSelection(current, platform))}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="influencer-filter-chips influencer-filter-chips-age">
              <legend>Audience age</legend>
              <div>
                {ageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={ages.includes(option.value)}
                    onClick={() => setAges((current) => toggleSelection(current, option.value))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="influencer-filter-chips influencer-filter-chips-topic">
              <legend>Topic</legend>
              <div>
                {topicOptions.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={topics.includes(topic)}
                    onClick={() => setTopics((current) => toggleSelection(current, topic))}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </details>
      </div>

      <div className="influencer-directory" aria-label="Influencers shaping Gen Alpha culture">
        {filtered.map((shaper, index) => (
          <article data-testid={shaper.type === "creator" ? "influencer-card" : "culture-shaper-card"} key={shaper.id}>
            <Link href={`/influencers/${shaper.id}`} aria-label={`Explore ${shaper.name}`} title={`Lab ID: ${shaper.id}`}>
              {getCultureShaperImage(shaper) ? (
                <img
                  src={getCultureShaperImage(shaper)}
                  alt={shaper.name}
                  className={shaper.type === "screen-ip" || shaper.type === "franchise" ? "influencer-card-mark" : "influencer-card-photo"}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
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
