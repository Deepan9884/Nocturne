"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { enrichMovie, parseMovieLink, type Movie } from "@/lib/movie";
import { ChatDock } from "./ChatDock";
import { FilmPlayer } from "./FilmPlayer";
import { LobbyScreen } from "./LobbyScreen";
import { TheatreHUD } from "./TheatreHUD";
import { useRoom } from "./useRoom";
import NocturneLogo from "./NocturneLogo";
import { TicketIcon } from "./icons";
import TheatreCanvas from "./TheatreCanvas";

type Phase = "lobby" | "preparing" | "entering" | "seated";

const SAMPLE_FILM = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
const PREPARE_STEPS = ["Loading the banner", "Dimming the house lights", "Opening the doors"];

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function PreparingOverlay({ movie }: { movie: Movie | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(PREPARE_STEPS.length - 1, current + 1));
    }, 520);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="preparing-overlay" role="status" aria-live="polite">
      <NocturneLogo size={54} className="preparing-emblem" />
      <p className="micro-label">Screen 04 / Preparing</p>
      <h2>{movie?.title ?? "Your feature presentation"}</h2>
      <div className="preparing-bar" aria-hidden="true">
        <span />
      </div>
      <div className="preparing-status">
        <span>{PREPARE_STEPS[step]}</span>
        <span>00:{String(step + 1).padStart(2, "0")}</span>
      </div>
      <p className="preparing-note">Please keep your link open. The room is being made ready.</p>
    </div>
  );
}

function EnteringOverlay({ movie, onSkip }: { movie: Movie | null; onSkip: () => void }) {
  return (
    <>
      <div className="entry-letterbox top" aria-hidden="true" />
      <div className="entry-letterbox bottom" aria-hidden="true" />
      <div className="entering-overlay">
        <div className="entering-copy">
          <p className="micro-label">
            <span className="live-dot" />
            Entering Screen 04
          </p>
          <h2>{movie?.title ?? "Your feature presentation"}</h2>
          <p>Follow the aisle. Your seat is on the right.</p>
        </div>
        <button type="button" onClick={onSkip} className="skip-walk">
          Skip the walk
        </button>
      </div>
    </>
  );
}

