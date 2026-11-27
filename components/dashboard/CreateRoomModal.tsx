"use client";

import { useState, useEffect, useRef } from "react";
import { Film, Users, Volume2, Lock, Globe, X, Play, Tv } from "lucide-react";
import { AUDITORIUM_THEMES, CURATED_FILM_PRESETS } from "@/lib/data/cinemaRooms";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchRoom: (roomData: {
    name: string;
    theme: string;
    screenName: string;
    filmUrl: string;
    filmTitle: string;
    seats: number;
    isPrivate: boolean;
    spatialAudio: boolean;
  }) => void;
  defaultFilmUrl?: string;
  defaultThemeId?: string;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  onLaunchRoom,
  defaultFilmUrl = "",
  defaultThemeId = "velvet",
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("Midnight Screening");
  const [selectedTheme, setSelectedTheme] = useState(defaultThemeId);
  const [filmUrl, setFilmUrl] = useState(defaultFilmUrl || CURATED_FILM_PRESETS[0].url);
  const [filmTitle, setFilmTitle] = useState(CURATED_FILM_PRESETS[0].title);
  const [seats, setSeats] = useState(24);
  const [isPrivate, setIsPrivate] = useState(false);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [errors, setErrors] = useState<{ roomName?: string; filmUrl?: string }>({});

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedTheme(defaultThemeId || "velvet");
    if (defaultFilmUrl) {
      setFilmUrl(defaultFilmUrl);
      const matched = CURATED_FILM_PRESETS.find((p) => p.url === defaultFilmUrl);
      setFilmTitle(matched ? matched.title : "Custom Stream Presentation");
    }
    setErrors({});
  }, [isOpen, defaultThemeId, defaultFilmUrl]);

  useEffect(() => {
    if (roomName.trim() && errors.roomName) {
      setErrors((prev) => ({ ...prev, roomName: undefined }));
    }
  }, [roomName, errors.roomName]);

  useEffect(() => {
    if (filmUrl.trim() && errors.filmUrl) {
      setErrors((prev) => ({ ...prev, filmUrl: undefined }));
    }
  }, [filmUrl, errors.filmUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof CURATED_FILM_PRESETS)[0]) => {
    setFilmUrl(preset.url);
    setFilmTitle(preset.title);
    if (errors.filmUrl) {
      setErrors((prev) => ({ ...prev, filmUrl: undefined }));
    }
  };

  const handleCreate = () => {
    const nextErrors: { roomName?: string; filmUrl?: string } = {};
    if (!roomName.trim()) {
      nextErrors.roomName = "Enter a room name for your screening.";
    }
    if (!filmUrl.trim()) {
      nextErrors.filmUrl = "Enter a YouTube, Vimeo, or MP4 stream link.";
    }
    if (nextErrors.roomName || nextErrors.filmUrl) {
      setErrors(nextErrors);
      return;
    }

    const themeObj =
      AUDITORIUM_THEMES.find((t) => t.id === selectedTheme) || AUDITORIUM_THEMES[0];
    onLaunchRoom({
      name: roomName.trim(),
      theme: selectedTheme,
      screenName: themeObj.name,
      filmUrl: filmUrl.trim() || CURATED_FILM_PRESETS[0].url,
      filmTitle: filmTitle || "Custom Feature Film",
      seats,
      isPrivate,
      spatialAudio,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="dash-root dash-dialog"
      aria-labelledby="create-room-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="dash-dialog-shell">
        <div className="dash-dialog-head">
          <div className="dash-dialog-title-group">
            <span className="dash-dialog-icon" aria-hidden="true">
              <Tv size={18} />
            </span>
            <div>
              <h2 id="create-room-title" className="dash-dialog-title">
                Create screening room
              </h2>
              <p className="dash-dialog-sub">
                Host a synchronized private auditorium with spatial seats and audio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dash-icon-close"
            aria-label="Close create room dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="dash-dialog-body">
          <div className="dash-field">
            <label htmlFor="room-name-input" className="dash-label">
              Auditorium name
            </label>
            <input
              id="room-name-input"
              name="roomName"
              type="text"
              value={roomName}
              aria-invalid={Boolean(errors.roomName)}
              aria-describedby="room-name-help"
              onChange={(e) => setRoomName(e.target.value)}
              className="dash-input"
              placeholder="Midnight Screening"
            />
            <p
              id="room-name-help"
              className={`dash-help ${errors.roomName ? "dash-help--error" : ""}`}
              role={errors.roomName ? "alert" : undefined}
            >
              {errors.roomName || ""}
            </p>
          </div>

          <div className="dash-field">
            <span className="dash-label" id="room-theme-label">
              Auditorium architecture
            </span>
            <div className="dash-theme-grid" role="group" aria-labelledby="room-theme-label">
              {AUDITORIUM_THEMES.map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  aria-pressed={selectedTheme === thm.id}
                  onClick={() => setSelectedTheme(thm.id)}
                  className="dash-theme-option"
                >
                  <div className="dash-room-top">
                    <span className="dash-room-name">{thm.name}</span>
                    <span className="dash-room-badge">{thm.badge}</span>
                  </div>
                  <p className="dash-room-desc">{thm.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="dash-field">
            <label htmlFor="room-film-url" className="dash-label">
              Film stream source (YouTube, Vimeo, or MP4 URL)
            </label>
            <div className="dash-input-wrap">
              <Film size={16} className="dash-input-icon" aria-hidden="true" />
              <input
                id="room-film-url"
                name="filmUrl"
                type="url"
                value={filmUrl}
                aria-invalid={Boolean(errors.filmUrl)}
                aria-describedby="room-film-help"
                onChange={(e) => { setFilmUrl(e.target.value); setFilmTitle("Custom Stream Presentation"); }}
                className="dash-input dash-input--with-icon"
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </div>
            <p
              id="room-film-help"
              className={`dash-help ${errors.filmUrl ? "dash-help--error" : ""}`}
              role={errors.filmUrl ? "alert" : undefined}
            >
              {errors.filmUrl || "Or choose a test reel below:"}
            </p>

            <div className="dash-chip-wrap" role="group" aria-label="Cinema test reels">
              {CURATED_FILM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={filmUrl === preset.url}
                  onClick={() => handleSelectPreset(preset)}
                  className="dash-chip"
                >
                  {preset.title.split("·")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-settings-strip">
            <div className="dash-setting-col">
              <div className="dash-setting-label">
                <Users size={15} aria-hidden="true" />
                <span>Auditorium seats</span>
              </div>
              <div className="dash-seg-group" role="group" aria-label="Seat capacity">
                {[12, 24, 48].map((count) => (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={seats === count}
                    onClick={() => setSeats(count)}
                    className="dash-seg-btn"
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="dash-setting-col">
              <div className="dash-setting-label">
                <Volume2 size={15} aria-hidden="true" />
                <span>Spatial 3D audio</span>
              </div>
              <button
                type="button"
                aria-pressed={spatialAudio}
                onClick={() => setSpatialAudio(!spatialAudio)}
                className="dash-seg-btn"
              >
                {spatialAudio ? "Dolby Atmos on" : "Stereo only"}
              </button>
            </div>

            <div className="dash-setting-col">
              <div className="dash-setting-label">
                {isPrivate ? (
                  <Lock size={15} aria-hidden="true" />
                ) : (
                  <Globe size={15} aria-hidden="true" />
                )}
                <span>Access level</span>
              </div>
              <button
                type="button"
                aria-pressed={isPrivate}
                onClick={() => setIsPrivate(!isPrivate)}
                className="dash-seg-btn"
              >
                {isPrivate ? "Friends only" : "Public screening"}
              </button>
            </div>
          </div>
        </div>

        <div className="dash-dialog-foot">
          <button type="button" onClick={onClose} className="dash-btn dash-btn--quiet">
            Cancel
          </button>
          <button type="button" onClick={handleCreate} className="dash-btn dash-btn--primary">
            <Play size={14} aria-hidden="true" />
            <span>Launch screening room</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
