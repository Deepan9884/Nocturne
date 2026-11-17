"use client";

import { useState } from "react";
import {
  Film,
  Users,
  Volume2,
  Lock,
  Globe,
  X,
  Play,
  Tv,
} from "lucide-react";

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
}

const THEME_OPTIONS = [
  {
    id: "velvet",
    name: "Screen 01 · Royal Velvet IMAX",
    desc: "Plush burgundy recliners, brass sconces & curved screen",
    accent: "#c9a86a",
    badge: "Most Popular",
  },
  {
    id: "cyber",
    name: "Screen 02 · Nocturne Skydeck",
    desc: "Starry skyline views, amber mood lighting & wide canvas",
    accent: "#e3c995",
    badge: "Atmospheric",
  },
  {
    id: "indie",
    name: "Screen 03 · Midnight Noir Lounge",
    desc: "Intimate vintage acoustics, warm amber lighting",
    accent: "#dfc28d",
    badge: "Cozy",
  },
  {
    id: "atmos",
    name: "Screen 04 · Dolby Atmos Blackbox",
    desc: "Stealth matte architecture, 32-channel spatial audio",
    accent: "#8c7243",
    badge: "Hi-Fi Audio",
  },
];

const CURATED_FILM_PRESETS = [
  {
    title: "Cyberpunk 2077 · Night City Premiere",
    url: "https://www.youtube.com/watch?v=BO8lX3hDU30",
    genre: "Sci-Fi / Action",
    duration: "4K 60fps",
  },
  {
    title: "Dune: Part Two · Sandworm Sequence",
    url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    genre: "Sci-Fi Epic",
    duration: "IMAX 4K",
  },
  {
    title: "Big Buck Bunny · 4K Color Grading Test",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Animation",
    duration: "10 mins",
  },
  {
    title: "Tears of Steel · VFX Showcase",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Cyberpunk VFX",
    duration: "12 mins",
  },
  {
    title: "Lo-fi Midnight Screening Chill Beats",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    genre: "Atmospheric / Music",
    duration: "Live Radio",
  },
];

