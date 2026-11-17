"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface HeroCinemaSceneProps {
  currentThemeColor?: string;
  activeFilmTitle?: string;
  mousePos?: { x: number; y: number };
  scrollProgress?: number;
}

export default function HeroCinemaScene({
  currentThemeColor = "#e7c28a",
  activeFilmTitle = "NOCTURNE · SCREEN 04",
  mousePos = { x: 0, y: 0 },
  scrollProgress = 0,
}: HeroCinemaSceneProps) {
  const screenMeshRef = useRef<THREE.Mesh>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const curtainLRef = useRef<THREE.Mesh>(null);
  const curtainRRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const projectorBeamRef = useRef<THREE.Mesh>(null);
  const aisleLightsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // Generate seats in orchestra
  const seatPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const rows = 6;
    const cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const aisleGap = c >= 4 ? 0.8 : -0.8;
        const x = (c - (cols - 1) / 2) * 1.08 + aisleGap * 0.45;
        const z = -2.2 + r * 2.3;
        positions.push(new THREE.Vector3(x, 0.45, z));
      }
    }
    return positions;
  }, []);

  // Generate 240 floating dust particles in projector beam
  const particlePositions = useMemo(() => {
    const count = 240;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = 0.4 + Math.random() * 8.8;
      arr[i * 3 + 2] = -12 + Math.random() * 24;
    }
    return arr;
  }, []);

  // Generate golden aisle step guide lights along the center carpet
  const aisleLightPositions = useMemo(() => {
    const count = 20;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const z = -3.5 + i * 1.3;
      const side = i % 2 === 0 ? -0.8 : 0.8;
      arr[i * 3] = side;
      arr[i * 3 + 1] = 0.04;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Setup dynamic screen canvas texture
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 576;
    screenCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    screenTextureRef.current = texture;

    if (screenMeshRef.current) {
      screenMeshRef.current.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.98,
      });
    }

    return () => {
      texture.dispose();
    };
  }, []);

  const renderScreen = () => {
    const canvas = screenCanvasRef.current;
    const texture = screenTextureRef.current;
    if (!canvas || !texture) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = timeRef.current;

    // Atmospheric gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#08090d");
    bg.addColorStop(0.5, "#15110d");
    bg.addColorStop(1, "#070709");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Dynamic glow center
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.48);
    glow.addColorStop(0, "rgba(231, 194, 138, 0.28)");
    glow.addColorStop(0.45, "rgba(180, 130, 70, 0.12)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Frame border
    ctx.strokeStyle = "rgba(201, 168, 106, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Inner thin border
    ctx.strokeStyle = "rgba(201, 168, 106, 0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, w - 92, h - 92);

    // Top Header label
    ctx.textAlign = "center";
    ctx.fillStyle = "#c9a86a";
    ctx.font = "600 16px 'Manrope', Arial, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("NOCTURNE · PRIVATE CINEMA · SCREEN 04", w / 2, 90);

    // Live Rolling Timecode
    const totalFrames = Math.floor(t * 24);
    const frames = totalFrames % 24;
    const secs = Math.floor(t) % 60;
    const mins = Math.floor(t / 60) % 60;
    const tc = `TC  01:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
    ctx.fillStyle = "rgba(201, 168, 106, 0.7)";
    ctx.font = "400 13px 'Courier New', monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText(tc, w / 2, 125);

    // Format Watermarks
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(241, 233, 219, 0.4)";
    ctx.font = "500 12px 'Manrope', Arial, sans-serif";
    ctx.fillText("2.39:1 CINEMASCOPE · 4K HDR", 60, h - 60);

    ctx.textAlign = "right";
    ctx.fillText("DOLBY ATMOS · 24 SEATS", w - 60, h - 60);

    // Main Film Title
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(241, 233, 219, 0.98)";
    ctx.font = "italic 400 52px 'Cormorant Garamond', Georgia, serif";
    ctx.letterSpacing = "1.5px";
    ctx.fillText(activeFilmTitle, w / 2, h / 2 + 10);

    // Subtitle
    ctx.fillStyle = "rgba(201, 168, 106, 0.85)";
    ctx.font = "400 15px 'Manrope', Arial, sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("YOUR PRIVATE PREMIERE IS READY", w / 2, h / 2 + 65);

    // Projector scanline
    const scanlineY = (t * 85) % h;
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(0, scanlineY, w, 4);

    texture.needsUpdate = true;
  };

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (Math.floor(timeRef.current * 24) !== Math.floor((timeRef.current - delta) * 24)) {
      renderScreen();
    }

    // Scroll-driven camera glide down the theatre aisle:
    // When scrollProgress goes from 0 to 1, the camera glides from z=18.5 to z=5.2
    const clampedScroll = Math.min(1, Math.max(0, scrollProgress * 2.8));
    const targetZ = THREE.MathUtils.lerp(18.5, 4.8, clampedScroll);
    const targetY = THREE.MathUtils.lerp(1.7, 1.35, clampedScroll) - mousePos.y * 0.35 + Math.sin(timeRef.current * 0.5) * 0.03;
    const targetX = mousePos.x * 0.65;

    const cam = state.camera;
    cam.position.x += (targetX - cam.position.x) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.06;
    cam.lookAt(mousePos.x * 0.18, 4.72, -12.5);

    // Curtains breathe
    if (curtainLRef.current) {
      curtainLRef.current.position.x = -8.2 + Math.sin(timeRef.current * 0.3) * 0.06;
      curtainLRef.current.rotation.y = Math.sin(timeRef.current * 0.25) * 0.035;
    }
    if (curtainRRef.current) {
      curtainRRef.current.position.x = 8.2 - Math.sin(timeRef.current * 0.3 + 0.4) * 0.06;
      curtainRRef.current.rotation.y = -Math.sin(timeRef.current * 0.25 + 0.4) * 0.035;
    }

    // Projector light beam breathing
    if (projectorBeamRef.current) {
      const beamMat = projectorBeamRef.current.material as THREE.MeshBasicMaterial;
      if (beamMat) {
        beamMat.opacity = 0.01 + Math.sin(timeRef.current * 1.9) * 0.004;
      }
    }

    // Particles swirl in beam
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * 0.03;
        positions[i] += Math.sin(timeRef.current * 0.6 + i) * delta * 0.02;
        if (positions[i + 1] > 8.8) {
          positions[i + 1] = 0.4;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#050506"]} />

      <ambientLight intensity={0.45} color="#f0d5b0" />

      {/* Projector spot hitting the screen */}
      <spotLight
        position={[0, 8.8, 6]}
        target-position={[0, 4.72, -12.5]}
        intensity={3.2}
        angle={0.75}
        penumbra={0.6}
        color={currentThemeColor}
        distance={38}
      />

      {/* Golden screen rim light */}
      <pointLight position={[0, 4.72, -12]} intensity={1.5} distance={20} color="#e7c28a" />

      {/* Sconces on left and right walls */}
      <pointLight position={[-9, 4, 2]} intensity={0.8} distance={8} color="#f5c270" />
      <pointLight position={[9, 4, 2]} intensity={0.8} distance={8} color="#f5c270" />
      <pointLight position={[-9, 4, 8]} intensity={0.8} distance={8} color="#f5c270" />
      <pointLight position={[9, 4, 8]} intensity={0.8} distance={8} color="#f5c270" />

      {/* The 2.39:1 Cinema Screen */}
      <mesh ref={screenMeshRef} position={[0, 4.72, -12.52]} scale={[14.4, 8.1, 1]}>
        <planeGeometry />
      </mesh>

      {/* Luxury gold screen border frame */}
      <group position={[0, 4.72, -12.4]}>
        <mesh position={[0, 8.1 / 2 + 0.06, 0.04]}>
          <boxGeometry args={[14.65, 0.12, 0.16]} />
          <meshStandardMaterial color="#9b7a42" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[0, -8.1 / 2 - 0.06, 0.04]}>
          <boxGeometry args={[14.65, 0.12, 0.16]} />
          <meshStandardMaterial color="#9b7a42" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[-14.4 / 2 - 0.06, 0, 0.04]}>
          <boxGeometry args={[0.12, 8.34, 0.16]} />
          <meshStandardMaterial color="#9b7a42" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[14.4 / 2 + 0.06, 0, 0.04]}>
          <boxGeometry args={[0.12, 8.34, 0.16]} />
          <meshStandardMaterial color="#9b7a42" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>

      {/* Pleated Velvet Curtains */}
      <mesh ref={curtainLRef} position={[-8.3, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={curtainRRef} position={[8.3, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Velvet Seats in Orchestra */}
      {seatPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.84, 0.15, 0.7]} />
            <meshStandardMaterial color="#240c11" roughness={0.82} metalness={0.06} />
          </mesh>
          <mesh position={[0, 0.44, -0.28]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.82, 0.74, 0.14]} />
            <meshStandardMaterial color="#220b10" roughness={0.82} metalness={0.06} />
          </mesh>
          <mesh position={[0.43, 0.08, 0.2]}>
            <boxGeometry args={[0.04, 0.06, 0.12]} />
            <meshBasicMaterial color="#c9a86a" />
          </mesh>
        </group>
      ))}

      {/* Reflective acoustic floor */}
      <mesh position={[0, -0.02, 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 44]} />
        <meshStandardMaterial color="#050507" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Aisle Step LED Guide Lights */}
      <points ref={aisleLightsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[aisleLightPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          color="#c9a86a"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Volumetric Projector Light Cone */}
      <mesh
        ref={projectorBeamRef}
        position={[0, 8.2, 2.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[8.2, 24, 32, 1, true]} />
        <meshBasicMaterial
          color={currentThemeColor}
          transparent
          opacity={0.012}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cinematic Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#f4d9a6"
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