export default function CinemaExperience() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [draftUrl, setDraftUrl] = useState("");
  const [name, setName] = useState("Guest");
  const [roomCode, setRoomCode] = useState("S04");
  const [preview, setPreview] = useState<Movie | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

  const { messages, onlineCount, peers, sendMessage, userId } = useRoom(roomCode, name || "Guest");
  const parsedDraft = useMemo(() => parseMovieLink(draftUrl), [draftUrl]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3600);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedRoom = params.get("room");
    const invitedFilm = params.get("film");

    if (invitedRoom) setRoomCode(invitedRoom.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 18).toUpperCase() || "S04");
    if (invitedFilm) setDraftUrl(invitedFilm);

    const storedName = window.localStorage.getItem("nocturne-name");
    if (storedName) setName(storedName);
  }, []);

  useEffect(() => {
    if (name && name !== "Guest") {
      try {
        window.localStorage.setItem("nocturne-name", name);
      } catch {
        // Name persistence is a convenience, not a requirement.
      }
    }
  }, [name]);

  useEffect(() => {
    if (!draftUrl.trim()) {
      setPreview(null);
      setResolving(false);
      return;
    }

    if (!parsedDraft) {
      setPreview(null);
      setResolving(false);
      return;
    }

    setPreview(parsedDraft);
    setResolving(true);
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      const enriched = await enrichMovie(parsedDraft, controller.signal);
      if (!controller.signal.aborted) {
        setPreview(enriched);
        setResolving(false);
      }
    }, 520);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [draftUrl, parsedDraft]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }
      if (chatOpen) setChatOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen, isPlaying]);

  useEffect(() => {
    document.title = phase === "seated"
      ? `${activeMovie?.title ?? "Feature presentation"} · Nocturne Screen 04`
      : "Nocturne · Your private premiere";
  }, [activeMovie?.title, phase]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!draftUrl.trim()) {
      setError("Paste a film link to open the room.");
      return;
    }

    const parsed = parseMovieLink(draftUrl);
    if (!parsed) {
      setError("That link doesn't look like a film. Try YouTube, Vimeo, an .mp4, or an image link.");
      return;
    }

    setError("");
    setPhase("preparing");
    setChatOpen(false);

    const base = preview?.url === parsed.url ? preview : parsed;
    setActiveMovie(base);

    const [enriched] = await Promise.all([
      enrichMovie(base).catch(() => base),
      wait(1900),
    ]);

    setActiveMovie(enriched);
    setPhase("entering");
  }, [draftUrl, preview]);

  const completeWalk = useCallback(() => {
    setPhase((current) => (current === "entering" ? "seated" : current));
  }, []);

  const handleLeave = useCallback(() => {
    setPhase("lobby");
    setIsPlaying(false);
    setChatOpen(false);
  }, []);

  const handleSample = useCallback(() => {
    setDraftUrl(SAMPLE_FILM);
    setError("");
    showToast("Sample film loaded. The banner is warming up.");
  }, [showToast]);

  const handleInvite = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomCode);
    if (activeMovie?.url) url.searchParams.set("film", activeMovie.url);

    try {
      await navigator.clipboard.writeText(url.toString());
      showToast("Private room link copied. Send it to your people.");
    } catch {
      const field = document.createElement("textarea");
      field.value = url.toString();
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
      showToast("Private room link copied.");
    }
  }, [activeMovie?.url, roomCode, showToast]);

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showToast("Your browser blocked fullscreen. Try the fullscreen key instead.");
    }
  }, [showToast]);

  const handlePlay = useCallback(() => {
    if (!activeMovie) return;
    setIsPlaying(true);
    setChatOpen(false);
  }, [activeMovie]);

  const sceneMovie = phase === "lobby" || phase === "preparing" ? preview ?? activeMovie : activeMovie;

  return (
    <div className={`cinema-app ${phase === "seated" ? "is-seated" : ""} ${isPlaying ? "is-playing" : ""}`}>
      <div className="scene-fallback" aria-hidden="true" />
      <TheatreCanvas
        isPlaying={isPlaying}
        movie={sceneMovie}
        onArrived={completeWalk}
        phase={phase === "preparing" ? "preparing" : phase}
      />
      <div className="cinema-vignette" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />

      {(phase === "lobby" || phase === "preparing") && (
        <div className={`lobby-shell ${phase === "preparing" ? "is-preparing" : ""}`}>
          <LobbyScreen
            draftUrl={draftUrl}
            error={error}
            name={name}
            onDraftUrlChange={(value) => {
              setDraftUrl(value);
              setError("");
            }}
            onNameChange={setName}
            onSample={handleSample}
            onSubmit={handleSubmit}
            preview={preview}
            resolving={resolving}
            roomCode={roomCode}
          />
        </div>
      )}

      {phase === "preparing" ? <PreparingOverlay movie={activeMovie} /> : null}
      {phase === "entering" ? <EnteringOverlay movie={activeMovie} onSkip={completeWalk} /> : null}

      {phase === "seated" ? (
        <TheatreHUD
          movie={activeMovie}
          onlineCount={onlineCount}
          onInvite={handleInvite}
          onLeave={handleLeave}
          onPlay={handlePlay}
          onFullscreen={handleFullscreen}
        />
      ) : null}

      {phase === "seated" ? (
        <ChatDock
          messages={messages}
          onlineCount={onlineCount}
          open={chatOpen}
          peerNames={peers.map((peer) => peer.name)}
          userId={userId}
          userName={name || "Guest"}
          movieTitle={activeMovie?.title ?? ""}
          onClose={() => setChatOpen(false)}
          onInvite={handleInvite}
          onSend={sendMessage}
          onToggle={() => setChatOpen((current) => !current)}
        />
      ) : null}

      {isPlaying && activeMovie ? <FilmPlayer movie={activeMovie} onClose={() => setIsPlaying(false)} /> : null}

      {toast ? (
        <div className="toast" role="status">
          <TicketIcon className="h-4 w-4" />
          {toast}
        </div>
      ) : null}
    </div>
  );
}
