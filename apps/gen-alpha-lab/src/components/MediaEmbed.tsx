import type { CSSProperties } from "react";

type MediaEmbedProps = {
  title: string;
  url?: string;
};

type MediaEmbedConfig = {
  aspectRatio: CSSProperties["aspectRatio"];
  src: string;
};

const youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;
const applePodcastPathPattern = /^\/[^/]+\/podcast(?:\/[^/]+)?\/id\d+$/;

function getYouTubeVideoId(parsed: URL, host: string): string | undefined {
  const isValidVideoId = (value: string | null | undefined) => value && youtubeVideoIdPattern.test(value) ? value : undefined;

  if (host === "youtu.be") {
    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    return pathSegments.length === 1 ? isValidVideoId(pathSegments[0]) : undefined;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    return parsed.pathname === "/watch" ? isValidVideoId(parsed.searchParams.get("v")) : undefined;
  }

  return undefined;
}

export function getMediaEmbedConfig(url: string | undefined): MediaEmbedConfig | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (parsed.protocol !== "https:") return undefined;

    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    if (host === "open.spotify.com" && pathSegments.length === 2 && pathSegments[0] === "episode" && /^[A-Za-z0-9]{22}$/.test(pathSegments[1])) {
      return { src: `https://open.spotify.com/embed/episode/${pathSegments[1]}`, aspectRatio: "352 / 152" };
    }

    const appleEpisodeId = parsed.searchParams.get("i");
    if (
      (host === "podcasts.apple.com" || host === "embed.podcasts.apple.com") &&
      applePodcastPathPattern.test(parsed.pathname) &&
      parsed.searchParams.size === 1 &&
      parsed.searchParams.getAll("i").length === 1 &&
      /^\d+$/.test(appleEpisodeId ?? "") &&
      !parsed.hash
    ) {
      return {
        src: `https://embed.podcasts.apple.com${parsed.pathname}${parsed.search}`,
        aspectRatio: "660 / 175"
      };
    }

    const youtubeId = getYouTubeVideoId(parsed, host);
    if (youtubeId) return { src: `https://www.youtube-nocookie.com/embed/${youtubeId}`, aspectRatio: "16 / 9" };
  } catch {
    return undefined;
  }

  return undefined;
}

export default function MediaEmbed({ title, url }: MediaEmbedProps) {
  const config = getMediaEmbedConfig(url);

  if (!config) return null;

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="media-embed"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={config.src}
      style={{ aspectRatio: config.aspectRatio, width: "100%" }}
      title={`${title} ${config.src.includes("youtube") ? "video" : "podcast"}`}
    />
  );
}
