"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Plus,
  Bell,
  Home,
  Film,
  Sparkles,
  History,
  Settings,
  Tv,
  Users,
  Play,
  Volume2,
  Mic,
  Paperclip,
  Sliders,
  LogOut,
} from "lucide-react";
import { AvatarConfig } from "./types";
import { loadSavedAvatar, saveAvatarToStorage } from "./avatarStorage";
import AvatarCustomizerModal from "./AvatarCustomizerModal";
import CreateRoomModal from "./CreateRoomModal";
import NocturneLogo from "../cinema/NocturneLogo";

// Dynamic import for 3D Avatar preview widget
const Avatar3DViewer = dynamic(() => import("./Avatar3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#c9a86a]/50 text-xs">
      <div className="animate-pulse">Loading Holo-Avatar...</div>
    </div>
  ),
});

// Dynamic import for full Cinema Experience
const CinemaExperience = dynamic(
  () => import("../cinema/CinemaExperience").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="scene-loader-fullscreen" />,
  }
);


export default function CinemaDashboard() {
  const [avatar, setAvatar] = useState<AvatarConfig>(() => loadSavedAvatar());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [showCinemaRoom, setShowCinemaRoom] = useState(false);
  const [activeFilmUrl, setActiveFilmUrl] = useState("");

  // Load avatar from storage on mount
  useEffect(() => {
    setAvatar(loadSavedAvatar());
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
    if (!promptInput.trim()) return;

    handleLaunchCinemaWithFilm(promptInput.trim(), "Custom Premiere");
    setPromptInput("");
  };

  // If Cinema Room is active, show the 3D theatre
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
          <span>Exit to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050506] text-[#f1e9db] flex items-center justify-center p-2 sm:p-5 md:p-8 font-sans selection:bg-[#c9a86a]/30 selection:text-[#f1e9db] relative overflow-x-hidden">
      {/* Background Cinematic Atmosphere & Amber/Champagne Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Center Projector Beam & Warm Amber Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-[#c9a86a]/10 rounded-full blur-[140px]" />
        {/* Subtle Oxblood Ambient Light in lower left */}
        <div className="absolute -bottom-24 -left-24 w-[700px] h-[700px] bg-[#2a0d12]/25 rounded-full blur-[160px]" />
        {/* Warm Bronze glow on right side */}
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-[#8c7243]/10 rounded-full blur-[130px]" />
        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,106,0.08),rgba(0,0,0,0))]" />
      </div>

      {/* Main Glassmorphism Window Container (Theme: Ink, Champagne Gold, Bone) */}
      <div className="relative w-full max-w-[1520px] min-h-[92vh] rounded-[32px] bg-[#0c0b10]/85 backdrop-blur-[36px] border border-[#c9a86a]/25 shadow-[0_0_80px_rgba(201,168,106,0.12)] flex flex-col md:flex-row overflow-hidden">
        {/* Subtle Top-Edge Champagne Luster Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e3c995]/40 to-transparent pointer-events-none z-30" />

        {/* ============================================================ */}
        {/* 1. LEFT NAVIGATION SIDEBAR                                   */}
        {/* ============================================================ */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#c9a86a]/15 bg-[#09080c]/80 backdrop-blur-md p-4 lg:p-5 select-none">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-5 border-b border-[#c9a86a]/15">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <NocturneLogo size={32} glow={true} />
                </div>
                <div>
                  <span className="text-base font-bold tracking-wider text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
                    Nocturne
                  </span>
                  <span className="block text-[10px] text-[#c9a86a]/70 uppercase tracking-widest font-mono">
                    Private Cinema
                  </span>
                </div>
              </Link>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c9a86a]/15 text-[#e3c995] border border-[#c9a86a]/30">
                VIP
              </span>
            </div>

            {/* Primary Nav Menu Items */}
            <div className="py-4 space-y-1.5">
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  activeTab === "home"
                    ? "bg-[#c9a86a]/20 text-[#f1e9db] border border-[#c9a86a]/40 shadow-[0_0_20px_rgba(201,168,106,0.2)]"
                    : "text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10"
                }`}
              >
                <Home className="w-4 h-4 text-[#c9a86a]" />
                <span>Home Dashboard</span>
              </button>

              <button
                onClick={() => setIsCreateRoomOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              >
                <Tv className="w-4 h-4 text-[#c9a86a]" />
                <span>Explore Rooms</span>
              </button>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#c9a86a] group-hover:animate-pulse" />
                  <span>3D Avatar Studio</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a86a]/20 text-[#e3c995] border border-[#c9a86a]/30 font-mono">
                  EDIT
                </span>
              </button>

              <button
                onClick={() => handleLaunchCinemaWithFilm("https://www.youtube.com/watch?v=BO8lX3hDU30", "Film Vault")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              >
                <Film className="w-4 h-4 text-[#c9a86a]" />
                <span>Film Vault</span>
              </button>

              <button
                onClick={() => handleLaunchCinemaWithFilm("https://www.youtube.com/watch?v=Way9Dexny3w", "Screen 01 · Velvet")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              >
                <History className="w-4 h-4 text-[#c9a86a]" />
                <span>Screen 01 · Velvet</span>
              </button>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              >
                <Sliders className="w-4 h-4 text-[#c9a86a]" />
                <span>Avatar Wardrobe</span>
              </button>

              <button
                onClick={() => alert("Settings: Dolby Atmos 3D spatial acoustics tuned to 48kHz reference studio.")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              >
                <Settings className="w-4 h-4 text-[#c9a86a]" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Account Profile & Switch Pass Row */}
          <div className="pt-4 border-t border-[#c9a86a]/15">
            <a
              href="/login"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-colors group"
              title="Switch account / Sign in with another pass"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#c9a86a] to-[#e3c995] text-[#050506] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {avatar.name.charAt(0)}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-medium text-[#f1e9db] truncate">{avatar.name}</div>
                  <div className="text-[10px] text-[#91887b] truncate">{avatar.title}</div>
                </div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-[#c9a86a]/60 group-hover:text-[#c9a86a] flex-shrink-0" />
            </a>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* 2. MAIN CENTER STAGE                                         */}
        {/* ============================================================ */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#07060a]/50 relative">
          {/* Top Search & Actions Bar */}
          <header className="h-16 px-6 flex items-center justify-between border-b border-[#c9a86a]/15 bg-[#0a090e]/60 backdrop-blur-md">
            {/* Search Input Box with Command-K */}
            <div className="relative w-full max-w-md hidden sm:block">
              <input
                type="text"
                placeholder="Search Nocturne films, rooms, or avatars..."
                className="w-full pl-9 pr-12 py-2 rounded-full bg-[#141318]/80 border border-[#c9a86a]/20 text-xs text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a]/60 focus:bg-[#1a1820] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#c9a86a]/60 absolute left-3.5 top-2.5" />
              <div className="absolute right-3 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#1f1d24] border border-[#c9a86a]/30 text-[10px] text-[#e3c995] font-mono">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Right Top Actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* + Create Room Button (Champagne Gold Cinema Theme) */}
              <button
                onClick={() => setIsCreateRoomOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] text-[#050506] text-xs font-semibold border border-[#e3c995]/50 shadow-[0_0_20px_rgba(201,168,106,0.3)] transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Create Room</span>
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => alert("Notifications: 2 cinephiles entered Screen 01.")}
                className="w-9 h-9 rounded-full bg-[#141318]/80 border border-[#c9a86a]/20 flex items-center justify-center text-[#e3c995] hover:text-[#f1e9db] hover:bg-[#c9a86a]/15 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c9a86a] animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c9a86a]" />
              </button>

              {/* User Profile Pill */}
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#141318]/80 border border-[#c9a86a]/20 hover:border-[#c9a86a]/50 transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#c9a86a] to-[#e3c995] text-[#050506] flex items-center justify-center text-xs font-bold shadow-sm">
                  {avatar.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-medium text-[#f1e9db] group-hover:text-[#e3c995] truncate max-w-[100px]">
                    {avatar.name}
                  </div>
                </div>
              </button>
            </div>
          </header>

          {/* Central Hero & Interactive Prompt Section */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-8 max-w-3xl mx-auto w-full">
            {/* Hero Heading */}
            <div className="text-center mb-7">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic tracking-tight text-[#f1e9db] mb-2">
                What are we watching today?
              </h1>
              <p className="text-xs sm:text-sm text-[#cfc4b3]/70 max-w-md mx-auto">
                Welcome to your private auditorium, {avatar.name}. Dim the house lights, summon your customized 3D character, and start the premiere.
              </p>
            </div>

            {/* Large Glass Input Box (Theme: Obsidian, Champagne Gold, Bone) */}
            <form onSubmit={handlePromptSubmit} className="relative mb-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#141318]/90 to-[#0e0d12]/95 border border-[#c9a86a]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(201,168,106,0.1)] p-4 focus-within:border-[#c9a86a]/80 focus-within:shadow-[0_0_30px_rgba(201,168,106,0.25)] transition-all">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handlePromptSubmit();
                    }
                  }}
                  rows={2}
                  placeholder="Paste a YouTube, Vimeo or MP4 film link, or enter a title..."
                  className="w-full bg-transparent text-[#f1e9db] placeholder-[#91887b] text-sm focus:outline-none resize-none"
                />

                <div className="flex items-center justify-between pt-2 border-t border-[#c9a86a]/15">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateRoomOpen(true)}
                      className="p-1.5 rounded-lg text-[#c9a86a]/70 hover:text-[#e3c995] hover:bg-[#c9a86a]/10 transition-colors"
                      title="Attach Film / Configure Room"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-[#91887b] hidden sm:inline">
                      Press Return to Launch Room
                    </span>
                  </div>

                  {/* Audio / Mic Waveform Pill in Gold */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Spatial voice chat active in cinema lobby.")}
                      className="px-3 py-1.5 rounded-xl bg-[#c9a86a]/15 hover:bg-[#c9a86a]/25 border border-[#c9a86a]/40 text-[#e3c995] text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(201,168,106,0.2)] transition-colors"
                      title="Spatial Voice Chat"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#c9a86a]" />
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2 bg-[#e3c995] rounded-full animate-pulse" />
                        <span className="w-0.5 h-3.5 bg-[#c9a86a] rounded-full animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-[#e3c995] rounded-full animate-pulse delay-150" />
                      </div>
                    </button>

                    <button
                      type="submit"
                      disabled={!promptInput.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] disabled:opacity-40 text-[#050506] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,168,106,0.3)]"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Launch</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Action Tag Buttons in Gold / Bone */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
              <button
                onClick={() => setIsCreateRoomOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#141318]/70 hover:bg-[#1f1d24] border border-[#c9a86a]/20 text-[#cfc4b3] hover:text-[#f1e9db] text-xs flex items-center gap-2 transition-colors"
              >
                <Tv className="w-3.5 h-3.5 text-[#c9a86a]" />
                <span>Create Room</span>
              </button>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#141318]/70 hover:bg-[#1f1d24] border border-[#c9a86a]/20 text-[#cfc4b3] hover:text-[#f1e9db] text-xs flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e3c995]" />
                <span>Customize 3D Avatar</span>
              </button>

              <button
                onClick={() => handleLaunchCinemaWithFilm("https://www.youtube.com/watch?v=BO8lX3hDU30", "Cyberpunk Night City")}
                className="px-3.5 py-1.5 rounded-xl bg-[#141318]/70 hover:bg-[#1f1d24] border border-[#c9a86a]/20 text-[#cfc4b3] hover:text-[#f1e9db] text-xs flex items-center gap-2 transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-[#c9a86a]" />
                <span>Featured Premiere</span>
              </button>

              <button
                onClick={() => alert("Spatial Audio Lounge: 32-channel virtual surround sound calibrated for headphones.")}
                className="px-3.5 py-1.5 rounded-xl bg-[#141318]/70 hover:bg-[#1f1d24] border border-[#c9a86a]/20 text-[#cfc4b3] hover:text-[#f1e9db] text-xs flex items-center gap-2 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#e3c995]" />
                <span>Spatial Audio</span>
              </button>
            </div>

            {/* Bottom 4 Feature Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Create Screening Room */}
              <button
                onClick={() => setIsCreateRoomOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-b from-[#141318]/70 to-[#0e0d12]/80 hover:from-[#1b1922] hover:to-[#14131a] border border-[#c9a86a]/20 hover:border-[#c9a86a]/50 text-left transition-all group flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
                    Create a room
                  </div>
                  <div className="text-[11px] text-[#91887b] mt-1">
                    Screen 01 · IMAX & Velvet architecture
                  </div>
                </div>
                <div className="pt-3 text-[#c9a86a]/70 group-hover:text-[#c9a86a]">
                  <Tv className="w-4 h-4" />
                </div>
              </button>

              {/* Card 2: 3D Character Studio */}
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-b from-[#141318]/70 to-[#0e0d12]/80 hover:from-[#1b1922] hover:to-[#14131a] border border-[#c9a86a]/20 hover:border-[#c9a86a]/50 text-left transition-all group flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
                    3D Character
                  </div>
                  <div className="text-[11px] text-[#91887b] mt-1">
                    Eyes, hair, 3D glasses & cinema wardrobe
                  </div>
                </div>
                <div className="pt-3 text-[#c9a86a]/70 group-hover:text-[#c9a86a]">
                  <Sparkles className="w-4 h-4" />
                </div>
              </button>

              {/* Card 3: Join Live Screening */}
              <button
                onClick={() => handleLaunchCinemaWithFilm("https://www.youtube.com/watch?v=BO8lX3hDU30", "Cyberpunk 2077 Night City")}
                className="p-4 rounded-2xl bg-gradient-to-b from-[#141318]/70 to-[#0e0d12]/80 hover:from-[#1b1922] hover:to-[#14131a] border border-[#c9a86a]/20 hover:border-[#c9a86a]/50 text-left transition-all group flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
                    Join live room
                  </div>
                  <div className="text-[11px] text-[#91887b] mt-1">
                    Night City Premiere · 14 viewers live
                  </div>
                </div>
                <div className="pt-3 text-[#c9a86a]/70 group-hover:text-[#c9a86a]">
                  <Users className="w-4 h-4" />
                </div>
              </button>

              {/* Card 4: Paste Video URL */}
              <button
                onClick={() => handleLaunchCinemaWithFilm("https://www.youtube.com/watch?v=aqz-KE-bpKQ", "Direct Sync Stream")}
                className="p-4 rounded-2xl bg-gradient-to-b from-[#141318]/70 to-[#0e0d12]/80 hover:from-[#1b1922] hover:to-[#14131a] border border-[#c9a86a]/20 hover:border-[#c9a86a]/50 text-left transition-all group flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
                    Direct sync
                  </div>
                  <div className="text-[11px] text-[#91887b] mt-1">
                    Instant YouTube / Vimeo / MP4 projection
                  </div>
                </div>
                <div className="pt-3 text-[#c9a86a]/70 group-hover:text-[#c9a86a]">
                  <Film className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* 3. RIGHT SIDEBAR: 3D CHARACTER SHOWCASE                      */}
        {/* ============================================================ */}
        <aside className="w-full md:w-84 lg:w-[380px] flex-shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-[#c9a86a]/15 bg-[#09080c]/80 backdrop-blur-md p-4 lg:p-6 select-none">
          {/* 3D Avatar Showcase Card */}
          <div className="flex-1 flex flex-col justify-between relative rounded-3xl bg-gradient-to-b from-[#17151e]/90 to-[#0e0d13]/95 border border-[#c9a86a]/30 shadow-[0_0_40px_rgba(201,168,106,0.14)] p-5 overflow-hidden group">
            {/* Top Label & Meta */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#f1e9db]">{avatar.name}</span>
                  <span className="text-[#c9a86a]">✦</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c9a86a]/20 border border-[#c9a86a]/40 text-[#e3c995] font-mono">
                  Lvl {avatar.level}
                </span>
              </div>
              <p className="text-xs text-[#91887b]">
                {avatar.title}
              </p>
            </div>

            {/* Large Interactive 3D Canvas Holo-Viewport (Full Body Framing) */}
            <div className="w-full flex-1 min-h-[460px] my-4 rounded-2xl bg-black/60 border border-[#c9a86a]/20 relative overflow-hidden shadow-inner flex items-center justify-center">
              <Avatar3DViewer
                config={avatar}
                isInteractive={true}
                isSpinning={false}
                fov={38}
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#c9a86a] animate-pulse" />
                <span className="text-[10px] text-[#e3c995] font-mono uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded-full border border-[#c9a86a]/30 backdrop-blur-md">
                  Active
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#e3c995] border border-[#c9a86a]/30 font-mono">
                  3D Holo-Chamber
                </span>
                <span className="text-[10px] text-[#cfc4b3]/70 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  Turn head with mouse
                </span>
              </div>
            </div>

            {/* Avatar Quick Stats & Customizer Button */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/15">
                  <div className="text-[10px] uppercase tracking-wider text-[#91887b]">Attire</div>
                  <div className="text-xs font-medium text-[#f1e9db] mt-0.5 capitalize">{avatar.outfit}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/15">
                  <div className="text-[10px] uppercase tracking-wider text-[#91887b]">Eyewear</div>
                  <div className="text-xs font-medium text-[#f1e9db] mt-0.5 capitalize">{avatar.eyewear}</div>
                </div>
              </div>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] text-[#050506] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(201,168,106,0.3)]"
              >
                <Sparkles className="w-4 h-4 stroke-[2.2]" />
                <span>Customize 3D Character</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* 3D Character Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentConfig={avatar}
        onSave={(newConfig) => {
          setAvatar(newConfig);
          saveAvatarToStorage(newConfig);
        }}
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onLaunchRoom={handleLaunchRoomFromModal}
        defaultFilmUrl={activeFilmUrl}
      />
    </div>
  );
}
