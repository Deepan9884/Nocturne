"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import type { Movie } from "@/lib/movie";

export type ScenePhase = "lobby" | "preparing" | "entering" | "seated";

type TheatreCanvasProps = {
  isPlaying: boolean;
  movie: Movie | null;
  onArrived: () => void;
  phase: ScenePhase;
};

const SCREEN_WIDTH = 14.4;
const SCREEN_HEIGHT = 8.1;
const SEAT_EYE = new THREE.Vector3(1.4, 1.37, 4.52);
const SCREEN_LOOK = new THREE.Vector3(0, 4.72, -12.5);

function makeCanvasTexture(
  width: number,
  height: number,
  paint: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) paint(context, canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function drawGrain(context: CanvasRenderingContext2D, width: number, height: number, amount = 900) {
  context.save();
  context.globalAlpha = 0.12;
  for (let index = 0; index < amount; index += 1) {
    const lightness = 160 + Math.round(Math.random() * 80);
    context.fillStyle = `rgb(${lightness}, ${lightness - 15}, ${lightness - 40})`;
    context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
  }
  context.restore();
}

function wrapTitle(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function makeBannerTexture(movie: Movie | null) {
  return makeCanvasTexture(1920, 1080, (context, canvas) => {
    const { width, height } = canvas;
    const base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#090b10");
    base.addColorStop(0.5, "#14110d");
    base.addColorStop(1, "#050607");
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(width * 0.5, height * 0.42, 20, width * 0.5, height * 0.42, width * 0.55);
    glow.addColorStop(0, "rgba(214, 169, 95, .26)");
    glow.addColorStop(0.45, "rgba(88, 74, 55, .12)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(231, 205, 158, .22)";
    context.lineWidth = 2;
    context.strokeRect(64, 64, width - 128, height - 128);

    context.textAlign = "center";
    context.fillStyle = "#c9a96d";
    context.font = "500 23px Arial, sans-serif";
    context.letterSpacing = "8px";
    context.fillText("NOCTURNE  /  PRIVATE CINEMA", width / 2, 160);

    context.fillStyle = "rgba(239, 230, 214, .86)";
    context.font = "italic 400 164px Georgia, 'Times New Roman', serif";
    const title = movie?.title && movie.title !== "Feature presentation" ? movie.title : "Your feature presentation";
    const lines = wrapTitle(context, title, width - 420);
    lines.forEach((line, index) => {
      context.fillText(line, width / 2, height * 0.46 + index * 150);
    });

    context.fillStyle = "rgba(201, 169, 109, .72)";
    context.font = "500 19px Arial, sans-serif";
    context.letterSpacing = "5px";
    context.fillText(movie ? "THE SCREEN IS YOURS" : "SCREEN 04  /  AWAITING A FILM", width / 2, height * 0.74);

    context.fillStyle = "rgba(239, 230, 214, .5)";
    context.font = "400 16px Arial, sans-serif";
    context.letterSpacing = "3px";
    context.fillText(movie?.providerLabel?.toUpperCase() ?? "PASTE A LINK TO BEGIN", width / 2, height * 0.79);

    const vignette = context.createRadialGradient(width / 2, height / 2, height * 0.25, width / 2, height / 2, width * 0.72);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, .7)");
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);

    drawGrain(context, width, height, 1400);
  });
}

function makePosterArt(title: string, kicker: string, palette: [string, string, string], mode: number) {
  return makeCanvasTexture(900, 1280, (context, canvas) => {
    const { width, height } = canvas;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(0.55, palette[1]);
    gradient.addColorStop(1, palette[2]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(width * 0.5, height * 0.35, 10, width * 0.5, height * 0.35, width * 0.7);
    glow.addColorStop(0, "rgba(255, 222, 170, .34)");
    glow.addColorStop(0.55, "rgba(255, 198, 120, .05)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    if (mode === 0) {
      context.fillStyle = "rgba(7, 8, 11, .82)";
      context.beginPath();
      context.moveTo(0, height * 0.68);
      context.lineTo(width * 0.32, height * 0.5);
      context.lineTo(width * 0.58, height * 0.7);
      context.lineTo(width, height * 0.46);
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
      context.strokeStyle = "rgba(230, 195, 134, .5)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(width * 0.72, height * 0.24, 108, 0, Math.PI * 2);
      context.stroke();
    } else if (mode === 1) {
      context.fillStyle = "rgba(4, 8, 14, .74)";
      context.fillRect(0, height * 0.52, width, height * 0.48);
      context.strokeStyle = "rgba(173, 199, 220, .36)";
      context.lineWidth = 1.4;
      for (let index = 0; index < 9; index += 1) {
        context.beginPath();
        context.ellipse(width * 0.5, height * 0.42, 90 + index * 70, 260 + index * 30, 0, 0, Math.PI * 2);
        context.stroke();
      }
      context.fillStyle = "rgba(231, 237, 243, .78)";
      context.beginPath();
      context.arc(width * 0.5, height * 0.42, 8, 0, Math.PI * 2);
      context.fill();
    } else {
      context.fillStyle = "rgba(12, 4, 7, .82)";
      context.beginPath();
      context.moveTo(0, height * 0.6);
      context.bezierCurveTo(width * 0.3, height * 0.46, width * 0.62, height * 0.83, width, height * 0.52);
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
      context.strokeStyle = "rgba(232, 196, 141, .45)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, height * 0.6);
      context.bezierCurveTo(width * 0.3, height * 0.46, width * 0.62, height * 0.83, width, height * 0.52);
      context.stroke();
    }

    context.strokeStyle = "rgba(239, 226, 203, .27)";
    context.lineWidth = 2;
    context.strokeRect(42, 42, width - 84, height - 84);

    context.textAlign = "center";
    context.fillStyle = "rgba(242, 226, 198, .66)";
    context.font = "500 15px Arial, sans-serif";
    context.letterSpacing = "7px";
    context.fillText(kicker, width / 2, 118);

    context.fillStyle = "rgba(247, 237, 220, .92)";
    context.font = "italic 400 78px Georgia, 'Times New Roman', serif";
    const lines = wrapTitle(context, title, width - 180);
    lines.forEach((line, index) => {
      context.fillText(line, width / 2, height * 0.81 + index * 72);
    });

    context.fillStyle = "rgba(230, 202, 150, .68)";
    context.font = "500 13px Arial, sans-serif";
    context.letterSpacing = "5px";
    context.fillText("A NOCTURNE SCREENING", width / 2, height * 0.94);

    drawGrain(context, width, height, 800);
  });
}

function makeSignTexture() {
  return makeCanvasTexture(1024, 320, (context, canvas) => {
    const { width, height } = canvas;
    context.fillStyle = "#0b0a09";
    context.fillRect(0, 0, width, height);
    const glow = context.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2);
    glow.addColorStop(0, "rgba(205, 165, 96, .18)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(207, 173, 111, .52)";
    context.lineWidth = 2;
    context.strokeRect(24, 24, width - 48, height - 48);
    context.textAlign = "center";
    context.fillStyle = "#d5b77d";
    context.font = "500 76px Georgia, 'Times New Roman', serif";
    context.letterSpacing = "11px";
    context.fillText("SCREEN 04", width / 2, 156);
    context.fillStyle = "rgba(237, 224, 201, .56)";
    context.font = "500 18px Arial, sans-serif";
    context.letterSpacing = "7px";
    context.fillText("PRIVATE SCREENING", width / 2, 210);
  });
}

function coverTexture(texture: THREE.Texture) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image?.height) return texture;
  const screenAspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  const imageAspect = image.width / image.height;

  if (imageAspect > screenAspect) {
    const repeat = screenAspect / imageAspect;
    texture.repeat.set(repeat, 1);
    texture.offset.set((1 - repeat) / 2, 0);
  } else {
    const repeat = imageAspect / screenAspect;
    texture.repeat.set(1, repeat);
    texture.offset.set(0, (1 - repeat) / 2);
  }

  texture.needsUpdate = true;
  return texture;
}

