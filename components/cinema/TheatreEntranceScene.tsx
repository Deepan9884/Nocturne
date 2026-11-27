"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface TheatreEntranceSceneProps {
  entering?: boolean;
}

function makeMarqueeTexture(primary: string, secondary: string, width = 1024, height = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Warm backlit parchment marquee glass (keeps crisp letter contrast without bloom blowout)
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#dfcca2");
    bg.addColorStop(0.5, "#efe1be");
    bg.addColorStop(1, "#d3be90");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle interior frame border
    ctx.strokeStyle = "#2b1d0d";
    ctx.lineWidth = 4;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    ctx.strokeStyle = "rgba(43, 29, 13, 0.42)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // Primary theatre nameplate
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#120c06";
    ctx.font = `600 ${Math.round(height * 0.42)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText(primary, width / 2, secondary ? height * 0.42 : height * 0.52);

    if (secondary) {
      ctx.fillStyle = "#2e200e";
      ctx.font = `700 ${Math.round(height * 0.14)}px "Manrope", Arial, sans-serif`;
      ctx.fillText(secondary, width / 2, height * 0.77);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makePosterTexture(title: string, subtitle: string, topColor: string, midColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(0.55, midColor);
    grad.addColorStop(1, "#0b0a0c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Abstract architectural silhouette inside poster
    const halo = ctx.createRadialGradient(256, 290, 20, 256, 290, 210);
    halo.addColorStop(0, "rgba(235, 202, 138, 0.5)");
    halo.addColorStop(0.5, "rgba(201, 168, 106, 0.14)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(235, 208, 158, 0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    ctx.beginPath();
    ctx.arc(256, 280, 110, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(241, 233, 219, 0.32)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#e6cfa0";
    ctx.font = '500 18px "Manrope", Arial, sans-serif';
    ctx.fillText(subtitle, 256, 86);

    ctx.fillStyle = "#f4ecdc";
    ctx.font = 'italic 400 54px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(title, 256, 628);

    ctx.fillStyle = "rgba(230, 207, 160, 0.72)";
    ctx.font = '500 14px "Manrope", Arial, sans-serif';
    ctx.fillText("SCREEN 04 TONIGHT", 256, 684);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function FlutedPilaster({ x, z = 0.2, height = 7.4 }: { x: number; z?: number; height?: number }) {
  const flutes = [-0.26, -0.13, 0, 0.13, 0.26];
  return (
    <group position={[x, height / 2, z]}>
      {/* Main stone pier */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.88, height, 0.56]} />
        <meshStandardMaterial color="#181920" roughness={0.76} metalness={0.08} />
      </mesh>
      {/* Fluted vertical stone ribs */}
      {flutes.map((fx) => (
        <mesh key={fx} position={[fx, 0, 0.29]}>
          <boxGeometry args={[0.055, height - 0.5, 0.06]} />
          <meshStandardMaterial color="#23252f" roughness={0.62} metalness={0.14} />
        </mesh>
      ))}
      {/* Bronze plinth & capital bands */}
      <mesh position={[0, -height / 2 + 0.18, 0.04]}>
        <boxGeometry args={[0.98, 0.36, 0.64]} />
        <meshStandardMaterial color="#68502c" roughness={0.38} metalness={0.78} />
      </mesh>
      <mesh position={[0, height / 2 - 0.14, 0.04]}>
        <boxGeometry args={[0.98, 0.26, 0.64]} />
        <meshStandardMaterial color="#7d6134" roughness={0.34} metalness={0.82} />
      </mesh>
    </group>
  );
}

function WallSconce({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[0.2, 0.68, 0.08]} />
        <meshStandardMaterial color="#8d6d3b" metalness={0.86} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.04, 0.06]}>
        <boxGeometry args={[0.11, 0.48, 0.06]} />
        <meshStandardMaterial
          color="#ffe3aa"
          emissive="#f0be6e"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0, 0.45]} color="#f1c57e" intensity={2.8} distance={5.5} decay={2} />
    </group>
  );
}

function PosterVitrine({
  x,
  title,
  subtitle,
  topColor,
  midColor,
}: {
  x: number;
  title: string;
  subtitle: string;
  topColor: string;
  midColor: string;
}) {
  const posterTex = useMemo(
    () => makePosterTexture(title, subtitle, topColor, midColor),
    [title, subtitle, topColor, midColor]
  );

  useEffect(() => () => posterTex.dispose(), [posterTex]);

  return (
    <group position={[x, 2.32, 0.08]}>
      {/* Cast bronze outer frame */}
      <mesh>
        <boxGeometry args={[1.48, 2.16, 0.14]} />
        <meshStandardMaterial color="#6e542e" metalness={0.84} roughness={0.3} />
      </mesh>
      {/* Illuminated poster print */}
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[1.28, 1.94]} />
        <meshStandardMaterial
          map={posterTex}
          emissive="#e8c88e"
          emissiveMap={posterTex}
          emissiveIntensity={0.45}
          roughness={0.4}
        />
      </mesh>
      {/* Top picture lamp hood */}
      <mesh position={[0, 1.14, 0.18]}>
        <boxGeometry args={[0.9, 0.08, 0.24]} />
        <meshStandardMaterial color="#7d6035" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.09, 0.22]}>
        <boxGeometry args={[0.78, 0.025, 0.05]} />
        <meshBasicMaterial color="#ffe4aa" toneMapped={false} />
      </mesh>
    </group>
  );
}

function EntranceDoors({ entering }: { entering: boolean }) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const targetAngle = entering ? 1.15 : 0.14;
    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.damp(leftDoorRef.current.rotation.y, -targetAngle, 3.2, delta);
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.damp(rightDoorRef.current.rotation.y, targetAngle, 3.2, delta);
    }
  });

  const renderDoorLeaf = (side: -1 | 1) => (
    <group position={[side * -0.58, 0, 0]}>
      {/* Bronze outer stile & rail perimeter */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[1.14, 3.05, 0.07]} />
        <meshStandardMaterial color="#4f3b21" metalness={0.82} roughness={0.32} />
      </mesh>
      {/* Warm translucent glass aperture */}
      <mesh position={[0, 1.66, 0.01]}>
        <planeGeometry args={[0.92, 2.38]} />
        <meshPhysicalMaterial
          color="#f2d59f"
          transparent
          opacity={0.22}
          roughness={0.12}
          metalness={0.15}
          reflectivity={0.9}
        />
      </mesh>
      {/* Horizontal bronze transoms */}
      <mesh position={[0, 0.48, 0.045]}>
        <boxGeometry args={[1.08, 0.42, 0.025]} />
        <meshStandardMaterial color="#261d14" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 2.08, 0.045]}>
        <boxGeometry args={[0.96, 0.035, 0.03]} />
        <meshStandardMaterial color="#967440" metalness={0.88} roughness={0.24} />
      </mesh>
      {/* Brass vertical pull handle */}
      <mesh position={[side * -0.4, 1.38, 0.09]}>
        <cylinderGeometry args={[0.022, 0.022, 0.78, 10]} />
        <meshStandardMaterial color="#d8b573" metalness={0.95} roughness={0.18} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0.42, -0.35]}>
      {/* Left hinged door */}
      <group ref={leftDoorRef} position={[-1.18, 0, 0]}>
        {renderDoorLeaf(-1)}
      </group>
      {/* Right hinged door */}
      <group ref={rightDoorRef} position={[1.18, 0, 0]}>
        {renderDoorLeaf(1)}
      </group>
    </group>
  );
}

function TheatreBuilding({ entering }: { entering: boolean }) {
  const frontMarquee = useMemo(() => makeMarqueeTexture("NOCTURNE", "PRIVATE CINEMA · SCREEN 04", 1024, 256), []);
  const sideMarquee = useMemo(() => makeMarqueeTexture("PREMIERE", "TONIGHT AT 20:00", 512, 256), []);

  useEffect(() => {
    return () => {
      frontMarquee.dispose();
      sideMarquee.dispose();
    };
  }, [frontMarquee, sideMarquee]);

  const marqueeBulbs = useMemo(() => {
    const arr: number[] = [];
    for (let x = -2.85; x <= 2.85; x += 0.38) {
      arr.push(Number(x.toFixed(2)));
    }
    return arr;
  }, []);

  return (
    <group>
      {/* ============================================================ */}
      {/* WET NIGHT PAVEMENT / REFLECTIVE FORECOURT                    */}
      {/* ============================================================ */}
      <mesh position={[0, 0, 4.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 26]} />
        <MeshReflectorMaterial
          blur={[240, 80]}
          resolution={256}
          mixBlur={0.95}
          mixStrength={14}
          roughness={0.62}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0e1015"
          metalness={0.5}
          mirror={0.52}
        />
      </mesh>

      {/* Subtle brass pavement expansion inlays */}
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, 0.004, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.025, 11]} />
          <meshStandardMaterial color="#6e542e" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}

      {/* ============================================================ */}
      {/* GRANITE ENTRANCE STEPS & THRESHOLD                           */}
      {/* ============================================================ */}
      <mesh position={[0, 0.07, 1.55]} receiveShadow>
        <boxGeometry args={[7.4, 0.14, 3.1]} />
        <meshStandardMaterial color="#1d1f26" roughness={0.72} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.21, 1.15]} receiveShadow>
        <boxGeometry args={[6.6, 0.14, 2.3]} />
        <meshStandardMaterial color="#21232b" roughness={0.68} metalness={0.14} />
      </mesh>
      <mesh position={[0, 0.35, 0.72]} receiveShadow>
        <boxGeometry args={[5.9, 0.14, 1.5]} />
        <meshStandardMaterial color="#252730" roughness={0.64} metalness={0.15} />
      </mesh>

      {/* Recessed brass step nose glow strips */}
      {[
        [0, 0.135, 3.11, 7.2],
        [0, 0.275, 2.31, 6.4],
        [0, 0.415, 1.48, 5.7],
      ].map(([x, y, z, w], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[w, 0.018, 0.02]} />
          <meshStandardMaterial
            color="#e7c688"
            emissive="#d6aa63"
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Brass entrance bollards flanking the stairs */}
      {[-3.25, 3.25].map((x) => (
        <group key={x} position={[x, 0.45, 3.05]}>
          <mesh>
            <cylinderGeometry args={[0.075, 0.095, 0.9, 14]} />
            <meshStandardMaterial color="#6e542e" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 14]} />
            <meshStandardMaterial
              color="#ffe5af"
              emissive="#f0bf70"
              emissiveIntensity={2.0}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, 0.55, 0.1]} color="#f0be74" intensity={1.8} distance={4} decay={2} />
        </group>
      ))}

      {/* ============================================================ */}
      {/* MONUMENTAL BUILDING FACADE & ART DECO STEPPED CROWN          */}
      {/* ============================================================ */}
      {/* Left, Right & Upper Building Stone Masonry Walls */}
      <mesh position={[-7.55, 6.2, -0.45]} receiveShadow>
        <boxGeometry args={[10.2, 12.8, 0.9]} />
        <meshStandardMaterial color="#14151b" roughness={0.84} metalness={0.06} />
      </mesh>
      <mesh position={[7.55, 6.2, -0.45]} receiveShadow>
        <boxGeometry args={[10.2, 12.8, 0.9]} />
        <meshStandardMaterial color="#14151b" roughness={0.84} metalness={0.06} />
      </mesh>
      <mesh position={[0, 7.9, -0.45]} receiveShadow>
        <boxGeometry args={[5.1, 8.6, 0.9]} />
        <meshStandardMaterial color="#171820" roughness={0.8} metalness={0.08} />
      </mesh>

      {/* Stepped Art Deco Central Crown Tower rising overhead */}
      <mesh position={[0, 9.2, -0.22]}>
        <boxGeometry args={[5.8, 5.2, 0.72]} />
        <meshStandardMaterial color="#1b1c24" roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh position={[0, 11.4, -0.1]}>
        <boxGeometry args={[3.9, 3.2, 0.72]} />
        <meshStandardMaterial color="#20222c" roughness={0.72} metalness={0.12} />
      </mesh>
      <mesh position={[0, 12.9, 0.02]}>
        <boxGeometry args={[2.1, 2.2, 0.72]} />
        <meshStandardMaterial color="#242733" roughness={0.68} metalness={0.14} />
      </mesh>

      {/* Upper facade glowing vertical architectural blade fins */}
      {[-1.55, 0, 1.55].map((x) => (
        <group key={x} position={[x, 8.5, 0.16]}>
          <mesh>
            <boxGeometry args={[0.14, 4.4, 0.14]} />
            <meshStandardMaterial color="#7d6134" metalness={0.82} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.04, 4.1, 0.02]} />
            <meshStandardMaterial
              color="#ffe5af"
              emissive="#e4b76e"
              emissiveIntensity={1.35}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 7.6, 1.3]} color="#e5bd7b" intensity={7} distance={9} decay={2} />

      {/* Horizontal stone cornices */}
      <mesh position={[0, 6.25, 0.14]}>
        <boxGeometry args={[18.5, 0.28, 0.44]} />
        <meshStandardMaterial color="#22242d" roughness={0.68} metalness={0.14} />
      </mesh>
      <mesh position={[0, 6.12, 0.36]}>
        <boxGeometry args={[18.5, 0.05, 0.04]} />
        <meshStandardMaterial color="#87693a" metalness={0.84} roughness={0.28} />
      </mesh>

      {/* Fluted stone pilasters framing the bays */}
      <FlutedPilaster x={-3.15} z={0.18} height={6.3} />
      <FlutedPilaster x={3.15} z={0.18} height={6.3} />
      <FlutedPilaster x={-6.75} z={0.1} height={6.3} />
      <FlutedPilaster x={6.75} z={0.1} height={6.3} />

      {/* Architectural Wall Sconces on outer piers */}
      <WallSconce x={-3.15} y={2.85} z={0.52} />
      <WallSconce x={3.15} y={2.85} z={0.52} />

      {/* Side Poster Vitrines */}
      <PosterVitrine
        x={-4.95}
        title="The Long Night"
        subtitle="NOCTURNE ARCHIVE"
        topColor="#1e1510"
        midColor="#472b19"
      />
      <PosterVitrine
        x={4.95}
        title="Silent Orbit"
        subtitle="DIRECTOR'S CUT"
        topColor="#101822"
        midColor="#1f3447"
      />

      {/* ============================================================ */}
      {/* RECESSED GLOWING THEATRE VESTIBULE & BRONZE ENTRANCE DOORS   */}
      {/* ============================================================ */}
      {/* Vestibule interior walls & warm illuminated lobby ceiling */}
      <mesh position={[0, 2.25, -2.85]}>
        <planeGeometry args={[5.2, 4.4]} />
        <meshStandardMaterial color="#2e1e15" roughness={0.62} metalness={0.1} />
      </mesh>
      <mesh position={[-2.45, 2.25, -1.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.7, 4.4]} />
        <meshStandardMaterial color="#251811" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[2.45, 2.25, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.7, 4.4]} />
        <meshStandardMaterial color="#251811" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.42, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.0, 2.7]} />
        <meshStandardMaterial color="#342318" roughness={0.42} metalness={0.18} />
      </mesh>

      {/* Glowing pendant lantern inside the lobby vestibule */}
      <group position={[0, 3.05, -1.55]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
          <meshStandardMaterial color="#967440" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 20, 16]} />
          <meshStandardMaterial
            color="#fff0cd"
            emissive="#f4c77b"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, -0.1, 0.25]} color="#f5ca82" intensity={18} distance={9} decay={2} />
      </group>

      {/* Bronze entrance doorframe & transom */}
      <mesh position={[-2.44, 2.15, -0.24]}>
        <boxGeometry args={[0.2, 3.6, 0.36]} />
        <meshStandardMaterial color="#7d6134" metalness={0.86} roughness={0.26} />
      </mesh>
      <mesh position={[2.44, 2.15, -0.24]}>
        <boxGeometry args={[0.2, 3.6, 0.36]} />
        <meshStandardMaterial color="#7d6134" metalness={0.86} roughness={0.26} />
      </mesh>
      <mesh position={[0, 3.85, -0.24]}>
        <boxGeometry args={[5.08, 0.22, 0.36]} />
        <meshStandardMaterial color="#7d6134" metalness={0.86} roughness={0.26} />
      </mesh>

      {/* Hinged double bronze & glass doors */}
      <EntranceDoors entering={entering} />

      {/* ============================================================ */}
      {/* CANTILEVERED CINEMA MARQUEE & CANOPY                         */}
      {/* ============================================================ */}
      <group position={[0, 4.45, 1.45]}>
        {/* Main dark bronze canopy body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.4, 0.92, 3.1]} />
          <meshStandardMaterial color="#141315" roughness={0.44} metalness={0.58} />
        </mesh>

        {/* Top & bottom stepped bronze cornice rings */}
        <mesh position={[0, 0.49, 0]}>
          <boxGeometry args={[6.62, 0.09, 3.28]} />
          <meshStandardMaterial color="#8c6d3c" metalness={0.88} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.49, 0]}>
          <boxGeometry args={[6.56, 0.09, 3.24]} />
          <meshStandardMaterial color="#8c6d3c" metalness={0.88} roughness={0.24} />
        </mesh>

        {/* Front illuminated backlit signboard */}
        <mesh position={[0, 0, 1.56]}>
          <planeGeometry args={[5.85, 0.72]} />
          <meshStandardMaterial
            map={frontMarquee}
            emissive="#e8cc93"
            emissiveMap={frontMarquee}
            emissiveIntensity={0.56}
            roughness={0.55}
          />
        </mesh>

        {/* Left & Right side marquee signboards (visible in 3/4 view!) */}
        <mesh position={[-3.21, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.7, 0.72]} />
          <meshStandardMaterial
            map={sideMarquee}
            emissive="#e8cc93"
            emissiveMap={sideMarquee}
            emissiveIntensity={0.52}
            roughness={0.55}
          />
        </mesh>
        <mesh position={[3.21, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.7, 0.72]} />
          <meshStandardMaterial
            map={sideMarquee}
            emissive="#e8cc93"
            emissiveMap={sideMarquee}
            emissiveIntensity={0.52}
            roughness={0.55}
          />
        </mesh>

        {/* Warm recessed marquee rim bulbs along bottom edge */}
        {marqueeBulbs.map((bx) => (
          <mesh key={bx} position={[bx, -0.54, 1.56]}>
            <sphereGeometry args={[0.032, 10, 8]} />
            <meshBasicMaterial color="#ffebb8" toneMapped={false} />
          </mesh>
        ))}

        {/* Illuminated coffer soffit underneath canopy */}
        <mesh position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.4, 2.3]} />
          <meshStandardMaterial
            color="#2b2013"
            emissive="#f0be74"
            emissiveIntensity={0.35}
            roughness={0.5}
          />
        </mesh>

        {/* Canopy downward lighting onto steps and pavement */}
        <pointLight position={[0, -0.65, 0.85]} color="#f4c780" intensity={7} distance={9} decay={2} />
        <pointLight position={[0, -0.65, 2.1]} color="#f4ca88" intensity={3.5} distance={7} decay={2} />

        {/* Architectural diagonal tie-rods suspending canopy */}
        {[-2.85, 2.85].map((rx) => (
          <group key={rx} position={[rx, 1.15, 0.05]} rotation={[-0.78, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.024, 0.024, 2.55, 8]} />
              <meshStandardMaterial color="#8c6d3c" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function EntranceCamera({ entering }: { entering: boolean }) {
  const smoothPointer = useRef(new THREE.Vector2());
  const enterProgress = useRef(0);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((state, delta) => {
    const cam = state.camera;
    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;

    smoothPointer.current.x = THREE.MathUtils.damp(smoothPointer.current.x, pointerX, 3.2, delta);
    smoothPointer.current.y = THREE.MathUtils.damp(smoothPointer.current.y, pointerY, 3.2, delta);

    if (entering && !reducedMotion) {
      enterProgress.current = Math.min(1, enterProgress.current + delta * 1.4);
    } else {
      enterProgress.current = Math.max(0, enterProgress.current - delta * 2.0);
    }

    const e = enterProgress.current;
    const ease = e * e * (3 - 2 * e);

    // 3/4 street-level architectural elevation framing building crown, marquee, poster vitrines & steps
    const basePos = new THREE.Vector3(-4.45, 2.25, 13.8);
    const enterPos = new THREE.Vector3(0.0, 1.85, 4.2);
    const pos = basePos.lerp(enterPos, ease);
    pos.x += smoothPointer.current.x * 0.36;
    pos.y += smoothPointer.current.y * 0.14;

    const baseLook = new THREE.Vector3(0.2, 3.85, 0.15);
    const enterLook = new THREE.Vector3(0.0, 2.2, -1.6);
    const look = baseLook.lerp(enterLook, ease);
    look.x += smoothPointer.current.x * 0.18;
    look.y += smoothPointer.current.y * 0.1;

    cam.position.lerp(pos, 1 - Math.exp(-5 * delta));
    cam.lookAt(look);
  });

  return null;
}

export default function TheatreEntranceScene({ entering = false }: TheatreEntranceSceneProps) {
  const [dpr, setDpr] = useState(1.25);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [-4.45, 2.25, 13.8], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        fallback={<div className="scene-gl-fallback" />}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
          gl.setClearColor("#090b10");
        }}
      >
        <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(0.95)}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          <color attach="background" args={["#090b10"]} />
          <fog attach="fog" args={["#090b10", 13, 30]} />

          {/* Moonlight cool key + architectural warm fill */}
          <ambientLight intensity={0.28} color="#96a8c6" />
          <hemisphereLight args={["#6e83a4", "#1b140f", 0.42]} />
          <directionalLight position={[-10, 14, 12]} intensity={1.35} color="#b4c8e6" />
          <directionalLight position={[8, 6, 10]} intensity={0.55} color="#f1ca8b" />

          <Suspense fallback={null}>
            <Environment resolution={64}>
              <Lightformer form="rect" color="#8aa2c4" intensity={0.9} scale={[12, 6]} position={[-8, 9, 10]} />
              <Lightformer form="rect" color="#f0c783" intensity={1.1} scale={[8, 3]} position={[0, 4, 8]} />
            </Environment>
          </Suspense>

          <EntranceCamera entering={entering} />
          <TheatreBuilding entering={entering} />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.42}
              luminanceThreshold={0.78}
              luminanceSmoothing={0.22}
              mipmapBlur
              radius={0.65}
            />
            <Vignette offset={0.22} darkness={0.62} eskil={false} />
          </EffectComposer>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
