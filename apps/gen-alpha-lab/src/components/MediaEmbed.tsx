import type { CSSProperties } from "react";

type MediaEmbedProps = {
  title: string;
  url?: string;
};

type MediaEmbedConfig = {
  aspectRatio: CSSProperties["aspectRatio"];
  src: string;
};

export function getMediaEmbedConfig(url: string | undefined): MediaEmbedConfig | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "open.spotify.com") {
      const episodeIndex = parsed.pathname.split("/").indexOf("episode");
      const episodeId = parsed.pathname.split("/")[episodeIndex + 1];
      if (episodeId) return { src: `https://open.spotify.com/embed/episode/${episodeId}`, aspectRatio: "352 / 152" };
    }

    if (host === "podcasts.apple.com" || host === "embed.podcasts.apple.com") {
      return {
        src: `https://embed.podcasts.apple.com${parsed.pathname}${parsed.search}`,
        aspectRatio: "660 / 175"
      };
    }

    const youtubeId = host === "youtu.be"
      ? parsed.pathname.slice(1)
      : host === "youtube.com" || host.endsWith(".youtube.com")
        ? parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).at(-1)
        : undefined;
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
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={config.src}
      style={{ aspectRatio: config.aspectRatio, width: "100%" }}
      title={`${title} ${config.src.includes("youtube") ? "video" : "podcast"}`}
    />
  );
}
