"use client";

import React from "react";
import { Sparkles, Film, Volume2, ShieldCheck } from "lucide-react";

interface TheatreScreenAuditoriumProps {
  screenLabel?: string;
  roomName?: string;
  seatCode?: string;
}

export default function TheatreScreenAuditorium({
  screenLabel = "SCREEN 01",
  roomName = "GRAND AUDITORIUM",
  seatCode = "VIP • ROW E-07",
}: TheatreScreenAuditoriumProps) {
  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[640px] flex flex-col justify-between p-5 sm:p-7 select-none overflow-hidden bg-gradient-to-b from-[#0a070e] via-[#08050a] to-[#120407]">
      {/* Subtle Film Grain and Vignette Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(201,168,106,0.12),transparent_75%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,240,210,0.08),transparent_50%)]" />

      {/* Acoustic Wall Sconces - Left & Right glowing pillars */}
      <div className="absolute left-2 top-28 bottom-28 w-[2px] bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent pointer-events-none" />
      <div className="absolute right-2 top-28 bottom-28 w-[2px] bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent pointer-events-none" />

      {/* ======================================================== */}
      {/* TICKET STUB TOP HEADER: LUXURY ADMITTANCE DATA           */}
      {/* ======================================================== */}
      <div className="relative z-10 flex items-start justify-between border-b border-[#c9a86a]/20 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#e3c995] shadow-[0_0_8px_#e3c995] animate-pulse motion-reduce:animate-none" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#e3c995] font-semibold">
              {roomName}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-serif italic text-[#f1e9db] tracking-wide">
            Private Premiere Auditorium
          </h2>
        </div>

        <div className="text-right">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2a080d] border border-[#c9a86a]/40 text-[#f5d77f] text-[10px] font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(201,168,106,0.2)]">
            {screenLabel}
          </span>
          <div className="text-[10px] text-[#cfc4b3]/70 font-mono mt-1">
            {seatCode}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* THE AUDITORIUM: PROJECTOR BEAM, CURVED SCREEN & CHAIRS   */}
      {/* ======================================================== */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center w-full">
        {/* Overhead Projector Booth Beam */}
        <div className="relative w-full max-w-[440px] flex justify-center">
          {/* Projector Lens Port */}
          <div className="w-12 h-2 rounded-full bg-[#f1e9db]/80 shadow-[0_0_20px_#fff7e6,0_0_40px_rgba(201,168,106,0.8)] mb-1" />
          
          {/* Projector Light Beam Cone */}
          <div
            className="absolute top-2 w-[340px] sm:w-[400px] h-[130px] pointer-events-none opacity-45"
            style={{
              clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
              background:
                "linear-gradient(180deg, rgba(255, 248, 225, 0.45) 0%, rgba(201, 168, 106, 0.22) 50%, rgba(201, 168, 106, 0.02) 100%)",
            }}
          />

          {/* Floating projector dust / light motes */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 pointer-events-none overflow-hidden">
            <span className="absolute top-2 left-10 w-1 h-1 rounded-full bg-white/70 shadow-[0_0_4px_#fff] animate-ping" />
            <span className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-[#e3c995]/80 shadow-[0_0_6px_#c9a86a]" />
            <span className="absolute top-12 left-20 w-1 h-1 rounded-full bg-[#fff]/50 shadow-[0_0_4px_#fff]" />
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CINEMA SCREEN: CURVED WITH BOLDLY WRITTEN "NOCTURNE" */}
        {/* ---------------------------------------------------- */}
        <div className="relative w-full max-w-[420px] sm:max-w-[460px] mx-auto mt-1 mb-5">
          {/* Screen Outer Glow & Floor Light Spill */}
          <div className="absolute -inset-2 bg-[#c9a86a]/20 rounded-[28px] blur-xl pointer-events-none" />

          {/* Screen Housing Bezel */}
          <div
            className="relative w-full rounded-2xl p-[3px] bg-gradient-to-b from-[#e8c872] via-[#5c441c] to-[#1c080b] shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_35px_rgba(201,168,106,0.35)]"
            style={{
              transform: "perspective(800px) rotateX(4deg)",
            }}
          >
            {/* The Illuminated Screen Canvas */}
            <div className="relative w-full h-32 sm:h-36 rounded-[13px] overflow-hidden bg-gradient-to-b from-[#1b1510] via-[#0d090c] to-[#050406] flex flex-col items-center justify-center border border-[#e3c995]/30">
              {/* Screen Inner Ambient Bloom */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,245,220,0.28)_0%,rgba(201,168,106,0.12)_55%,transparent_90%)]" />

              {/* Anamorphic Lens Flare Horizontal Streak */}
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#fff5d0] to-transparent shadow-[0_0_12px_#fff]" />

              {/* 2.39:1 Aspect Ratio Corner Guides */}
              <div className="absolute top-2 left-2.5 w-2.5 h-2.5 border-t border-l border-[#c9a86a]/60" />
              <div className="absolute top-2 right-2.5 w-2.5 h-2.5 border-t border-r border-[#c9a86a]/60" />
              <div className="absolute bottom-2 left-2.5 w-2.5 h-2.5 border-b border-l border-[#c9a86a]/60" />
              <div className="absolute bottom-2 right-2.5 w-2.5 h-2.5 border-b border-r border-[#c9a86a]/60" />

              {/* Screen Top Header Tag */}
              <div className="relative z-10 flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-[0.25em] text-[#c9a86a]/80 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-[#e3c995]" />
                <span>Feature Presentation</span>
              </div>

              {/* BOLDLY WRITTEN NOCTURNE */}
              <div className="relative z-10 text-center px-4">
                <h1
                  className="text-3xl sm:text-4xl md:text-[42px] font-serif font-black tracking-[0.3em] uppercase leading-none select-none drop-shadow-[0_4px_16px_rgba(227,201,149,0.7)]"
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #fff4d1 35%, #e3c995 70%, #9e7a3a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 25px rgba(227,201,149,0.45)",
                  }}
                >
                  NOCTURNE
                </h1>
                
                {/* Screen Subtitle */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#c9a86a]/60" />
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono text-[#e3c995]/90 font-medium">
                    Private Premiere Theatre · 70MM
                  </span>
                  <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#c9a86a]/60" />
                </div>
              </div>

              {/* Screen Bottom Reflection Line */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#c9a86a]/15 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Under-Screen Curved Stage Rim & Floor Bounce Glow */}
          <div className="w-[88%] mx-auto h-2 rounded-[50%] bg-gradient-to-r from-transparent via-[#e3c995]/50 to-transparent blur-[2px] mt-0.5" />
        </div>

        {/* ---------------------------------------------------- */}
        {/* THE CHAIRS: TIERED LUXURY CINEMA SEATING             */}
        {/* ---------------------------------------------------- */}
        <div className="relative w-full max-w-[420px] sm:max-w-[460px] flex flex-col items-center">
          {/* Subtle Ambient Light Wash over Seats from Screen */}
          <div className="absolute top-0 inset-x-8 h-20 bg-gradient-to-b from-[#e3c995]/15 via-[#c9a86a]/5 to-transparent blur-md pointer-events-none" />

          {/* ROW 1: FRONT ROW (Closest to screen, illuminated top edges) */}
          <div className="w-[82%] flex items-center justify-between gap-1 sm:gap-2 mb-2 relative z-10">
            {/* Left Block - Row A */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {["A1", "A2", "A3"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  isFrontRow={true}
                  accent={seat === "A2"}
                />
              ))}
            </div>

            {/* Center Aisle Indicator with Floor Runner Light */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d77f] shadow-[0_0_6px_#f5d77f]" />
              <div className="w-[1px] h-4 bg-[#c9a86a]/30 my-0.5" />
            </div>

            {/* Right Block - Row A */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {["A4", "A5", "A6"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  isFrontRow={true}
                  accent={seat === "A5"}
                />
              ))}
            </div>
          </div>

          {/* ROW 2: MID ROW (ORCHESTRA PRIME) */}
          <div className="w-[92%] flex items-center justify-between gap-1.5 sm:gap-2 mb-2 relative z-10">
            {/* Left Block - Row B */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {["B1", "B2", "B3"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  accent={seat === "B2"}
                />
              ))}
            </div>

            {/* Center Aisle */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d77f]/80 shadow-[0_0_6px_#f5d77f]" />
              <div className="w-[1px] h-4 bg-[#c9a86a]/30 my-0.5" />
            </div>

            {/* Right Block - Row B */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {["B4", "B5", "B6"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  accent={seat === "B5"}
                />
              ))}
            </div>
          </div>

          {/* ROW 3: BACK ROW (LOGE VIP - SELECTED SEAT HIGHLIGHT) */}
          <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 relative z-20">
            {/* Left Block - Row C */}
            <div className="flex items-center gap-1 sm:gap-2">
              {["C1", "C2", "C3"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  isHeroRow={true}
                />
              ))}
            </div>

            {/* Center Aisle Runner Plate */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="w-2 h-2 rounded-full bg-[#e3c995] shadow-[0_0_10px_#f5d77f] animate-pulse motion-reduce:animate-none" />
              <span className="text-[7px] font-mono text-[#c9a86a] mt-0.5 uppercase tracking-tighter">
                AISLE
              </span>
            </div>

            {/* Right Block - Row C (Contains VIP Selected Seat) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {["C4", "C5", "C6"].map((seat) => (
                <CinemaSeat
                  key={seat}
                  label={seat}
                  isHeroRow={true}
                  isSelected={seat === "C5"}
                />
              ))}
            </div>
          </div>

          {/* Seating Legend / Callout */}
          <div className="flex items-center justify-center gap-4 mt-3 text-[10px] font-mono text-[#cfc4b3]/75">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#c9a86a] shadow-[0_0_6px_#c9a86a]" />
              <span className="text-[#f5d77f]">Your Reserved Seat (C5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#3d0f15] border border-[#c9a86a]/40" />
              <span>Plush Velvet Recliners</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TICKET STUB BOTTOM FOOTER: BARCODE & VERIFIED METRICS    */}
      {/* ======================================================== */}
      <div className="relative z-10 pt-3 border-t border-[#c9a86a]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Authentic Movie Ticket Barcode */}
        <div className="flex flex-col items-start">
          <div className="flex items-end gap-[2px] h-7 px-2 py-1 rounded bg-[#0a0406] border border-[#c9a86a]/30">
            {/* Procedural Barcode Lines */}
            {[
              2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1,
              4, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2,
            ].map((width, idx) => (
              <span
                key={idx}
                className="bg-[#e3c995] rounded-[0.5px]"
                style={{
                  width: `${width * 1.5}px`,
                  height: idx % 3 === 0 ? "100%" : idx % 2 === 0 ? "82%" : "90%",
                  opacity: idx % 5 === 0 ? 0.75 : 1,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] font-mono text-[#c9a86a]/80 tracking-widest mt-1">
            *NOC-70MM-004921-VIP*
          </span>
        </div>

        {/* Sound & Picture Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1f060a] border border-[#c9a86a]/30 text-[10px] text-[#e3c995] font-mono">
            <Volume2 className="w-3 h-3 text-[#c9a86a]" />
            <span>DOLBY ATMOS</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1f060a] border border-[#c9a86a]/30 text-[10px] text-[#e3c995] font-mono">
            <Film className="w-3 h-3 text-[#c9a86a]" />
            <span>4K LASER</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1f060a] border border-[#c9a86a]/30 text-[10px] text-[#e3c995] font-mono">
            <ShieldCheck className="w-3 h-3 text-[#c9a86a]" />
            <span>P2P PASS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * High-fidelity individual cinema seat in plush red velvet with gold armrests
 */
function CinemaSeat({
  label,
  isFrontRow = false,
  isHeroRow = false,
  isSelected = false,
  accent = false,
}: {
  label: string;
  isFrontRow?: boolean;
  isHeroRow?: boolean;
  isSelected?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      title={`Seat ${label}`}
      className={`group relative flex flex-col items-center transition-colors duration-300 ${
        isFrontRow
          ? "w-8 sm:w-9"
          : isHeroRow
          ? "w-9 sm:w-11"
          : "w-8 sm:w-10"
      }`}
    >
      {/* Selected Seat Golden Halo */}
      {isSelected && (
        <div className="absolute -top-2 w-full h-10 bg-[#e3c995]/30 rounded-t-lg blur-md pointer-events-none" />
      )}

      {/* Seat Backrest / Cushion */}
      <div
        className={`w-full rounded-t-lg transition-colors relative overflow-hidden flex flex-col items-center justify-center ${
          isFrontRow ? "h-6 sm:h-7" : isHeroRow ? "h-7 sm:h-8" : "h-6 sm:h-7"
        } ${
          isSelected
            ? "bg-gradient-to-b from-[#e3c995] via-[#c9a86a] to-[#7a5720] border border-[#fff] shadow-[0_0_15px_rgba(227,201,149,0.8)]"
            : accent
            ? "bg-gradient-to-b from-[#5c131d] via-[#3a0a11] to-[#220508] border border-[#c9a86a]/40 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            : "bg-gradient-to-b from-[#440d15] via-[#2c080e] to-[#1c0408] border border-[#c9a86a]/25 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Velvet Vertical Stitching Lines */}
        <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-30">
          <div className="w-[1px] h-full bg-white/40" />
          <div className="w-[1px] h-full bg-white/40" />
        </div>

        {/* Seat Number Tag */}
        <span
          className={`relative z-10 text-[8px] font-mono font-bold leading-none ${
            isSelected
              ? "text-[#120406]"
              : "text-[#e3c995]/85 group-hover:text-white"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Seat Bottom Cushion */}
      <div
        className={`w-[90%] h-2.5 sm:h-3 rounded-b-md transition-colors ${
          isSelected
            ? "bg-[#9e7631] border-t border-[#fff]/40"
            : "bg-[#25060a] border-t border-[#c9a86a]/30"
        }`}
      />

      {/* Gold Armrests */}
      <div className="w-full flex justify-between px-[1px] -mt-3 pointer-events-none">
        <span
          className={`w-1 h-3 rounded-full ${
            isSelected
              ? "bg-[#fff] shadow-[0_0_4px_#fff]"
              : "bg-gradient-to-b from-[#e3c995] to-[#7a5924]"
          }`}
        />
        <span
          className={`w-1 h-3 rounded-full ${
            isSelected
              ? "bg-[#fff] shadow-[0_0_4px_#fff]"
              : "bg-gradient-to-b from-[#e3c995] to-[#7a5924]"
          }`}
        />
      </div>
    </div>
  );
}