function usePosterTexture(movie: Movie | null) {
  const fallback = useMemo(() => makeBannerTexture(movie), [movie?.id, movie?.title, movie?.providerLabel]);
  const [texture, setTexture] = useState<THREE.Texture>(fallback);

  useEffect(() => {
    let active = true;
    setTexture(fallback);

    const urls = movie?.posterCandidates ?? [];
    if (!urls.length) return () => undefined;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let index = 0;

    const attempt = () => {
      if (!active || index >= urls.length) return;
      const url = urls[index];
      index += 1;
      loader.load(
        url,
        (loaded) => {
          if (!active) {
            loaded.dispose();
            return;
          }
          loaded.colorSpace = THREE.SRGBColorSpace;
          loaded.anisotropy = 8;
          loaded.minFilter = THREE.LinearMipmapLinearFilter;
          loaded.generateMipmaps = true;
          setTexture(coverTexture(loaded));
        },
        undefined,
        attempt,
      );
    };

    attempt();

    return () => {
      active = false;
    };
  }, [fallback, movie?.id]);

  useEffect(() => {
    return () => fallback.dispose();
  }, [fallback]);

  return texture;
}

function useCompactQuality() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}

function usePageVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

function CameraRig({ onArrived, phase }: { onArrived: () => void; phase: ScenePhase }) {
  const progress = useRef(0);
  const arrived = useRef(false);
  const smoothPointer = useRef(new THREE.Vector2());
  const onArrivedRef = useRef(onArrived);
  onArrivedRef.current = onArrived;

  const positionCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 1.7, 19.25),
          new THREE.Vector3(0, 1.68, 16.1),
          new THREE.Vector3(0, 1.63, 13.15),
          new THREE.Vector3(0.08, 1.58, 10.55),
          new THREE.Vector3(0.36, 1.51, 8.3),
          new THREE.Vector3(0.87, 1.44, 6.2),
          SEAT_EYE.clone(),
        ],
        false,
        "catmullrom",
        0.35,
      ),
    [],
  );

  const lookCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 2.75, 11.6),
          new THREE.Vector3(0, 3.15, 10.1),
          new THREE.Vector3(0, 3.8, 3.3),
          new THREE.Vector3(0, 4.45, -6.2),
          SCREEN_LOOK.clone(),
        ],
        false,
        "catmullrom",
        0.35,
      ),
    [],
  );

  useEffect(() => {
    if (phase === "preparing") {
      progress.current = 0;
      arrived.current = false;
    }
    if (phase === "seated") {
      progress.current = 1;
      arrived.current = true;
    }
  }, [phase]);

  useFrame((state, delta) => {
    const camera = state.camera;
    const time = state.clock.elapsedTime;
    const pointerX = THREE.MathUtils.damp(smoothPointer.current.x, state.pointer.x, 3.2, delta);
    const pointerY = THREE.MathUtils.damp(smoothPointer.current.y, state.pointer.y, 3.2, delta);
    smoothPointer.current.set(pointerX, pointerY);

    if (phase === "entering") {
      progress.current = Math.min(1, progress.current + delta / 7.2);
      const t = progress.current;
      const eased = t * t * t * (t * (t * 6 - 15) + 10);
      const position = positionCurve.getPointAt(eased);
      const target = lookCurve.getPointAt(eased);
      const walking = Math.sin(eased * Math.PI * 13) * 0.018 * (1 - eased);
      camera.position.copy(position);
      camera.position.y += walking;
      camera.lookAt(target);
      camera.updateProjectionMatrix();

      if (t >= 1 && !arrived.current) {
        arrived.current = true;
        onArrivedRef.current();
      }
      return;
    }

    if (phase === "seated") {
      const breath = Math.sin(time * 0.72) * 0.007;
      camera.position.lerp(
        new THREE.Vector3(SEAT_EYE.x + pointerX * 0.03, SEAT_EYE.y + breath, SEAT_EYE.z + Math.abs(pointerY) * 0.012),
        1 - Math.exp(-5 * delta),
      );
      const target = SCREEN_LOOK.clone();
      target.x += pointerX * 1.7;
      target.y += pointerY * 1.15 + Math.sin(time * 0.42) * 0.025;
      camera.lookAt(target);
      return;
    }

    const z = 19.25;
    const desired = new THREE.Vector3(pointerX * 0.12, 1.7 + pointerY * 0.035 + Math.sin(time * 0.36) * 0.012, z);
    camera.position.lerp(desired, 1 - Math.exp(-2.3 * delta));
    const target = new THREE.Vector3(pointerX * 1.45, 2.78 + pointerY * 0.42, 11.5);
    camera.lookAt(target);
  });

  return null;
}

