"use client";

import type { Movie } from "@/lib/movie";
import { PosterImage } from "./PosterImage";
import {
  ArrowUpRight,
  CompassIcon,
  ExpandIcon,
  PlayIcon,
  UsersIcon,
} from "./icons";
import NocturneLogo from "./NocturneLogo";

type TheatreHUDProps = {
  movie: Movie | null;
  onlineCount: number;
  onInvite: () => void;
  onLeave: () => void;
  onPlay: () => void;
  onFullscreen: () => void;
};

export function TheatreHUD({
  movie,
  onlineCount,
  onInvite,
  onLeave,
  onPlay,
  onFullscreen,
}: TheatreHUDProps) {
  return (
    <div className="theatre-hud">
      <header className="hud-top">
        <button type="button" className="brand brand-button" onClick={onLeave} aria-label="Leave the theatre">
          <NocturneLogo size={32} glow={false} />
          <span className="brand-words">
            <strong>Nocturne</strong>
            <small>Screen 04</small>
          </span>
        </button>

        <div className="hud-now">
          <span className="micro-label">
            <span className="live-dot" />
            House lights down
          </span>
          <strong>{movie?.title ?? "Feature presentation"}</strong>
        </div>

        <div className="hud-actions">
          <button type="button" className="hud-button" onClick={onInvite}>
            <UsersIcon className="h-4 w-4" />
            <span>Invite</span>
            <span className="hud-count">{onlineCount}</span>
          </button>
          <button type="button" className="hud-button icon-only" onClick={onFullscreen} aria-label="Fullscreen">
            <ExpandIcon className="h-4 w-4" />
          </button>
          <button type="button" className="hud-button" onClick={onLeave}>
            Leave
          </button>
        </div>
      </header>

      <div className="seat-marker">
        <span>Orchestra / F7</span>
        <span className="seat-marker-line" />
        <span>Screen 04</span>
      </div>

      <div className="hud-bottom">
        <section className="film-card">
          <div className="film-card-poster">
            <PosterImage
              alt=""
              candidates={movie?.posterCandidates ?? []}
              className="film-card-image"
              title={movie?.title ?? "N"}
            />
            <span className="film-card-play">
              <PlayIcon className="h-4 w-4" />
            </span>
          </div>

          <div className="film-card-copy">
            <span className="micro-label">{movie?.providerLabel ?? "Private link"} / Feature</span>
            <h2>{movie?.title ?? "Feature presentation"}</h2>
            <p>{movie?.channel ?? "Screen 04 is ready when you are."}</p>
            <div className="film-card-meta">
              <span>Private screening</span>
              <span>4K laser</span>
              <span>Dolby Atmos</span>
            </div>
          </div>

          <button type="button" className="play-button" onClick={onPlay}>
            <span className="play-button-icon">
              <PlayIcon className="h-[18px] w-[18px]" />
            </span>
            <span>
              <strong>Play film</strong>
              <small>House lights to zero</small>
            </span>
          </button>
        </section>

        <div className="hud-right">
          <div className="look-hint">
            <CompassIcon className="h-4 w-4" />
            <span>Move your cursor to look around</span>
          </div>
          <button type="button" className="hud-source-button" onClick={onPlay}>
            Open projection <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
