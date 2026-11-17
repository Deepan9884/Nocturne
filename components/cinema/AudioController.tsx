"use client";

import { useState, useEffect } from "react";
import { VolumeMuteIcon } from "./icons";
import { cinematicAudio } from "@/lib/cinematicSound";

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(cinematicAudio.getStatus());
  }, []);

  const handleToggle = () => {
    const nextState = cinematicAudio.toggle();
    setIsPlaying(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`cinematic-audio-pill ${isPlaying ? "is-active" : ""}`}
      title={isPlaying ? "Mute Cinema Ambience" : "Enable Cinema Soundscape (432Hz + 35mm Projector)"}
      data-cursor="AUDIO"
    >
      {isPlaying ? (
        <>
          <div className="audio-equalizer" aria-hidden="true">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
          <span className="audio-label">SOUND // 432Hz ON</span>
        </>
      ) : (
        <>
          <VolumeMuteIcon className="h-3.5 w-3.5 text-champagne shrink-0" />
          <span className="audio-label">SOUNDSCAPE // OFF</span>
        </>
      )}
    </button>
  );
}
