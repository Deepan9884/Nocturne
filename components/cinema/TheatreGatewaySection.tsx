"use client";

import { useState } from "react";
import { ArrowRightIcon, SparklesIcon, TicketIcon, FilmIcon } from "./icons";
import type { FilmPreset } from "./BoxOfficeWidget";
import { cinematicAudio } from "@/lib/cinematicSound";
import TheatreCanvas from "./TheatreCanvas";

interface TheatreGatewaySectionProps {
  activePreset: FilmPreset;
  onEnterExperience: () => void;
}

export default function TheatreGatewaySection({
  activePreset,
  onEnterExperience,
}: TheatreGatewaySectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLaunch = () => {
    cinematicAudio.playChime();
    onEnterExperience();
  };

  return (
    <div className="gateway-container">
      <div
        className={`gateway-projection-frame ${isHovered ? "is-hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleLaunch}
        data-cursor="ENTER"
      >
        {/* Real-time 3D Canvas in Lobby Mode */}
        <div className="gateway-canvas-layer">
          <TheatreCanvas
            isPlaying={false}
            movie={null}
            onArrived={() => {}}
            phase="lobby"
          />
        </div>

        {/* Ambient Projector Flares & Vignette */}
        <div className="gateway-anamorphic-flare" />
        <div className="gateway-vignette-overlay" />

        {/* Luxury Gateway Billboard Content */}
        <div className="gateway-content-overlay">
          <div className="gateway-top-meta">
            <span className="gateway-pill">
              <TicketIcon className="h-3 w-3 text-champagne" />
              <span>Private access</span>
            </span>
            <span className="gateway-code">Gate: NOC-S04</span>
          </div>

          <div className="gateway-center-cta">
            <h2 className="gateway-headline">
              Enter Screen 04
            </h2>
            <p className="gateway-sub">
              Now staging: <strong>{activePreset.title}</strong> · {activePreset.ratio} · 24 Velvet Seats.
              Click to take your place in the orchestra.
            </p>

            <button
              type="button"
              className="gateway-launch-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch();
              }}
              data-cursor="LAUNCH"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Launch The Screening Room</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="gateway-bottom-meta">
            <div className="meta-spec">
              <FilmIcon className="h-3.5 w-3.5 text-champagne" />
              <span>SOURCE: {activePreset.source}</span>
            </div>
            <div className="meta-spec">
              <span>LATENCY: ZERO BUFFER</span>
            </div>
            <div className="meta-spec">
              <span>ENCRYPTION: LOCAL P2P</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
