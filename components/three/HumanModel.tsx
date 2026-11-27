"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { MeshoptDecoder } from "three-stdlib";
import { HumanModelMetadata } from "@/lib/data/humanModels";
import { AvatarConfig } from "@/components/dashboard/types";
import {
  AnimationActionState,
  AnimationStateManager,
  buildCharacterClips,
} from "@/lib/animationController";
import { ProceduralIKSolver, IKBoneReferences } from "@/lib/ikSolver";

interface HumanModelProps {
  model: HumanModelMetadata;
  activeAnimation?: AnimationActionState;
  mousePos?: { x: number; y: number };
  ikEnabled?: boolean;
  config?: AvatarConfig;
}

// Preload models
useGLTF.preload("/models/humans/male-human.glb", false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useGLTF.preload("/models/humans/female-human.glb", false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useGLTF.preload("/models/humans/anatomical-human.glb");
useGLTF.preload("/characters/soldier.glb");
useTexture.preload("/characters/michelle_luxury_diffuse.png");

// -------------------------------------------------------------------
// 1. REALISTIC MALE HUMAN COMPONENT (ReadyPlayerMe)
// -------------------------------------------------------------------
function MaleHumanMesh({
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
  config?: AvatarConfig;
}) {
  const gltf = useGLTF("/models/humans/male-human.glb", false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const animManagerRef = useRef<AnimationStateManager | null>(null);
  const ikSolverRef = useRef<ProceduralIKSolver>(new ProceduralIKSolver());
  const bonesRef = useRef<IKBoneReferences>({});

  const clips = useMemo(() => {
    return buildCharacterClips(gltf.scene, true);
  }, [gltf.scene]);

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

  useEffect(() => {
    animManagerRef.current?.play(activeAnimation, 0.45);
  }, [activeAnimation]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        const matName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : mesh.material?.name;

        if (matName?.includes("Eye")) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: config?.eyeColor || "#5078a0",
            roughness: 0.05,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            reflectivity: 0.8,
          });
        } else if (matName?.includes("Outfit_Top") || matName?.includes("Outfit")) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: config?.outfitColor || "#121017",
            roughness: 0.48,
            metalness: 0.05,
            sheen: 0.85,
            sheenRoughness: 0.35,
            sheenColor: new THREE.Color("#c9a86a"),
          });
        } else if (matName?.includes("Skin") || matName?.includes("Head")) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: config?.skinTone || "#d8a47f",
            roughness: 0.42,
            metalness: 0.02,
          });
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene, config]);

  useFrame((state, delta) => {
    animManagerRef.current?.update(delta);
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

// -------------------------------------------------------------------
// 2. REALISTIC FEMALE HUMAN COMPONENT (Aria Vance / Michelle)
// -------------------------------------------------------------------
function FemaleHumanMesh({
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
  const gltf = useGLTF("/models/humans/female-human.glb", false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const luxuryTexture = useTexture("/characters/michelle_luxury_diffuse.png");
  luxuryTexture.colorSpace = THREE.SRGBColorSpace;
  luxuryTexture.flipY = false;

  const animManagerRef = useRef<AnimationStateManager | null>(null);
  const ikSolverRef = useRef<ProceduralIKSolver>(new ProceduralIKSolver());
  const bonesRef = useRef<IKBoneReferences>({});

  const clips = useMemo(() => {
    const dance = gltf.animations.find((a) => a.name === "SambaDance");
    return buildCharacterClips(gltf.scene, false, dance);
  }, [gltf.scene, gltf.animations]);

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

  useEffect(() => {
    animManagerRef.current?.play(activeAnimation, 0.45);
  }, [activeAnimation]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.material = new THREE.MeshPhysicalMaterial({
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
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene, luxuryTexture]);

  useFrame((state, delta) => {
    animManagerRef.current?.update(delta);
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

// -------------------------------------------------------------------
// 3. ANATOMICAL HUMAN FIGURE (Skeletal & Muscular System Study)
// -------------------------------------------------------------------
function AnatomicalHumanMesh() {
  const gltf = useGLTF("/models/humans/anatomical-human.glb");

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        // Bone vs Muscle anatomical PBR shading
        if (name.includes("bone") || name.includes("cranium") || name.includes("skeleton")) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#e8dfd1", // ivory bone
            roughness: 0.38,
            metalness: 0.15,
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: "#6b1d28", // deep anatomical muscle crimson
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

// -------------------------------------------------------------------
// MAIN EXPORT: Dynamic Human Model Switcher
// -------------------------------------------------------------------
export default function HumanModel({
  model,
  activeAnimation = "idle",
  mousePos = { x: 0, y: 0 },
  ikEnabled = true,
  config,
}: HumanModelProps) {
  const soldierGLTF = useGLTF("/characters/soldier.glb");

  if (model.id === "male") {
    return (
      <MaleHumanMesh
        soldierAnimations={soldierGLTF.animations}
        activeAnimation={activeAnimation}
        mousePos={mousePos}
        ikEnabled={ikEnabled}
        config={config}
      />
    );
  }

  if (model.id === "female") {
    return (
      <FemaleHumanMesh
        soldierAnimations={soldierGLTF.animations}
        activeAnimation={activeAnimation}
        mousePos={mousePos}
        ikEnabled={ikEnabled}
      />
    );
  }

  return <AnatomicalHumanMesh />;
}
