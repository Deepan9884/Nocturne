"use client";

import React from "react";

export interface NocturneLogoProps {
  size?: number;
  variant?: "mark" | "lockup" | "crest";
  className?: string;
  glow?: boolean;
}

export default function NocturneLogo({
  size = 40,
  variant = "mark",
  className = "",
  glow = true,
}: NocturneLogoProps) {
  // Unique gradient IDs to prevent DOM collision if rendered multiple times
  const id = React.useId().replace(/:/g, "");

  const goldLinear = `gold-lin-${id}`;
  const goldBevel = `gold-bev-${id}`;
  const goldHighlight = `gold-hi-${id}`;
  const oxbloodRadial = `ox-rad-${id}`;
  const glowFilter = `glow-${id}`;

  const markSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nocturne-logo-svg ${className}`}
      aria-label="Nocturne Cinema Emblem"
    >
      <defs>
        {/* Deep rich Oxblood lacquer enamel backdrop */}
        <radialGradient
          id={oxbloodRadial}
          cx="42%"
          cy="32%"
          r="68%"
          fx="40%"
          fy="30%"
        >
          <stop offset="0%" stopColor="#44131b" />
          <stop offset="50%" stopColor="#25080e" />
          <stop offset="85%" stopColor="#120407" />
          <stop offset="100%" stopColor="#080204" />
        </radialGradient>

        {/* 24-Karat Champagne Gold Multi-Stop Gradient */}
        <linearGradient
          id={goldLinear}
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff5db" />
          <stop offset="18%" stopColor="#e3c285" />
          <stop offset="42%" stopColor="#f3ddac" />
          <stop offset="68%" stopColor="#c59f5b" />
          <stop offset="88%" stopColor="#e8cf99" />
          <stop offset="100%" stopColor="#8c6a2f" />
        </linearGradient>

        {/* Specular Bevel Accent */}
        <linearGradient
          id={goldBevel}
          x1="120"
          y1="0"
          x2="0"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8a672c" />
          <stop offset="50%" stopColor="#d8b473" />
          <stop offset="100%" stopColor="#fff4d4" />
        </linearGradient>

        {/* Pure Specular Light Glint */}
        <radialGradient
          id={goldHighlight}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ffd98e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c9a86a" stopOpacity="0" />
        </radialGradient>

        {glow && (
          <filter id={glowFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#e3c285"
              floodOpacity="0.45"
            />
          </filter>
        )}
      </defs>

      {/* Outer Art Deco Hexagonal-Stepped Medallion Frame */}
      {/* Outer shadow / grounding base */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="18"
        fill="#040203"
        stroke={`url(#${goldBevel})`}
        strokeWidth="1.5"
      />

      {/* Recessed Oxblood Velvet & Lacquer Core */}
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="14"
        fill={`url(#${oxbloodRadial})`}
      />

      {/* Fine Concentric Gold Guilloché Perimeter Inlay */}
      <rect
        x="14"
        y="14"
        width="92"
        height="92"
        rx="10"
        fill="none"
        stroke={`url(#${goldLinear})`}
        strokeWidth="0.8"
        strokeOpacity="0.55"
      />

      {/* Four Art Deco Corner Stepped Accents */}
      {/* Top Left */}
      <path
        d="M17 25 L25 17 M17 30 L30 17"
        stroke={`url(#${goldLinear})`}
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      {/* Top Right */}
      <path
        d="M103 25 L95 17 M103 30 L90 17"
        stroke={`url(#${goldLinear})`}
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      {/* Bottom Left */}
      <path
        d="M17 95 L25 103 M17 90 L30 103"
        stroke={`url(#${goldLinear})`}
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      {/* Bottom Right */}
      <path
        d="M103 95 L95 103 M103 90 L90 103"
        stroke={`url(#${goldLinear})`}
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />

      {/* The Iconic Nocturne Art Deco Typographic Monogram "N" */}
      <g filter={glow ? `url(#${glowFilter})` : undefined}>
        {/* Left Upright Column - Fluted Facet A (Light) */}
        <polygon
          points="32,88 32,32 39,26 39,88"
          fill={`url(#${goldLinear})`}
        />
        {/* Left Upright Column - Fluted Facet B (Shadow Bevel) */}
        <polygon
          points="39,26 44,32 44,88 39,88"
          fill={`url(#${goldBevel})`}
        />

        {/* Diagonal Beam - Slicing Anamorphic Light Axis */}
        {/* Top facet */}
        <polygon
          points="39,26 44,32 81,88 76,88"
          fill={`url(#${goldLinear})`}
        />
        {/* Central specular ray */}
        <polygon
          points="41,29 88,88 81,88 39,26"
          fill={`url(#${goldHighlight})`}
          opacity="0.35"
        />
        {/* Under bevel */}
        <polygon
          points="44,32 50,38 88,94 81,88"
          fill={`url(#${goldBevel})`}
          opacity="0.85"
        />

        {/* Right Upright Column - Fluted Facet A (Light) */}
        <polygon
          points="76,88 76,32 82,26 82,88"
          fill={`url(#${goldLinear})`}
        />
        {/* Right Upright Column - Fluted Facet B (Shadow Bevel) */}
        <polygon
          points="82,26 88,32 88,88 82,88"
          fill={`url(#${goldBevel})`}
        />

        {/* Top Architectural Serif Capitals */}
        <polygon points="28,34 32,30 45,30 45,34" fill={`url(#${goldLinear})`} />
        <polygon points="73,34 76,30 92,30 88,34" fill={`url(#${goldLinear})`} />

        {/* Base Architectural Plinths */}
        <polygon points="28,86 32,90 47,90 44,86" fill={`url(#${goldBevel})`} />
        <polygon points="73,86 76,90 92,90 88,86" fill={`url(#${goldBevel})`} />

        {/* Center Apex Diamond Celestial Spark (Projector Focal Aperture) */}
        <polygon
          points="60,18 63,24 69,27 63,30 60,36 57,30 51,27 57,24"
          fill={`url(#${goldLinear})`}
        />
        <circle cx="60" cy="27" r="1.5" fill="#ffffff" />
      </g>

      {/* Subtle Lower Celestial Film Crescent Arc */}
      <path
        d="M34 98 Q60 106 86 98 Q60 102 34 98 Z"
        fill={`url(#${goldLinear})`}
        opacity="0.45"
      />
    </svg>
  );

  if (variant === "mark") {
    return markSvg;
  }

  // Full Brand Lockup with Master Editorial Typography
  return (
    <div className={`nocturne-brand-lockup ${className}`}>
      {markSvg}
      <div className="brand-meta">
        <strong className="brand-title">NOCTURNE</strong>
        <span className="brand-subtitle">PRIVATE AUDITORIUM</span>
      </div>
    </div>
  );
}
