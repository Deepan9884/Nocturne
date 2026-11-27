"use client";

import { useEffect } from "react";
import type { Movie } from "@/lib/movie";
import { ArrowUpRight, CloseIcon, FilmIcon } from "./icons";

type FilmPlayerProps = {
  movie: Movie;
  onClose: () => void;
};

export function FilmPlayer({ movie, onClose }: FilmPlayerProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const canEmbed = movie.provider === "youtube" || movie.provider === "vimeo";
  const isDirectVideo = movie.provider === "video";
  const isImage = movie.provider === "image";

  return (
    <div className="film-player" role="dialog" aria-modal="true" aria-label={`Watching ${movie.title}`}>
      <div
        className="film-player-backdrop"
        style={
          movie.posterCandidates[0]
            ? { backgroundImage: `linear-gradient(180deg, rgba(3,3,4,.82), rgba(3,3,4,.96)), url(${movie.posterCandidates[0]})` }
            : undefined
        }
      />

      <header className="film-player-head">
        <div>
          <p className="micro-label text-[var(--champagne)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--champagne)]" />
            Now playing · Screen 04
          </p>
          <p className="film-player-title">{movie.title}</p>
        </div>
        <button type="button" className="film-close" onClick={onClose} aria-label="Close player">
          <CloseIcon className="h-[18px] w-[18px]" />
          <span>Close</span>
        </button>
      </header>

      <div className="film-stage">
        <div className="film-frame">
          {canEmbed && movie.embedUrl ? (
            <iframe
              key={movie.embedUrl}
              src={movie.embedUrl}
              title={movie.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : null}

          {isDirectVideo && movie.playbackUrl ? (
            <video src={movie.playbackUrl} controls autoPlay muted playsInline poster={movie.posterCandidates[0]}>
              Your browser cannot play this film.
            </video>
          ) : null}

          {isImage && movie.posterCandidates[0] ? (
            <img src={movie.posterCandidates[0]} alt={movie.title} className="film-still" />
          ) : null}

          {!canEmbed && !isDirectVideo && !isImage ? (
            <div className="film-unavailable">
              <FilmIcon className="h-10 w-10 text-[var(--champagne)]" />
              <p className="micro-label">External projection</p>
              <h2>This film lives outside the room.</h2>
              <p>
                The source does not allow an in-room embed. Open the original link and keep this room open for chat.
              </p>
              {movie.playbackUrl ? (
                <a href={movie.playbackUrl} target="_blank" rel="noreferrer">
                  Open original <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <footer className="film-player-foot">
        <p>
          <span className="sound-dot" /> Sound on. House lights low.
        </p>
        <div>
          <span>{movie.providerLabel}</span>
          {movie.channel ? <span>{movie.channel}</span> : null}
          {movie.playbackUrl ? (
            <a href={movie.playbackUrl} target="_blank" rel="noreferrer">
              Original <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
