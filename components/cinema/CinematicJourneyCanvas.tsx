import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CinemaSnackStand3D from "./CinemaSnackStand3D";

export interface CinematicJourneyCanvasProps {
  progress?: number;
  progressRef?: React.RefObject<number>;
  mousePos?: { x: number; y: number };
  activeFilmTitle?: string;
  themeColor?: string;
}

export interface LuxuryCinemaSeatItem {
  pos: THREE.Vector3;
  isSweetSpot: boolean;
  row: number;
  col: number;
  label: string;
}

const InstancedCinemaSeats = React.memo(function InstancedCinemaSeats({
  seats,
}: {
  seats: Array<LuxuryCinemaSeatItem>;
}) {
  const plinthRef = useRef<THREE.InstancedMesh>(null);
  const baseRef = useRef<THREE.InstancedMesh>(null);
  const cushionRef = useRef<THREE.InstancedMesh>(null);
  const backrestRef = useRef<THREE.InstancedMesh>(null);
  const headrestRef = useRef<THREE.InstancedMesh>(null);
  const armrestsRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();

    seats.forEach((seat, i) => {
      // 1. Bronze plinth
      dummy.position.set(seat.pos.x, seat.pos.y + 0.05, seat.pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      plinthRef.current?.setMatrixAt(i, dummy.matrix);

      // 2. Velvet Foundation
      dummy.position.set(seat.pos.x, seat.pos.y + 0.23, seat.pos.z + 0.02);
      dummy.updateMatrix();
      baseRef.current?.setMatrixAt(i, dummy.matrix);

      // 3. Seat Cushion
      dummy.position.set(seat.pos.x, seat.pos.y + 0.32, seat.pos.z + 0.01);
      dummy.updateMatrix();
      cushionRef.current?.setMatrixAt(i, dummy.matrix);

      // 4. Backrest
      dummy.position.set(seat.pos.x, seat.pos.y + 0.65, seat.pos.z + 0.24);
      dummy.rotation.set(-0.14, 0, 0);
      dummy.updateMatrix();
      backrestRef.current?.setMatrixAt(i, dummy.matrix);

      // 5. Headrest
      dummy.position.set(seat.pos.x, seat.pos.y + 0.98, seat.pos.z + 0.20);
      dummy.rotation.set(-0.08, 0, 0);
      dummy.updateMatrix();
      headrestRef.current?.setMatrixAt(i, dummy.matrix);

      // 6. Armrests (Left & Right)
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(seat.pos.x - 0.43, seat.pos.y + 0.38, seat.pos.z + 0.02);
      dummy.updateMatrix();
      armrestsRef.current?.setMatrixAt(i * 2, dummy.matrix);

      dummy.position.set(seat.pos.x + 0.43, seat.pos.y + 0.38, seat.pos.z + 0.02);
      dummy.updateMatrix();
      armrestsRef.current?.setMatrixAt(i * 2 + 1, dummy.matrix);
    });

    plinthRef.current && (plinthRef.current.instanceMatrix.needsUpdate = true);
    baseRef.current && (baseRef.current.instanceMatrix.needsUpdate = true);
    cushionRef.current && (cushionRef.current.instanceMatrix.needsUpdate = true);
    backrestRef.current && (backrestRef.current.instanceMatrix.needsUpdate = true);
    headrestRef.current && (headrestRef.current.instanceMatrix.needsUpdate = true);
    armrestsRef.current && (armrestsRef.current.instanceMatrix.needsUpdate = true);
  }, [seats]);

  const sweetSpot = seats.find((s) => s.isSweetSpot);

  return (
    <group>
      {/* 40 Plinths in 1 draw call */}
      <instancedMesh ref={plinthRef} args={[undefined, undefined, seats.length]}>
        <cylinderGeometry args={[0.18, 0.20, 0.10, 12]} />
        <meshStandardMaterial color="#0c0b0e" metalness={0.9} roughness={0.25} />
      </instancedMesh>

      {/* 40 Bases in 1 draw call */}
      <instancedMesh ref={baseRef} args={[undefined, undefined, seats.length]}>
        <boxGeometry args={[0.76, 0.14, 0.58]} />
        <meshStandardMaterial color="#5a101a" roughness={0.65} metalness={0.05} />
      </instancedMesh>

      {/* 40 Cushions in 1 draw call */}
      <instancedMesh ref={cushionRef} args={[undefined, undefined, seats.length]}>
        <boxGeometry args={[0.74, 0.08, 0.56]} />
        <meshStandardMaterial color="#881a29" roughness={0.5} metalness={0.05} />
      </instancedMesh>

      {/* 40 Backrests in 1 draw call */}
      <instancedMesh ref={backrestRef} args={[undefined, undefined, seats.length]}>
        <boxGeometry args={[0.72, 0.60, 0.12]} />
        <meshStandardMaterial color="#781422" roughness={0.52} metalness={0.05} />
      </instancedMesh>

      {/* 40 Headrests in 1 draw call */}
      <instancedMesh ref={headrestRef} args={[undefined, undefined, seats.length]}>
        <boxGeometry args={[0.56, 0.18, 0.14]} />
        <meshStandardMaterial color="#881a29" roughness={0.48} metalness={0.06} />
      </instancedMesh>

      {/* 80 Armrests in 1 draw call */}
      <instancedMesh ref={armrestsRef} args={[undefined, undefined, seats.length * 2]}>
        <boxGeometry args={[0.12, 0.24, 0.58]} />
        <meshStandardMaterial color="#5a101a" roughness={0.65} metalness={0.05} />
      </instancedMesh>

      {/* Sweet Spot VIP Plaque (Single badge) */}
      {sweetSpot && (
        <group position={[sweetSpot.pos.x + 0.50, sweetSpot.pos.y + 0.46, sweetSpot.pos.z + 0.10]}>
          <mesh>
            <boxGeometry args={[0.014, 0.08, 0.16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh position={[0.01, 0, 0]}>
            <boxGeometry args={[0.002, 0.025, 0.12]} />
            <meshStandardMaterial color="#ffdf9e" emissive="#ffa430" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
});

export default function CinematicJourneyCanvas({
  progress,
  progressRef,
  mousePos,
  activeFilmTitle = "NOCTURNE · SCREEN 04",
  themeColor = "#e7c28a",
}: CinematicJourneyCanvasProps) {
  const timeRef = useRef(0);
  const screen04Ref = useRef<THREE.Mesh>(null);
  const screen05Ref = useRef<THREE.Mesh>(null);
  const screenCanvas04Ref = useRef<HTMLCanvasElement | null>(null);
  const screenCanvas05Ref = useRef<HTMLCanvasElement | null>(null);
  const screenTexture04Ref = useRef<THREE.CanvasTexture | null>(null);
  const screenTexture05Ref = useRef<THREE.CanvasTexture | null>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const doorLightSpillRef = useRef<THREE.MeshBasicMaterial>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 4.72, -12.5));
  const lookTargetVec = useRef(new THREE.Vector3(0, 4.72, -12.5));
  const mouseDampedRef = useRef({ x: 0, y: 0 });
  const corridorPoster1Ref = useRef<THREE.Mesh>(null);
  const corridorPoster2Ref = useRef<THREE.Mesh>(null);
  const videoRefs = useRef<{
    v04: HTMLVideoElement | null;
    v05: HTMLVideoElement | null;
  }>({ v04: null, v05: null });

  // Generate seats in the main auditorium (Zone A) with tiered rake
  const seatsZoneA = useMemo(() => {
    const list: Array<LuxuryCinemaSeatItem> = [];
    const rowLetters = ["Row D", "Row E", "Row F", "Row G", "Row H"];
    for (let r = 0; r < 5; r++) {
      const rowY = (r + 1) * 0.14; // Tiered cinema riser (+14cm per row, resting flush on top surface)
      const z = 2.0 + r * 2.2;
      for (let c = 0; c < 8; c++) {
        const gap = c >= 4 ? 0.75 : -0.75;
        const x = (c - 3.5) * 1.05 + gap * 0.4;
        const isSweetSpot = r === 2 && c === 4; // Row F, Seat 07 (Row 2 at z = 6.4, x = 0.825)
        const seatNum = c < 4 ? c + 1 : c + 3;
        list.push({
          pos: new THREE.Vector3(x, rowY, z),
          isSweetSpot,
          row: r,
          col: c,
          label: `${rowLetters[r]} · ${seatNum < 10 ? "0" : ""}${seatNum}`,
        });
      }
    }
    return list;
  }, []);

  // Floor lights along the center aisle
  const aisleGuideLights = useMemo(() => {
    const arr = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      const z = -12 + i * 1.3;
      const side = i % 2 === 0 ? -0.8 : 0.8;
      arr[i * 3] = side;
      arr[i * 3 + 1] = 0.04;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Ambient floating particles
  const particlesData = useMemo(() => {
    const count = 300;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = 0.5 + Math.random() * 8.5;
      arr[i * 3 + 2] = -26 + Math.random() * 45;
    }
    return arr;
  }, []);

  // Load Flow-generated Photorealistic & Veo 3.1 Video Textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Dedicated high-resolution vertical cinematic marquee posters for the VIP Gallery
    loader.load("/films/poster-cosmic-voyage.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (corridorPoster1Ref.current) {
        corridorPoster1Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          toneMapped: false,
        });
      }
    });

    loader.load("/films/poster-neo-tokyo.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (corridorPoster2Ref.current) {
        corridorPoster2Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          toneMapped: false,
        });
      }
    });

    loader.load("/films/cosmic-voyage.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.repeat.set(1.0, 0.68);
      tex.offset.set(0.0, 0.16);
      if (screen04Ref.current && !screen04Ref.current.userData.hasVideo) {
        screen04Ref.current.material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      }
      if (screen05Ref.current && !screen05Ref.current.userData.hasVideo) {
        screen05Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.95,
        });
      }
    });

    // Helper to initialize and play looping muted video texture
    const setupVideo = (src: string, onReady: (vTex: THREE.VideoTexture) => void) => {
      const vid = document.createElement("video");
      vid.src = src;
      vid.crossOrigin = "anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.autoplay = true;

      const vTex = new THREE.VideoTexture(vid);
      vTex.colorSpace = THREE.SRGBColorSpace;
      vTex.minFilter = THREE.LinearFilter;
      vTex.magFilter = THREE.LinearFilter;

      vid.play().then(() => {
        onReady(vTex);
      }).catch(() => {
        const startInteraction = () => {
          vid.play().then(() => onReady(vTex)).catch(() => {});
          window.removeEventListener("scroll", startInteraction);
          window.removeEventListener("click", startInteraction);
          window.removeEventListener("touchstart", startInteraction);
        };
        window.addEventListener("scroll", startInteraction, { passive: true });
        window.addEventListener("click", startInteraction, { passive: true });
        window.addEventListener("touchstart", startInteraction, { passive: true });
      });

      return { vid, vTex };
    };

    // 2. Video 1: Screen 04 Master Trailer (/films/cosmic-voyage.mp4)
    const res04 = setupVideo("/films/cosmic-voyage.mp4", (vTex) => {
      videoRefs.current.v04 = res04.vid;
      vTex.repeat.set(1.0, 0.68);
      vTex.offset.set(0.0, 0.16);
      if (screen04Ref.current) {
        screen04Ref.current.material = new THREE.MeshBasicMaterial({ map: vTex, side: THREE.DoubleSide });
        screen04Ref.current.userData.hasVideo = true;
      }
    });

    // 3. Video 2: Screen 05 Premiere Suite Director's Master (/films/neo-tokyo-premiere.mp4)
    const res05 = setupVideo("/films/neo-tokyo-premiere.mp4", (vTex) => {
      videoRefs.current.v05 = res05.vid;
      if (screen05Ref.current) {
        screen05Ref.current.material = new THREE.MeshBasicMaterial({
          map: vTex,
          transparent: true,
          opacity: 0.98,
        });
        screen05Ref.current.userData.hasVideo = true;
      }
    });

    return () => {
      res04.vid.pause();
      res04.vTex.dispose();
      res05.vid.pause();
      res05.vTex.dispose();
    };
  }, []);

  // Paint dynamic 24fps frames on screens
  const updateScreenTextures = () => {
    const t = timeRef.current;

    // Paint Screen 04 (Main Auditorium)
    if (screenCanvas04Ref.current && screenTexture04Ref.current) {
      const c = screenCanvas04Ref.current;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, c.width, c.height);

        const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 10, c.width / 2, c.height / 2, c.width * 0.45);
        g.addColorStop(0, "rgba(231, 194, 138, 0.28)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#c9a86a";
        ctx.font = "600 16px 'Manrope', sans-serif";
        ctx.letterSpacing = "6px";
        ctx.fillText("NOCTURNE · SCREEN 04 · ARCHITECTURAL SALON", c.width / 2, 80);

        ctx.fillStyle = "rgba(241, 233, 219, 0.95)";
        ctx.font = "italic 400 48px 'Cormorant Garamond', serif";
        ctx.fillText(activeFilmTitle, c.width / 2, c.height / 2 + 10);

        ctx.fillStyle = "rgba(201, 168, 106, 0.75)";
        ctx.font = "400 14px 'Manrope', sans-serif";
        ctx.letterSpacing = "4px";
        ctx.fillText("2.39:1 CINEMASCOPE · 4K MASTER · DOLBY ATMOS", c.width / 2, c.height / 2 + 60);

        screenTexture04Ref.current.needsUpdate = true;
      }
    }

    // Paint Screen 05 (Director's VIP Suite)
    if (screenCanvas05Ref.current && screenTexture05Ref.current) {
      const c = screenCanvas05Ref.current;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, c.width, c.height);

        // Elegant 2.39:1 scope cinematic projection luminescence
        const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 20, c.width / 2, c.height / 2, c.width * 0.55);
        g.addColorStop(0, "rgba(235, 205, 155, 0.45)");
        g.addColorStop(0.35, "rgba(201, 168, 106, 0.22)");
        g.addColorStop(0.7, "rgba(130, 95, 45, 0.08)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        // Scope 2.39:1 subtle gold perimeter frame
        ctx.strokeStyle = "rgba(223, 194, 141, 0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, c.width - 60, c.height - 60);

        screenTexture05Ref.current.needsUpdate = true;
      }
    }
  };

  useFrame((state, delta) => {
    timeRef.current += delta;

    const cam = state.camera;
    const p = THREE.MathUtils.clamp(progressRef?.current !== undefined ? progressRef.current : (progress ?? 0), 0, 1);

    // Continuous 4-Stage Collision-Free Cinematic Camera Kinematics:
    // Stage 1 (0.00 - 0.25): Foyer -> Center Aisle (X: 0.0, Z: 19.0 -> 12.0)
    // Stage 2 (0.25 - 0.48): Aisle Walkdown to Row F (Z: 12.0 -> 6.45), Sidestep into Seat F-07 (X: 0.0 -> 0.825), Optical Sweet Spot
    // Stage 3 (0.48 - 0.73): Rise from seat, return to aisle, front cross-aisle, step through opening double doors to High Porch
    // Stage 4 (0.73 - 1.00): Glide down Outer VIP Gallery (X: 9.8, Z: 1.1 -> -17.5 past Screen 04), turn left into Screen 05 Suite
    let camTargetX = 0;
    let camTargetY = 1.72;
    let camTargetZ = 19.0;
    let lookTargetX = 0;
    let lookTargetY = 4.72;
    let lookTargetZ = -12.5;

    // Double door animation between auditorium and High Porch mezzanine
    // Doors begin opening at p = 0.50 and are fully swung open by p = 0.60
    const doorProgress = THREE.MathUtils.clamp((p - 0.50) / 0.10, 0, 1);
    const doorEase = doorProgress * doorProgress * (3 - 2 * doorProgress);
    const doorAngle = doorEase * (Math.PI * 0.48); // ~86 degrees outward swing

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = -doorAngle;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = doorAngle;
    }
    if (doorLightSpillRef.current) {
      doorLightSpillRef.current.opacity = doorEase * 0.32;
    }

    if (p < 0.25) {
      // -------------------------------------------------------------
      // Stage 1 (0.00 - 0.25): Foyer -> Center Aisle Approach
      // Strictly along central aisle (x = 0), looking straight at Screen 04
      // -------------------------------------------------------------
      const t = p / 0.25;
      const ease = t * t * (3 - 2 * t);
      camTargetX = 0.0;
      camTargetY = THREE.MathUtils.lerp(1.72, 1.55, ease);
      camTargetZ = THREE.MathUtils.lerp(19.0, 12.0, ease);
      lookTargetX = 0.0;
      lookTargetY = 4.72;
      lookTargetZ = -12.5;
    } else if (p < 0.48) {
      // -------------------------------------------------------------
      // Stage 2 (0.25 - 0.48): Orchestra Seating & Sweet Spot F-07
      // -------------------------------------------------------------
      if (p < 0.36) {
        // Sub-phase 2A (0.25 - 0.36): Walk down center aisle between Row 4 & Row 3
        // Camera stays strictly in center aisle (x = 0.0) avoiding all seat collision
        const t = (p - 0.25) / (0.36 - 0.25);
        const ease = t * t * (3 - 2 * t);
        camTargetX = 0.0;
        camTargetY = THREE.MathUtils.lerp(1.55, 1.30, ease);
        camTargetZ = THREE.MathUtils.lerp(12.0, 6.45, ease);
        lookTargetX = 0.0;
        lookTargetY = THREE.MathUtils.lerp(4.72, 4.60, ease);
        lookTargetZ = -12.5;
      } else if (p < 0.42) {
        // Sub-phase 2B (0.36 - 0.42): Sidestep smoothly into Seat F-07 and settle into cushion
        const t = (p - 0.36) / (0.42 - 0.36);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.0, 0.825, ease);
        camTargetY = THREE.MathUtils.lerp(1.30, 1.08, ease);
        camTargetZ = 6.45;
        lookTargetX = 0.0;
        lookTargetY = 4.60;
        lookTargetZ = -12.5;
      } else {
        // Sub-phase 2C (0.42 - 0.48): Seated in Seat F-07: The Optical Sweet Spot
        camTargetX = 0.825;
        camTargetY = 1.08;
        camTargetZ = 6.45;
        lookTargetX = 0.0;
        lookTargetY = 4.60;
        lookTargetZ = -12.5;
      }
    } else if (p < 0.73) {
      // -------------------------------------------------------------
      // Stage 3 (0.48 - 0.73): Rise from seat -> Cross-Aisle -> High Porch Veranda
      // Continuous grounded eye-level steadicam navigation
      // -------------------------------------------------------------
      if (p < 0.54) {
        // Sub-phase 3A (0.48 - 0.54): Rise from Seat F-07, step left back into center aisle
        const t = (p - 0.48) / (0.54 - 0.48);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.825, 0.0, ease);
        camTargetY = THREE.MathUtils.lerp(1.08, 1.72, ease);
        camTargetZ = THREE.MathUtils.lerp(6.45, 5.0, ease);
        // Head turns towards the right cinema exit doors
        lookTargetX = THREE.MathUtils.lerp(0.0, 4.6, ease);
        lookTargetY = THREE.MathUtils.lerp(4.60, 1.75, ease);
        lookTargetZ = THREE.MathUtils.lerp(-12.5, 2.0, ease);
      } else if (p < 0.60) {
        // Sub-phase 3B (0.54 - 0.60): Walk down aisle to front apron cross-aisle towards doorway
        // Doors smoothly swing open outward into terrace
        const t = (p - 0.54) / (0.60 - 0.54);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.0, 4.6, ease);
        camTargetY = 1.72;
        camTargetZ = THREE.MathUtils.lerp(5.0, 2.0, ease);
        lookTargetX = THREE.MathUtils.lerp(4.6, 9.5, ease);
        lookTargetY = THREE.MathUtils.lerp(1.75, 1.65, ease);
        lookTargetZ = THREE.MathUtils.lerp(2.0, 1.4, ease);
      } else if (p < 0.66) {
        // Sub-phase 3C (0.60 - 0.66): Glide through open doors across bridge onto Cinema Snack Stand plaza
        const t = (p - 0.60) / (0.66 - 0.60);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(4.6, 8.75, ease);
        camTargetY = THREE.MathUtils.lerp(1.72, 1.76, ease);
        camTargetZ = THREE.MathUtils.lerp(2.0, 1.25, ease);
        lookTargetX = THREE.MathUtils.lerp(9.5, 13.05, ease);
        lookTargetY = THREE.MathUtils.lerp(1.65, 1.54, ease);
        lookTargetZ = THREE.MathUtils.lerp(1.4, 0.06, ease);
      } else {
        // Sub-phase 3D (0.66 - 0.73): Standing before the 3D Cinema Snack Stand (Popcorn machine, lady attendant, puffs & rolls)
        camTargetX = 8.75;
        camTargetY = 1.76;
        camTargetZ = 1.25;
        lookTargetX = 13.05;
        lookTargetY = 1.54;
        lookTargetZ = 0.06;
      }
    } else {
      // -------------------------------------------------------------
      // Stage 4 (0.73 - 1.00): VIP Gallery Corridor -> Screen 05 Premiere Suite
      // -------------------------------------------------------------
      if (p < 0.84) {
        // Sub-phase 4A (0.73 - 0.84): Walk from Snack Stand down VIP corridor towards illuminated portal
        const t = (p - 0.73) / (0.84 - 0.73);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(8.75, 9.8, ease);
        camTargetY = THREE.MathUtils.lerp(1.76, 1.72, ease);
        camTargetZ = THREE.MathUtils.lerp(1.25, -17.5, ease);

        // Gaze turns smoothly from snack stand down the hall, then gracefully angles toward the glowing VIP Suite entrance
        lookTargetX = THREE.MathUtils.lerp(13.05, 0.0, ease);
        lookTargetY = THREE.MathUtils.lerp(1.54, 3.2, ease);
        lookTargetZ = THREE.MathUtils.lerp(0.06, -29.0, ease);
      } else if (p < 0.92) {
        // Sub-phase 4B (0.84 - 0.92): Step through VIP archway into the grand Director's Suite
        const t = (p - 0.84) / (0.92 - 0.84);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(9.8, 0.0, ease);
        camTargetY = THREE.MathUtils.lerp(1.72, 1.65, ease);
        camTargetZ = THREE.MathUtils.lerp(-17.5, -21.0, ease);

        // Gaze gracefully transitions up towards Screen 05 center
        lookTargetX = 0.0;
        lookTargetY = THREE.MathUtils.lerp(3.2, 4.72, ease);
        lookTargetZ = -29.0;
      } else {
        // Sub-phase 4C (0.92 - 1.00): Seated in VIP Director's Row facing Screen 05 directly
        camTargetX = 0.0;
        camTargetY = 1.65;
        camTargetZ = -21.0;
        lookTargetX = 0.0;
        lookTargetY = 4.72;
        lookTargetZ = -29.0;
      }
    }

    // Damped mouse parallax: silky-smooth steadicam sway, zero twitch or wall clipping
    const isSweetSpotOccupied = p >= 0.38 && p <= 0.48;
    const mouseScaleX = isSweetSpotOccupied ? 0.03 : 0.08;
    const mouseScaleY = isSweetSpotOccupied ? 0.02 : 0.04;
    const rawPointerX = mousePos ? mousePos.x : state.pointer.x;
    const rawPointerY = mousePos ? mousePos.y : state.pointer.y;

    // Filter and exponentially damp raw mouse coordinates
    const mouseSmooth = 1 - Math.exp(-4.0 * delta);
    mouseDampedRef.current.x = THREE.MathUtils.lerp(mouseDampedRef.current.x, rawPointerX, mouseSmooth);
    mouseDampedRef.current.y = THREE.MathUtils.lerp(mouseDampedRef.current.y, rawPointerY, mouseSmooth);

    const mouseInfluenceX = mouseDampedRef.current.x * mouseScaleX;
    const mouseInfluenceY = mouseDampedRef.current.y * mouseScaleY;

    // Zone-aware video decode management (only decodes the active screen)
    const { v04, v05 } = videoRefs.current;
    if (v04 && v05) {
      if (p < 0.48) {
        if (v04.paused) v04.play().catch(() => {});
        if (!v05.paused) v05.pause();
      } else if (p < 0.74) {
        if (!v04.paused) v04.pause();
        if (!v05.paused) v05.pause();
      } else {
        if (!v04.paused) v04.pause();
        if (v05.paused) v05.play().catch(() => {});
      }
    }

    // Fluid frame-rate-independent steadicam exponential damping
    const smoothFactor = 1 - Math.exp(-6.5 * delta);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, camTargetX + mouseInfluenceX, smoothFactor);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, camTargetY + mouseInfluenceY, smoothFactor);
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, camTargetZ, smoothFactor);

    // Damped steadicam orientation tracking (zero GC allocation, stable rotation authority)
    lookTargetVec.current.set(lookTargetX, lookTargetY, lookTargetZ);
    lookAtRef.current.lerp(lookTargetVec.current, smoothFactor);
    cam.lookAt(lookAtRef.current);

    // Dust particles drift (pure GPU transform, zero buffer re-upload)
    if (particlesRef.current) {
      particlesRef.current.rotation.y = timeRef.current * 0.015;
      particlesRef.current.position.y = Math.sin(timeRef.current * 0.25) * 0.2;
    }
  });

  return (
    <>
      <color attach="background" args={["#050506"]} />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.4} color="#f0d5b0" />

      {/* Main Screen 04 Projector Spotlight */}
      <spotLight
        position={[0, 9.5, 6]}
        target-position={[0, 4.72, -12.5]}
        intensity={3.5}
        angle={0.7}
        penumbra={0.65}
        color={themeColor}
        distance={40}
      />

      {/* Screen 04 Rim Light */}
      <pointLight position={[0, 4.72, -12]} intensity={1.8} distance={22} color="#e7c28a" />
      <pointLight position={[0, 8.5, 6.0]} intensity={4.5} distance={30} color="#ffa43b" decay={1.4} />

      {/* Art Deco Architectural Wall Sconces (Left Auditorium Wall) */}
      {[-8.0, -3.0, 2.0, 7.0, 12.0, 17.0].map((zPos, idx) => (
        <group key={`sconce-left-${idx}`} position={[-8.12, 4.2, zPos]}>
          <mesh>
            <boxGeometry args={[0.04, 0.88, 0.16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
            <meshBasicMaterial color="#ffe3b0" />
          </mesh>
          <mesh position={[0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.058, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0.05, -0.38, 0]}>
            <cylinderGeometry args={[0.045, 0.058, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          
        </group>
      ))}

      {/* Art Deco Architectural Wall Sconces (Right Auditorium Wall, skipping doorway at z = 2.0) */}
      {[-8.0, -3.0, 7.0, 12.0, 17.0].map((zPos, idx) => (
        <group key={`sconce-right-${idx}`} position={[6.08, 4.2, zPos]}>
          <mesh>
            <boxGeometry args={[0.04, 0.88, 0.16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[-0.05, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
            <meshBasicMaterial color="#ffe3b0" />
          </mesh>
          <mesh position={[-0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.058, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[-0.05, -0.38, 0]}>
            <cylinderGeometry args={[0.045, 0.058, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          
        </group>
      ))}

      {/* Curved Proscenium Stage Footlight Trough below Screen 04 */}
      <group position={[0, 0.08, 13.82]}>
        {/* Curved Proscenium Stage Apron Bullnose Lip */}
        <mesh position={[0, 0.04, 0]} scale={[-1, 1, 1]}>
          <cylinderGeometry args={[26.0, 26.0, 0.08, 48, 1, true, Math.PI - 0.28, 0.56]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.22} side={THREE.DoubleSide} />
        </mesh>
        {[-6.0, -4.0, -2.0, 0, 2.0, 4.0, 6.0].map((xPos, idx) => {
          const zCurved = -26.0 + (xPos * xPos) / 52.0;
          return (
            <group key={idx} position={[xPos, 0.09, zCurved]}>
              <mesh>
                <cylinderGeometry args={[0.11, 0.11, 0.04, 20]} />
                <meshStandardMaterial color="#1a1412" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.09, 20]} />
                <meshBasicMaterial color="#fff0d0" />
              </mesh>
              
            </group>
          );
        })}
      </group>

      {/* Auditorium Curvaceous Acoustic Barrel Vault Ceiling Structure & Brass Downlights */}
      <group position={[-1.0, -3.0, 4.0]}>
        {/* Curvaceous Plaster Vault Shell spanning the auditorium */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[11.5, 11.5, 33.0, 40, 1, true, Math.PI - 0.65, 1.30]} />
          <meshStandardMaterial color="#080709" roughness={0.90} side={THREE.DoubleSide} />
        </mesh>
        {/* Art Deco Curved Acoustic Rib Arches along the vault */}
        {[-12.0, -6.0, 0, 6.0, 12.0].map((rz, ridx) => (
          <group key={`vault-rib-${ridx}`} position={[0, 0, rz]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[11.38, 11.38, 0.32, 40, 1, true, Math.PI - 0.65, 1.30]} />
              <meshStandardMaterial color="#140f10" roughness={0.75} side={THREE.DoubleSide} />
            </mesh>
            {/* Center Keystone Luminaire on Vault Spine */}
            <group position={[0, 11.42, 0]}>
              <mesh>
                <cylinderGeometry args={[0.14, 0.16, 0.06, 20]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, -0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.11, 20]} />
                <meshBasicMaterial color="#ffe2b0" />
              </mesh>
              
            </group>
          </group>
        ))}
        {/* Warm Golden Cove Lights along Springlines washing up into the Barrel Vault */}
        {[-8.0, 0, 8.0].map((cz, ci) => (
          <group key={`cove-${ci}`}>
            <pointLight position={[-6.8, 9.2, cz]} intensity={2.8} distance={7} color="#ffa43b" decay={1.6} />
            <pointLight position={[6.8, 9.2, cz]} intensity={2.8} distance={7} color="#ffa43b" decay={1.6} />
          </group>
        ))}
      </group>

      {/* Fluted Semicircular Acoustic Wall Pilasters (Left Wall at x = -8.08) */}
      {[-5.5, -0.5, 4.5, 9.5, 14.5].map((zPos, idx) => (
        <mesh key={`pilaster-left-${idx}`} position={[-8.08, 4.0, zPos]}>
          <cylinderGeometry args={[0.20, 0.20, 8.0, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#180c10" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Fluted Semicircular Acoustic Wall Pilasters (Right Wall at x = 6.06) */}
      {[-5.5, -0.5, 4.5, 9.5, 14.5].map((zPos, idx) => (
        <mesh key={`pilaster-right-${idx}`} position={[6.06, 4.0, zPos]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 8.0, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#180c10" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* ============================================================ */}
      {/* ZONE A: THE MAIN AUDITORIUM & SCREEN 04                       */}
      {/* ============================================================ */}

      {/* Screen 04 (Main Panoramic Cinemascope 2.39:1 Curved Screen) */}
      <mesh ref={screen04Ref} position={[0, 4.72, 19.48]} scale={[-1, 1, 1]}>
        <cylinderGeometry args={[32.0, 32.0, 8.1, 64, 1, true, Math.PI - 0.225, 0.45]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>

      {/* Screen 04 Acoustic Baffle Curved Back Wall (Safely 10cm behind screen to prevent Z-fighting) */}
      <mesh position={[0, 4.72, 19.78]} scale={[-1, 1, 1]}>
        <cylinderGeometry args={[32.4, 32.4, 8.8, 48, 1, true, Math.PI - 0.24, 0.48]} />
        <meshStandardMaterial color="#040405" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Screen 04 Curvaceous Architectural Masking & Pelmet */}
      <group position={[0, 4.72, 19.48]} scale={[-1, 1, 1]}>
        {/* Top Curved Pelmet Masking Arc */}
        <mesh position={[0, 8.1 / 2 + 0.05, 0]}>
          <cylinderGeometry args={[31.95, 31.95, 0.12, 64, 1, true, Math.PI - 0.228, 0.456]} />
          <meshStandardMaterial color="#0c0a09" metalness={0.2} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom Curved Pelmet Masking Arc */}
        <mesh position={[0, -8.1 / 2 - 0.05, 0]}>
          <cylinderGeometry args={[31.95, 31.95, 0.12, 64, 1, true, Math.PI - 0.228, 0.456]} />
          <meshStandardMaterial color="#0c0a09" metalness={0.2} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Fluted Semicircular Art Deco Proscenium Columns flanking Screen 04 */}
      {[-7.35, 7.35].map((colX, cIdx) => (
        <group key={`proscenium-col-${cIdx}`} position={[colX, 4.72, -11.75]}>
          {/* Main Fluted Column Shaft */}
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 8.35, 24]} />
            <meshStandardMaterial color="#1a0e12" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Stepped Art Deco Brass Capital */}
          <mesh position={[0, 4.22, 0]}>
            <cylinderGeometry args={[0.42, 0.34, 0.16, 24]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
          </mesh>
          {/* Stepped Art Deco Brass Plinth Base */}
          <mesh position={[0, -4.22, 0]}>
            <cylinderGeometry args={[0.34, 0.42, 0.16, 24]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
          </mesh>
          {/* Column Up/Down Accent Glow */}
          <pointLight position={[0, -3.8, 0.2]} intensity={2.4} distance={4.5} color="#ffa43b" decay={1.5} />
        </group>
      ))}

      {/* Main Velvet Curtains */}
      <mesh position={[-8.2, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[8.2, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Auditorium Enclosing Wall with Grand Cinema Exit Doorway to High Porch */}
      <group position={[6.2, 0, 0]}>
        {/* Front Wall Segment (from z = -14.0 to z = 0.9) */}
        <mesh position={[0, 4.0, -6.55]}>
          <boxGeometry args={[0.26, 8.0, 14.9]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>
        <mesh position={[-0.14, 4.0, -6.55]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[14.9, 8.0]} />
          <meshStandardMaterial color="#26080e" roughness={0.92} metalness={0.05} />
        </mesh>

        {/* Rear Wall Segment (from z = 3.1 to z = 24.0) */}
        <mesh position={[0, 4.0, 13.55]}>
          <boxGeometry args={[0.26, 8.0, 20.9]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>
        <mesh position={[-0.14, 4.0, 13.55]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[20.9, 8.0]} />
          <meshStandardMaterial color="#26080e" roughness={0.92} metalness={0.05} />
        </mesh>

        {/* Top Wall Segment above Doorway (from y = 3.2 to 8.0, z = 0.9 to 3.1) */}
        <mesh position={[0, 5.6, 2.0]}>
          <boxGeometry args={[0.26, 4.8, 2.2]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>

        {/* Doorway Architrave Frame (Dark Mahogany & Polished Brass Trim) */}
        <group position={[-0.14, 0, 2.0]}>
          {/* Top Lintel Architrave */}
          <mesh position={[0, 3.26, 0]}>
            <boxGeometry args={[0.08, 0.16, 2.38]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Left Jamb Architrave */}
          <mesh position={[0, 1.6, -1.14]}>
            <boxGeometry args={[0.08, 3.2, 0.1]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Right Jamb Architrave */}
          <mesh position={[0, 1.6, 1.14]}>
            <boxGeometry args={[0.08, 3.2, 0.1]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>

          {/* Illuminated Exit Marquee Transom Sign */}
          <mesh position={[0.02, 3.48, 0]}>
            <boxGeometry args={[0.06, 0.22, 1.6]} />
            <meshStandardMaterial color="#14100c" roughness={0.4} />
          </mesh>
          <mesh position={[-0.02, 3.48, 0]}>
            <boxGeometry args={[0.02, 0.18, 1.54]} />
            <meshBasicMaterial color="#ffe0a3" />
          </mesh>
          <pointLight position={[-0.2, 3.48, 0]} intensity={1.8} distance={4} color="#ffa43b" />
        </group>

        {/* Left Door Leaf (Hinged at z = 0.9, swings outward into terrace) */}
        <group ref={leftDoorRef} position={[0, 0, 0.9]}>
          <mesh position={[0, 1.575, 0.54]}>
            <boxGeometry args={[0.06, 3.15, 1.08]} />
            <meshStandardMaterial color="#1a0f0a" roughness={0.45} />
          </mesh>
          {/* Inset Oxblood Leather Panel */}
          <mesh position={[-0.035, 1.575, 0.54]}>
            <boxGeometry args={[0.015, 2.65, 0.88]} />
            <meshStandardMaterial color="#300d14" roughness={0.92} />
          </mesh>
          {/* Brass Push Handle */}
          <mesh position={[-0.07, 1.15, 0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 12]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Brass Kickplate */}
          <mesh position={[-0.035, 0.18, 0.54]}>
            <boxGeometry args={[0.015, 0.32, 0.92]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.25} />
          </mesh>
        </group>

        {/* Right Door Leaf (Hinged at z = 3.1, swings outward into terrace) */}
        <group ref={rightDoorRef} position={[0, 0, 3.1]}>
          <mesh position={[0, 1.575, -0.54]}>
            <boxGeometry args={[0.06, 3.15, 1.08]} />
            <meshStandardMaterial color="#1a0f0a" roughness={0.45} />
          </mesh>
          {/* Inset Oxblood Leather Panel */}
          <mesh position={[-0.035, 1.575, -0.54]}>
            <boxGeometry args={[0.015, 2.65, 0.88]} />
            <meshStandardMaterial color="#300d14" roughness={0.92} />
          </mesh>
          {/* Brass Push Handle */}
          <mesh position={[-0.07, 1.15, -0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 12]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Brass Kickplate */}
          <mesh position={[-0.035, 0.18, -0.54]}>
            <boxGeometry args={[0.015, 0.32, 0.92]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* Volumetric Doorway Floor Light Spill (Brightens when doors swing open) */}
      <mesh position={[5.4, 0.02, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 2.4]} />
        <meshBasicMaterial
          ref={doorLightSpillRef}
          color="#ffa43b"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Seated Area Gentle Overhead Ambient & Low-Floor Tone */}
      <pointLight position={[0.825, 3.2, 6.2]} intensity={1.8} distance={7} color="#ffe2b0" decay={1.6} />
      <pointLight position={[0.32, 0.25, 5.2]} intensity={1.0} distance={3.5} color="#f5c270" decay={1.8} />
      <pointLight position={[1.35, 0.25, 5.2]} intensity={1.0} distance={3.5} color="#f5c270" decay={1.8} />

      {/* Tiered Architectural Risers (Stepped Platforms under Seats) */}
      <group>
        {[0, 1, 2, 3, 4].map((r) => {
          const z = 2.0 + r * 2.2;
          const platformH = (r + 1) * 0.14;
          const topY = platformH;
          const midY = platformH / 2;
          return (
            <group key={r}>
              {/* Left Seat Bank Tier Platform */}
              <mesh position={[-2.75, midY, z]}>
                <boxGeometry args={[3.8, platformH, 2.2]} />
                <meshStandardMaterial color="#0b090a" roughness={0.8} metalness={0.1} />
              </mesh>
              {/* Left Tier Step Brass Bullnose Edge Nosing */}
              <mesh position={[-2.75, topY, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.016, 0.016, 3.8, 16]} />
                <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
              </mesh>

              {/* Right Seat Bank Tier Platform */}
              <mesh position={[2.75, midY, z]}>
                <boxGeometry args={[3.8, platformH, 2.2]} />
                <meshStandardMaterial color="#0b090a" roughness={0.8} metalness={0.1} />
              </mesh>
              {/* Right Tier Step Brass Bullnose Edge Nosing */}
              <mesh position={[2.75, topY, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.016, 0.016, 3.8, 16]} />
                <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
              </mesh>

              {/* Center Aisle Low-Rise Stepped Terrace */}
              {r > 0 && (
                <group>
                  <mesh position={[0, midY - 0.04, z]}>
                    <boxGeometry args={[1.68, platformH - 0.08, 2.2]} />
                    <meshStandardMaterial color="#090809" roughness={0.85} metalness={0.08} />
                  </mesh>
                  {/* Center Aisle Brass Bullnose Edge Nosing */}
                  <mesh position={[0, platformH - 0.04, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.014, 0.014, 1.68, 16]} />
                    <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}

        {/* Rear Foyer Stepped Risers connecting Entrance (z: 19.0) to Orchestra Back Row (z: 11.9) */}
        {[
          { z: 12.8, h: 0.56, w: 14.0 },
          { z: 14.2, h: 0.38, w: 14.0 },
          { z: 15.6, h: 0.20, w: 14.0 },
        ].map((stp, idx) => (
          <group key={`foyer-step-${idx}`}>
            <mesh position={[0, stp.h / 2, stp.z]}>
              <boxGeometry args={[stp.w, stp.h, 1.4]} />
              <meshStandardMaterial color="#0c0a0c" roughness={0.88} metalness={0.08} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Velvet Luxury Lounger Seats in Orchestra with Tiered Rake (Instanced 6 draw calls) */}
      <InstancedCinemaSeats seats={seatsZoneA} />

      {/* Reflective Acoustic Marble Floor */}
      <mesh position={[0, -0.02, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 60]} />
        <meshStandardMaterial color="#050507" roughness={0.32} metalness={0.45} />
      </mesh>

      {/* Central Aisle Plush Velvet Acoustic Carpet Runner (Eliminates Specular Glare) */}
      <mesh position={[0, 0.01, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.65, 30]} />
        <meshStandardMaterial color="#1a060a" roughness={0.96} metalness={0.02} />
      </mesh>

      {/* Aisle LED Guide Lights */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[aisleGuideLights, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.10}
          color="#dfc28d"
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Aisle Step Runway Luminaires on every Tier Riser */}
      {[
        { z: 2.0, y: 0.14 },
        { z: 4.2, y: 0.28 },
        { z: 6.4, y: 0.42 },
        { z: 8.6, y: 0.56 },
        { z: 10.8, y: 0.70 },
        { z: 12.8, y: 0.56 },
        { z: 14.2, y: 0.38 },
        { z: 15.6, y: 0.20 },
      ].map((step, idx) => (
        <group key={`aisle-step-${idx}`}>
          {/* Left Step Luminaire */}
          <group position={[-0.86, step.y + 0.02, step.z]}>
            <mesh>
              <boxGeometry args={[0.05, 0.035, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0.028, 0, 0]}>
              <boxGeometry args={[0.008, 0.02, 0.08]} />
              <meshBasicMaterial color="#ffc470" />
            </mesh>
            <pointLight position={[0.12, 0, 0]} intensity={1.4} distance={2.2} color="#ffa43b" decay={1.7} />
          </group>
          {/* Right Step Luminaire */}
          <group position={[0.86, step.y + 0.02, step.z]}>
            <mesh>
              <boxGeometry args={[0.05, 0.035, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[-0.028, 0, 0]}>
              <boxGeometry args={[0.008, 0.02, 0.08]} />
              <meshBasicMaterial color="#ffc470" />
            </mesh>
            <pointLight position={[-0.12, 0, 0]} intensity={1.4} distance={2.2} color="#ffa43b" decay={1.7} />
          </group>
        </group>
      ))}

      {/* Rear Projection Booth Window & Lens Aperture (z = 18.2, y = 8.4) */}
      <group position={[0, 8.4, 18.2]}>
        {/* Polished Brass Projection Port Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.55, 0.12]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Projection Booth Glass */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[0.84, 0.42]} />
          <meshStandardMaterial color="#08101a" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
        </mesh>
        {/* Brilliant Master Projector Lens */}
        <mesh position={[0, 0, -0.06]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Powerful Lens Core Light */}
        <pointLight position={[0, 0, -0.2]} intensity={7.5} distance={18} color="#eef6ff" decay={1.4} />
      </group>

      {/* Atmospheric 4K Volumetric Projector Beam Cone */}
      <mesh position={[0, 8.5, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[8.4, 25, 32, 1, true]} />
        <meshBasicMaterial
          color="#d8ebff"
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ============================================================ */}
      {/* ZONE B: HIGH PORCH VINTAGE PROVISIONS & FOOD VERANDA           */}
      {/* Step seamlessly through the animated cinema exit double doors   */}
      {/* Grounded eye-level architecture with Veo 3.1 live video mural  */}
      {/* ============================================================ */}
      {/* Entry Terrace Walkway connecting Doorway (x: 6.2) to High Porch Deck (x: 8.25) */}
      <mesh position={[7.225, 0.06, 2.0]}>
        <boxGeometry args={[2.05, 0.12, 2.8]} />
        <meshStandardMaterial color="#1a1410" roughness={0.38} metalness={0.15} />
      </mesh>
      {/* Walkway Brass Edge Nosings */}
      <mesh position={[7.225, 0.125, 0.6]}>
        <boxGeometry args={[2.05, 0.012, 0.03]} />
        <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[7.225, 0.125, 3.4]}>
        <boxGeometry args={[2.05, 0.012, 0.03]} />
        <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
      </mesh>

      <group position={[12.5, 0, 0.0]}>
        {/* High Porch Solid Teak Floor Deck (Flush +12cm Low Riser outside doors) */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[8.5, 0.12, 10.5]} />
          <meshStandardMaterial color="#1a1410" roughness={0.38} metalness={0.15} />
        </mesh>
        {/* Brass Inlay Border around Deck Perimeter */}
        <mesh position={[-4.2, 0.125, 0]}>
          <boxGeometry args={[0.03, 0.012, 10.4]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Art Deco Fluted Columns supporting the Pergola Ceiling */}
        {[-4.5, 4.5].map((zPos, i) => (
          <group key={i} position={[-3.8, 2.15, zPos]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.13, 4.1, 16]} />
              <meshStandardMaterial color="#141316" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Brass Fluted Capital */}
            <mesh position={[0, 2.0, 0]}>
              <boxGeometry args={[0.34, 0.14, 0.34]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Brass Base Plinth */}
            <mesh position={[0, -2.0, 0]}>
              <boxGeometry args={[0.34, 0.12, 0.34]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        ))}

        {/* Vintage Wrought Iron & Brass Balustrade with Open Walkway Portal (z: 0.7 to 3.3) */}
        <group position={[-3.8, 0.12, 0]}>
          {/* North Railing Section (z: -4.8 to 0.7) */}
          <group position={[0, 0, -2.05]}>
            <mesh position={[0, 0.94, 0]}>
              <boxGeometry args={[0.1, 0.08, 5.5]} />
              <meshStandardMaterial color="#2b1a12" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <boxGeometry args={[0.12, 0.02, 5.5]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.04, 5.5]} />
              <meshStandardMaterial color="#1b120c" metalness={0.7} roughness={0.3} />
            </mesh>
            {Array.from({ length: 14 }).map((_, i) => (
              <mesh key={i} position={[0, 0.5, -2.5 + i * 0.38]}>
                <cylinderGeometry args={[0.015, 0.015, 0.88, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* South Railing Section (z: 3.3 to 4.8) */}
          <group position={[0, 0, 4.05]}>
            <mesh position={[0, 0.94, 0]}>
              <boxGeometry args={[0.1, 0.08, 1.5]} />
              <meshStandardMaterial color="#2b1a12" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <boxGeometry args={[0.12, 0.02, 1.5]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.04, 1.5]} />
              <meshStandardMaterial color="#1b120c" metalness={0.7} roughness={0.3} />
            </mesh>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={i} position={[0, 0.5, -0.6 + i * 0.4]}>
                <cylinderGeometry args={[0.015, 0.015, 0.88, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* Brass Entrance Newel Posts flanking the entryway */}
          {[0.7, 3.3].map((zPos, i) => (
            <group key={i} position={[0, 0, zPos]}>
              <mesh position={[0, 0.54, 0]}>
                <boxGeometry args={[0.12, 1.08, 0.12]} />
                <meshStandardMaterial color="#1b120c" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.12, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Overhead Vintage Timber Pergola Roof (at Y: 4.25) */}
        <group position={[0, 4.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[8.4, 0.14, 10.4]} />
            <meshStandardMaterial color="#1a120c" roughness={0.6} />
          </mesh>
          {/* Scalloped Vintage Deep Oxblood Fabric Awning Trim along porch edge */}
          <mesh position={[-3.8, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.38, 9.6]} />
            <meshStandardMaterial color="#380d14" roughness={0.88} />
          </mesh>
          <mesh position={[-3.8, -0.42, 0]}>
            <boxGeometry args={[0.09, 0.03, 9.6]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* Hanging Vintage Brass Cage Edison Filament Lanterns */}
        {[-3.6, -1.2, 1.2, 3.6].map((zOffset, i) => (
          <group key={i} position={[-0.8, 3.4, zOffset]}>
            {/* Cord */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.85, 8]} />
              <meshStandardMaterial color="#111113" />
            </mesh>
            {/* Vintage Brass Hood */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.1, 0.22, 0.18, 16, 1, true]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing Amber Filament Bulb */}
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshBasicMaterial color="#ffb049" />
            </mesh>
            <pointLight intensity={14} distance={9} color="#ffa43b" decay={1.5} />
          </group>
        ))}

        {/* Warm Vintage Concessions Ambient Floodlights */}
        <pointLight position={[0.4, 3.4, 0]} intensity={12} distance={14} color="#ffbe6b" decay={1.4} />
        <pointLight position={[-1.4, 3.1, 0.2]} intensity={10} distance={12} color="#ffa43b" decay={1.4} />

        {/* Complete 3D Cinema Snack Stand (Popcorn Machine, Lady Attendant, Puffs, Rolls, Menu Board) */}
        <CinemaSnackStand3D />
      </group>

      {/* ============================================================ */}
      {/* ZONE B: VIP GALLERY CORRIDOR (High Porch to Screen 05)       */}
      {/* Located at x: 9.8, running from z: -5.25 down to z: -18.25   */}
      {/* Safely connects the north end of the High Porch to Screen 05 */}
      {/* Does NOT block the High Porch doorway entrance at z: 2.0!     */}
      {/* ============================================================ */}
      <group position={[9.8, 0, -11.75]}>
        {/* Gallery Corridor Floor Runner in Dark Herringbone Terrazzo (z: -5.25 to -18.25) */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[3.2, 0.16, 13.0]} />
          <meshStandardMaterial color="#0e0c0b" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* Polished Brass Floor Inlay Borders */}
        <mesh position={[-1.5, 0.17, 0]}>
          <boxGeometry args={[0.04, 0.02, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[1.5, 0.17, 0]}>
          <boxGeometry args={[0.04, 0.02, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Outer Fluted Timber Wall along x: 11.4 (relative x: +1.6) */}
        <mesh position={[1.6, 3.1, 0]}>
          <boxGeometry args={[0.2, 6.2, 13.0]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Art Deco Brass Mouldings on Outer Wall */}
        <mesh position={[1.49, 1.1, 0]}>
          <boxGeometry args={[0.03, 0.04, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[1.49, 3.6, 0]}>
          <boxGeometry args={[0.03, 0.04, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Inner Dividing Wall along x: 8.2 (relative x: -1.6) separating Corridor from Auditorium */}
        {/* Main Solid Wall Segment from relative z = +6.5 down to -3.8 (length 10.3, world z: -5.25 to -15.55) */}
        {/* Stays strictly between z: -5.25 and -15.55 - NEVER reaches the food area doorway at z: 2.0! */}
        <mesh position={[-1.6, 3.1, 1.35]}>
          <boxGeometry args={[0.2, 6.2, 10.3]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Art Deco Brass Mouldings on Inner Wall */}
        <mesh position={[-1.49, 1.1, 1.35]}>
          <boxGeometry args={[0.03, 0.04, 10.3]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-1.49, 3.6, 1.35]}>
          <boxGeometry args={[0.03, 0.04, 10.3]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Wall Transom above VIP Entrance Archway (relative z: -3.8 to -6.5) */}
        <mesh position={[-1.6, 4.8, -5.15]}>
          <boxGeometry args={[0.22, 2.8, 2.7]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Corridor End Wall (relative z: -6.5, world z: -18.25) closing off the gallery end */}
        <mesh position={[0, 3.1, -6.5]}>
          <boxGeometry args={[3.2, 6.2, 0.2]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Gallery Architectural Coffered Ceiling */}
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[3.4, 0.2, 13.0]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.6} />
        </mesh>

        {/* Warm Downlights along the VIP Gallery Ceiling */}
        {[4.5, 1.5, -1.5, -4.5].map((zPos, idx) => (
          <group key={idx} position={[0, 5.8, zPos]}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.15, 0.08, 16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <circleGeometry args={[0.09, 16]} />
              <meshBasicMaterial color="#ffe2b0" />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={6.5} distance={5.5} color="#ffa43b" decay={1.5} />
          </group>
        ))}

        {/* Wall Sconces with warm upward/downward luminescence (Outer Wall) */}
        {[3.5, -0.5, -4.5].map((zPos, idx) => (
          <group key={idx} position={[1.47, 2.4, zPos]}>
            <mesh>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={2.2} distance={3.8} color="#ffa43b" decay={1.6} />
          </group>
        ))}

        {/* Wall Sconces with warm luminescence (Inner Wall) */}
        {[4.0, 0.0].map((zPos, idx) => (
          <group key={idx} position={[-1.47, 2.4, zPos]}>
            <mesh>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={2.2} distance={3.8} color="#ffa43b" decay={1.6} />
          </group>
        ))}

        {/* Living Video Marquee Poster 1 (Cosmic Voyage Veo 3.1) */}
        <group position={[1.46, 2.2, 2.2]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Ebony Mounting Backplate (flush against wall, non-reflective) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.44, 2.08, 0.016]} />
            <meshStandardMaterial color="#110e0c" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Bespoke Vertical Marquee Poster Plane */}
          <mesh ref={corridorPoster1Ref} position={[0, 0, 0.020]}>
            <planeGeometry args={[1.30, 1.94]} />
            <meshBasicMaterial
              color="#1a1410"
              toneMapped={false}
            />
          </mesh>

          {/* Art Deco 3D Polished Brass Bevelled Outer Frame (4 distinct borders framing the poster) */}
          <mesh position={[0, 1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[-0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Art Deco Brass Crest Plaque on top */}
          <mesh position={[0, 1.06, 0.030]}>
            <boxGeometry args={[0.42, 0.04, 0.04]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.92} roughness={0.25} />
          </mesh>

          {/* Dedicated Gallery Picture Downlight */}
          <pointLight position={[0, 1.08, 0.20]} intensity={1.5} distance={3.0} color="#ffe2b0" decay={1.8} />
        </group>

        {/* Living Video Marquee Poster 2 (Neo-Tokyo Premiere Veo 3.1) */}
        <group position={[1.46, 2.2, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Ebony Mounting Backplate (flush against wall, non-reflective) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.44, 2.08, 0.016]} />
            <meshStandardMaterial color="#110e0c" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Bespoke Vertical Marquee Poster Plane */}
          <mesh ref={corridorPoster2Ref} position={[0, 0, 0.020]}>
            <planeGeometry args={[1.30, 1.94]} />
            <meshBasicMaterial
              color="#1a1410"
              toneMapped={false}
            />
          </mesh>

          {/* Art Deco 3D Polished Brass Bevelled Outer Frame (4 distinct borders framing the poster) */}
          <mesh position={[0, 1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[-0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Art Deco Brass Crest Plaque on top */}
          <mesh position={[0, 1.06, 0.030]}>
            <boxGeometry args={[0.42, 0.04, 0.04]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.92} roughness={0.25} />
          </mesh>

          {/* Dedicated Gallery Picture Downlight */}
          <pointLight position={[0, 1.08, 0.20]} intensity={1.5} distance={3.0} color="#dfc28d" decay={1.8} />
        </group>

        {/* VIP Suite Entrance Portal Opening into Screen 05 (relative z: -5.15) */}
        <group position={[-1.5, 0, -5.15]}>
          {/* Portal Architrave Frame */}
          <mesh position={[0, 3.45, 0]}>
            <boxGeometry args={[0.26, 0.16, 2.8]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.7, -1.35]}>
            <boxGeometry args={[0.26, 3.4, 0.14]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.7, 1.35]}>
            <boxGeometry args={[0.26, 3.4, 0.14]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Illuminated VIP Portal Sign */}
          <mesh position={[0.1, 3.65, 0]}>
            <boxGeometry args={[0.08, 0.24, 2.0]} />
            <meshStandardMaterial color="#120f0c" roughness={0.4} />
          </mesh>
          <pointLight position={[0.2, 3.65, 0]} intensity={14} distance={6} color="#dfc28d" decay={1.4} />
        </group>
      </group>

      {/* ============================================================ */}
      {/* ZONE C: SCREEN 05 (THE DIRECTOR'S VIP SUITE)                  */}
      {/* Fully enclosed 360-degree architectural private screening suite */}
      {/* Oxblood acoustic fabric baffle, mahogany fluted side walls,   */}
      {/* coffered ceiling, plush cinema carpet & massive 4K Screen 05   */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* 1. Front Screen Wall (at z: -29.4) */}
        <mesh position={[0, 3.8, -29.4]}>
          <boxGeometry args={[30.0, 7.6, 0.4]} />
          <meshStandardMaterial color="#1a060c" roughness={0.95} />
        </mesh>

        {/* Massive Screen 05 */}
        <mesh ref={screen05Ref} position={[0, 4.72, -28.9]} scale={[16.0, 9.0, 1]}>
          <planeGeometry />
        </mesh>

        {/* Screen 05 Architectural Cinema Masking */}
        <group position={[0, 4.72, -28.88]}>
          <mesh position={[0, 9.0 / 2 + 0.04, 0]}>
            <boxGeometry args={[16.08, 0.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[0, -9.0 / 2 - 0.04, 0]}>
            <boxGeometry args={[16.08, 0.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[-16.0 / 2 - 0.04, 0, 0]}>
            <boxGeometry args={[0.08, 9.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[16.0 / 2 + 0.04, 0, 0]}>
            <boxGeometry args={[0.08, 9.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
        </group>

        {/* Screen 05 Velvet Drapes flanking the screen */}
        <mesh position={[-9.5, 4.2, -28.2]}>
          <planeGeometry args={[3.6, 9.2, 32, 1]} />
          <meshStandardMaterial color="#220810" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[9.5, 4.2, -28.2]}>
          <planeGeometry args={[3.6, 9.2, 32, 1]} />
          <meshStandardMaterial color="#220810" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
        </mesh>

        {/* Screen 05 Stage Apron & Plinth */}
        <mesh position={[0, 0.22, -28.2]}>
          <boxGeometry args={[20.0, 0.44, 2.0]} />
          <meshStandardMaterial color="#120e0c" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.44, -27.2]}>
          <boxGeometry args={[20.0, 0.03, 0.05]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Screen 05 Ambient Glow & Stage Uplighting */}
        <pointLight position={[0, 4.72, -27.5]} intensity={18} distance={32} color="#ffe2b0" decay={1.2} />
        <pointLight position={[0, 0.6, -26.8]} intensity={8} distance={10} color="#ffb049" decay={1.4} />

        {/* 2. Right Enclosing Wall of Screen 05 Suite (Flushed with corridor outer wall at x: +11.4) */}
        <mesh position={[11.4, 3.6, -22.75]}>
          <boxGeometry args={[0.4, 7.2, 13.5]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>
        {/* Right Wall Mouldings & Sconces */}
        <mesh position={[11.19, 1.1, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[11.19, 3.6, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        {[-18.5, -22.5, -26.5].map((zPos, idx) => (
          <group key={idx} position={[11.15, 2.6, zPos]}>
            <mesh>
              <boxGeometry args={[0.08, 0.5, 0.16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={14} distance={8} color="#ffa43b" decay={1.4} />
          </group>
        ))}

        {/* 3. Left Enclosing Wall of Screen 05 Suite (Symmetrical at x: -11.4) */}
        <mesh position={[-11.4, 3.6, -22.75]}>
          <boxGeometry args={[0.4, 7.2, 13.5]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>
        {/* Left Wall Mouldings & Sconces */}
        <mesh position={[-11.19, 1.1, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-11.19, 3.6, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        {[-18.5, -22.5, -26.5].map((zPos, idx) => (
          <group key={idx} position={[-11.15, 2.6, zPos]}>
            <mesh>
              <boxGeometry args={[0.08, 0.5, 0.16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={14} distance={8} color="#ffa43b" decay={1.4} />
          </group>
        ))}

        {/* 4. Back Wall of Screen 05 Suite (at z: -16.0) */}
        {/* Left back section from x: -11.4 to x: +8.2 (length: 19.6) */}
        <mesh position={[-1.6, 3.6, -16.0]}>
          <boxGeometry args={[19.6, 7.2, 0.4]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>

        {/* 5. Complete Cinema Floor Carpet */}
        <mesh position={[0, 0.05, -22.75]}>
          <boxGeometry args={[23.2, 0.1, 13.5]} />
          <meshStandardMaterial color="#1a060d" roughness={0.96} />
        </mesh>

        {/* 6. Complete Coffered Cinema Ceiling */}
        <mesh position={[0, 7.2, -22.75]}>
          <boxGeometry args={[23.2, 0.2, 13.5]} />
          <meshStandardMaterial color="#0d0908" roughness={0.6} />
        </mesh>

        {/* Ceiling Downlights illuminating the VIP Suite */}
        <pointLight position={[0, 6.5, -22.5]} intensity={18} distance={18} color="#ffe2b0" decay={1.3} />
        <pointLight position={[5.0, 5.0, -20.0]} intensity={14} distance={12} color="#ffa43b" decay={1.3} />
        <pointLight position={[-5.0, 5.0, -20.0]} intensity={14} distance={12} color="#ffa43b" decay={1.3} />

        {/* Screen 05 VIP Art Deco Curvaceous Barrel Tub Club Armchairs */}
        {[-3.6, -1.2, 1.2, 3.6].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, -22.5]}>
            {/* 1. Cast-Bronze Circular Swivel Plinth Base */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.44, 0.48, 0.06, 28]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.14} />
            </mesh>

            {/* 2. Sculpted Circular Imperial Oxblood Velvet Seat Cushion */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.50, 0.50, 0.24, 28]} />
              <meshStandardMaterial color="#5c101c" roughness={0.58} metalness={0.05} />
            </mesh>
            {/* Front Comfort Waterfall Lip Roll */}
            <mesh position={[0, 0.22, -0.48]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.65, 20]} />
              <meshStandardMaterial color="#781422" roughness={0.52} metalness={0.05} />
            </mesh>

            {/* 3. Wrap-Around Curvaceous Dark Walnut Barrel Tub Shell */}
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.64, 36, 1, true, -Math.PI * 0.85, Math.PI * 1.7]} />
              <meshStandardMaterial color="#160e0a" roughness={0.26} metalness={0.12} side={THREE.DoubleSide} />
            </mesh>

            {/* 4. Fluted Vertical Inner Velvet Pleating along the Horseshoe Arc */}
            {Array.from({ length: 9 }).map((_, vi) => {
              const angle = -Math.PI * 0.78 + (vi / 8) * (Math.PI * 1.56);
              const px = 0.48 * Math.cos(angle);
              const pz = 0.48 * Math.sin(angle);
              return (
                <mesh key={`flute-${vi}`} position={[px, 0.58, pz]}>
                  <cylinderGeometry args={[0.055, 0.055, 0.62, 16]} />
                  <meshStandardMaterial color="#781422" roughness={0.50} metalness={0.05} />
                </mesh>
              );
            })}

            {/* 5. Continuous Curved Polished Champagne Brass Bullnose Crown Rim */}
            <mesh position={[0, 0.90, 0]} rotation={[Math.PI / 2, 0, -Math.PI * 0.85]}>
              <torusGeometry args={[0.55, 0.022, 16, 36, Math.PI * 1.7]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>

            {/* 6. Rounded Leather Arm Bolster Terminals on Left and Right Ends */}
            {[-0.52, 0.52].map((armX, ai) => (
              <group key={`arm-term-${ai}`} position={[armX, 0.62, 0.16]}>
                <mesh>
                  <cylinderGeometry args={[0.065, 0.065, 0.46, 20]} />
                  <meshStandardMaterial color="#221612" roughness={0.45} metalness={0.08} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                  <sphereGeometry args={[0.065, 16, 16]} />
                  <meshStandardMaterial color="#221612" roughness={0.45} metalness={0.08} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                  <torusGeometry args={[0.066, 0.008, 12, 20]} />
                  <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* Floating Dust Particles throughout all zones */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlesData, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#f4d9a6"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
