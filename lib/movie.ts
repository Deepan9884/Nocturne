export type MovieProvider = "youtube" | "vimeo" | "video" | "image" | "link";

export type Movie = {
  id: string;
  url: string;
  provider: MovieProvider;
  title: string;
  channel?: string;
  posterCandidates: string[];
  embedUrl?: string;
  playbackUrl?: string;
  providerLabel: string;
  note?: string;
};

const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"];
const VIMEO_HOSTS = ["vimeo.com", "www.vimeo.com", "player.vimeo.com"];

function normaliseUrl(raw: string) {
  const value = raw.trim();
  if (!value) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(withProtocol);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

function compactHost(hostname: string) {
  return hostname.replace(/^www\./, "");
}

function titleFromPath(pathname: string) {
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  const decoded = decodeURIComponent(last).replace(/[-_]+/g, " ").replace(/\.[a-z0-9]+$/i, "");
  return decoded.trim();
}

function youtubeId(url: URL) {
  if (url.hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (["shorts", "embed", "live", "v"].includes(parts[0])) {
    return parts[1] ?? null;
  }

  return url.searchParams.get("v");
}

function vimeoId(url: URL) {
  if (url.hostname === "player.vimeo.com") {
    return url.pathname.split("/").filter(Boolean)[1] ?? null;
  }
  return url.pathname.split("/").filter(Boolean)[0] ?? null;
}

function isImage(url: URL) {
  return /\.(avif|gif|jpe?g|png|webp)(?:$|[?#])/i.test(url.pathname + url.search);
}

function isVideo(url: URL) {
  return /\.(m4v|mp4|ogv|ogg|webm)(?:$|[?#])/i.test(url.pathname + url.search);
}

export function parseMovieLink(raw: string): Movie | null {
  const url = normaliseUrl(raw);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, "");

  if (YOUTUBE_HOSTS.includes(url.hostname) || YOUTUBE_HOSTS.includes(host)) {
    const id = youtubeId(url);
    if (!id) return null;

    return {
      id: `youtube-${id}`,
      url: url.toString(),
      provider: "youtube",
      title: "Feature presentation",
      posterCandidates: [
        `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      ],
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      playbackUrl: `https://www.youtube.com/watch?v=${id}`,
      providerLabel: "YouTube",
    };
  }

  if (VIMEO_HOSTS.includes(url.hostname) || VIMEO_HOSTS.includes(host)) {
    const id = vimeoId(url);
    if (!id || !/^\d+$/.test(id)) return null;

    return {
      id: `vimeo-${id}`,
      url: url.toString(),
      provider: "vimeo",
      title: "Feature presentation",
      posterCandidates: [`https://vumbnail.com/${id}.jpg`],
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`,
      playbackUrl: url.toString(),
      providerLabel: "Vimeo",
    };
  }

  if (isImage(url)) {
    return {
      id: `image-${url.pathname}`,
      url: url.toString(),
      provider: "image",
      title: titleFromPath(url.pathname) || "Feature presentation",
      posterCandidates: [url.toString()],
      providerLabel: "Image",
    };
  }

  if (isVideo(url)) {
    return {
      id: `video-${url.pathname}`,
      url: url.toString(),
      provider: "video",
      title: titleFromPath(url.pathname) || "Feature presentation",
      posterCandidates: [],
      playbackUrl: url.toString(),
      providerLabel: "Direct film",
    };
  }

  return {
    id: `link-${url.toString()}`,
    url: url.toString(),
    provider: "link",
    title: titleFromPath(url.pathname) || compactHost(url.hostname),
    posterCandidates: [],
    playbackUrl: url.toString(),
    providerLabel: compactHost(url.hostname),
    note: "This source opens outside the screening room.",
  };
}

/**
 * Public oEmbed data is optional decoration. If the provider or network says no,
 * the parsed link still works and the generated banner remains in place.
 */
export async function enrichMovie(movie: Movie, signal?: AbortSignal): Promise<Movie> {
  if (!["youtube", "vimeo"].includes(movie.provider)) return movie;

  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(movie.url)}`, {
      signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return movie;

    const data = (await response.json()) as {
      author_name?: string;
      error?: string;
      thumbnail_url?: string;
      title?: string;
    };

    if (data.error) return movie;

    const extras = [
      data.thumbnail_url,
      ...movie.posterCandidates,
    ].filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index);

    return {
      ...movie,
      title: data.title?.trim() || movie.title,
      channel: data.author_name?.trim() || movie.channel,
      posterCandidates: extras,
    };
  } catch {
    return movie;
  }
}

export function moviePlayLabel(movie: Movie | null) {
  if (!movie) return "Play film";
  if (movie.provider === "image") return "View banner";
  if (movie.provider === "link") return "Open source";
  return "Play film";
}
