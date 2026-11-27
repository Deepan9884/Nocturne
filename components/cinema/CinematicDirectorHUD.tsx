"use client";

import { ArrowRightIcon, SparklesIcon } from "./icons";
import MagneticButton from "./MagneticButton";
import { cinematicAudio } from "@/lib/cinematicSound";

export interface CinematicDirectorHUDProps {
  currentStage: number; // 1, 2, 3, 4
  progress: number;
  timecode: string;
  onJumpToStage: (stageIndex: number) => void;
  onLaunchCinema: (filmUrl?: string) => void;
}

export default function CinematicDirectorHUD({
  currentStage,
  progress,
  timecode,
  onJumpToStage,
  onLaunchCinema,
}: CinematicDirectorHUDProps) {
  const stages = [
    { num: "01", name: "FOYER & ENTRANCE", cam: "CAM_01 // ENTRANCE_ELEV" },
    { num: "02", name: "SEATING & ARCHITECTURE", cam: "CAM_02 // ORCHESTRA_F07" },
    { num: "03", name: "CONCESSIONS & SNACKS", cam: "CAM_03 // SNACK_STAND" },
    { num: "04", name: "SCREEN 05 PREMIERE", cam: "CAM_04 // VIP_SCREEN_05" },
  ];

  return (
    <div className="director-hud-overlay" aria-hidden="true">
      {/* Top Right: Skip to Premiere CTA */}
      <div className="hud-corner top-right">
        <MagneticButton
          className="hud-quick-launch-btn"
          onClick={() => onLaunchCinema()}
          data-cursor="ENTER"
        >
          <SparklesIcon className="h-3.5 w-3.5" />
          <span>Launch Screen 05</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </MagneticButton>
      </div>

      {/* Bottom Center: Spatial Timeline Waypoint Bar */}
      <div className="hud-bottom-bar">
        <div className="hud-timeline-container">
          <div className="hud-progress-track">
            <div
              className="hud-progress-fill"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>

          <div className="hud-waypoints-row">
            {stages.map((stg, idx) => {
              const isActive = currentStage === idx + 1;
              const isPast = progress >= idx * 0.25;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`hud-waypoint-btn ${isActive ? "is-active" : ""} ${isPast ? "is-passed" : ""}`}
                  onClick={() => {
                    cinematicAudio.playClick(600 + idx * 80);
                    onJumpToStage(idx);
                  }}
                  data-cursor="FLY"
                >
                  <span className="waypoint-num">{stg.num}</span>
                  <span className="waypoint-name">{stg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
