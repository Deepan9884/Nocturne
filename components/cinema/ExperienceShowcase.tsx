"use client";

import { useState } from "react";
import {
  FilmIcon,
  CompassIcon,
  UsersIcon,
  PlayIcon,
  VolumeIcon,
  TicketIcon,
  CheckIcon,
} from "./icons";
import { cinematicAudio } from "@/lib/cinematicSound";

function InteractiveCard({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });
  const [transform, setTransform] = useState("perspective(1200px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y, active: true });

    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    setTransform(
      `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`
    );
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({ ...prev, active: false }));
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  };

  return (
    <div
      className={`luxury-experience-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
      }}
      {...props}
    >
      <div
        className="card-spotlight-glow"
        style={{
          opacity: mouse.active ? 1 : 0,
          background: `radial-gradient(650px circle at ${mouse.x}px ${mouse.y}px, rgba(227, 201, 149, 0.12), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

export default function ExperienceShowcase() {
  const [activeSource, setActiveSource] = useState<"youtube" | "vimeo" | "mp4" | "image">("youtube");
  const [walkStep, setWalkStep] = useState<number>(3); // 0: Lobby, 1: Doors, 2: Aisle, 3: Seat F7
  const [aspectRatio, setAspectRatio] = useState<"2.39" | "1.85" | "1.43">("2.39");

  const sources = [
    { id: "youtube" as const, label: "YouTube 4K", format: "Direct Embed" },
    { id: "vimeo" as const, label: "Vimeo HDR", format: "Lossless Player" },
    { id: "mp4" as const, label: ".MP4 / .WebM", format: "Native HTML5" },
    { id: "image" as const, label: "Ultra-Res Still", format: "Photographic Banner" },
  ];

  const walkMilestones = [
    { label: "Lobby Salon", sub: "Ticket Check", cam: "Z: 28m" },
    { label: "Velvet Doors", sub: "Threshold", cam: "Z: 19m" },
    { label: "Aisle Sconces", sub: "Dimming", cam: "Z: 10m" },
    { label: "Seat F-07", sub: "Settled In", cam: "Z: 4.5m" },
  ];

  const aspectRatios = [
    { id: "2.39" as const, label: "2.39:1", name: "Cinemascope" },
    { id: "1.85" as const, label: "1.85:1", name: "Academy Flat" },
    { id: "1.43" as const, label: "1.43:1", name: "IMAX 70mm" },
  ];

  return (
    <div className="experience-cards-grid">
      {/* Card 1: Universal Ingestion */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <FilmIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">INPUT PIPELINE</span>
        </div>
        <h3 className="card-heading">Universal Film Ingestion</h3>
        <p className="card-body-text">
          Feed any stream or archive into Screen 04. YouTube, Vimeo, direct{" "}
          <code className="text-champagne font-mono text-xs">.mp4</code>,{" "}
          <code className="text-champagne font-mono text-xs">.webm</code>, or photographic stills.
          Instant metadata extraction with zero transcoding delays.
        </p>

        {/* Interactive Source Pills */}
        <div className="card-interactive-area">
          <div className="source-toggle-group">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  cinematicAudio.playClick(680);
                  setActiveSource(s.id);
                }}
                className={`source-pill ${activeSource === s.id ? "is-active" : ""}`}
              >
                <span className="pill-dot" />
                <span className="pill-label">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="source-feedback-box">
            <span className="feedback-status">STATUS // READY</span>
            <span className="feedback-format">
              Active Decoder: {sources.find((s) => s.id === activeSource)?.format}
            </span>
          </div>
        </div>
      </InteractiveCard>

      {/* Card 2: Cinematic Continuous Walk-In */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <CompassIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">CONTINUOUS CAMERA</span>
        </div>
        <h3 className="card-heading">Unbroken Cinematic Walk-In</h3>
        <p className="card-body-text">
          No abrupt page jump cuts. The 3D camera glides unbroken from the box office lobby,
          through parting velvet doors, down the lit aisle runner, settling you into seat F7
          in one continuous, masterfully graded tracking shot.
        </p>

        {/* Interactive Walk Stepper */}
        <div className="card-interactive-area">
          <div className="walk-stepper-track">
            {walkMilestones.map((milestone, idx) => {
              const isActive = walkStep === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    cinematicAudio.playClick(600 + idx * 80);
                    setWalkStep(idx);
                  }}
                  className={`walk-node ${isActive ? "is-active" : ""}`}
                >
                  <span className="node-dot" />
                  <span className="node-label">{milestone.label}</span>
                  <span className="node-cam">{milestone.cam}</span>
                </button>
              );
            })}
          </div>
        </div>
      </InteractiveCard>

      {/* Card 3: Watch Together / P2P Chamber */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <UsersIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">SYNCHRONIZED PRESENCE</span>
        </div>
        <h3 className="card-heading">Synchronized Chamber</h3>
        <p className="card-body-text">
          Share your private room code. Synchronize playback markers and dialogue in real-time
          across tabs without latency. Experience cinema as a collective ritual, from the privacy
          of your personal screen.
        </p>

        {/* Interactive Chat Chamber Preview */}
        <div className="card-interactive-area">
          <div className="mock-chat-chamber">
            <div className="chamber-header">
              <span className="live-indicator-dot" />
              <span>ROOM S04 · 3 GUESTS PRESENT</span>
            </div>
            <div className="chamber-messages">
              <div className="chamber-bubble peer">
                <span className="peer-name">Elena · Seat F06</span>
                <span className="bubble-text">Curtains are parting. Sound is sublime.</span>
              </div>
              <div className="chamber-bubble self">
                <span className="bubble-text">House lights dimming now. Enjoy the premiere.</span>
              </div>
            </div>
          </div>
        </div>
      </InteractiveCard>

      {/* Card 4: Anamorphic Projection */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <PlayIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">OPTICAL RATIO</span>
        </div>
        <h3 className="card-heading">Anamorphic Presentation</h3>
        <p className="card-body-text">
          One click expands into the full theatrical aspect ratio with matte letterboxing.
          Dynamic screen framing accommodates ultra-wide Panavision 2.39:1, Academy Flat 1.85:1,
          or tall documentary aspect ratios with pure optical fidelity.
        </p>

        {/* Interactive Aspect Ratio Switcher */}
        <div className="card-interactive-area">
          <div className="aspect-ratio-selector">
            {aspectRatios.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  cinematicAudio.playClick(640);
                  setAspectRatio(r.id);
                }}
                className={`ratio-btn ${aspectRatio === r.id ? "is-selected" : ""}`}
              >
                <span>{r.label}</span>
                <small>{r.name}</small>
              </button>
            ))}
          </div>
          <div className="ratio-visual-preview">
            <div
              className="ratio-screen-box"
              style={{
                aspectRatio:
                  aspectRatio === "2.39"
                    ? "2.39 / 1"
                    : aspectRatio === "1.85"
                    ? "1.85 / 1"
                    : "1.43 / 1",
              }}
            >
              <div className="ratio-screen-inner">
                <span className="ratio-watermark">{aspectRatio}:1 SCOPE</span>
              </div>
            </div>
          </div>
        </div>
      </InteractiveCard>

      {/* Card 5: Spatial Acoustics */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <VolumeIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">BINAURAL AUDIO</span>
        </div>
        <h3 className="card-heading">Binaural Spatial Acoustics</h3>
        <p className="card-body-text">
          Accurate 3D audio reverberation models an acoustic screening hall with deep absorption
          drapes and wooden reflectors. Screen audio emanates from dead center while ambient cues
          and whispered reactions envelop your headphones.
        </p>

        {/* Interactive Acoustic Frequency Equalizer */}
        <div className="card-interactive-area">
          <div className="acoustic-wave-display">
            {[45, 78, 62, 94, 55, 88, 70, 92, 60, 85, 50, 75].map((h, i) => (
              <span
                key={i}
                className="acoustic-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </div>
          <div className="acoustic-specs-row">
            <span>CALIBRATION: 432 Hz</span>
            <span>HEADPHONE TRACKING: ACTIVE</span>
          </div>
        </div>
      </InteractiveCard>

      {/* Card 6: Zero Telemetry */}
      <InteractiveCard data-cursor="EXPLORE">
        <div className="card-top-row">
          <div className="card-icon-frame">
            <TicketIcon className="h-5 w-5 text-champagne" />
          </div>
          <span className="card-tag">SOVEREIGN PRIVACY</span>
        </div>
        <h3 className="card-heading">Zero Telemetry & Tracking</h3>
        <p className="card-body-text">
          Pure client-to-client broadcast. Nocturne collects zero metrics, establishes no remote
          databases, and runs no surveillance cookies. Your links and screening sessions exist
          only within your own browser process.
        </p>

        {/* Security Badges */}
        <div className="card-interactive-area">
          <div className="privacy-trust-badges">
            <div className="trust-badge">
              <CheckIcon className="h-3.5 w-3.5 text-champagne" />
              <span>No Cloud Database</span>
            </div>
            <div className="trust-badge">
              <CheckIcon className="h-3.5 w-3.5 text-champagne" />
              <span>Encrypted Local Storage</span>
            </div>
            <div className="trust-badge">
              <CheckIcon className="h-3.5 w-3.5 text-champagne" />
              <span>Peer-To-Peer Only</span>
            </div>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );
}
