"use client";

import { ProjectorIcon, LaurelLeftIcon, LaurelRightIcon } from "./icons";

const MARQUEE_ITEMS = [
  { tag: "FORMAT", title: "Panavision 70mm System", code: "SCOPE 2.39:1" },
  { tag: "AUDIO", title: "Binaural Spatial Acoustics", code: "DOLBY ATMOS" },
  { tag: "ARCHIVAL", title: "Cannes Official Screening Standard", code: "SELECTION 2026" },
  { tag: "PIPELINE", title: "Lossless Peer-To-Peer Sync", code: "BROADCAST CHANNEL" },
  { tag: "SEATING", title: "Orchestra Tier 24-Seat Salon", code: "RESERVED F07" },
  { tag: "PRIVACY", title: "Zero Telemetry / No Database", code: "CLIENT-SIDE" },
  { tag: "SOURCES", title: "YouTube · Vimeo · MP4 · WebM", code: "UNIVERSAL" },
];

export default function FilmStripMarquee() {
  return (
    <div className="film-strip-section" aria-hidden="true">
      <div className="film-strip-track">
        {/* Render twice for continuous infinite scroll */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="film-cell">
            {/* Top Sprocket Perforations */}
            <div className="sprocket-row top">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="sprocket-hole" />
              ))}
            </div>

            <div className="film-cell-inner">
              <div className="cell-header">
                <span className="cell-tag">{item.tag}</span>
                <span className="cell-code">{item.code}</span>
              </div>
              <div className="cell-content">
                {idx % 3 === 0 ? (
                  <div className="cell-laurel-badge">
                    <LaurelLeftIcon className="h-4 w-4 text-champagne" />
                    <span className="laurel-text">{item.title}</span>
                    <LaurelRightIcon className="h-4 w-4 text-champagne" />
                  </div>
                ) : (
                  <div className="cell-title-row">
                    <ProjectorIcon className="h-3.5 w-3.5 text-champagne shrink-0" />
                    <span className="cell-title">{item.title}</span>
                  </div>
                )}
              </div>
              <div className="cell-footer">
                <span className="cell-fps">24 FPS · 35MM CELLULOID</span>
                <span className="cell-edge-code">FRAME #{String((idx % 12) + 1).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Bottom Sprocket Perforations */}
            <div className="sprocket-row bottom">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="sprocket-hole" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
