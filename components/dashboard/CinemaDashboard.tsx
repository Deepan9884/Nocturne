"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Sparkles,
  Play,
  Paperclip,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AvatarConfig } from "./types";
import { loadSavedAvatar, saveAvatarToStorage } from "./avatarStorage";
import AvatarCustomizerModal from "./AvatarCustomizerModal";
import CreateRoomModal from "./CreateRoomModal";
import NocturneLogo from "../cinema/NocturneLogo";
import Avatar3DViewer from "./Avatar3DViewer";
import CinemaExperience from "../cinema/CinemaExperience";
import "../../src/dashboard.css";

export default function CinemaDashboard() {
  const [avatar, setAvatar] = useState<AvatarConfig>(() => loadSavedAvatar());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [promptError, setPromptError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCinemaRoom, setShowCinemaRoom] = useState(false);
  const [activeFilmUrl, setActiveFilmUrl] = useState("");

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAvatar(loadSavedAvatar());
  }, []);

  useEffect(() => {
    if (promptInput.trim() && promptError) {
      setPromptError("");
    }
  }, [promptInput, promptError]);

  const handleLaunchCinemaWithFilm = (url: string, _title?: string) => {
    setActiveFilmUrl(url);
    try {
      const windowUrl = new URL(window.location.href);
      windowUrl.searchParams.set("film", url);
      window.history.replaceState({}, "", windowUrl.toString());
    } catch {
      // fallback
    }
    setShowCinemaRoom(true);
  };

  const handleLaunchRoomFromModal = (roomData: {
    name: string;
    filmUrl: string;
    filmTitle: string;
  }) => {
    setIsCreateRoomOpen(false);
    handleLaunchCinemaWithFilm(roomData.filmUrl, roomData.name);
  };

  const handlePromptSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const value = promptInput.trim();
    if (!value) {
      setPromptError("Enter a YouTube, Vimeo, or MP4 film link to launch a room.");
      promptInputRef.current?.focus();
      return;
    }

    setPromptError("");
    handleLaunchCinemaWithFilm(value, "Custom Premiere");
    setPromptInput("");
  };

  const openRoomModal = () => {
    setMobileMenuOpen(false);
    setIsCreateRoomOpen(true);
  };

  if (showCinemaRoom) {
    return (
      <div className="fullscreen-theatre-mount">
        <CinemaExperience />
        <button
          type="button"
          className="exit-theatre-pill"
          onClick={() => setShowCinemaRoom(false)}
          title="Return to Dashboard"
        >
          <span>Exit to dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="dash-root dash-page">
      <header className="dash-topbar">
        <div className="dash-topbar-inner">
          <div className="dash-topbar-left">
            <Link to="/" className="dash-brand" aria-label="Nocturne private cinema home">
              <NocturneLogo size={32} glow={false} />
              <span className="dash-brand-words">
                <strong className="dash-brand-name">Nocturne</strong>
                <span className="dash-brand-sub">Private cinema</span>
              </span>
            </Link>

            <nav className="dash-nav" aria-label="Dashboard navigation">
              <button
                type="button"
                aria-current={activeTab === "home" ? "page" : undefined}
                onClick={() => setActiveTab("home")}
                className="dash-nav-btn"
              >
                <span>Screening desk</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomizerOpen(true)}
                className="dash-nav-btn"
              >
                <Sparkles size={15} aria-hidden="true" />
                <span>3D studio</span>
              </button>
            </nav>
          </div>

          <div className="dash-topbar-right">
            <button
              type="button"
              onClick={() => setIsCreateRoomOpen(true)}
              className="dash-btn dash-btn--secondary dash-topbar-create"
            >
              <Plus size={15} aria-hidden="true" />
              <span>Create room</span>
            </button>

            <Link
              to="/login"
              className="dash-account-link"
              aria-label={`Account: ${avatar.name}, switch account`}
              title="Switch account or sign in with another pass"
            >
              <span className="dash-account-avatar" aria-hidden="true">
                {avatar.name.charAt(0)}
              </span>
              <span className="dash-account-name">{avatar.name}</span>
              <LogOut size={14} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="dash-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-controls="dash-mobile-drawer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          id="dash-mobile-drawer"
          className={`dash-mobile-drawer ${mobileMenuOpen ? "is-open" : ""}`}
        >
          <div className="dash-mobile-actions">
            <button
              type="button"
              aria-current={activeTab === "home" ? "page" : undefined}
              onClick={() => {
                setActiveTab("home");
                setMobileMenuOpen(false);
              }}
              className="dash-nav-btn"
            >
              Screening desk
            </button>
            <button
              type="button"
              onClick={() => openRoomModal()}
              className="dash-nav-btn"
            >
              Create room
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCustomizerOpen(true);
              }}
              className="dash-nav-btn"
            >
              3D studio
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-grid">
          <section className="dash-workbench" aria-labelledby="dash-title">
            <div className="dash-head">
              <h1 id="dash-title" className="dash-title">
                Screening room
              </h1>
              <p className="dash-subtitle">
                Paste a film link to open your auditorium or configure room seating and audio.
              </p>
            </div>

            <form onSubmit={handlePromptSubmit} className="dash-launcher" noValidate>
              <label htmlFor="film-launch-input" className="dash-launcher-label">
                Film stream URL or title
              </label>
              <textarea
                id="film-launch-input"
                ref={promptInputRef}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSubmit();
                  }
                }}
                rows={3}
                aria-invalid={Boolean(promptError)}
                aria-describedby="film-launch-help"
                placeholder="Paste a YouTube, Vimeo, or MP4 film link, or enter a title…"
                className="dash-launcher-textarea"
              />

              <div className="dash-launcher-foot">
                <div className="dash-launcher-meta">
                  <button
                    type="button"
                    onClick={() => openRoomModal()}
                    className="dash-btn dash-btn--quiet"
                    title="Attach film or configure room"
                  >
                    <Paperclip size={15} aria-hidden="true" />
                    <span>Configure room</span>
                  </button>

                  <p
                    id="film-launch-help"
                    className={`dash-help ${promptError ? "dash-help--error" : ""}`}
                    role={promptError ? "alert" : undefined}
                  >
                    {promptError || "Press Return to enter the auditorium"}
                  </p>
                </div>

                <button
                  type="submit"
                  className="dash-btn dash-btn--primary"
                >
                  <Play size={14} aria-hidden="true" />
                  <span>Launch</span>
                </button>
              </div>
            </form>
          </section>

          <aside className="dash-avatar-panel" aria-labelledby="avatar-stage-heading">
            <div className="dash-avatar-head">
              <div>
                <h2 id="avatar-stage-heading" className="dash-avatar-name">
                  {avatar.name}
                </h2>
                <p className="dash-avatar-role">{avatar.title}</p>
              </div>
              <span className="dash-level-tag">Level {avatar.level}</span>
            </div>

            <div className="dash-avatar-stage">
              <Avatar3DViewer
                config={avatar}
                isInteractive={true}
                isSpinning={false}
                fov={42}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="dash-btn dash-btn--secondary dash-btn--full"
            >
              <Sparkles size={15} aria-hidden="true" />
              <span>Customize 3D character</span>
            </button>
          </aside>
        </div>
      </main>

      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentConfig={avatar}
        onSave={(newConfig) => {
          setAvatar(newConfig);
          saveAvatarToStorage(newConfig);
        }}
      />

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onLaunchRoom={handleLaunchRoomFromModal}
        defaultFilmUrl={activeFilmUrl || promptInput.trim()}
      />
    </div>
  );
}
