"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Avatar3DCharacter from "./Avatar3DCharacter";
import { AvatarConfig } from "./types";

interface Avatar3DViewerProps {
  config: AvatarConfig;
  className?: string;
  isInteractive?: boolean;
  isSpinning?: boolean;
  fov?: number;
}

export default function Avatar3DViewer({
  config,
  className = "w-full h-full",
  isInteractive = true,
  isSpinning = false,
  fov = 38,
}: Avatar3DViewerProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isInteractive) return;

    const handlePointerMove = (e: MouseEvent) => {
      // Normalize mouse to [-1, 1] relative to window center
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isInteractive]);

  return (
    <div className={`relative ${className} select-none`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{
          position: [0, -0.32, 4.4],
          fov: fov,
          near: 0.1,
          far: 25,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        {/* Cinema Warm Ambient Base */}
        <ambientLight intensity={1.2} color="#261e18" />

        {/* Projector Key Light (Crisp Warm White) */}
        <directionalLight position={[2, 3, 3]} intensity={2.4} color="#fffbf2" />

        {/* Fill Light (Warm Bone / Soft Amber) */}
        <pointLight position={[-2, -1, 1.5]} intensity={1.2} color="#cfc4b3" distance={8} />

        {/* Champagne Gold Rim Light */}
        <pointLight position={[0, 1.5, -2.5]} intensity={4.5} color="#e3c995" distance={10} />

        {/* Floor Glow Accent (Warm Gold) */}
        <pointLight position={[0, -1.8, 1]} intensity={1.6} color="#c9a86a" distance={5} />

        {/* Character Mesh */}
        <Avatar3DCharacter
          config={config}
          mousePos={mousePos}
          isSpinning={isSpinning}
        />
      </Canvas>
    </div>
  );
}
