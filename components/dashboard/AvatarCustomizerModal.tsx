"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  AvatarConfig,
  HairStyle,
  EyewearType,
  OutfitStyle,
  AccessoryType,
} from "./types";
import {
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
  OUTFIT_COLORS,
  PRESET_AVATARS,
  saveAvatarToStorage,
} from "./avatarStorage";
import {
  Sparkles,
  Shuffle,
  RotateCw,
  Eye,
  Scissors,
  Glasses,
  Shirt,
  User,
  Check,
  X,
  Popcorn,
  Headphones,
  Award,
  type LucideIcon,
} from "lucide-react";

const Avatar3DViewer = dynamic(() => import("./Avatar3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#c9a86a]/60 text-sm">
      <div className="animate-pulse">Loading 3D Chamber...</div>
    </div>
  ),
});

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
}

type TabKey = "hair" | "face" | "eyewear" | "outfit" | "identity";

const HAIR_STYLES: { id: HairStyle; label: string; desc: string }[] = [
  { id: "slick", label: "Slick Director", desc: "Classic swept-back premiere look" },
  { id: "pompadour", label: "High Pompadour", desc: "Voluminous retro wave" },
  { id: "spiky", label: "Sculpted Spikes", desc: "Angular cinematic cuts" },
  { id: "bob", label: "Curtain Bob", desc: "Sleek cheek-length bob with bangs" },
  { id: "afro", label: "Afro Crown", desc: "Sculpted voluminous cloud" },
  { id: "wavy", label: "Cinema Waves", desc: "Casual flowing locks" },
  { id: "buzz", label: "Buzz Fade", desc: "Ultra clean close cut" },
];

const EYEWEAR_STYLES: { id: EyewearType; label: string; icon: string; desc: string }[] = [
  { id: "cinema3d", label: "Classic 3D Glasses", icon: "🕶️", desc: "Iconic red & cyan anaglyph lenses" },
  { id: "cyberVisor", label: "Champagne Gold Visor", icon: "⚡", desc: "Holographic optical eye shield" },
  { id: "shades", label: "VIP Club Shades", icon: "🕶️", desc: "Dark tinted frames with gold temples" },
  { id: "goldFrames", label: "Vintage Wireframes", icon: "👓", desc: "Circular gold director spectacles" },
  { id: "none", label: "No Eyewear", icon: "👁️", desc: "Clear unobstructed view" },
];

const OUTFIT_STYLES: { id: OutfitStyle; label: string; desc: string }[] = [
  { id: "tuxedo", label: "Velvet Tuxedo", desc: "Silk lapels & champagne gold pin" },
  { id: "cyberJacket", label: "Director Jacket", desc: "Gold piping & structured collar" },
  { id: "hoodie", label: "Midnight Hoodie", desc: "Cozy theater acoustic drape" },
  { id: "kimono", label: "Silk Kimono", desc: "Modern wrapped cinema robe" },
  { id: "tee", label: "Minimalist Crew", desc: "Clean essential premiere tee" },
];

const ACCESSORIES: { id: AccessoryType; label: string; icon: LucideIcon; desc: string }[] = [
  { id: "popcorn", label: "Popcorn Bucket", icon: Popcorn, desc: "Fresh butter popcorn bucket" },
  { id: "headphones", label: "Studio Cans", icon: Headphones, desc: "Acoustic gold ear monitors" },
  { id: "directorBadge", label: "Director Pass", icon: Award, desc: "Gold VIP all-access lanyard" },
  { id: "none", label: "None", icon: X, desc: "Minimalist hands-free" },
];

