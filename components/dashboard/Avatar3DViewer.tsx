"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Sparkles,
  ContactShadows,
  PerformanceMonitor,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import Avatar3DCharacter from "./Avatar3DCharacter";
import { AvatarConfig } from "./types";
import { AnimationActionState } from "@/lib/animationController";
import { ViewerErrorBoundary, ViewerLoadingFallback } from "@/components/three/ViewerBoundary";

interface Avatar3DViewerProps {
  config: AvatarConfig;
  className?: string;
  isInteractive?: boolean;
  isSpinning?: boolean;
  fov?: number;
  manualAngle?: number;
  isFaceFocus?: boolean;
  activeAnimation?: AnimationActionState;
  ikEnabled?: boolean;
  onDprChange?: (dpr: number) => void;
}

function CameraRig({
  isFaceFocus = false,
  mousePos = { x: 0, y: 0 },
  isInteractive = true,
}: {
  isFaceFocus?: boolean;
  mousePos?: { x: number; y: number };
  isInteractive?: boolean;
}) {
  useFrame((state) => {
    const targetY = isFaceFocus ? -0.02 : -0.34;
    const targetZ = isFaceFocus ? 1.15 : 3.45;
    const targetX = isInteractive ? mousePos.x * 0.12 : 0;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);

    const lookTargetY = isFaceFocus ? -0.02 : -0.34;
    state.camera.lookAt(0, lookTargetY, 0);
  });

  return null;
}

export default function Avatar3DViewer({
  config,
  className = "w-full h-full",
  isInteractive = true,
  isSpinning = false,
  fov = 42,
  manualAngle,
  isFaceFocus = false,
  activeAnimation = "idle",
  ikEnabled = true,
  onDprChange,
}: Avatar3DViewerProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1.5);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isInteractive || reducedMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isInteractive, reducedMotion]);

  const handleIncline = () => {
    const targetDpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1.5, 2.0);
    setDpr(targetDpr);
    onDprChange?.(targetDpr);
  };

  const handleDecline = () => {
    setDpr(1.0);
    onDprChange?.(1.0);
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <ViewerErrorBoundary label="3D character preview could not initialize WebGL.">
        <Suspense fallback={<ViewerLoadingFallback message="Loading 3D character…" />}>
          <Canvas
            dpr={dpr}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
            }}
            camera={{
              position: [0, -0.34, 3.45],
              fov: fov,
              near: 0.1,
              far: 25,
            }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.25;
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <PerformanceMonitor onIncline={handleIncline} onDecline={handleDecline}>
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />

              <CameraRig
                isFaceFocus={isFaceFocus}
                mousePos={mousePos}
                isInteractive={isInteractive && !isSpinning && !reducedMotion && manualAngle === undefined}
              />

              <ambientLight intensity={1.8} color="#fff6ee" />
              <spotLight
                position={[0, 4.8, 2.2]}
                angle={0.45}
                penumbra={0.7}
                intensity={3.5}
                color="#fffdf8"
                decay={2}
              />
              <directionalLight
                position={[2.8, 3.4, 3.6]}
                intensity={3.0}
                color="#fffdf8"
                castShadow
              />
              <pointLight position={[0, 0.75, 2.0]} intensity={2.6} color="#fffef9" distance={5.5} decay={2} />
              <pointLight position={[-2.4, 0.2, 1.8]} intensity={1.6} color="#ede3d5" distance={8} decay={2} />
              <pointLight position={[0, 1.8, -2.6]} intensity={5.2} color="#f0d8a8" distance={10} decay={2} />
              <pointLight
                position={[0, -1.8, 1.2]}
                intensity={2.2}
                color={config.outfitColor || "#c9a86a"}
                distance={5}
                decay={2}
              />

              <Sparkles
                count={reducedMotion ? 0 : 28}
                scale={[3.2, 4.2, 3.2]}
                size={2.2}
                speed={reducedMotion ? 0 : 0.35}
                color="#e3c995"
                opacity={0.55}
              />

              <ContactShadows
                position={[0, -1.68, 0]}
                opacity={0.7}
                scale={3.6}
                blur={1.8}
                far={3.5}
                color="#000000"
              />

              <Avatar3DCharacter
                config={config}
                mousePos={mousePos}
                isSpinning={isSpinning && !reducedMotion}
                manualAngle={manualAngle}
                activeAnimation={activeAnimation}
                ikEnabled={ikEnabled && !reducedMotion}
              />

              <EffectComposer multisampling={4}>
                <Bloom
                  luminanceThreshold={0.72}
                  luminanceSmoothing={0.35}
                  intensity={1.1}
                  mipmapBlur
                />
                <Vignette eskil={false} offset={0.18} darkness={0.7} />
              </EffectComposer>
            </PerformanceMonitor>
          </Canvas>
        </Suspense>
      </ViewerErrorBoundary>
    </div>
  );
}
