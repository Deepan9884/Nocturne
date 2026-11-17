"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Film,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Shield,
  Volume2,
  Tv,
  Star,
  ChevronLeft,
} from "lucide-react";
import NocturneLogo from "../cinema/NocturneLogo";
import {
  PRESET_AVATARS,
  saveAvatarToStorage,
  saveStoredUser,
  UserProfile,
} from "../dashboard/avatarStorage";
import { AvatarConfig } from "../dashboard/types";

// Dynamic import for 3D Avatar preview widget
const Avatar3DViewer = dynamic(
  () => import("../dashboard/Avatar3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-[#c9a86a]/50 text-xs">
        <div className="animate-pulse">Initializing 3D Holo-Chamber...</div>
      </div>
    ),
  }
);

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("Alex Vance");
  const [email, setEmail] = useState("alex@nocturne.cinema");
  const [password, setPassword] = useState("••••••••••••");
  const [membershipTier, setMembershipTier] = useState<"VIP Director" | "Cinephile Standard">("VIP Director");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig>(PRESET_AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userProfile: UserProfile = {
      name: mode === "signup" ? (name.trim() || "Cinephile") : (name || "Alex Vance"),
      email: email.trim() || "director@nocturne.cinema",
      tier: membershipTier,
      isLoggedIn: true,
      avatarConfig: selectedAvatar,
    };

    // Save avatar and user profile to storage
    saveStoredUser(userProfile);
    saveAvatarToStorage(selectedAvatar);

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIsSubmitting(true);
    const demoUser: UserProfile = {
      name: "Alex Vance",
      email: "alex@nocturne.cinema",
      tier: "VIP Director",
      isLoggedIn: true,
      avatarConfig: PRESET_AVATARS[0],
    };
    saveStoredUser(demoUser);
    saveAvatarToStorage(PRESET_AVATARS[0]);

    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleSelectPreset = (preset: AvatarConfig) => {
    setSelectedAvatar(preset);
    setName(preset.name);
  };

  return (
    <div className="min-h-screen w-full bg-[#050506] text-[#f1e9db] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-[#c9a86a]/30 selection:text-[#f1e9db] relative overflow-x-hidden">
      {/* Background Cinematic Atmosphere & Amber/Gold Spotlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Center Projector Beam */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[#c9a86a]/10 rounded-full blur-[150px]" />
        {/* Left Oxblood Ambient Glow */}
        <div className="absolute -bottom-24 -left-24 w-[750px] h-[750px] bg-[#2a0d12]/30 rounded-full blur-[170px]" />
        {/* Right Bronze Accent Glow */}
        <div className="absolute top-1/4 -right-24 w-[600px] h-[600px] bg-[#8c7243]/10 rounded-full blur-[140px]" />
        {/* Anamorphic Lens Flare Line */}
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a86a]/15 to-transparent" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 mb-4 select-none z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <NocturneLogo size={34} glow={true} />
          <div>
            <span className="text-base font-bold tracking-wider text-[#f1e9db] group-hover:text-[#e3c995] transition-colors">
              NOCTURNE
            </span>
            <span className="block text-[10px] text-[#c9a86a]/70 uppercase tracking-widest font-mono">
              Private Cinema
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141318]/70 hover:bg-[#1f1d24] border border-[#c9a86a]/20 text-xs text-[#cfc4b3] hover:text-[#f1e9db] transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Theatre</span>
        </Link>
      </header>

      {/* Main Glassmorphism Auth Chassis */}
      <div className="relative w-full max-w-6xl min-h-[700px] rounded-[32px] bg-[#0c0b10]/90 backdrop-blur-[36px] border border-[#c9a86a]/25 shadow-[0_0_80px_rgba(201,168,106,0.12)] flex flex-col lg:flex-row overflow-hidden z-10">
        {/* Subtle Top-Edge Champagne Luster Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e3c995]/40 to-transparent pointer-events-none z-30" />

        {/* ============================================================ */}
        {/* LEFT COLUMN: 3D CHARACTER SHOWCASE & PREMIERE CALLOUT        */}
        {/* ============================================================ */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#c9a86a]/15 bg-gradient-to-b from-[#14121a]/60 via-[#0a090e]/80 to-[#100e16]/80 relative select-none">
          {/* Top Editorial Eyebrow */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a86a]/15 border border-[#c9a86a]/30 text-[#e3c995] text-xs font-mono uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Screen 01 · Private Premiere</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif italic text-[#f1e9db] tracking-tight leading-snug">
              {mode === "login"
                ? "Welcome back to your private auditorium."
                : "Claim your 3D avatar & enter the cinema."}
            </h1>

            <p className="text-xs sm:text-sm text-[#cfc4b3]/75 mt-2.5 max-w-md">
              {mode === "login"
                ? "Step into the screening room. Your custom 3D character, personal seat, and synchronized watch parties are waiting."
                : "Every member receives an interactive full-body 3D character, customizable attire, and real-time Dolby Atmos screening rooms."}
            </p>
          </div>

          {/* Interactive 3D Avatar Holo-Chamber */}
          <div className="w-full h-72 sm:h-80 my-6 rounded-2xl bg-black/60 border border-[#c9a86a]/20 relative overflow-hidden shadow-inner flex items-center justify-center">
            <Avatar3DViewer
              config={selectedAvatar}
              isInteractive={true}
              isSpinning={false}
              fov={38}
            />

            {/* Chamber Floating Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#e3c995] border border-[#c9a86a]/30 font-mono">
                {selectedAvatar.name}
              </span>
              <span className="text-[10px] text-[#91887b] font-mono">
                Lvl {selectedAvatar.level}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="text-[10px] text-[#cfc4b3]/70 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-[#c9a86a]/20 font-mono">
                Interactive 3D Avatar
              </span>
            </div>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#c9a86a]/15 text-xs text-[#cfc4b3]/80">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#c9a86a]" />
              <span className="text-[11px]">Dolby 3D Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#c9a86a]" />
              <span className="text-[11px]">Private Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c9a86a]" />
              <span className="text-[11px]">VIP Passkey</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: AUTH FORM (LOGIN / SIGN UP)                     */}
        {/* ============================================================ */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 bg-[#09080d]/90">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#141318]/90 border border-[#c9a86a]/20 mb-8 max-w-sm">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#c9a86a] to-[#a88243] text-[#050506] shadow-[0_0_15px_rgba(201,168,106,0.3)]"
                  : "text-[#cfc4b3]/70 hover:text-[#f1e9db]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === "signup"
                  ? "bg-gradient-to-r from-[#c9a86a] to-[#a88243] text-[#050506] shadow-[0_0_15px_rgba(201,168,106,0.3)]"
                  : "text-[#cfc4b3]/70 hover:text-[#f1e9db]"
              }`}
            >
              Premiere Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Moniker / Name (Sign Up only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-1.5">
                  Director Moniker / Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141318]/80 border border-[#c9a86a]/25 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm transition-all"
                  />
                  <User className="w-4 h-4 text-[#c9a86a]/60 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-1.5">
                Cinema Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nocturne.cinema"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141318]/80 border border-[#c9a86a]/25 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm transition-all"
                />
                <Mail className="w-4 h-4 text-[#c9a86a]/60 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Passcode */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider text-[#c9a86a] font-medium">
                  Auditorium Passcode
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset link dispatched to cinema email.")}
                    className="text-[11px] text-[#c9a86a] hover:text-[#e3c995] transition-colors"
                  >
                    Forgot passcode?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security pass..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141318]/80 border border-[#c9a86a]/25 text-[#f1e9db] placeholder-[#91887b] focus:outline-none focus:border-[#c9a86a] text-sm transition-all"
                />
                <Lock className="w-4 h-4 text-[#c9a86a]/60 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#91887b] hover:text-[#f1e9db] absolute right-3 top-2.5 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign Up Options: Membership Tier & Avatar Selector */}
            {mode === "signup" && (
              <>
                {/* Membership Tier Picker */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-1.5">
                    Membership Pass Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMembershipTier("VIP Director")}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        membershipTier === "VIP Director"
                          ? "bg-[#c9a86a]/20 border-[#c9a86a] text-[#f1e9db] shadow-[0_0_15px_rgba(201,168,106,0.2)]"
                          : "bg-[#141318]/50 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">VIP Director</span>
                        <Star className="w-3.5 h-3.5 text-[#c9a86a] fill-current" />
                      </div>
                      <span className="text-[10px] text-[#91887b] block mt-0.5">
                        Dolby 8K & Custom auditoriums
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMembershipTier("Cinephile Standard")}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        membershipTier === "Cinephile Standard"
                          ? "bg-[#c9a86a]/20 border-[#c9a86a] text-[#f1e9db] shadow-[0_0_15px_rgba(201,168,106,0.2)]"
                          : "bg-[#141318]/50 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Cinephile</span>
                        <Film className="w-3.5 h-3.5 text-[#91887b]" />
                      </div>
                      <span className="text-[10px] text-[#91887b] block mt-0.5">
                        Public watch parties & lounge
                      </span>
                    </button>
                  </div>
                </div>

                {/* Starting 3D Avatar Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c9a86a] font-medium mb-1.5">
                    Choose Initial 3D Character
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between ${
                          selectedAvatar.name === preset.name
                            ? "bg-[#c9a86a]/20 border-[#c9a86a] text-[#f1e9db] shadow-[0_0_10px_rgba(201,168,106,0.2)]"
                            : "bg-[#141318]/40 border-[#c9a86a]/15 text-[#cfc4b3] hover:border-[#c9a86a]/30"
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-medium truncate">{preset.name}</div>
                          <div className="text-[10px] text-[#91887b] truncate capitalize">
                            {preset.hairStyle} · {preset.outfit}
                          </div>
                        </div>
                        {selectedAvatar.name === preset.name && (
                          <Check className="w-3.5 h-3.5 text-[#c9a86a] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cfc4b3]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#c9a86a]/40 bg-[#141318] text-[#c9a86a] focus:ring-0"
                />
                <span>Keep me seated on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c9a86a] to-[#a88243] hover:from-[#e3c995] hover:to-[#b89150] text-[#050506] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(201,168,106,0.35)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Opening Auditorium Doors...</span>
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? "Enter The Premiere"
                      : "Create Pass & Claim 3D Avatar"}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign In & Divider */}
          <div className="mt-6 pt-5 border-t border-[#c9a86a]/15 space-y-3">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[#16141a]/80 hover:bg-[#c9a86a]/15 border border-[#c9a86a]/25 text-[#e3c995] text-xs font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c9a86a]" />
              <span>Instant Demo Access (Director Alex Vance)</span>
            </button>

            <p className="text-[11px] text-[#91887b] text-center">
              {mode === "login" ? "New to Nocturne Cinema? " : "Already hold a cinema pass? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-[#c9a86a] hover:underline font-medium"
              >
                {mode === "login" ? "Join the Premiere" : "Sign In here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
