"use client";

import { useEffect, useState } from "react";

type PosterImageProps = {
  alt: string;
  candidates: string[];
  className?: string;
  title?: string;
};

export function PosterImage({ alt, candidates, className, title = "N" }: PosterImageProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [candidates[0]]);

  const source = candidates[index];

  if (!source) {
    return (
      <div className={`poster-placeholder ${className ?? ""}`} aria-label={alt}>
        <span>{title.slice(0, 1).toUpperCase()}</span>
      </div>
    );
  }

  return (
    // Remote film posters come from arbitrary providers, so next/image cannot whitelist them at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setIndex((current) => (current + 1 < candidates.length ? current + 1 : current + 1))}
      onLoad={(event) => {
        const element = event.currentTarget;
        if (element.naturalWidth < 120 && index + 1 < candidates.length) {
          setIndex((current) => current + 1);
        }
      }}
      style={index >= candidates.length ? { display: "none" } : undefined}
    />
  );
}