export default function CreateRoomModal({
  isOpen,
  onClose,
  onLaunchRoom,
  defaultFilmUrl = "",
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("Midnight Screening");
  const [selectedTheme, setSelectedTheme] = useState("velvet");
  const [filmUrl, setFilmUrl] = useState(defaultFilmUrl || CURATED_FILM_PRESETS[0].url);
  const [filmTitle, setFilmTitle] = useState(CURATED_FILM_PRESETS[0].title);
  const [seats, setSeats] = useState(24);
  const [isPrivate, setIsPrivate] = useState(false);
  const [spatialAudio, setSpatialAudio] = useState(true);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof CURATED_FILM_PRESETS)[0]) => {
    setFilmUrl(preset.url);
    setFilmTitle(preset.title);
  };

  const handleCreate = () => {
    const themeObj = THEME_OPTIONS.find((t) => t.id === selectedTheme) || THEME_OPTIONS[0];
    onLaunchRoom({
      name: roomName,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0b10]/95 border border-[#c9a86a]/30 shadow-[0_0_80px_rgba(201,168,106,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c9a86a]/20 bg-[#14121a]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c9a86a]/20 border border-[#c9a86a]/40 flex items-center justify-center text-[#e3c995]">
              <Tv className="w-5 h-5 text-[#c9a86a]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-[#f1e9db] tracking-wide">
                Create Screening Room
              </h2>
              <p className="text-xs text-[#cfc4b3]/70">
                Host a synchronized private auditorium with spatial seats & voice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#cfc4b3] hover:text-[#f1e9db] hover:bg-[#c9a86a]/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-2">
              Auditorium Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/30 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm"
              placeholder="e.g. Alex's Midnight Premiere"
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-2.5">
              Auditorium Architecture & Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => setSelectedTheme(thm.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedTheme === thm.id
                      ? "bg-[#c9a86a]/20 border-[#c9a86a] shadow-[0_0_15px_rgba(201,168,106,0.2)] text-[#f1e9db]"
                      : "bg-[#141318]/40 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{thm.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c9a86a]/20 text-[#e3c995]">
                      {thm.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#91887b] mt-1 line-clamp-2">
                    {thm.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Film Link Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-2">
              Film Stream Source (YouTube, Vimeo, MP4 URL)
            </label>
            <div className="relative">
              <input
                type="text"
                value={filmUrl}
                onChange={(e) => {
                  setFilmUrl(e.target.value);
                  setFilmTitle("Custom Stream Presentation");
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/30 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm"
                placeholder="Paste any YouTube or video URL..."
              />
              <Film className="w-4 h-4 text-[#c9a86a]/60 absolute left-3.5 top-3" />
            </div>

            {/* Quick Presets Carousel */}
            <div className="mt-3">
              <span className="text-[11px] text-[#91887b] block mb-2">
                Or pick a cinema test reel:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CURATED_FILM_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all ${
                      filmUrl === preset.url
                        ? "bg-[#c9a86a]/30 border-[#c9a86a] text-[#f1e9db] shadow-[0_0_10px_rgba(201,168,106,0.25)]"
                        : "bg-[#141318]/40 border-[#c9a86a]/20 text-[#cfc4b3] hover:bg-[#1a1822]"
                    }`}
                  >
                    {preset.title.split("·")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room Settings: Capacity, Audio, Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Seats */}
            <div className="p-3.5 rounded-2xl bg-[#141318]/40 border border-[#c9a86a]/20">
              <div className="flex items-center gap-2 text-xs text-[#cfc4b3] mb-2">
                <Users className="w-4 h-4 text-[#c9a86a]" />
                <span>Auditorium Seats</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[12, 24, 48].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSeats(count)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono transition-colors ${
                      seats === count
                        ? "bg-[#c9a86a] text-[#050506] font-semibold"
                        : "bg-[#1f1d24] text-[#cfc4b3] hover:bg-[#282532]"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Spatial Audio */}
            <div className="p-3.5 rounded-2xl bg-[#141318]/40 border border-[#c9a86a]/20">
              <div className="flex items-center gap-2 text-xs text-[#cfc4b3] mb-2">
                <Volume2 className="w-4 h-4 text-[#c9a86a]" />
                <span>Spatial 3D Audio</span>
              </div>
              <button
                type="button"
                onClick={() => setSpatialAudio(!spatialAudio)}
                className={`w-full py-1 rounded-lg text-xs font-medium transition-colors ${
                  spatialAudio
                    ? "bg-[#c9a86a] text-[#050506] font-semibold"
                    : "bg-[#1f1d24] text-[#cfc4b3]"
                }`}
              >
                {spatialAudio ? "Dolby Atmos On" : "Stereo Only"}
              </button>
            </div>

            {/* Privacy */}
            <div className="p-3.5 rounded-2xl bg-[#141318]/40 border border-[#c9a86a]/20">
              <div className="flex items-center gap-2 text-xs text-[#cfc4b3] mb-2">
                {isPrivate ? <Lock className="w-4 h-4 text-[#c9a86a]" /> : <Globe className="w-4 h-4 text-[#c9a86a]" />}
                <span>Access Level</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-full py-1 rounded-lg text-xs font-medium transition-colors ${
                  isPrivate
                    ? "bg-[#c9a86a] text-[#050506] font-semibold"
                    : "bg-[#1f1d24] text-[#cfc4b3]"
                }`}
              >
                {isPrivate ? "Friends Only" : "Public Screening"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c9a86a]/20 bg-[#121118]/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#cfc4b3] hover:text-[#f1e9db] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] text-[#050506] text-xs font-semibold border border-[#e3c995]/50 shadow-[0_0_25px_rgba(201,168,106,0.35)] flex items-center gap-2 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Auditorium Room</span>
          </button>
        </div>
      </div>
    </div>
  );
}
