"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, MeshReflectorMaterial, ContactShadows } from "@react-three/drei";
import { MeshoptDecoder } from "three-stdlib";
import { AvatarConfig } from "./types";
import {
  AnimationActionState,
  AnimationStateManager,
  buildCharacterClips,
} from "@/lib/animationController";
import { ProceduralIKSolver, IKBoneReferences } from "@/lib/ikSolver";

interface Avatar3DCharacterProps {
  config: AvatarConfig;
  mousePos?: { x: number; y: number };
  isSpinning?: boolean;
  manualAngle?: number;
  activeAnimation?: AnimationActionState;
  ikEnabled?: boolean;
}

const MICHELLE_MODEL_PATH = "/characters/michelle.meshopt.glb";
const BOY_MODEL_PATH = "/characters/readyplayer.me.meshopt.glb";
const SOLDIER_MODEL_PATH = "/characters/soldier.meshopt.glb";

// Pre-register MeshoptDecoder with GLTFLoader for glTF Transform compressed assets
useGLTF.preload(MICHELLE_MODEL_PATH, false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useGLTF.preload(BOY_MODEL_PATH, false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useGLTF.preload(SOLDIER_MODEL_PATH, false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useTexture.preload("/characters/michelle_luxury_diffuse.png");

// =====================================================================
// 1. FEMALE 3D GLB MODEL (Aria Vance / Michelle - Haute Couture Director)
// =====================================================================
function MichelleGLBModel({
  soldierAnimations,
  activeAnimation = "idle",
  mousePos = { x: 0, y: 0 },
  ikEnabled = true,
}: {
  soldierAnimations: THREE.AnimationClip[];
  activeAnimation?: AnimationActionState;
  mousePos?: { x: number; y: number };
  ikEnabled?: boolean;
}) {
  const gltf = useGLTF(MICHELLE_MODEL_PATH, false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const luxuryTexture = useTexture("/characters/michelle_luxury_diffuse.png");
  luxuryTexture.colorSpace = THREE.SRGBColorSpace;
  luxuryTexture.flipY = false;

  const animManagerRef = useRef<AnimationStateManager | null>(null);
  const ikSolverRef = useRef<ProceduralIKSolver>(new ProceduralIKSolver());
  const bonesRef = useRef<IKBoneReferences>({});

  // Build full animation clip set with Samba Dance as Director Pose
  const clips = useMemo(() => {
    const dance = gltf.animations.find((a) => a.name === "SambaDance");
    return buildCharacterClips(gltf.scene, false, dance);
  }, [gltf.scene, gltf.animations]);

  // Initialize AnimationMixer and discover IK bones
  useEffect(() => {
    if (!gltf.scene) return;

    bonesRef.current = ProceduralIKSolver.discoverBones(gltf.scene);
    ikSolverRef.current.registerBones(bonesRef.current);
    const manager = new AnimationStateManager(gltf.scene, clips);
    manager.play(activeAnimation, 0.4);
    animManagerRef.current = manager;

    return () => {
      manager.dispose();
    };
  }, [gltf.scene, clips]);

  // Handle crossfade between animation states
  useEffect(() => {
    animManagerRef.current?.play(activeAnimation, 0.45);
  }, [activeAnimation]);

  // Upscale materials with PBR physical properties
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        const mat = new THREE.MeshPhysicalMaterial({
          map: luxuryTexture,
          metalness: 0.08,
          roughness: 0.35,
          clearcoat: 0.22,
          clearcoatRoughness: 0.15,
          sheen: 0.5,
          sheenRoughness: 0.4,
          sheenColor: new THREE.Color("#e3c995"),
          reflectivity: 0.4,
        });
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene, luxuryTexture]);

  // Animation and procedural IK pass
  useFrame((state, delta) => {
    // 1. Advance skeletal animation mixer
    animManagerRef.current?.update(delta);

    // 2. Procedural IK Look-At pass
    ikSolverRef.current.update(
      bonesRef.current,
      mousePos,
      state.clock.getElapsedTime(),
      delta,
      ikEnabled
    );
  });

  return (
    <group position={[0, -1.60, 0]} scale={[1.16, 1.16, 1.16]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// =====================================================================
// 2. MALE 3D GLB MODEL (Alex Vance - Haute Couture Cinematographer)
// =====================================================================
function HumanBoyGLBModel({
  soldierAnimations,
  activeAnimation = "idle",
  mousePos = { x: 0, y: 0 },
  ikEnabled = true,
  config,
}: {
  soldierAnimations: THREE.AnimationClip[];
  activeAnimation?: AnimationActionState;
  mousePos?: { x: number; y: number };
  ikEnabled?: boolean;
  config: AvatarConfig;
}) {
  const gltf = useGLTF(BOY_MODEL_PATH, false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const animManagerRef = useRef<AnimationStateManager | null>(null);
  const ikSolverRef = useRef<ProceduralIKSolver>(new ProceduralIKSolver());
  const bonesRef = useRef<IKBoneReferences>({});

  // Build full animation clip set for ReadyPlayerMe skeleton
  const clips = useMemo(() => {
    return buildCharacterClips(gltf.scene, true);
  }, [gltf.scene]);

  // Initialize AnimationMixer and discover IK bones
  useEffect(() => {
    if (!gltf.scene) return;

    bonesRef.current = ProceduralIKSolver.discoverBones(gltf.scene);
    ikSolverRef.current.registerBones(bonesRef.current);
    const manager = new AnimationStateManager(gltf.scene, clips);
    manager.play(activeAnimation, 0.4);
    animManagerRef.current = manager;

    return () => {
      manager.dispose();
    };
  }, [gltf.scene, clips]);

  // Handle crossfade between animation states
  useEffect(() => {
    animManagerRef.current?.play(activeAnimation, 0.45);
  }, [activeAnimation]);

  // Upscale materials with PBR physical properties and custom styling
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        const matName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : mesh.material?.name;

        // Eye Material Upscaling (glossy iris/cornea reflection)
        if (matName?.includes("Eye")) {
          const eyeMat = new THREE.MeshPhysicalMaterial({
            color: config.eyeColor || "#5078a0",
            roughness: 0.05,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            reflectivity: 0.8,
          });
          mesh.material = eyeMat;
        }

        // Tuxedo / Outfit Top (Velvet sheen & luxury dark fabric)
        else if (matName?.includes("Outfit_Top") || matName?.includes("Outfit")) {
          const outfitMat = new THREE.MeshPhysicalMaterial({
            color: config.outfitColor || "#121017",
            roughness: 0.48,
            metalness: 0.05,
            sheen: 0.85,
            sheenRoughness: 0.35,
            sheenColor: new THREE.Color("#c9a86a"),
          });
          mesh.material = outfitMat;
        }

        // Skin Finish
        else if (matName?.includes("Skin") || matName?.includes("Head")) {
          const skinMat = new THREE.MeshStandardMaterial({
            color: config.skinTone || "#d8a47f",
            roughness: 0.42,
            metalness: 0.02,
          });
          mesh.material = skinMat;
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene, config]);

  // Animation and procedural IK pass
  useFrame((state, delta) => {
    // 1. Advance skeletal animation mixer
    animManagerRef.current?.update(delta);

    // 2. Procedural IK Look-At pass
    ikSolverRef.current.update(
      bonesRef.current,
      mousePos,
      state.clock.getElapsedTime(),
      delta,
      ikEnabled
    );
  });

  return (
    <group position={[0, -1.60, 0]} scale={[1.05, 1.05, 1.05]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// =====================================================================
// 2.5 ANATOMICAL HUMAN FIGURE (Skeletal & Muscular System Study)
// =====================================================================
function AnatomicalHumanMesh() {
  const gltf = useGLTF("/models/humans/anatomical-human.glb");

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        if (name.includes("bone") || name.includes("cranium") || name.includes("skeleton")) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#e8dfd1",
            roughness: 0.38,
            metalness: 0.15,
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#6b1d28",
            roughness: 0.52,
            metalness: 0.08,
          });
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene]);

  return (
    <group position={[0, -1.60, 0]} scale={[1.0, 1.0, 1.0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// =====================================================================
// 3. MAIN COMPONENT: 3D Studio Stage & Character Engine
// =====================================================================
export default function Avatar3DCharacter({
  config,
  mousePos = { x: 0, y: 0 },
  isSpinning = false,
  manualAngle,
  activeAnimation = "idle",
  ikEnabled = true,
}: Avatar3DCharacterProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const turntableRef = useRef<THREE.Group>(null);

  const soldierGLTF = useGLTF(SOLDIER_MODEL_PATH, false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const isGirl = config.modelBase === "girl";

  // Turntable rotation and interactive parallax
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = reduceMotion ? 0 : Math.sin(t * 1.5) * 0.012;
    }

    if (turntableRef.current) {
      if (manualAngle !== undefined) {
        turntableRef.current.rotation.y = THREE.MathUtils.lerp(
          turntableRef.current.rotation.y,
          manualAngle,
          0.10
        );
      } else if (isSpinning && !reduceMotion) {
        turntableRef.current.rotation.y += delta * 0.65;
      } else if (!reduceMotion) {
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
      {/* ============================================================ */}
      {/* 0. LUXURY OBSIDIAN TURNTABLE STAGE                           */}
      {/* ============================================================ */}
      <group position={[0, -1.62, 0]}>
        {/* Soft Contact Shadow anchoring character feet */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.82}
          scale={2.4}
          blur={1.8}
          far={1.4}
          resolution={512}
          color="#000000"
        />

        {/* Polished Obsidian Mirror Disc */}
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

        {/* Outer Obsidian Beveled Rim */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[1.05, 1.12, 0.08, 64]} />
          <meshStandardMaterial color="#08070b" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Champagne Gold Glowing Halo Ring */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.016, 16, 64]} />
          <meshStandardMaterial
            color="#e3c995"
            emissive="#c9a86a"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>

        {/* Concentric Tech Marker Ring */}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.16, 1.175, 64]} />
          <meshStandardMaterial
            color="#c9a86a"
            emissive="#c9a86a"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 1. 3D RIGGED .GLB CHARACTER ON TURNTABLE                     */}
      {/* ============================================================ */}
      <group ref={turntableRef} position={[0, 0, 0]}>
        {config.modelBase === "anatomical" ? (
          <AnatomicalHumanMesh />
        ) : isGirl ? (
          <MichelleGLBModel
            soldierAnimations={soldierGLTF.animations}
            activeAnimation={activeAnimation}
            mousePos={mousePos}
            ikEnabled={ikEnabled}
          />
        ) : (
          <HumanBoyGLBModel
            soldierAnimations={soldierGLTF.animations}
            activeAnimation={activeAnimation}
            mousePos={mousePos}
            ikEnabled={ikEnabled}
            config={config}
          />
        )}

        {/* Dynamic Warm Stage Bounce Light */}
        <pointLight
          position={[0, -1.3, 0.6]}
          intensity={2.6}
          color="#c9a86a"
          distance={4.2}
          decay={2}
        />

        {/* Champagne Silhouette Rim Backlight */}
        <pointLight
          position={[0, 0.6, -1.4]}
          intensity={4.8}
          color="#e3c995"
          distance={5.5}
          decay={2}
        />

        {/* Soft Face Catchlight */}
        <pointLight
          position={[0, -0.1, 1.3]}
          intensity={2.8}
          color="#fffaf0"
          distance={3.5}
          decay={2}
        />

        {/* Dedicated Crisp Front Key Light */}
        <directionalLight
          position={[0.3, 0.9, 2.2]}
          intensity={2.6}
          color="#fffef6"
          castShadow
        />
      </group>
    </group>
  );
}
