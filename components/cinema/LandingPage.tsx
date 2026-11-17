"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRightIcon,
  SparklesIcon,
  ChevronDownIcon,
} from "./icons";
import CinematicJourneyCanvas from "./CinematicJourneyCanvas";
import {
  SeatingArchitectureOverlay,
  ConcessionsFeaturesOverlay,
  Screen05PremiereOverlay,
} from "./CinematicStageOverlays";
import NocturneLogo from "./NocturneLogo";
import AudioController from "./AudioController";
import CinematicCursor from "./CinematicCursor";
import MagneticButton from "./MagneticButton";
import { PRESET_FILMS, FilmPreset } from "./BoxOfficeWidget";

// Lazy-load the complete cinema app
const CinemaExperience = dynamic(
  () => import("./CinemaExperience").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="scene-loader-fullscreen" /> }
);

function getStageOpacity(
  p: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number
): number {
  if (p < enterStart || p > exitEnd) return 0;
  if (p >= enterEnd && p <= exitStart) return 1;
  if (p < enterEnd) return (p - enterStart) / (enterEnd - enterStart);
  return (exitEnd - p) / (exitEnd - exitStart);
}

export default function LandingPage() {
  const [showCinema, setShowCinema] = useState(false);
  const [initialFilmUrl, setInitialFilmUrl] = useState<string>("");
  const [activePreset, setActivePreset] = useState<FilmPreset>(PRESET_FILMS[0]);
  const [progress, setProgress] = useState(0); // 0.0 to 1.0 continuous spatial scroll
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [currentStage, setCurrentStage] = useState(1);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);

  // Initialize Lenis + GSAP ScrollTrigger Integration
  useEffect(() => {
    let lenis: any = null;
    let tickerCallback: any = null;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      import("lenis").then(({ default: LenisModule }) => {
        lenis = new LenisModule({
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.6,
        });
        lenisRef.current = lenis;

        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });

        tickerCallback = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        // Bind continuous spatial progression to ScrollTrigger
        if (scrollTrackRef.current) {
          ScrollTrigger.create({
            trigger: scrollTrackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              setProgress(p);

              // Derive active spatial stage (1: Foyer, 2: Seating, 3: Concessions, 4: Screen 05)
              if (p < 0.24) setCurrentStage(1);
              else if (p < 0.52) setCurrentStage(2);
              else if (p < 0.80) setCurrentStage(3);
              else setCurrentStage(4);
            },
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (lenis) lenis.destroy();
    };
  }, []);

  // Track mouse coordinates for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 24fps camera timecode generator
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const f = frame % 24;
      const totalSec = Math.floor(frame / 24);
      const s = totalSec % 60;
      const m = Math.floor(totalSec / 60) % 60;
      const h = Math.floor(totalSec / 3600);
      setTimecode(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`
      );
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Synchronized scroll fallback listener to ensure 100% sync
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTrackRef.current) return;
      const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const p = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setProgress(p);
      if (p < 0.24) setCurrentStage(1);
      else if (p < 0.52) setCurrentStage(2);
      else if (p < 0.80) setCurrentStage(3);
      else setCurrentStage(4);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jump smoothly to any room waypoint
  const jumpToStage = useCallback((stageIndex: number) => {
    if (!scrollTrackRef.current) return;
    const trackHeight = scrollTrackRef.current.offsetHeight - window.innerHeight;
    const targetPercentages = [0.0, 0.38, 0.66, 0.96];
    const targetScrollY = Math.max(0, trackHeight * targetPercentages[stageIndex]);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScrollY, {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  }, []);

  // Support direct stage deep-linking via ?stage=1|2|3|4
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const stageParam = params.get("stage");
    if (stageParam) {
      const stageIdx = parseInt(stageParam, 10) - 1;
      if (stageIdx >= 0 && stageIdx <= 3) {
        const timer = setTimeout(() => {
          jumpToStage(stageIdx);
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [jumpToStage]);

  const handleLaunchCinemaWithFilm = (filmUrl?: string) => {
    if (filmUrl) {
      setInitialFilmUrl(filmUrl);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("film", filmUrl);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // fallback
      }
    }
    setShowCinema(true);
  };

  // If cinema experience is active, display the 3D theatre application
  if (showCinema) {
    return (
      <div className="fullscreen-theatre-mount">
        <CinemaExperience />
        <button
          type="button"
          className="exit-theatre-pill"
          onClick={() => setShowCinema(false)}
          title="Return to Nocturne Hall"
        >
          <span>Exit to Foyer</span>
        </button>
      </div>
    );
  }

  // Calculate opacity & transform for each stage overlay based on continuous scroll progress
  // Stage 1: Foyer & Grand Entrance (0.00 -> 0.22)
  const s1Opacity = getStageOpacity(progress, 0.0, 0.0, 0.16, 0.23);
  const s1Transform = `translate3d(0, ${-progress * 120}px, 0)`;

  // Stage 2: Seating Area & Architecture (0.24 -> 0.48)
  const s2Opacity = getStageOpacity(progress, 0.24, 0.30, 0.44, 0.48);
  const s2Transform = `translate3d(0, ${(1 - s2Opacity) * 35}px, 0)`;

  // Stage 3: Midnight Concessions & High Porch (0.56 -> 0.72)
  const s3Opacity = getStageOpacity(progress, 0.56, 0.62, 0.70, 0.725);
  const s3Transform = `translate3d(0, ${(1 - s3Opacity) * 35}px, 0)`;

  // Stage 4: Screen 05 Premiere Chamber (0.88 -> 1.00)
  const s4Opacity = getStageOpacity(progress, 0.88, 0.94, 1.00, 1.00);
  const s4Transform = `translate3d(0, ${(1 - s4Opacity) * 35}px, 0)`;

  return (
    <div className="spatial-cinema-universe">
      <CinematicCursor />

      {/* Persistent Cinematic Header */}
      <header className="cinematic-header">
        <div className="header-inner">
          <a href="#" className="brand-lockup" aria-label="Nocturne Cinema Home">
            <NocturneLogo size={38} className="brand-emblem-svg" />
            <div className="brand-meta">
              <strong className="brand-title">NOCTURNE</strong>
              <span className="brand-subtitle">PRIVATE AUDITORIUM</span>
            </div>
          </a>

          <div className="header-actions">
            <AudioController />

            <a
              href="/login"
              className="btn-header-cta flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#cfc4b3] hover:text-[#f1e9db] hover:bg-[#c9a86a]/10 transition-all"
              data-cursor="LOGIN"
            >
              <span>Sign In</span>
            </a>

            <a
              href="/dashboard"
              className="btn-header-cta flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181614]/80 border border-[#c9a86a]/30 text-[#e3c995] hover:text-[#f1e9db] hover:border-[#c9a86a]/60 hover:bg-[#231f1a] shadow-[0_0_15px_rgba(201,168,106,0.18)] transition-all text-xs"
              data-cursor="DASHBOARD"
            >
              <SparklesIcon className="h-3.5 w-3.5 text-[#c9a86a]" />
              <span>3D Dashboard</span>
            </a>

            <MagneticButton
              className="btn-header-cta"
              onClick={() => handleLaunchCinemaWithFilm(activePreset.url)}
              data-cursor="ENTER"
            >
              <span>Enter The Room</span>
              <ArrowRightIcon className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* Continuous Spatial Scroll Track */}
      <div ref={scrollTrackRef} className="spatial-scroll-track">
        {/* Sticky 100vh Spatial Viewport */}
        <div className="spatial-sticky-viewport">
          {/* Continuous Multi-Room 3D Universe Canvas */}
          <div className="spatial-3d-scene-layer" aria-hidden="true">
            <Canvas
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
              camera={{ position: [0, 1.7, 19.0], fov: 50, near: 0.1, far: 110 }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.15;
              }}
            >
              <CinematicJourneyCanvas
                progress={progress}
                mousePos={mousePos}
                activeFilmTitle={activePreset.title}
                themeColor={activePreset.color}
              />
            </Canvas>
            <div className="spatial-radial-vignette" />
            <div className="spatial-anamorphic-grain" />
          </div>

          {/* ============================================================ */}
          {/* STAGE 1: FOYER & GRAND ENTRANCE (p: 0.00 -> 0.22)             */}
          {/* ============================================================ */}
          <div
            className="spatial-overlay-layer stage-1-layer"
            style={{
              opacity: s1Opacity,
              transform: s1Transform,
              pointerEvents: s1Opacity > 0.2 ? "auto" : "none",
              display: s1Opacity <= 0 ? "none" : "flex",
            }}
          >
            <div className="hero-editorial-column">
              <h1 className="hero-headline animated-kinetic-title">
                <span className="line-reveal">Paste a film.</span>
                <span className="line-reveal"><em>Walk into</em> the screening room.</span>
                <span className="line-reveal">Watch <em>together</em>.</span>
              </h1>

              <div className="hero-cta-button-row">
                <MagneticButton
                  className="btn-primary-cinematic"
                  onClick={() => handleLaunchCinemaWithFilm(activePreset.url)}
                  data-cursor="ENTER"
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span>Enter The Theatre</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </MagneticButton>

                <a
                  href="/dashboard"
                  className="btn-ghost-cinematic flex items-center gap-2"
                  data-cursor="DASHBOARD"
                >
                  <SparklesIcon className="h-4 w-4 text-[#c9a86a]" />
                  <span>3D Avatar Dashboard</span>
                </a>

                <MagneticButton
                  className="btn-ghost-cinematic"
                  onClick={() => jumpToStage(1)}
                  data-cursor="EXPLORE"
                >
                  <span>Explore The Salon</span>
                </MagneticButton>
              </div>
            </div>

            <div
              className="hero-scroll-cue"
              onClick={() => jumpToStage(1)}
              role="button"
              tabIndex={0}
              data-cursor="DESCEND"
            >
              <span className="cue-label">SCROLL TO ENTER THE ORCHESTRA SEATING</span>
              <ChevronDownIcon className="h-4 w-4 cue-chevron" />
            </div>
          </div>

          {/* ============================================================ */}
          {/* STAGE 2: SEATING AREA & ARCHITECTURE (p: 0.23 -> 0.48)        */}
          {/* ============================================================ */}
          <div
            className="spatial-overlay-layer stage-2-layer"
            style={{
              opacity: s2Opacity,
              transform: s2Transform,
              pointerEvents: s2Opacity > 0.2 ? "auto" : "none",
              display: s2Opacity <= 0 ? "none" : "flex",
            }}
          >
            <SeatingArchitectureOverlay />
          </div>

          {/* ============================================================ */}
          {/* STAGE 3: MIDNIGHT CONCESSIONS & FEATURES (p: 0.48 -> 0.74)    */}
          {/* ============================================================ */}
          <div
            className="spatial-overlay-layer stage-3-layer"
            style={{
              opacity: s3Opacity,
              transform: s3Transform,
              pointerEvents: s3Opacity > 0.2 ? "auto" : "none",
              display: s3Opacity <= 0 ? "none" : "flex",
            }}
          >
            <ConcessionsFeaturesOverlay />
          </div>

          {/* ============================================================ */}
          {/* STAGE 4: SCREEN 05 PREMIERE & HIGHLIGHTS (p: 0.72 -> 1.00)   */}
          {/* ============================================================ */}
          <div
            className="spatial-overlay-layer stage-4-layer"
            style={{
              opacity: s4Opacity,
              transform: s4Transform,
              pointerEvents: s4Opacity > 0.2 ? "auto" : "none",
              display: s4Opacity <= 0 ? "none" : "flex",
            }}
          >
            <Screen05PremiereOverlay
              onLaunchCinema={(url) => handleLaunchCinemaWithFilm(url || activePreset.url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
