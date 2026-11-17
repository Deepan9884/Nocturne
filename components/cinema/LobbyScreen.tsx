"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Movie } from "@/lib/movie";
import { PosterImage } from "./PosterImage";
import { ArrowRight, FilmIcon, LinkIcon, LockIcon, TicketIcon } from "./icons";
import NocturneLogo from "./NocturneLogo";

type LobbyScreenProps = {
  draftUrl: string;
  error: string;
  name: string;
  onDraftUrlChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSample: () => void;
  onSubmit: () => void;
  preview: Movie | null;
  resolving: boolean;
  roomCode: string;
};

export function LobbyScreen({
  draftUrl,
  error,
  name,
  onDraftUrlChange,
  onNameChange,
  onSample,
  onSubmit,
  preview,
  resolving,
  roomCode,
}: LobbyScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) inputRef.current?.focus();
  }, [error]);

  return (
    <div className="lobby">
      <header className="lobby-nav">
        <Link className="brand" href="/" aria-label="Nocturne private cinema">
          <NocturneLogo size={34} glow={false} />
          <span className="brand-words">
            <strong>Nocturne</strong>
            <small>Private cinema</small>
          </span>
        </Link>

        <div className="lobby-nav-mid">
          <span className="nav-rule" />
          <span>Screen 04 / House open</span>
        </div>

        <div className="lobby-nav-right">
          <span className="live-dot" />
          <span>Room {roomCode}</span>
          <span className="nav-separator">·</span>
          <span>24 seats</span>
        </div>
      </header>

      <main className="lobby-main">
        <section className="lobby-copy">
          <p className="eyebrow hero-entrance">
            <span className="eyebrow-line" />
            A private screening room
          </p>

          <h1 className="hero-entrance hero-title">
            Your own
            <br />
            <em>private premiere.</em>
          </h1>

          <p className="hero-sub hero-entrance">
            Paste a film link. We&apos;ll dim the lights, walk you to your seat,
            and leave the rest to the screen.
          </p>

          <form
            className="ticket-panel hero-entrance"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="ticket-topline">
              <span>
                <TicketIcon className="h-3.5 w-3.5" />
                Box office
              </span>
              <span className="ticket-topline-number">01</span>
            </div>

            <div className="ticket-field">
              <label htmlFor="film-link">Film link</label>
              <div className={`ticket-input ${error ? "has-error" : ""}`}>
                <LinkIcon className="h-[18px] w-[18px]" />
                <input
                  ref={inputRef}
                  id="film-link"
                  name="film"
                  value={draftUrl}
                  onChange={(event) => onDraftUrlChange(event.target.value)}
                  placeholder="Paste a YouTube, Vimeo or .mp4 link"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "film-error" : undefined}
                />
                {resolving ? <span className="reading-reel">Reading reel</span> : null}
              </div>
              {error ? (
                <p className="film-error" id="film-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            <div
              className={`ticket-preview ${preview ? "is-ready" : ""}`}
              aria-live="polite"
            >
              {preview ? (
                <>
                  <PosterImage
                    alt=""
                    candidates={preview.posterCandidates}
                    className="ticket-preview-image"
                    title={preview.title}
                  />
                  <div className="ticket-preview-copy">
                    <span className="micro-label">{preview.providerLabel} / loaded</span>
                    <strong>{preview.title}</strong>
                    <span className="ticket-preview-note">
                      {preview.note ?? (preview.channel ? `From ${preview.channel}` : "Ready for Screen 04")}
                    </span>
                  </div>
                  <span className="ticket-ready">
                    <span className="live-dot" />
                    Ready
                  </span>
                </>
              ) : (
                <div className="ticket-preview-empty">
                  <FilmIcon className="h-4 w-4" />
                  <span>The banner loads here before you walk in.</span>
                </div>
              )}
            </div>

            <div className="ticket-actions">
              <label className="name-field">
                <span>Your name</span>
                <input
                  value={name}
                  onChange={(event) => onNameChange(event.target.value.slice(0, 24))}
                  maxLength={24}
                  autoComplete="nickname"
                  placeholder="Guest"
                />
              </label>

              <button type="submit" className="enter-button">
                <span>Enter the theatre</span>
                <ArrowRight className="h-[17px] w-[17px]" />
              </button>
            </div>

            <div className="ticket-footer">
              <p>
                <LockIcon className="h-3.5 w-3.5" />
                Your link stays in this browser
              </p>
              <button type="button" onClick={onSample}>
                Try a sample film
              </button>
            </div>
          </form>

          <ol className="lobby-steps hero-entrance">
            <li>
              <span>01</span>
              <div>
                <strong>Paste a link</strong>
                <small>YouTube, Vimeo, direct video or a still.</small>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Walk in</strong>
                <small>The camera takes you through the doors.</small>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Watch together</strong>
                <small>Invite your people and open the room chat.</small>
              </div>
            </li>
          </ol>
        </section>

        {preview ? (
          <aside className="now-showing hero-entrance" aria-label="Now showing">
            <div className="now-showing-frame">
              <PosterImage
                alt={preview.title}
                candidates={preview.posterCandidates}
                className="now-showing-image"
                title={preview.title}
              />
              <div className="now-showing-shade" />
              <span className="now-showing-label">Now showing</span>
              <span className="now-showing-screen">Screen 04</span>
            </div>
            <div className="now-showing-copy">
              <p>
                <span className="live-dot" />
                Ready to screen
              </p>
              <h2>{preview.title}</h2>
              <div>
                <span>{preview.providerLabel}</span>
                <span>Private link</span>
                <span>Seat F7</span>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="lobby-side-note hero-entrance" aria-hidden="true">
            <span className="side-note-number">04</span>
            <p>
              One room.
              <br />
              One screen.
              <br />
              Your people.
            </p>
            <span className="side-note-rule" />
            <small>Dolby Atmos · 4K Laser · 24 seats</small>
          </aside>
        )}
      </main>

      <footer className="lobby-foot">
        <div>
          <NocturneLogo size={16} glow={false} />
          <span>Nocturne / Private cinema / MMXXVI</span>
        </div>
        <div>
          <span>Best with headphones</span>
          <span className="nav-separator">·</span>
          <span>Drag to look around once seated</span>
        </div>
      </footer>
    </div>
  );
}