function Sconce({ side, z }: { side: -1 | 1; z: number }) {
  const x = side * 11.72;
  return (
    <group position={[x, 3.15, z]} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.34, 0.72, 0.06]} />
        <meshStandardMaterial color="#9b7a42" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.05, 0.055]}>
        <boxGeometry args={[0.21, 0.5, 0.04]} />
        <meshBasicMaterial color="#f4d39a" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Pendant({ x }: { x: number }) {
  return (
    <group position={[x, 8.35, 17.5]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.1, 6]} />
        <meshStandardMaterial color="#8e6d3b" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <sphereGeometry args={[0.16, 18, 12]} />
        <meshBasicMaterial color="#f3d29a" toneMapped={false} />
      </mesh>
    </group>
  );
}

function DoorPanel({ open, side }: { open: boolean; side: -1 | 1 }) {
  const group = useRef<THREE.Group>(null);
  const closed = side === -1 ? 1.12 : -1.12;
  const opened = side === -1 ? 1.38 : -1.38;

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      open ? opened : closed,
      2.4,
      delta,
    );
  });

  return (
    <group position={[side * 2.58, 0, 12.31]} rotation={[0, closed, 0]} ref={group}>
      <mesh position={[side * -1.27, 2.5, 0]}>
        <boxGeometry args={[2.48, 4.96, 0.14]} />
        <meshStandardMaterial color="#17110f" roughness={0.5} metalness={0.18} />
      </mesh>
      <mesh position={[side * -1.27, 2.5, 0.08]}>
        <boxGeometry args={[2.1, 4.5, 0.025]} />
        <meshStandardMaterial color="#201713" roughness={0.62} metalness={0.08} />
      </mesh>
      <mesh position={[side * -2.38, 2.2, 0.12]}>
        <boxGeometry args={[0.045, 0.62, 0.045]} />
        <meshStandardMaterial color="#c6a267" metalness={0.92} roughness={0.22} />
      </mesh>
      <mesh position={[side * -1.27, 4.62, 0.09]}>
        <boxGeometry args={[2.12, 0.025, 0.03]} />
        <meshStandardMaterial color="#8b6a36" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[side * -1.27, 0.55, 0.09]}>
        <boxGeometry args={[2.12, 0.025, 0.03]} />
        <meshStandardMaterial color="#8b6a36" metalness={0.85} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Lobby({
  open,
  movie,
  phase,
}: {
  open: boolean;
  movie: Movie | null;
  phase: ScenePhase;
}) {
  const signTexture = useMemo(() => makeSignTexture(), []);
  const art = useMemo(
    () => [
      makePosterArt("The Long Night", "NOCTURNE ORIGINAL", ["#17120e", "#3a2515", "#08090b"], 0),
      makePosterArt("Afterglow", "A FILM IN THREE ACTS", ["#0a121b", "#1d3140", "#05080b"], 1),
      makePosterArt("Silent Orbit", "SCREEN 04  /  MIDNIGHT", ["#170b10", "#43222b", "#070809"], 2),
    ],
    [],
  );

  useEffect(() => {
    return () => {
      signTexture.dispose();
      art.forEach((texture) => texture.dispose());
    };
  }, [art, signTexture]);

  return (
    <group>
      <mesh position={[-7.35, 5.2, 12.54]}>
        <boxGeometry args={[9.3, 10.4, 0.32]} />
        <meshStandardMaterial color="#111114" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[7.35, 5.2, 12.54]}>
        <boxGeometry args={[9.3, 10.4, 0.32]} />
        <meshStandardMaterial color="#111114" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0, 8.05, 12.54]}>
        <boxGeometry args={[5.25, 4.7, 0.32]} />
        <meshStandardMaterial color="#111114" roughness={0.82} metalness={0.08} />
      </mesh>

      <mesh position={[-2.72, 2.6, 12.48]}>
        <boxGeometry args={[0.24, 5.2, 0.38]} />
        <meshStandardMaterial color="#7e6134" metalness={0.82} roughness={0.3} />
      </mesh>
      <mesh position={[2.72, 2.6, 12.48]}>
        <boxGeometry args={[0.24, 5.2, 0.38]} />
        <meshStandardMaterial color="#7e6134" metalness={0.82} roughness={0.3} />
      </mesh>
      <mesh position={[0, 5.3, 12.48]}>
        <boxGeometry args={[5.68, 0.24, 0.38]} />
        <meshStandardMaterial color="#7e6134" metalness={0.82} roughness={0.3} />
      </mesh>

      <mesh position={[0, 5.92, 12.33]}>
        <boxGeometry args={[4.6, 1.45, 0.08]} />
        <meshStandardMaterial color="#0a0908" roughness={0.46} metalness={0.25} />
      </mesh>
      <mesh position={[0, 5.92, 12.27]}>
        <planeGeometry args={[4.16, 1.3]} />
        <meshBasicMaterial map={signTexture} toneMapped={false} />
      </mesh>

      <DoorPanel open={open} side={-1} />
      <DoorPanel open={open} side={1} />

      {[-1, 1].map((side, index) => {
        const x = side * 5.15;
        return (
          <group key={side} position={[x, 2.7, 12.29]}>
            <mesh>
              <boxGeometry args={[2.35, 3.35, 0.16]} />
              <meshStandardMaterial color="#8d6b37" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[2.08, 3.08]} />
              <meshStandardMaterial map={art[phase === "lobby" ? index + 1 : index]} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh position={[0, 1.84, 0.28]}>
              <boxGeometry args={[1.4, 0.045, 0.15]} />
              <meshBasicMaterial color="#f0cd92" toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      <pointLight position={[0, 3.3, 14.4]} intensity={10} distance={11} decay={2} color="#e7bc7d" />
      <pointLight position={[0, 6.7, 17.4]} intensity={12} distance={12} decay={2} color="#eccb95" />

      <mesh position={[0, 0.014, 17.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 11.2]} />
        <meshStandardMaterial color="#240d10" roughness={0.97} metalness={0.02} />
      </mesh>
      <mesh position={[-1.72, 0.019, 17.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.025, 11.2]} />
        <meshBasicMaterial color="#a37d42" toneMapped={false} />
      </mesh>
      <mesh position={[1.72, 0.019, 17.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.025, 11.2]} />
        <meshBasicMaterial color="#a37d42" toneMapped={false} />
      </mesh>

      <Pendant x={-4.1} />
      <Pendant x={4.1} />
      <Sconce side={-1} z={16.7} />
      <Sconce side={1} z={16.7} />

      <mesh position={[0, 2.9, 12.17]}>
        <planeGeometry args={[5.3, 5.1]} />
        <meshBasicMaterial color="#f0ce98" transparent opacity={0.028} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {movie ? null : (
        <pointLight position={[0, 2.1, 12.9]} intensity={3.4} distance={5} decay={2} color="#d9b57a" />
      )}
    </group>
  );
}

function Architecture() {
  const slats = useMemo(() => {
    const positions: { x: number; z: number }[] = [];
    for (let z = -10.5; z < 21.5; z += 2.55) {
      positions.push({ x: -11.86, z });
      positions.push({ x: 11.86, z });
    }
    return positions;
  }, []);

  const slatRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!slatRef.current) return;
    const matrix = new THREE.Matrix4();
    slats.forEach((slat, index) => {
      matrix.makeTranslation(slat.x, 5.45, slat.z);
      slatRef.current?.setMatrixAt(index, matrix);
    });
    slatRef.current.instanceMatrix.needsUpdate = true;
  }, [slats]);

  return (
    <group>
      <mesh position={[0, -0.02, 3.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 39]} />
        <meshStandardMaterial color="#07080b" roughness={0.98} metalness={0.02} />
      </mesh>

      <mesh position={[0, 10.38, 3.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 39]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.86} metalness={0.06} />
      </mesh>

      <mesh position={[-12.1, 5.2, 3.8]}>
        <boxGeometry args={[0.35, 10.4, 39]} />
        <meshStandardMaterial color="#101014" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[12.1, 5.2, 3.8]}>
        <boxGeometry args={[0.35, 10.4, 39]} />
        <meshStandardMaterial color="#101014" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0, 5.2, 23.3]}>
        <boxGeometry args={[24, 10.4, 0.35]} />
        <meshStandardMaterial color="#0d0d11" roughness={0.88} metalness={0.05} />
      </mesh>

      <instancedMesh ref={slatRef} args={[undefined, undefined, slats.length]}>
        <boxGeometry args={[0.08, 7.4, 0.22]} />
        <meshStandardMaterial color="#1a191d" roughness={0.66} metalness={0.16} />
      </instancedMesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 11.9, 1.03, 3.8]}>
            <boxGeometry args={[0.08, 0.045, 38.4]} />
            <meshStandardMaterial color="#8b6a38" metalness={0.86} roughness={0.28} />
          </mesh>
          <mesh position={[side * 11.9, 6.48, 3.8]}>
            <boxGeometry args={[0.08, 0.035, 38.4]} />
            <meshStandardMaterial color="#604b2c" metalness={0.8} roughness={0.34} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.012, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.05, 29]} />
        <meshStandardMaterial color="#11080b" roughness={0.99} metalness={0.01} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 4.95, 10.26, 3.5]}>
          <boxGeometry args={[0.1, 0.035, 30]} />
          <meshBasicMaterial color="#d4b476" toneMapped={false} />
        </mesh>
      ))}

      {[-7.2, -1.2, 4.8, 10.8, 16.8].map((z) => (
        <group key={z}>
          <mesh position={[0, 10.31, z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#e7c88d" toneMapped={false} />
          </mesh>
        </group>
      ))}

      <Sconce side={-1} z={4.8} />
      <Sconce side={1} z={4.8} />
      <Sconce side={-1} z={-5.4} />
      <Sconce side={1} z={-5.4} />
    </group>
  );
}

