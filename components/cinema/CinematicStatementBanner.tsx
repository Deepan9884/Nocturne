"use client";

interface CinematicStatementBannerProps {
  phrase?: string;
}

export default function CinematicStatementBanner({
  phrase = "THE CELLULOID RITUAL · PRIVATE SALON · 2.39:1 CINEMASCOPE · ZERO TELEMETRY · DOLBY ATMOS",
}: CinematicStatementBannerProps) {
  return (
    <div className="cinematic-statement-wrapper" aria-hidden="true">
      <div className="statement-line top" />
      <div className="statement-marquee-track">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="statement-item">
            <span className="statement-text">{phrase}</span>
            <span className="statement-bullet">◆</span>
          </div>
        ))}
      </div>
      <div className="statement-line bottom" />
    </div>
  );
}
