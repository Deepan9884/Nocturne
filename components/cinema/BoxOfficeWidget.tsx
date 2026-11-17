"use client";

import { useState } from "react";
import { ArrowRightIcon, FilmIcon, SparklesIcon, CheckIcon } from "./icons";
import { cinematicAudio } from "@/lib/cinematicSound";

export interface FilmPreset {
  id: string;
  title: string;
  source: string;
  duration: string;
  ratio: string;
  color: string;
  url: string;
}

export const PRESET_FILMS: FilmPreset[] = [
  {
    id: "cosmic",
    title: "2001: Cosmic Voyage",
    source: "YouTube 4K",
    duration: "148 MIN",
    ratio: "2.39:1 SCOPE",
    color: "#e7c28a",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
  {
    id: "noir",
    title: "Blade Runner: Neo-Tokyo",
    source: "Vimeo HDR",
    duration: "117 MIN",
    ratio: "2.39:1 SCOPE",
    color: "#dfc28d",
    url: "https://vimeo.com/76979871",
  },
  {
    id: "chopin",
    title: "Chopin: Nocturne No. 20",
    source: "Lossless Master",
    duration: "44 MIN",
    ratio: "1.85:1 FLAT",
    color: "#ff4d6d",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "solar",
    title: "Solar Flare Observatory",
    source: "Direct MP4",
    duration: "82 MIN",
    ratio: "1.43:1 IMAX",
    color: "#80ed99",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

interface BoxOfficeWidgetProps {
  activePreset: FilmPreset;
  onSelectPreset: (preset: FilmPreset) => void;
  onLaunchCinema: (filmUrl?: string) => void;
}

export default function BoxOfficeWidget({
  activePreset,
  onSelectPreset,
  onLaunchCinema,
}: BoxOfficeWidgetProps) {
  const [customUrl, setCustomUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePresetClick = (preset: FilmPreset) => {
    cinematicAudio.playClick(720);
    onSelectPreset(preset);
  };

  const handleLaunch = () => {
    cinematicAudio.playClick(580);
    onLaunchCinema(customUrl.trim() || activePreset.url);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customUrl.trim() || activePreset.url);
      setCopied(true);
      cinematicAudio.playClick(880);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="box-office-terminal">
      <div className="terminal-header">
        <div className="terminal-title-group">
          <span className="terminal-dot pulse" />
          <span className="terminal-label">BOX OFFICE TERMINAL</span>
        </div>
        <span className="terminal-status">STANDBY // READY TO PROJECT</span>
      </div>

      {/* Preset Selector Carousel / Pills */}
      <div className="preset-selector-row">
        <span className="selector-title">CURATED REPERTOIRE:</span>
        <div className="preset-chips">
          {PRESET_FILMS.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`preset-chip ${isSelected ? "is-selected" : ""}`}
                style={
                  isSelected
                    ? ({
                        borderColor: preset.color,
                        boxShadow: `0 0 16px ${preset.color}33`,
                      } as React.CSSProperties)
                    : {}
                }
                data-cursor="SELECT"
              >
                <span
                  className="preset-indicator"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="preset-name">{preset.title}</span>
                <span className="preset-format">{preset.source}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Input Field */}
      <div className="terminal-input-wrap">
        <div className="terminal-input-bar">
          <FilmIcon className="h-4 w-4 terminal-input-icon text-champagne" />
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder={`Or paste any YouTube, Vimeo, .mp4 link (current: ${activePreset.title})`}
            className="terminal-text-input"
          />
          {copied ? (
            <span className="copy-confirm">
              <CheckIcon className="h-3.5 w-3.5" />
              <span>COPIED</span>
            </span>
          ) : (
            <button
              type="button"
              className="terminal-copy-btn"
              onClick={handleCopyLink}
              title="Copy active URL"
            >
              <span>COPY LINK</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal Actions */}
      <div className="terminal-footer">
        <div className="terminal-specs">
          <span className="spec-tag">FORMAT: {activePreset.ratio}</span>
          <span className="spec-tag">LENGTH: {activePreset.duration}</span>
          <span className="spec-tag">SOUND: 3D SPATIAL</span>
        </div>
        <button
          type="button"
          className="terminal-enter-btn"
          onClick={handleLaunch}
          data-cursor="ENTER"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Enter Screen 04</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
