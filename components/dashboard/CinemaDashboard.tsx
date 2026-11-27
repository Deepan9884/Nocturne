"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
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
import { AUDITORIUM_THEMES, CURATED_FILM_PRESETS } from "@/lib/data/cinemaRooms";
import "../../src/dashboard.css";

type CatalogView = "all" | "rooms" | "reels";

export default function CinemaDashboard() {
  const [avatar, setAvatar] = useState<AvatarConfig>(() => loadSavedAvatar());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [selectedRoomTheme, setSelectedRoomTheme] = useState<string>("velvet");
  const [promptInput, setPromptInput] = useState("");
  const [promptError, setPromptError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogView, setCatalogView] = useState<CatalogView>("all");
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCinemaRoom, setShowCinemaRoom] = useState(false);
  const [activeFilmUrl, setActiveFilmUrl] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAvatar(loadSavedAvatar());
  }, []);

  useEffect(() => {
    if (promptInput.trim() && promptError) {
      setPromptError("");
    }
  }, [promptInput, promptError]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth <= 640) {
          setMobileMenuOpen(true);
        }
        window.requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  const openRoomModalForTheme = (themeId?: string) => {
    if (themeId) setSelectedRoomTheme(themeId);
    setMobileMenuOpen(false);
    setIsCreateRoomOpen(true);
  };

  const filteredRooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return AUDITORIUM_THEMES;
    return AUDITORIUM_THEMES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredReels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CURATED_FILM_PRESETS;
    return CURATED_FILM_PRESETS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q) ||
        p.duration.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const showRooms = catalogView === "all" || catalogView === "rooms";
  const showReels = catalogView === "all" || catalogView === "reels";
  const visibleCount =
    (showRooms ? filteredRooms.length : 0) + (showReels ? filteredReels.length : 0);

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
            <div className="dash-search-wrap">
              <Search size={15} className="dash-search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search auditoriums and test reels"
                placeholder="Search rooms or reels…"
                className="dash-search-input"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="dash-search-clear"
                  aria-label="Clear search"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              ) : (
                <kbd className="dash-search-kbd" aria-hidden="true">
                  ⌘K
                </kbd>
              )}
            </div>

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
          <div className="dash-input-wrap">
            <Search size={15} className="dash-input-icon" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter auditoriums and reels"
              placeholder="Search rooms or reels…"
              className="dash-input dash-input--with-icon dash-input--with-clear"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="dash-search-clear"
                aria-label="Clear search"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
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
              onClick={() => openRoomModalForTheme()}
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
                Paste a film link to open your auditorium, configure room seating, or launch a curated reel.
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
                rows={2}
                aria-invalid={Boolean(promptError)}
                aria-describedby="film-launch-help"
                placeholder="Paste a YouTube, Vimeo, or MP4 film link, or enter a title…"
                className="dash-launcher-textarea"
              />

              <div className="dash-launcher-foot">
                <div className="dash-launcher-meta">
                  <button
                    type="button"
                    onClick={() => openRoomModalForTheme()}
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

            <section className="dash-catalog" aria-labelledby="catalog-heading">
              <div className="dash-catalog-head">
                <h2 id="catalog-heading" className="dash-section-heading">
                  Auditoriums and repertoire
                </h2>

                <div className="dash-tabs" role="tablist" aria-label="Filter catalog view">
                  {(
                    [
                      { id: "all", label: "All" },
                      { id: "rooms", label: "Auditoriums" },
                      { id: "reels", label: "Test reels" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={catalogView === tab.id}
                      onClick={() => setCatalogView(tab.id)}
                      className="dash-tab"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {visibleCount === 0 ? (
                <div className="dash-empty">
                  <p className="dash-empty-title">No auditoriums or reels match “{searchQuery.trim()}”.</p>
                  <p className="dash-empty-desc">
                    Clear the search filter to browse all four auditorium presets and five test reels.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="dash-btn dash-btn--secondary"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  {showRooms && filteredRooms.length > 0 && (
                    <div className="dash-rooms-grid" aria-label="Auditorium themes">
                      {filteredRooms.map((room) => (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => openRoomModalForTheme(room.id)}
                          className="dash-room-btn"
                        >
                          <div className="dash-room-top">
                            <span className="dash-room-name">{room.name}</span>
                            <span className="dash-room-badge">{room.badge}</span>
                          </div>
                          <p className="dash-room-desc">{room.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {showReels && filteredReels.length > 0 && (
                    <div className="dash-table-wrap">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th scope="col">Test reel</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Format</th>
                            <th scope="col" className="dash-table-actions">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReels.map((preset) => (
                            <tr key={preset.id}>
                              <td className="dash-table-title">{preset.title}</td>
                              <td data-label="Genre">{preset.genre}</td>
                              <td data-label="Format" className="dash-num">{preset.duration}</td>
                              <td className="dash-table-actions">
                                <div className="dash-row-actions">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPromptInput(preset.url);
                                      setPromptError("");
                                      promptInputRef.current?.focus();
                                    }}
                                    className="dash-btn dash-btn--quiet"
                                  >
                                    Load
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLaunchCinemaWithFilm(preset.url, preset.title)}
                                    className="dash-btn dash-btn--secondary"
                                  >
                                    Enter
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>
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
        defaultThemeId={selectedRoomTheme}
      />
    </div>
  );
}
