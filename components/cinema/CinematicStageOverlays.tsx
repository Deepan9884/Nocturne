"use client";

interface StageProps {
  onLaunchCinema: (url?: string) => void;
}

export function SeatingArchitectureOverlay() {
  return (
    <div className="stage-overlay-content seating-minimal-zone">
      <div className="seat-slogan-block">
        <h2 className="seat-slogan-title">
          Get seating view.<br />
          <span>Theatre-level experience.</span>
        </h2>
      </div>
    </div>
  );
}

export function ConcessionsFeaturesOverlay() {
  return (
    <div className="stage-overlay-content high-porch-minimal-zone">
      <div className="porch-slogan-block">
        <span className="porch-eyebrow">Midnight Concessions</span>
        <h2 className="porch-slogan-title">
          Fresh popcorn, warm puffs<br />
          <em>&amp; artisan rolls.</em>
        </h2>
      </div>
    </div>
  );
}

export function Screen05PremiereOverlay({ onLaunchCinema }: StageProps) {
  const defaultFilm = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

  return (
    <div className="stage-overlay-content screen05-premiere-zone">
      <div
        className="stage-header-block center"
        onClick={() => onLaunchCinema(defaultFilm)}
        role="button"
        tabIndex={0}
        data-cursor="ENTER"
        style={{ cursor: "pointer" }}
      >
        <h2 className="stage-title">
          Watch your loved films.<br />
          <span>Together with your closest ones.</span>
        </h2>
      </div>
    </div>
  );
}
