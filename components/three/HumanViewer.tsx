"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Sparkles,
  ContactShadows,
  PerformanceMonitor,
  AdaptiveDpr,
  AdaptiveEvents,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { HumanModelMetadata } from "@/lib/data/humanModels";
import HumanModel from "./HumanModel";
import { AvatarConfig } from "@/components/dashboard/types";
import { AnimationActionState } from "@/lib/animationController";
import { ViewerErrorBoundary, ViewerLoadingFallback } from "./ViewerBoundary";

interface HumanViewerProps {
  selectedModel: HumanModelMetadata;
  activeAnimation?: AnimationActionState;
  ikEnabled?: boolean;
  isSpinning?: boolean;
  manualAngle?: number;
  isFaceFocus?: boolean;
  className?: string;
  onDprChange?: (dpr: number) => void;
  config?: AvatarConfig;
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
    const targetZ = isFaceFocus ? 1.15 : 3.25;
    const targetX = isInteractive ? mousePos.x * 0.12 : 0;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);

    const lookTargetY = isFaceFocus ? -0.02 : -0.34;
    state.camera.lookAt(0, lookTargetY, 0);
  });

  return null;
}

function TurntableStage({
  children,
  mousePos = { x: 0, y: 0 },
  isSpinning = false,
  manualAngle,
  reducedMotion = false,
}: {
  children: React.ReactNode;
  mousePos?: { x: number; y: number };
  isSpinning?: boolean;
  manualAngle?: number;
  reducedMotion?: boolean;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const turntableRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = reducedMotion ? 0 : Math.sin(t * 1.5) * 0.012;
    }

    if (turntableRef.current) {
      if (manualAngle !== undefined) {
        turntableRef.current.rotation.y = THREE.MathUtils.lerp(
          turntableRef.current.rotation.y,
          manualAngle,
          0.10
        );
      } else if (isSpinning && !reducedMotion) {
        turntableRef.current.rotation.y += delta * 0.65;
      } else if (!reducedMotion) {
        const targetRotY = mousePos.x * 0.20;
        turntableRef.current.rotation.y = THREE.MathUtils.lerp(
          turntableRef.current.rotation.y,
          targetRotY,
          0.05
        );
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      <group position={[0, -1.62, 0]}>
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.82}
          scale={2.4}
          blur={1.8}
          far={1.4}
          resolution={512}
          color="#000000"
        />

        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 64]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mirror={0.45}
            mixBlur={1}
            mixStrength={45}
            roughness={0.25}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#08070c"
            metalness={0.88}
          />
        </mesh>

        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[1.05, 1.12, 0.08, 64]} />
          <meshStandardMaterial color="#08070b" roughness={0.3} metalness={0.85} />
        </mesh>

        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.016, 16, 64]} />
          <meshStandardMaterial
            color="#e3c995"
            emissive="#c9a86a"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group ref={turntableRef} position={[0, 0, 0]}>
        {children}

        <pointLight position={[0, -1.3, 0.6]} intensity={2.6} color="#c9a86a" distance={4.2} decay={2} />
        <pointLight position={[0, 0.6, -1.4]} intensity={4.8} color="#e3c995" distance={5.5} decay={2} />
        <pointLight position={[0, -0.1, 1.3]} intensity={2.8} color="#fffaf0" distance={3.5} decay={2} />
        <directionalLight position={[0.3, 0.9, 2.2]} intensity={2.6} color="#fffef6" castShadow />
      </group>
    </group>
  );
}

export default function HumanViewer({
  selectedModel,
  activeAnimation = "idle",
  ikEnabled = true,
  isSpinning = false,
  manualAngle,
  isFaceFocus = false,
  className = "w-full h-full",
  onDprChange,
  config,
}: HumanViewerProps) {
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
    if (reducedMotion) return;
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

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
      <ViewerErrorBoundary label="3D character studio could not initialize WebGL.">
        <Suspense fallback={<ViewerLoadingFallback message="Loading 3D character…" />}>
          <Canvas
            dpr={dpr}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
            camera={{ position: [0, -0.34, 3.25], fov: 38, near: 0.1, far: 25 }}
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
                isInteractive={!isSpinning && !reducedMotion && manualAngle === undefined}
              />

              <ambientLight intensity={1.8} color="#fff6ee" />
              <spotLight position={[0, 4.8, 2.2]} angle={0.45} penumbra={0.7} intensity={3.5} color="#fffdf8" decay={2} />
              <directionalLight position={[2.8, 3.4, 3.6]} intensity={3.0} color="#fffdf8" castShadow />
              <pointLight position={[0, 0.75, 2.0]} intensity={2.6} color="#fffef9" distance={5.5} decay={2} />
              <pointLight position={[-2.4, 0.2, 1.8]} intensity={1.6} color="#ede3d5" distance={8} decay={2} />
              <pointLight position={[0, 1.8, -2.6]} intensity={5.2} color="#f0d8a8" distance={10} decay={2} />

              <Sparkles
                count={reducedMotion ? 0 : 28}
                scale={[3.2, 4.2, 3.2]}
                size={2.2}
                speed={reducedMotion ? 0 : 0.35}
                color="#e3c995"
                opacity={0.55}
              />

              <TurntableStage
                mousePos={mousePos}
                isSpinning={isSpinning}
                manualAngle={manualAngle}
                reducedMotion={reducedMotion}
              >
                <HumanModel
                  model={selectedModel}
                  activeAnimation={activeAnimation}
                  mousePos={mousePos}
                  ikEnabled={ikEnabled && !reducedMotion}
                  config={config}
                />
              </TurntableStage>

              <EffectComposer multisampling={4}>
                <Bloom luminanceThreshold={0.72} luminanceSmoothing={0.35} intensity={1.1} mipmapBlur />
                <Vignette eskil={false} offset={0.18} darkness={0.7} />
              </EffectComposer>
            </PerformanceMonitor>
          </Canvas>
        </Suspense>
      </ViewerErrorBoundary>
    </div>
  );
}