export default function AvatarCustomizerModal({
  isOpen,
  onClose,
  currentConfig,
  onSave,
}: AvatarCustomizerModalProps) {
  const [draft, setDraft] = useState<AvatarConfig>({ ...currentConfig });
  const [activeTab, setActiveTab] = useState<TabKey>("hair");
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const handleRandomize = () => {
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomEye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].value;
    const randomEyewear = EYEWEAR_STYLES[Math.floor(Math.random() * EYEWEAR_STYLES.length)].id;
    const randomOutfit = OUTFIT_STYLES[Math.floor(Math.random() * OUTFIT_STYLES.length)].id;
    const randomOutfitColor = OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)].value;
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;

    setDraft((prev) => ({
      ...prev,
      hairStyle: randomHair,
      hairColor: randomHairColor,
      skinTone: randomSkin,
      eyeColor: randomEye,
      eyeGlow: Math.random() > 0.3,
      eyewear: randomEyewear,
      outfit: randomOutfit,
      outfitColor: randomOutfitColor,
      accessory: randomAccessory,
    }));
  };

  const handleApplyPreset = (preset: AvatarConfig) => {
    setDraft({ ...preset });
  };

  const handleSaveAndClose = () => {
    saveAvatarToStorage(draft);
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Outer Frosted Glass Window in Nocturne Theme */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] flex flex-col rounded-3xl bg-[#0c0b10]/95 border border-[#c9a86a]/30 shadow-[0_0_80px_rgba(201,168,106,0.15)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c9a86a]/20 bg-[#14121a]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c9a86a]/20 border border-[#c9a86a]/40 flex items-center justify-center text-[#e3c995]">
              <Sparkles className="w-5 h-5 text-[#c9a86a] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-[#f1e9db] tracking-wide flex items-center gap-2">
                3D Character Studio
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9a86a]/15 text-[#e3c995] border border-[#c9a86a]/30 font-mono">
                  Realtime
                </span>
              </h2>
              <p className="text-xs text-[#cfc4b3]/70">
                Personalize your avatar for cinema seating, watch parties & emotes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="px-3 py-1.5 rounded-xl bg-[#1c1a24]/80 hover:bg-[#282534] border border-[#c9a86a]/30 text-[#e3c995] text-xs flex items-center gap-1.5 transition-colors"
              title="Generate a randomized aesthetic combination"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Randomize</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#cfc4b3] hover:text-[#f1e9db] hover:bg-[#c9a86a]/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Left 3D Viewport + Right Customization Pane */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* ============================================================ */}
          {/* LEFT: 3D Turntable Chamber Viewport                           */}
          {/* ============================================================ */}
          <div className="w-full md:w-1/2 h-64 md:h-full relative flex flex-col bg-gradient-to-b from-[#16141d]/50 via-[#0a090e] to-[#121118]/60 border-b md:border-b-0 md:border-r border-[#c9a86a]/20">
            {/* Ambient Background Warm Gold Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-[#c9a86a]/10 blur-3xl" />
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 w-full h-full relative">
              <Avatar3DViewer
                config={draft}
                isSpinning={isSpinning}
                isInteractive={!isSpinning}
                fov={38}
              />
            </div>

            {/* Viewport Overlay Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-auto">
              <div className="px-3 py-1 rounded-full bg-black/60 border border-[#c9a86a]/30 text-[11px] text-[#e3c995] backdrop-blur-md">
                Level {draft.level} · {draft.name}
              </div>
              <div className="text-[10px] text-[#91887b] px-1 font-mono">
                {draft.title}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                onClick={() => setIsSpinning((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 backdrop-blur-md transition-colors ${
                  isSpinning
                    ? "bg-[#c9a86a] text-[#050506] font-semibold border border-[#e3c995]"
                    : "bg-black/60 text-[#e3c995] border border-[#c9a86a]/30 hover:bg-[#1f1d26]"
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
                <span>{isSpinning ? "Auto-Spin On" : "Auto-Spin"}</span>
              </button>

              {/* Quick Preset Selector Pills */}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-xl border border-[#c9a86a]/20 overflow-x-auto">
                {PRESET_AVATARS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-1 rounded-lg text-[10px] text-[#cfc4b3] hover:text-[#f1e9db] hover:bg-[#c9a86a]/20 transition-colors whitespace-nowrap"
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: Customization Controls & Navigation Tabs               */}
          {/* ============================================================ */}
          <div className="w-full md:w-1/2 flex-1 flex flex-col min-h-0 bg-[#09080d]/90">
            {/* Customizer Tabs */}
            <div className="flex items-center gap-1 p-3 border-b border-[#c9a86a]/20 bg-[#121118]/60 overflow-x-auto">
              {[
                { id: "hair" as TabKey, label: "Hair", icon: Scissors },
                { id: "face" as TabKey, label: "Eyes & Skin", icon: Eye },
                { id: "eyewear" as TabKey, label: "Eyewear", icon: Glasses },
                { id: "outfit" as TabKey, label: "Wardrobe", icon: Shirt },
                { id: "identity" as TabKey, label: "Identity", icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-[#c9a86a]/25 text-[#f1e9db] border border-[#c9a86a]/50 shadow-[0_0_15px_rgba(201,168,106,0.25)]"
                        : "text-[#cfc4b3]/70 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels Scroll Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TAB 1: HAIR */}
              {activeTab === "hair" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Hairstyle
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, hairStyle: style.id }))
                          }
                          className={`p-3 rounded-2xl text-left border transition-all ${
                            draft.hairStyle === style.id
                              ? "bg-[#c9a86a]/20 border-[#c9a86a] shadow-[0_0_15px_rgba(201,168,106,0.2)]"
                              : "bg-[#141318]/40 border-[#c9a86a]/15 hover:border-[#c9a86a]/40 hover:bg-[#1a1822]"
                          }`}
                        >
                          <div className="text-sm font-medium text-[#f1e9db] flex items-center justify-between">
                            {style.label}
                            {draft.hairStyle === style.id && (
                              <Check className="w-3.5 h-3.5 text-[#c9a86a]" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#91887b] mt-0.5">
                            {style.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Hair Color
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, hairColor: c.value }))
                          }
                          className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                            draft.hairColor.toLowerCase() === c.value.toLowerCase()
                              ? "bg-[#c9a86a]/25 border-[#c9a86a] shadow-[0_0_12px_rgba(201,168,106,0.25)] text-[#f1e9db]"
                              : "bg-[#141318]/40 border-[#c9a86a]/20 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: c.value }}
                          />
                          <span className="text-xs">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EYES & SKIN */}
              {activeTab === "face" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium">
                        Iris Color
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cfc4b3]">
                        <input
                          type="checkbox"
                          checked={draft.eyeGlow}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, eyeGlow: e.target.checked }))
                          }
                          className="rounded border-[#c9a86a]/50 bg-[#141318] text-[#c9a86a] focus:ring-0"
                        />
                        <span>Luminance Glow</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {EYE_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, eyeColor: c.value }))
                          }
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                            draft.eyeColor.toLowerCase() === c.value.toLowerCase()
                              ? "bg-[#c9a86a]/25 border-[#c9a86a] shadow-[0_0_12px_rgba(201,168,106,0.25)] text-[#f1e9db]"
                              : "bg-[#141318]/40 border-[#c9a86a]/20 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-white/40 shadow-[0_0_8px_currentColor]"
                            style={{ backgroundColor: c.value, color: c.value }}
                          />
                          <span className="text-xs font-medium">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Skin Tone Complexion
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SKIN_TONES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, skinTone: s.value }))
                          }
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                            draft.skinTone.toLowerCase() === s.value.toLowerCase()
                              ? "bg-[#c9a86a]/25 border-[#c9a86a] shadow-[0_0_12px_rgba(201,168,106,0.25)] text-[#f1e9db]"
                              : "bg-[#141318]/40 border-[#c9a86a]/20 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: s.value }}
                          />
                          <span className="text-xs font-medium">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EYEWEAR */}
              {activeTab === "eyewear" && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                    Cinema Eyewear & Optics
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {EYEWEAR_STYLES.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, eyewear: opt.id }))
                        }
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          draft.eyewear === opt.id
                            ? "bg-[#c9a86a]/20 border-[#c9a86a] shadow-[0_0_15px_rgba(201,168,106,0.2)] text-[#f1e9db]"
                            : "bg-[#141318]/40 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/40 hover:bg-[#1a1822]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.icon}</span>
                          <div className="text-left">
                            <div className="text-sm font-medium">{opt.label}</div>
                            <div className="text-xs text-[#91887b]">
                              {opt.desc}
                            </div>
                          </div>
                        </div>
                        {draft.eyewear === opt.id && (
                          <Check className="w-4 h-4 text-[#c9a86a]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WARDROBE & ACCESSORIES */}
              {activeTab === "outfit" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Screening Attire
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {OUTFIT_STYLES.map((outfit) => (
                        <button
                          key={outfit.id}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, outfit: outfit.id }))
                          }
                          className={`p-3 rounded-2xl text-left border transition-all ${
                            draft.outfit === outfit.id
                              ? "bg-[#c9a86a]/20 border-[#c9a86a] shadow-[0_0_15px_rgba(201,168,106,0.2)]"
                              : "bg-[#141318]/40 border-[#c9a86a]/15 hover:border-[#c9a86a]/40 hover:bg-[#1a1822]"
                          }`}
                        >
                          <div className="text-sm font-medium text-[#f1e9db] flex items-center justify-between">
                            {outfit.label}
                            {draft.outfit === outfit.id && (
                              <Check className="w-3.5 h-3.5 text-[#c9a86a]" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#91887b] mt-0.5">
                            {outfit.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Fabric Palette
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {OUTFIT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, outfitColor: c.value }))
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                            draft.outfitColor.toLowerCase() === c.value.toLowerCase()
                              ? "bg-[#c9a86a]/25 border-[#c9a86a] shadow-[0_0_12px_rgba(201,168,106,0.25)] text-[#f1e9db]"
                              : "bg-[#141318]/40 border-[#c9a86a]/20 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: c.value }}
                          />
                          <span className="text-xs">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-3">
                      Cinema Gear & Accessory
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {ACCESSORIES.map((acc) => {
                        const Icon = acc.icon;
                        return (
                          <button
                            key={acc.id}
                            onClick={() =>
                              setDraft((prev) => ({ ...prev, accessory: acc.id }))
                            }
                            className={`p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                              draft.accessory === acc.id
                                ? "bg-[#c9a86a]/20 border-[#c9a86a] shadow-[0_0_15px_rgba(201,168,106,0.2)] text-[#f1e9db]"
                                : "bg-[#141318]/40 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/40 hover:bg-[#1a1822]"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-black/60 border border-[#c9a86a]/30 flex items-center justify-center text-[#e3c995]">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">
                                {acc.label}
                              </div>
                              <div className="text-[10px] text-[#91887b] truncate">
                                {acc.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: IDENTITY */}
              {activeTab === "identity" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-2">
                      Screening Moniker / Name
                    </label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/30 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm"
                      placeholder="e.g. Alex Vance"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-2">
                      Auditorium Title
                    </label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141318]/70 border border-[#c9a86a]/30 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm"
                      placeholder="e.g. Premiere Director"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141318]/40 border border-[#c9a86a]/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-[#f1e9db]">VIP Premiere Pass Tier</div>
                      <div className="text-[11px] text-[#91887b]">
                        Unlocks exclusive 8K projection & custom auditoriums
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#c9a86a]/20 border border-[#c9a86a]/40 text-[#e3c995] text-xs font-mono">
                      Level {draft.level}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 border-t border-[#c9a86a]/20 bg-[#121118]/60 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#cfc4b3] hover:text-[#f1e9db] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAndClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] text-[#050506] text-xs font-semibold border border-[#e3c995]/50 shadow-[0_0_20px_rgba(201,168,106,0.3)] flex items-center gap-2 transition-all"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Equip Character</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
