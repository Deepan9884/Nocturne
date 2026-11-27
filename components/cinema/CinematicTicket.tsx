"use client";

import { useState, useRef, MouseEvent } from "react";
import { TicketIcon, ShieldCheckIcon } from "./icons";
import NocturneLogo from "./NocturneLogo";

interface CinematicTicketProps {
  filmTitle?: string;
  sourceType?: string;
  roomCode?: string;
  seatCode?: string;
  onEnterTheatre?: () => void;
}

export default function CinematicTicket({
  filmTitle = "Feature Presentation",
  sourceType = "4K Master",
  roomCode = "SCREEN 04",
  seatCode = "F-07",
  onEnterTheatre,
}: CinematicTicketProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className="cinematic-ticket-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.18s ease-out",
      }}
    >
      {/* Dynamic holographic foil glare */}
      <div
        className="ticket-glare"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(227, 201, 149, ${glarePos.opacity}), rgba(255, 255, 255, 0) 65%)`,
        }}
      />

      <div className="ticket-body">
        {/* Left stub: Screening Room Details */}
        <div className="ticket-main-section">
          <div className="ticket-header-row">
            <div className="ticket-brand-mark">
              <NocturneLogo size={28} className="ticket-emblem" glow={false} />
              <div className="ticket-brand-text">
                <span className="brand-name">Nocturne</span>
                <span className="brand-sub">Private admission</span>
              </div>
            </div>
            <div className="ticket-badge-pill">
              <ShieldCheckIcon className="h-3 w-3" />
              <span>P2P verified</span>
            </div>
          </div>

          <div className="ticket-title-row">
            <h4 className="ticket-film-title">{filmTitle}</h4>
          </div>

          <div className="ticket-specs-grid">
            <div className="spec-item">
              <span className="spec-label">Theatre</span>
              <span className="spec-value">{roomCode}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Tier</span>
              <span className="spec-value">Orchestra</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Reserved seat</span>
              <span className="spec-value gold">{seatCode}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Format</span>
              <span className="spec-value">{sourceType}</span>
            </div>
          </div>

          <div className="ticket-footer-row">
            <span className="ticket-footnote">Client-side encrypted admission</span>
            {onEnterTheatre && (
              <button type="button" className="ticket-action-btn" onClick={onEnterTheatre}>
                <span>Claim Seat</span>
              </button>
            )}
          </div>
        </div>

        {/* Perforated separator divider */}
        <div className="ticket-perforation">
          <div className="perf-notch top" />
          <div className="perf-line" />
          <div className="perf-notch bottom" />
        </div>

        {/* Right stub: Barcode & Entry Gate */}
        <div className="ticket-stub-section">
          <div className="stub-header">
            <TicketIcon className="h-4 w-4" />
            <span className="stub-gate">Gate 01</span>
          </div>
          <div className="stub-seat-callout">
            <span className="callout-lbl">Seat</span>
            <span className="callout-val">{seatCode}</span>
          </div>
          <div className="stub-barcode-wrapper">
            <div className="barcode-bars" aria-hidden="true">
              {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 5, 3, 2, 4, 1, 3, 2].map((w, idx) => (
                <span key={idx} style={{ width: `${w}px` }} />
              ))}
            </div>
            <span className="barcode-number">NOC-8842-F07</span>
          </div>
        </div>
      </div>
    </div>
  );
}