const SEAT_POSITIONS = (() => {
  const rows = [7.65, 5.0, 2.35, -0.3];
  const columns = [-6.0, -4.85, -3.7, -2.55, -1.4, 1.4, 2.55, 3.7, 4.85, 6.0];
  return rows.flatMap((z, row) => columns.map((x, column) => ({ column, row, x, z })));
})();

function Seats() {
  const baseRef = useRef<THREE.InstancedMesh>(null);
  const backRef = useRef<THREE.InstancedMesh>(null);
  const armRef = useRef<THREE.InstancedMesh>(null);
  const baseGeometry = useMemo(() => new RoundedBoxGeometry(0.98, 0.18, 0.9, 2, 0.06), []);
  const backGeometry = useMemo(() => new RoundedBoxGeometry(0.98, 0.68, 0.19, 2, 0.06), []);
  const armGeometry = useMemo(() => new RoundedBoxGeometry(0.1, 0.28, 0.73, 2, 0.035), []);
  const count = SEAT_POSITIONS.length;

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    const backQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.09, 0, 0));

    SEAT_POSITIONS.forEach((seat, index) => {
      matrix.compose(new THREE.Vector3(seat.x, 0.56, seat.z - 0.03), quaternion, scale);
      baseRef.current?.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(seat.x, 0.86, seat.z + 0.33), backQuaternion, scale);
      backRef.current?.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(seat.x - 0.56, 0.68, seat.z + 0.04), quaternion, scale);
      armRef.current?.setMatrixAt(index * 2, matrix);
      matrix.compose(new THREE.Vector3(seat.x + 0.56, 0.68, seat.z + 0.04), quaternion, scale);
      armRef.current?.setMatrixAt(index * 2 + 1, matrix);
    });

    [baseRef, backRef, armRef].forEach((ref) => {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    });
  }, []);

  return (
    <group>
      <instancedMesh ref={baseRef} args={[undefined, undefined, count]}>
        <primitive object={baseGeometry} attach="geometry" />
        <meshStandardMaterial color="#251116" roughness={0.78} metalness={0.04} />
      </instancedMesh>
      <instancedMesh ref={backRef} args={[undefined, undefined, count]}>
        <primitive object={backGeometry} attach="geometry" />
        <meshStandardMaterial color="#2d151a" roughness={0.74} metalness={0.04} />
      </instancedMesh>
      <instancedMesh ref={armRef} args={[undefined, undefined, count * 2]}>
        <primitive object={armGeometry} attach="geometry" />
        <meshStandardMaterial color="#180c0f" roughness={0.82} metalness={0.03} />
      </instancedMesh>

      {SEAT_POSITIONS.filter((seat) => seat.column === 0 || seat.column === 5).map((seat) => (
        <group key={`${seat.row}-${seat.column}`}>
          <mesh position={[seat.x - 0.73, 0.09, seat.z + 0.03]}>
            <boxGeometry args={[0.05, 0.018, 0.42]} />
            <meshBasicMaterial color="#d5b778" toneMapped={false} />
          </mesh>
          <mesh position={[seat.x + 0.73, 0.09, seat.z + 0.03]}>
            <boxGeometry args={[0.05, 0.018, 0.42]} />
            <meshBasicMaterial color="#d5b778" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Curtain({ side }: { side: -1 | 1 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.55, 9.15, 34, 1);
    const positions = geo.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const ripple = Math.sin((x / 2.55) * Math.PI * 7.5) * 0.18 + Math.sin(x * 2.7) * 0.04;
      positions.setZ(index, ripple);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={[side * 8.2, -0.1, 0.36]}>
      <meshStandardMaterial color="#310c12" roughness={0.98} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Screen({ movie }: { movie: Movie | null }) {
  const texture = usePosterTexture(movie);

  return (
    <group position={[0, 4.72, -12.52]}>
      <mesh position={[0, 0, -0.16]}>
        <boxGeometry args={[16.1, 8.9, 0.22]} />
        <meshStandardMaterial color="#060608" roughness={0.5} metalness={0.25} />
      </mesh>

      <mesh>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, SCREEN_HEIGHT / 2 + 0.08, 0.04]}>
        <boxGeometry args={[SCREEN_WIDTH + 0.22, 0.11, 0.16]} />
        <meshStandardMaterial color="#8f6b35" metalness={0.93} roughness={0.22} />
      </mesh>
      <mesh position={[0, -SCREEN_HEIGHT / 2 - 0.08, 0.04]}>
        <boxGeometry args={[SCREEN_WIDTH + 0.22, 0.11, 0.16]} />
        <meshStandardMaterial color="#8f6b35" metalness={0.93} roughness={0.22} />
      </mesh>
      <mesh position={[-SCREEN_WIDTH / 2 - 0.08, 0, 0.04]}>
        <boxGeometry args={[0.11, SCREEN_HEIGHT + 0.22, 0.16]} />
        <meshStandardMaterial color="#8f6b35" metalness={0.93} roughness={0.22} />
      </mesh>
      <mesh position={[SCREEN_WIDTH / 2 + 0.08, 0, 0.04]}>
        <boxGeometry args={[0.11, SCREEN_HEIGHT + 0.22, 0.16]} />
        <meshStandardMaterial color="#8f6b35" metalness={0.93} roughness={0.22} />
      </mesh>

      <mesh position={[0, -4.55, 0.62]}>
        <boxGeometry args={[22, 0.35, 3.4]} />
        <meshStandardMaterial color="#0a090a" roughness={0.72} metalness={0.15} />
      </mesh>
      <mesh position={[0, -4.36, 2.28]}>
        <boxGeometry args={[20.4, 0.025, 0.035]} />
        <meshBasicMaterial color="#d4b678" toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0.3]}>
        <planeGeometry args={[17.6, 9.25]} />
        <meshBasicMaterial color="#f0c98e" transparent opacity={0.035} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Curtain side={-1} />
      <Curtain side={1} />

      <mesh position={[0, SCREEN_HEIGHT / 2 + 0.62, 0.24]}>
        <boxGeometry args={[18.5, 0.72, 0.45]} />
        <meshStandardMaterial color="#250a0f" roughness={0.96} metalness={0.02} />
      </mesh>

      <pointLight position={[0, -0.12, 1.12]} color="#f1d4a4" intensity={32} distance={26} decay={2} />
      <pointLight position={[0, -3.42, 1.92]} color="#d9a869" intensity={8} distance={10} decay={2} />
    </group>
  );
}

function ProjectorBeam() {
  const { position, quaternion, height } = useMemo(() => {
    const apex = new THREE.Vector3(0, 9.62, 18.2);
    const base = new THREE.Vector3(0, 4.75, -12.1);
    const midpoint = apex.clone().add(base).multiplyScalar(0.5);
    const direction = apex.clone().sub(base).normalize();
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    return { position: midpoint, quaternion: rotation, height: apex.distanceTo(base) };
  }, []);

  return (
    <mesh position={position} quaternion={quaternion} renderOrder={2}>
      <coneGeometry args={[6.35, height, 32, 1, true]} />
      <meshBasicMaterial
        color="#f3d7a1"
        transparent
        opacity={0.011}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(180 * 3);
    for (let index = 0; index < 180; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 13;
      values[index * 3 + 1] = 0.8 + Math.random() * 8.2;
      values[index * 3 + 2] = -11.5 + Math.random() * 29;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const attribute = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const values = attribute.array as Float32Array;
    for (let index = 0; index < values.length / 3; index += 1) {
      values[index * 3 + 1] += delta * 0.028;
      values[index * 3] += Math.sin(state.clock.elapsedTime * 0.12 + index) * 0.00055;
      if (values[index * 3 + 1] > 9.2) values[index * 3 + 1] = 0.8;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#f0d4a3"
        transparent
        opacity={0.42}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HouseLights({ phase, isPlaying }: { phase: ScenePhase; isPlaying: boolean }) {
  const ambient = useRef<THREE.AmbientLight>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const stageSpot = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    const seated = phase === "seated";
    const ambientTarget = isPlaying ? 0.05 : seated ? 0.11 : phase === "lobby" ? 0.25 : 0.16;
    const spotTarget = isPlaying ? 5 : seated ? 19 : 28;
    const stageTarget = isPlaying ? 8 : seated ? 26 : 42;

    if (ambient.current) ambient.current.intensity = THREE.MathUtils.damp(ambient.current.intensity, ambientTarget, 1.8, delta);
    if (spot.current) spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, spotTarget, 1.8, delta);
    if (stageSpot.current) stageSpot.current.intensity = THREE.MathUtils.damp(stageSpot.current.intensity, stageTarget, 1.8, delta);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.25} color="#b9c2d4" />
      <hemisphereLight args={["#6d7a90", "#170f0b", 0.17]} />
      <spotLight
        ref={spot}
        position={[0, 9.55, 6.3]}
        angle={0.72}
        penumbra={0.92}
        intensity={24}
        distance={24}
        decay={2}
        color="#f2c489"
      />
      <spotLight
        ref={stageSpot}
        position={[0, 9.65, -6.4]}
        angle={0.66}
        penumbra={0.88}
        intensity={36}
        distance={26}
        decay={2}
        color="#e9bd82"
      />
      <pointLight position={[0, 0.22, 9.5]} intensity={1.4} distance={7} decay={2} color="#b7864e" />
    </>
  );
}

function Scene({
  isPlaying,
  movie,
  onArrived,
  phase,
}: {
  isPlaying: boolean;
  movie: Movie | null;
  onArrived: () => void;
  phase: ScenePhase;
}) {
  const compact = useCompactQuality();

  return (
    <>
      <color attach="background" args={["#050506"]} />
      <CameraRig phase={phase} onArrived={onArrived} />
      <HouseLights phase={phase} isPlaying={isPlaying} />

      <Suspense fallback={null}>
        <Environment resolution={64}>
          <Lightformer form="rect" color="#e7c28a" intensity={1.2} scale={[8, 4]} position={[0, 6, -11]} target={[0, 4, 0]} />
          <Lightformer form="rect" color="#6e849b" intensity={0.4} scale={[9, 6]} position={[-10, 5, 8]} target={[0, 3, 0]} />
          <Lightformer form="rect" color="#b78756" intensity={0.5} scale={[9, 6]} position={[10, 5, 8]} target={[0, 3, 0]} />
          <Lightformer form="ring" color="#f1cf96" intensity={0.6} scale={3} position={[0, 8, 4]} target={[0, 2, 0]} />
        </Environment>
      </Suspense>

      <Architecture />
      <Lobby open={phase !== "lobby"} movie={movie} phase={phase} />
      <Screen movie={movie} />
      <Seats />
      <ProjectorBeam />
      {compact ? null : <Dust />}

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={compact ? 0.38 : 0.58}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.22}
          mipmapBlur
          radius={0.7}
        />
        {compact ? null : <Noise opacity={0.022} premultiply blendFunction={BlendFunction.OVERLAY} />}
        <Vignette offset={0.24} darkness={0.72} eskil={false} />
      </EffectComposer>
    </>
  );
}

export default function TheatreCanvas({ isPlaying, movie, onArrived, phase }: TheatreCanvasProps) {
  const compact = useCompactQuality();
  const visible = usePageVisibility();

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={compact ? [1, 1.15] : [1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 1.7, 19.25], fov: 52, near: 0.08, far: 80 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        fallback={<div className="scene-gl-fallback" />}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.setClearColor("#050506");
        }}
      >
        <Scene isPlaying={isPlaying} movie={movie} onArrived={onArrived} phase={phase} />
      </Canvas>
    </div>
  );
}
