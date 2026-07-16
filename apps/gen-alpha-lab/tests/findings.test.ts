import { describe, expect, it } from "vitest";
import {
  findingTopics,
  filterLibraryByFormat,
  findings,
  getLibrarySections,
  getFindingById,
  getTopicById,
  getSupportingRecords,
  validateFindings
} from "../src/lib/findings";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha field-guide findings", () => {
  it("keeps AI cross-cutting across six cultural lenses", () => {
    expect(findingTopics.map((topic) => [topic.id, topic.label, topic.href])).toEqual([
      ["connect", "How they connect", "/topics/connect"],
      ["media", "How they consume media", "/topics/media"],
      ["influence", "How they are influenced", "/topics/influence"],
      ["time", "How they spend time", "/topics/time"],
      ["learn", "How they learn", "/topics/learn"],
      ["play-create", "How they play and create", "/topics/play-create"]
    ]);
    expect(getTopicById("ai")).toBeUndefined();
    expect(findingTopics.flatMap((topic) => topic.findingIds)).not.toContain("ai-is-a-normal-interface");
    expect(findings.some((finding) => finding.id === "ai-is-a-normal-interface")).toBe(false);
  });

  it("gives each lens enough topic-page material to stand alone", () => {
    for (const topic of findingTopics) {
      expect(getTopicById(topic.id)).toMatchObject({
        id: topic.id,
        href: `/topics/${topic.id}`
      });
      expect(topic.pageTitle).toMatch(/^How they /);
      expect(topic.visualAnatomy.length).toBeGreaterThanOrEqual(3);
      expect(topic.findingIds.length).toBeGreaterThanOrEqual(1);
      expect(topic.genZContrast).toMatch(/Gen Z/);
    }

    expect(getTopicById("missing-topic")).toBeUndefined();
  });

  it("looks up a finding for a navigable editorial detail page", () => {
    expect(getFindingById("learning-is-assembled")).toMatchObject({
      id: "learning-is-assembled",
      title: "They learn by doing, with help on demand."
    });
    expect(getFindingById("missing-finding")).toBeUndefined();
  });

  it("gives every published finding two valid records including non-community evidence", () => {
    expect(validateFindings(findings, seedRecords)).toEqual([]);

    for (const finding of findings) {
      const support = getSupportingRecords(finding, seedRecords);
      expect(support.length).toBeGreaterThanOrEqual(2);
      expect(
        support.some(
          (record) =>
            record.sourceClass !== "community" &&
            (record.confidence === "medium" || record.confidence === "high")
        )
      ).toBe(true);
    }
  });

  it("rejects duplicate support IDs and support without direct, qualifying evidence", () => {
    const finding = {
      ...findings[0],
      id: "invalid-support",
      supportIds: ["pwc-alpha-2026", "pwc-alpha-2026", "field-cousin-placeholder"]
    };
    const invalidRecords = seedRecords.map((record) => {
      if (record.id === "pwc-alpha-2026") {
        return { ...record, url: "not-a-url", confidence: "low" as const };
      }
      if (record.id === "field-cousin-placeholder") {
        return { ...record, sourceClass: undefined };
      }
      return record;
    });

    expect(validateFindings([finding], invalidRecords)).toEqual(
      expect.arrayContaining([
        "invalid-support has duplicate supporting record IDs.",
        "invalid-support support pwc-alpha-2026 requires a valid direct URL.",
        "invalid-support support pwc-alpha-2026 requires medium or high confidence.",
        "invalid-support support field-cousin-placeholder must be a report, article, or podcast.",
        "invalid-support support field-cousin-placeholder requires an explicit non-community source class."
      ])
    );
  });

  it("features the Spotify episode as synthesized owned media without framing it as a personal point of view", () => {
    expect(seedRecords).toContainEqual(
      expect.objectContaining({
        kind: "podcast",
        sourceClass: "owned",
        title: "#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood",
        url: "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g",
        synthesisStatus: "Featured synthesis",
        tags: expect.arrayContaining(["owned", "ai", "gaming", "digital-childhood"])
      })
    );
    expect(seedRecords.find((record) => record.id === "owned-podcast-093")?.summary).not.toMatch(/Joshua/i);
  });

  it("keeps Eclectic Polymath first in a deduplicated nine-episode podcast listening set", () => {
    const podcasts = filterLibraryByFormat(seedRecords, "podcasts");

    expect(podcasts).toHaveLength(9);
    expect(podcasts[0]).toMatchObject({
      id: "owned-podcast-093",
      source: "Eclectic Polymath",
      url: "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g"
    });
    expect(podcasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: expect.stringContaining("id1733611380?i=1000649487888") })
    ]));
  });

  it("keeps only the richer Spotify embed for the duplicated Future Report episode", () => {
    const futureReportEpisodes = seedRecords.filter((record) => record.source === "The Future Report");

    expect(futureReportEpisodes).toEqual([
      expect.objectContaining({
        id: "future-report-alpha-mccrindle-2025",
        url: "https://open.spotify.com/episode/5WPGgs3LmLOAkxww8NwsKS"
      })
    ]);
  });

  it("keeps the owned synthesis first when the library receives podcast records in another order", () => {
    const podcasts = filterLibraryByFormat(seedRecords, "podcasts");
    const sections = getLibrarySections([...podcasts.slice(1), podcasts[0]]);
    const podcastSection = sections.find((section) => section.id === "podcasts");

    expect(podcastSection?.records[0]?.id).toBe("owned-podcast-093");
  });

  it("organizes the library into one unique section per media format", () => {
    const sections = getLibrarySections(seedRecords);

    expect(sections.map((section) => section.title)).toEqual([
      "Reports",
      "Articles",
      "Books",
      "Podcasts",
      "Videos"
    ]);
    expect(sections.every((section) => section.records.length > 0)).toBe(true);
    expect(sections.flatMap((section) => section.records).every((record) => record.url)).toBe(true);
  });

  it("filters library records by format", () => {
    expect(filterLibraryByFormat(seedRecords, "all")).toEqual(seedRecords.filter((record) => record.url && record.kind !== "interview"));
    expect(filterLibraryByFormat(seedRecords, "reports").every((record) => record.kind === "report")).toBe(true);
    expect(filterLibraryByFormat(seedRecords, "books").every((record) => record.kind === "book")).toBe(true);
    expect(filterLibraryByFormat(seedRecords, "videos").map((record) => record.id)).toContain("common-sense-media-youtube-2025");
  });

  it("includes the supplied deep-reading sources with direct links and explicit purposes", () => {
    const expectedResources = [
      ["mccrindle-alpha-defined", "https://mccrindle.com.au/article/topic/generation-alpha/generation-alpha-defined/"],
      ["emarketer-alpha-habits-2026", "https://www.emarketer.com/content/gen-alpha-digital-habits-2026/"],
      ["gwi-alpha-unfiltered", "https://www.gwi.com/reports/gen-alpha"],
      ["razorfish-alpha-ai", "https://www.razorfish.com/articles/news/razorfish-explores-gen-alpha-relationship-with-ai-in-new-study/"],
      ["razorfish-alpha-industries", "https://www.razorfish.com/articles/news/razorfishs-new-gen-alpha-research-spotlights-the-generations-perceptions-of-five-key-industries/"],
      ["ftc-coppa-2025", "https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data"],
      ["roblox-search-style-trends-2025", "https://ir.roblox.com/news/news-details/2025/Roblox-Releases-New-Data-Decoding-Search-and-Style-Trends-in-Digital-Experiences/default.aspx"],
      ["arxiv-young-user-safety-2025", "https://arxiv.org/abs/2505.11160"],
      ["esafety-social-minimum-age", "https://www.esafety.gov.au/about-us/industry-regulation/social-media-age-restrictions"],
      ["aecf-generation-alpha", "https://www.aecf.org/blog/what-is-generation-alpha"],
      ["oxford-brain-rot-2024", "https://corp.oup.com/news/brain-rot-named-oxford-word-of-the-year-2024/"]
    ];

    for (const [id, url] of expectedResources) {
      expect(seedRecords).toContainEqual(
        expect.objectContaining({
          id,
          url,
          useModes: expect.arrayContaining([expect.stringMatching(/^(make|think|learn)$/)])
        })
      );
    }
  });
});
