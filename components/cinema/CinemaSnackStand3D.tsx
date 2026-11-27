import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { MeshoptDecoder, SkeletonUtils } from "three-stdlib";
import { ProceduralIKSolver, IKBoneReferences } from "@/lib/ikSolver";

const ATTENDANT_MODEL_PATH = "/characters/michelle.meshopt.glb";
const ATTENDANT_TEXTURE_PATH = "/characters/michelle_luxury_diffuse.png";

useGLTF.preload(ATTENDANT_MODEL_PATH, false, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useTexture.preload(ATTENDANT_TEXTURE_PATH);

function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Deterministic popcorn kernel mounds inside machine & buckets (no Math.random in render)
const MACHINE_POPCORN_KERNELS: Array<{ pos: [number, number, number]; r: number; tint: string }> = (() => {
  const items: Array<{ pos: [number, number, number]; r: number; tint: string }> = [];
  const colors = ["#f8e1a0", "#f4c96b", "#faecc2", "#ebb852"];
  for (let i = 0; i < 66; i++) {
    const layer = Math.floor(i / 17);
    const angle = (i * 2.39996) % (Math.PI * 2); // golden angle
    const radiusScale = ((i % 17) / 17) * 0.22;
    const x = Math.cos(angle) * radiusScale;
    const z = Math.sin(angle) * (radiusScale * 1.14);
    const moundPeak = Math.max(0, 1 - radiusScale / 0.24) * 0.16;
    const y = 0.03 + layer * 0.058 + moundPeak * 0.72;
    const r = 0.03 + ((i * 7) % 5) * 0.004;
    items.push({ pos: [x, y, z], r, tint: colors[i % colors.length] });
  }
  return items;
})();

const POPPING_KERNEL_SEEDS = Array.from({ length: 10 }, (_, i) => ({
  x: Math.cos(i * 1.9) * 0.14,
  z: Math.sin(i * 2.3) * 0.15,
  phase: i * 0.68,
  speed: 4.2 + (i % 4) * 0.7,
  height: 0.26 + (i % 3) * 0.12,
}));

const BUCKET_POPCORN_TOPPINGS: Array<{ pos: [number, number, number]; r: number }> = [
  { pos: [0, 0.015, 0], r: 0.034 },
  { pos: [-0.028, 0.006, 0.02], r: 0.028 },
  { pos: [0.028, 0.008, -0.018], r: 0.029 },
  { pos: [0.018, 0.004, 0.03], r: 0.026 },
  { pos: [-0.024, 0.004, -0.026], r: 0.027 },
  { pos: [0, 0.032, 0.008], r: 0.028 },
  { pos: [-0.012, 0.022, -0.014], r: 0.025 },
  { pos: [0.016, 0.022, 0.012], r: 0.024 },
];

interface AttendantRigBones {
  spine?: THREE.Object3D;
  spine1?: THREE.Object3D;
  spine2?: THREE.Object3D;
  leftArm?: THREE.Object3D;
  rightArm?: THREE.Object3D;
  leftForeArm?: THREE.Object3D;
  rightForeArm?: THREE.Object3D;
  bindQuats: Map<THREE.Object3D, THREE.Quaternion>;
}

/**
 * Animated 3D female snack-stand attendant using the existing rigged Michelle GLB model,
 * safely cloned with SkeletonUtils and posed directly via Bone references (avoiding Three.js
 * PropertyBinding's Mixamo colon sanitization issue that leaves tracks unbound in T-pose).
 */
const SnackAttendantLady = React.memo(function SnackAttendantLady({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const gltf = useGLTF(ATTENDANT_MODEL_PATH, false, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const diffuseTex = useTexture(ATTENDANT_TEXTURE_PATH);

  const clonedData = useMemo(() => {
    const tex = diffuseTex.clone();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    tex.needsUpdate = true;

    const clone = SkeletonUtils.clone(gltf.scene);
    const rig: AttendantRigBones = { bindQuats: new Map() };

    clone.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const normalMap = (origMat as THREE.MeshStandardMaterial | undefined)?.normalMap ?? null;
        mesh.frustumCulled = false;
        mesh.material = new THREE.MeshStandardMaterial({
          map: tex,
          normalMap,
          metalness: 0.06,
          roughness: 0.58,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }

      const name = child.name.toLowerCase();
      const register = (obj: THREE.Object3D) => {
        if (!rig.bindQuats.has(obj)) rig.bindQuats.set(obj, obj.quaternion.clone());
      };

      if (name === "mixamorig:spine" || name === "mixamorigspine") {
        rig.spine = child;
        register(child);
      } else if (name === "mixamorig:spine1" || name === "mixamorigspine1") {
        rig.spine1 = child;
        register(child);
      } else if (name === "mixamorig:spine2" || name === "mixamorigspine2") {
        rig.spine2 = child;
        register(child);
      } else if (name === "mixamorig:leftarm" || name === "mixamorigleftarm") {
        rig.leftArm = child;
        register(child);
      } else if (name === "mixamorig:rightarm" || name === "mixamorigrightarm") {
        rig.rightArm = child;
        register(child);
      } else if (name === "mixamorig:leftforearm" || name === "mixamorigleftforearm") {
        rig.leftForeArm = child;
        register(child);
      } else if (name === "mixamorig:rightforearm" || name === "mixamorigrightforearm") {
        rig.rightForeArm = child;
        register(child);
      }
    });

    return { clone, tex, rig };
  }, [gltf.scene, diffuseTex]);

  // Fit a sleek burgundy & champagne-gold Nocturne cinema apron onto her front torso (Spine1 is in cm scale)
  useEffect(() => {
    const spine1 = clonedData.rig.spine1;
    if (!spine1) return;

    const apronGroup = new THREE.Group();
    const apronMat = new THREE.MeshStandardMaterial({
      color: "#5c0f1b",
      roughness: 0.72,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: "#d4b270",
      roughness: 0.28,
      metalness: 0.78,
      side: THREE.DoubleSide,
    });

    // Main curved bib & waist apron panel hugging front torso
    const bodyGeo = new THREE.CylinderGeometry(10.6, 11.4, 34, 16, 1, true, -0.72, 1.44);
    const bodyMesh = new THREE.Mesh(bodyGeo, apronMat);
    bodyMesh.position.set(0, -1.5, 0.4);
    apronGroup.add(bodyMesh);

    // Champagne gold top bib border
    const topTrimGeo = new THREE.CylinderGeometry(10.75, 10.75, 1.4, 16, 1, true, -0.68, 1.36);
    const topTrimMesh = new THREE.Mesh(topTrimGeo, goldMat);
    topTrimMesh.position.set(0, 14.8, 0.4);
    apronGroup.add(topTrimMesh);

    // Waistband tie strap
    const waistGeo = new THREE.CylinderGeometry(10.9, 10.9, 2.2, 16, 1, true, -0.95, 1.9);
    const waistMesh = new THREE.Mesh(waistGeo, goldMat);
    waistMesh.position.set(0, -6.5, 0.4);
    apronGroup.add(waistMesh);

    // Front pocket trim
    const pocketGeo = new THREE.CylinderGeometry(11.35, 11.45, 7.5, 12, 1, true, -0.38, 0.76);
    const pocketMesh = new THREE.Mesh(pocketGeo, goldMat);
    pocketMesh.position.set(0, -13.0, 0.4);
    apronGroup.add(pocketMesh);

    // Gold name badge on upper left bib
    const badgeGeo = new THREE.BoxGeometry(4.2, 1.6, 0.5);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMat);
    badgeMesh.position.set(4.5, 10.2, 10.4);
    badgeMesh.rotation.y = 0.35;
    apronGroup.add(badgeMesh);

    spine1.add(apronGroup);
    return () => {
      spine1.remove(apronGroup);
      bodyGeo.dispose();
      topTrimGeo.dispose();
      waistGeo.dispose();
      pocketGeo.dispose();
      badgeGeo.dispose();
      apronMat.dispose();
      goldMat.dispose();
    };
  }, [clonedData]);

  useEffect(() => {
    return () => {
      clonedData.tex.dispose();
    };
  }, [clonedData]);

  const ikSolverRef = useRef<ProceduralIKSolver>(
    new ProceduralIKSolver({ maxHeadYaw: THREE.MathUtils.degToRad(22), maxHeadPitch: THREE.MathUtils.degToRad(12) })
  );
  const bonesRef = useRef<IKBoneReferences>({});
  const lookTargetRef = useRef({ x: -0.14, y: 0.03 });
  const tempEuler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const tempQuat = useRef(new THREE.Quaternion());

  useEffect(() => {
    bonesRef.current = ProceduralIKSolver.discoverBones(clonedData.clone);
    ikSolverRef.current.registerBones(bonesRef.current);
  }, [clonedData]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { rig } = clonedData;

    const applyBoneOffset = (
      bone: THREE.Object3D | undefined,
      rx: number,
      ry: number,
      rz: number
    ) => {
      if (!bone) return;
      const baseQ = rig.bindQuats.get(bone);
      if (!baseQ) return;
      tempEuler.current.set(rx, ry, rz, "YXZ");
      tempQuat.current.setFromEuler(tempEuler.current);
      bone.quaternion.copy(baseQ).multiply(tempQuat.current);
    };

    // Subtle breathing in spine
    const breath = Math.sin(t * 1.7);
    applyBoneOffset(rig.spine, breath * 0.012, 0, 0);
    applyBoneOffset(rig.spine1, breath * 0.016, 0, 0);
    applyBoneOffset(rig.spine2, breath * 0.018, 0, 0);

    // Natural lowered arms + welcoming forearm bend over counter (eliminates T-pose!)
    applyBoneOffset(rig.leftArm, 1.12 + Math.sin(t * 1.4) * 0.025, 0, 0.20 + Math.cos(t * 1.2) * 0.015);
    applyBoneOffset(rig.rightArm, 1.12 - Math.sin(t * 1.4) * 0.025, 0, -0.20 - Math.cos(t * 1.2) * 0.015);
    applyBoneOffset(rig.leftForeArm, 0, 0, 1.18 + Math.sin(t * 1.4) * 0.035);
    applyBoneOffset(rig.rightForeArm, 0, 0, -1.18 + Math.cos(t * 1.4) * 0.035);

    // Gentle welcoming head motion toward the approaching guest
    lookTargetRef.current.x = -0.14 + Math.sin(t * 0.7) * 0.1;
    lookTargetRef.current.y = 0.03 + Math.cos(t * 0.5) * 0.04;
    ikSolverRef.current.update(bonesRef.current, lookTargetRef.current, t, delta, true);
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[1.12, 1.12, 1.12]}>
      <primitive object={clonedData.clone} />
    </group>
  );
});

function PopcornBucket({
  position,
  scale = 1,
  stripeTex,
}: {
  position: [number, number, number];
  scale?: number;
  stripeTex: THREE.CanvasTexture;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tapered Cinema Striped Popcorn Tub */}
      <mesh position={[0, 0.095, 0]}>
        <cylinderGeometry args={[0.072, 0.052, 0.19, 20]} />
        <meshStandardMaterial map={stripeTex} roughness={0.52} metalness={0.08} />
      </mesh>
      {/* Brass/Cream Top Rim */}
      <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.072, 0.005, 8, 20]} />
        <meshStandardMaterial color="#f5ecd8" roughness={0.4} />
      </mesh>
      {/* Overflowing Golden Popcorn Mound */}
      {BUCKET_POPCORN_TOPPINGS.map((k, idx) => (
        <mesh key={idx} position={[k.pos[0], 0.19 + k.pos[1], k.pos[2]]}>
          <sphereGeometry args={[k.r, 8, 8]} />
          <meshStandardMaterial color={idx % 2 === 0 ? "#f7de9a" : "#efc263"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function FlakyPuffPastry({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Bottom crispy pastry crust layer */}
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.105, 0.016, 0.085]} />
        <meshStandardMaterial color="#c98532" roughness={0.78} />
      </mesh>
      {/* Spiced masala filling seam */}
      <mesh position={[0, 0.022, 0]}>
        <boxGeometry args={[0.096, 0.008, 0.078]} />
        <meshStandardMaterial color="#8c3d18" roughness={0.85} />
      </mesh>
      {/* Flaky puffed golden upper pastry */}
      <mesh position={[0, 0.036, 0]}>
        <boxGeometry args={[0.108, 0.022, 0.088]} />
        <meshStandardMaterial color="#e0a24a" roughness={0.62} />
      </mesh>
      {/* Crown baked dome */}
      <mesh position={[0, 0.048, 0]} scale={[1.2, 0.45, 0.95]}>
        <sphereGeometry args={[0.042, 10, 8]} />
        <meshStandardMaterial color="#d48932" roughness={0.52} />
      </mesh>
    </group>
  );
}

function StuffedKathiRoll({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Main golden crispy wrapped roll */}
      <mesh position={[0, 0.024, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 0.16, 14]} />
        <meshStandardMaterial color="#cfa052" roughness={0.68} />
      </mesh>
      {/* Parchment paper sleeve wrapping half the roll */}
      <mesh position={[0.032, 0.024, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0255, 0.0255, 0.092, 14]} />
        <meshStandardMaterial color="#f2e8d4" roughness={0.82} />
      </mesh>
      {/* Spiced paneer & herb filling peeking out the open cut end */}
      <mesh position={[-0.081, 0.024, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.019, 0.019, 0.008, 12]} />
        <meshStandardMaterial color="#a83e1c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function GoldenSamosa({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.032, 0]}>
        <coneGeometry args={[0.048, 0.064, 4]} />
        <meshStandardMaterial color="#d69436" roughness={0.72} />
      </mesh>
    </group>
  );
}

export default function CinemaSnackStand3D() {
  const poppingKernelRefs = useRef<Array<THREE.Mesh | null>>([]);

  // Create crisp procedural CanvasTextures for cinema signage, menu board, and popcorn tubs
  const textures = useMemo(() => {
    const marqueeTex = createCanvasTexture(1024, 224, (ctx, w, h) => {
      ctx.fillStyle = "#19060b";
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.55);
      glow.addColorStop(0, "rgba(227, 185, 110, 0.22)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#dfc28d";
      ctx.lineWidth = 4;
      ctx.strokeRect(14, 14, w - 28, h - 28);
      ctx.strokeStyle = "rgba(223, 194, 141, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 24, w - 48, h - 48);

      ctx.textAlign = "center";
      ctx.fillStyle = "#f7e8cc";
      ctx.font = "600 66px Georgia, 'Times New Roman', serif";
      ctx.fillText("NOCTURNE CONCESSIONS", w / 2, 114);

      ctx.fillStyle = "#e3c07b";
      ctx.font = "600 24px Arial, sans-serif";
      ctx.fillText("FRESH POPCORN   •   MASALA PUFFS   •   PANEER ROLLS", w / 2, 168);
    });

    const menuBoardTex = createCanvasTexture(1024, 512, (ctx, w, h) => {
      ctx.fillStyle = "#0e0a09";
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w / 2, h * 0.35, 20, w / 2, h * 0.5, w * 0.58);
      glow.addColorStop(0, "rgba(218, 174, 98, 0.16)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#c9a86a";
      ctx.lineWidth = 5;
      ctx.strokeRect(18, 18, w - 36, h - 36);
      ctx.strokeStyle = "rgba(201, 168, 106, 0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, w - 60, h - 60);

      ctx.textAlign = "center";
      ctx.fillStyle = "#f4e6cc";
      ctx.font = "600 44px Georgia, serif";
      ctx.fillText("SNACKS & CONCESSIONS", w / 2, 92);

      ctx.fillStyle = "#c9a86a";
      ctx.font = "600 18px Arial, sans-serif";
      ctx.fillText("FRESHLY POPPED & BAKED ALL EVENING", w / 2, 128);

      ctx.strokeStyle = "rgba(201, 168, 106, 0.45)";
      ctx.beginPath();
      ctx.moveTo(90, 148);
      ctx.lineTo(w - 90, 148);
      ctx.stroke();

      const leftItems = [
        ["BUTTERED POPCORN", "₹80"],
        ["CARAMEL POPCORN", "₹100"],
        ["CHEESE POPCORN TUB", "₹120"],
        ["CHEESE NACHOS & SALSA", "₹110"],
      ];
      const rightItems = [
        ["MASALA PUFFS (HOT)", "₹60"],
        ["PANEER KATHI ROLL", "₹90"],
        ["CRISPY VEG ROLL", "₹75"],
        ["GOLDEN SAMOSA (2 PCS)", "₹40"],
      ];

      ctx.font = "500 26px Georgia, serif";
      leftItems.forEach(([name, price], idx) => {
        const y = 212 + idx * 66;
        ctx.textAlign = "left";
        ctx.fillStyle = "#f2e8d7";
        ctx.fillText(name, 74, y);
        ctx.textAlign = "right";
        ctx.fillStyle = "#f0c978";
        ctx.fillText(price, w / 2 - 42, y);
      });

      ctx.strokeStyle = "rgba(201, 168, 106, 0.25)";
      ctx.beginPath();
      ctx.moveTo(w / 2, 175);
      ctx.lineTo(w / 2, 445);
      ctx.stroke();

      rightItems.forEach(([name, price], idx) => {
        const y = 212 + idx * 66;
        ctx.textAlign = "left";
        ctx.fillStyle = "#f2e8d7";
        ctx.fillText(name, w / 2 + 42, y);
        ctx.textAlign = "right";
        ctx.fillStyle = "#f0c978";
        ctx.fillText(price, w - 74, y);
      });
    });

    const popcornHeaderTex = createCanvasTexture(512, 128, (ctx, w, h) => {
      ctx.fillStyle = "#7a121f";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#f2d28b";
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffe6a6";
      ctx.font = "700 52px Georgia, serif";
      ctx.fillText("★ POPCORN ★", w / 2, 82);
    });

    const stripeTex = createCanvasTexture(512, 256, (ctx, w, h) => {
      const stripes = 12;
      const sw = w / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#8a1625" : "#f5ebd8";
        ctx.fillRect(i * sw, 0, sw + 1, h);
      }
      // Gold band across center
      ctx.fillStyle = "#1a0a0c";
      ctx.fillRect(0, h * 0.34, w, h * 0.32);
      ctx.strokeStyle = "#d9b775";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, h * 0.34, w, h * 0.32);
      ctx.textAlign = "center";
      ctx.fillStyle = "#f5d796";
      ctx.font = "700 28px Georgia, serif";
      ctx.fillText("NOCTURNE", w * 0.25, h * 0.54);
      ctx.fillText("POPCORN", w * 0.75, h * 0.54);
    });
    stripeTex.wrapS = THREE.RepeatWrapping;

    const makePlacard = (title: string, price: string) =>
      createCanvasTexture(256, 96, (ctx, w, h) => {
        ctx.fillStyle = "#160d0b";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#c9a86a";
        ctx.lineWidth = 4;
        ctx.strokeRect(5, 5, w - 10, h - 10);
        ctx.textAlign = "center";
        ctx.fillStyle = "#f4e8d2";
        ctx.font = "700 26px Georgia, serif";
        ctx.fillText(title, w / 2, 42);
        ctx.fillStyle = "#efc773";
        ctx.font = "700 24px Arial, sans-serif";
        ctx.fillText(price, w / 2, 74);
      });

    const puffsLabelTex = makePlacard("MASALA PUFFS", "₹60");
    const rollsLabelTex = makePlacard("PANEER ROLLS", "₹90");
    const samosaLabelTex = makePlacard("SAMOSAS", "₹40");

    return {
      marqueeTex,
      menuBoardTex,
      popcornHeaderTex,
      stripeTex,
      puffsLabelTex,
      rollsLabelTex,
      samosaLabelTex,
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((tex) => tex.dispose());
    };
  }, [textures]);

  // Animate popping popcorn kernels inside the glass machine
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    poppingKernelRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const seed = POPPING_KERNEL_SEEDS[i];
      const bounce = Math.abs(Math.sin(t * seed.speed + seed.phase));
      mesh.position.y = 0.22 + bounce * seed.height;
      mesh.rotation.x = t * 2.5 + seed.phase;
      mesh.rotation.z = t * 1.9 + seed.phase;
    });
  });

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. CUSTOMER FLOOR RUNNER (Replaces barstools)                 */}
      {/* ============================================================ */}
      <group position={[-0.78, 0.125, 0]}>
        <mesh>
          <boxGeometry args={[1.15, 0.014, 5.6]} />
          <meshStandardMaterial color="#3c0a13" roughness={0.94} metalness={0.04} />
        </mesh>
        <mesh position={[-0.56, 0.004, 0]}>
          <boxGeometry args={[0.03, 0.012, 5.6]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.56, 0.004, 0]}>
          <boxGeometry args={[0.03, 0.012, 5.6]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. OVERHEAD CONCESSIONS CANOPY & MARQUEE SIGN                */}
      {/* ============================================================ */}
      <group position={[0.45, 2.78, 0]}>
        {/* Canopy fascia beam */}
        <mesh>
          <boxGeometry args={[0.42, 0.36, 6.2]} />
          <meshStandardMaterial color="#24090e" roughness={0.48} metalness={0.18} />
        </mesh>
        {/* Top & bottom brass cornice trim */}
        <mesh position={[-0.21, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.03, 6.24]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
        </mesh>
        <mesh position={[-0.21, -0.18, 0]}>
          <boxGeometry args={[0.04, 0.03, 6.24]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
        </mesh>
        {/* Brass suspension rods up to pergola roof */}
        {[-2.8, 0, 2.8].map((rz, idx) => (
          <mesh key={idx} position={[0, 0.85, rz]}>
            <cylinderGeometry args={[0.016, 0.016, 1.45, 10]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
          </mesh>
        ))}
        {/* Illuminated Marquee Banner */}
        <mesh position={[-0.22, 0, -0.02]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.5, 0.32]} />
          <meshBasicMaterial map={textures.marqueeTex} toneMapped={false} />
        </mesh>
        {/* Downward counter illumination */}
        <pointLight position={[-0.45, -0.35, -1.2]} intensity={6.5} distance={5} color="#ffd080" decay={1.6} />
        <pointLight position={[-0.45, -0.35, 1.2]} intensity={6.5} distance={5} color="#ffd080" decay={1.6} />
      </group>

      {/* ============================================================ */}
      {/* 3. CINEMA CONCESSIONS COUNTER (No barstools, no footrail)    */}
      {/* ============================================================ */}
      <group position={[0.52, 0.12, 0]}>
        {/* Lower Mahogany & Crimson Panel Counter Body */}
        <group position={[0, 0.48, 0]}>
          <mesh>
            <boxGeometry args={[1.28, 0.96, 6.0]} />
            <meshStandardMaterial color="#1a0d0a" roughness={0.44} metalness={0.18} />
          </mesh>
          {/* Rounded ends */}
          {[-3.0, 3.0].map((endZ, ei) => (
            <mesh key={ei} position={[0, 0, endZ]} rotation={[0, ei === 0 ? Math.PI : 0, 0]}>
              <cylinderGeometry args={[0.64, 0.64, 0.96, 24, 1, false, -Math.PI / 2, Math.PI]} />
              <meshStandardMaterial color="#1a0d0a" roughness={0.44} metalness={0.18} />
            </mesh>
          ))}
          {/* Framed Crimson Velvet Front Kiosk Panels */}
          {[-2.0, 0, 2.0].map((pz, idx) => (
            <group key={idx} position={[-0.645, 0.02, pz]}>
              <mesh>
                <boxGeometry args={[0.02, 0.72, 1.72]} />
                <meshStandardMaterial color="#420b15" roughness={0.82} metalness={0.05} />
              </mesh>
              {/* Brass outer border strips */}
              <mesh position={[-0.012, 0.36, 0]}>
                <boxGeometry args={[0.016, 0.02, 1.76]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
              </mesh>
              <mesh position={[-0.012, -0.36, 0]}>
                <boxGeometry args={[0.016, 0.02, 1.76]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
              </mesh>
            </group>
          ))}
          {/* Vertical Brass Pilasters separating panels */}
          {[-2.95, -1.0, 1.0, 2.95].map((vz, idx) => (
            <mesh key={idx} position={[-0.65, 0.02, vz]}>
              <boxGeometry args={[0.03, 0.84, 0.05]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
            </mesh>
          ))}
          {/* Illuminated Recessed Gold Toe-Kick Strip */}
          <mesh position={[-0.63, -0.45, 0]}>
            <boxGeometry args={[0.02, 0.04, 5.95]} />
            <meshBasicMaterial color="#e0b56a" />
          </mesh>
        </group>

        {/* Cream Travertine Marble Service Countertop (top at local y = 1.03) */}
        <group position={[0, 0.995, 0]}>
          <mesh>
            <boxGeometry args={[1.44, 0.07, 6.0]} />
            <meshStandardMaterial color="#efe7da" roughness={0.22} metalness={0.08} />
          </mesh>
          {[-3.0, 3.0].map((endZ, ei) => (
            <mesh key={ei} position={[0, 0, endZ]} rotation={[0, ei === 0 ? Math.PI : 0, 0]}>
              <cylinderGeometry args={[0.72, 0.72, 0.07, 24, 1, false, -Math.PI / 2, Math.PI]} />
              <meshStandardMaterial color="#efe7da" roughness={0.22} metalness={0.08} />
            </mesh>
          ))}
          <mesh position={[-0.725, 0, 0]}>
            <boxGeometry args={[0.024, 0.074, 6.0]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.14} />
          </mesh>
        </group>

        {/* ---------------------------------------------------------- */}
        {/* A. VINTAGE GLASS POPCORN MACHINE (Left-center hero)        */}
        {/* ---------------------------------------------------------- */}
        <group position={[-0.14, 1.03, -1.24]}>
          {/* Red Lacquered & Brass Base Pedestal */}
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.56, 0.18, 0.66]} />
            <meshStandardMaterial color="#6e101d" roughness={0.32} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.60, 0.03, 0.70]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.58, 0.025, 0.68]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>

          {/* 4 Polished Brass Corner Pillars */}
          {[
            [-0.26, -0.31],
            [-0.26, 0.31],
            [0.26, -0.31],
            [0.26, 0.31],
          ].map(([cx, cz], ci) => (
            <mesh key={ci} position={[cx, 0.56, cz]}>
              <cylinderGeometry args={[0.018, 0.018, 0.76, 12]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
            </mesh>
          ))}

          {/* Clear Glass Chamber Panes (all 4 sides) */}
          <mesh position={[-0.26, 0.56, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.60, 0.72]} />
            <meshPhysicalMaterial
              color="#fff6e0"
              transparent
              opacity={0.18}
              roughness={0.04}
              metalness={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0.26, 0.56, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.60, 0.72]} />
            <meshPhysicalMaterial
              color="#fff6e0"
              transparent
              opacity={0.18}
              roughness={0.04}
              metalness={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.56, 0.31]}>
            <planeGeometry args={[0.50, 0.72]} />
            <meshPhysicalMaterial
              color="#fff6e0"
              transparent
              opacity={0.18}
              roughness={0.04}
              metalness={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.56, -0.31]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.50, 0.72]} />
            <meshPhysicalMaterial
              color="#fff6e0"
              transparent
              opacity={0.18}
              roughness={0.04}
              metalness={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Interior Stainless Warming Floor */}
          <mesh position={[0, 0.195, 0]}>
            <boxGeometry args={[0.49, 0.015, 0.59]} />
            <meshStandardMaterial color="#d4c7b0" metalness={0.75} roughness={0.25} />
          </mesh>

          {/* Fluffy Pile of Golden Buttered Popcorn Inside Chamber */}
          <group position={[0, 0.20, 0]}>
            {MACHINE_POPCORN_KERNELS.map((k, idx) => (
              <mesh key={idx} position={k.pos}>
                <sphereGeometry args={[k.r, 8, 8]} />
                <meshStandardMaterial color={k.tint} roughness={0.82} />
              </mesh>
            ))}
            {/* Animated Popping Kernels */}
            {POPPING_KERNEL_SEEDS.map((seed, idx) => (
              <mesh
                key={`pop-${idx}`}
                ref={(el) => {
                  poppingKernelRefs.current[idx] = el;
                }}
                position={[seed.x, 0.25, seed.z]}
              >
                <dodecahedronGeometry args={[0.026, 0]} />
                <meshStandardMaterial color="#faebba" roughness={0.8} />
              </mesh>
            ))}
          </group>

          {/* Overhead Suspended Popping Kettle + Hanging Rods */}
          <group position={[0, 0.68, 0]}>
            <mesh position={[0, 0.12, -0.1]}>
              <cylinderGeometry args={[0.012, 0.012, 0.26, 8]} />
              <meshStandardMaterial color="#d8d4cc" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.12, 0.1]}>
              <cylinderGeometry args={[0.012, 0.012, 0.26, 8]} />
              <meshStandardMaterial color="#d8d4cc" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Kettle pot */}
            <mesh>
              <cylinderGeometry args={[0.13, 0.11, 0.15, 20]} />
              <meshStandardMaterial color="#d9c698" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Hinged tilted kettle lids */}
            <mesh position={[0, 0.09, -0.06]} rotation={[0.45, 0, 0]}>
              <cylinderGeometry args={[0.135, 0.135, 0.012, 18, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#e3dccb" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.09, 0.06]} rotation={[-0.45, 0, 0]}>
              <cylinderGeometry args={[0.135, 0.135, 0.012, 18, 1, false, Math.PI, Math.PI]} />
              <meshStandardMaterial color="#e3dccb" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Kettle pouring handle */}
            <mesh position={[-0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
              <meshStandardMaterial color="#1a1210" roughness={0.5} />
            </mesh>
          </group>

          {/* Warm Amber Interior Heat Lamp */}
          <pointLight position={[0, 0.78, 0]} intensity={7.5} distance={2.4} color="#ffb242" decay={1.6} />

          {/* Art Deco Crimson & Gold Popcorn Machine Canopy Roof */}
          <group position={[0, 0.96, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.58, 0.12, 0.68]} />
              <meshStandardMaterial color="#7a121f" roughness={0.3} metalness={0.22} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.46, 0.10, 0.56]} />
              <meshStandardMaterial color="#580b15" roughness={0.32} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.60, 0.025, 0.70]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
            </mesh>
            {/* Brass Crown Finial */}
            <mesh position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.036, 12, 12]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
            </mesh>
            {/* Glowing POPCORN Marquee Header */}
            <mesh position={[-0.295, 0.04, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[0.58, 0.10]} />
              <meshBasicMaterial map={textures.popcornHeaderTex} toneMapped={false} />
            </mesh>
          </group>
        </group>

        {/* Ready-to-Serve Striped Popcorn Tubs Beside Machine */}
        <PopcornBucket position={[-0.12, 1.03, -0.72]} scale={1.12} stripeTex={textures.stripeTex} />
        <PopcornBucket position={[-0.26, 1.03, -0.54]} scale={0.90} stripeTex={textures.stripeTex} />
        <PopcornBucket position={[-0.12, 1.03, -1.72]} scale={1.06} stripeTex={textures.stripeTex} />

        {/* ---------------------------------------------------------- */}
        {/* B. CENTRAL OPEN SERVICE STATION (Directly in front of lady) */}
        {/* ---------------------------------------------------------- */}
        <group position={[-0.12, 1.03, -0.06]}>
          {/* Compact Art Deco POS / Order Terminal */}
          <group position={[0.20, 0, -0.34]} rotation={[0, 0.22, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.14, 0.08, 0.16]} />
              <meshStandardMaterial color="#181210" roughness={0.42} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.12, 0]} rotation={[0, 0, -0.38]}>
              <boxGeometry args={[0.018, 0.13, 0.22]} />
              <meshStandardMaterial color="#1c1512" metalness={0.75} roughness={0.28} />
            </mesh>
            <mesh position={[0.012, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.19, 0.105]} />
              <meshBasicMaterial color="#2a2117" />
            </mesh>
          </group>

          {/* Serving Tray with Popcorn, Puff, Roll & Cinema Soda Cups */}
          <group position={[-0.10, 0, 0.02]}>
            {/* Walnut & Brass Serving Tray */}
            <mesh position={[0, 0.012, 0]}>
              <boxGeometry args={[0.38, 0.022, 0.56]} />
              <meshStandardMaterial color="#2a160c" roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[-0.19, 0.024, 0]}>
              <boxGeometry args={[0.014, 0.018, 0.56]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Fresh Popcorn Tub on Tray */}
            <PopcornBucket position={[0.04, 0.022, -0.14]} scale={0.85} stripeTex={textures.stripeTex} />
            {/* Served Flaky Puff on Plate */}
            <mesh position={[-0.04, 0.026, 0.06]}>
              <cylinderGeometry args={[0.09, 0.075, 0.012, 16]} />
              <meshStandardMaterial color="#f2ede4" roughness={0.25} />
            </mesh>
            <FlakyPuffPastry position={[-0.04, 0.032, 0.06]} rotY={0.4} />
            {/* Served Roll */}
            <StuffedKathiRoll position={[0.06, 0.024, 0.18]} rotY={0.35} />
            {/* Two Cinema Soft Drink Cups with Lids & Straws */}
            {[-0.21, -0.07].map((cz, ci) => (
              <group key={ci} position={[-0.10, 0.022, cz]}>
                <mesh position={[0, 0.075, 0]}>
                  <cylinderGeometry args={[0.038, 0.028, 0.15, 16]} />
                  <meshStandardMaterial color="#7a121f" roughness={0.45} />
                </mesh>
                <mesh position={[0, 0.152, 0]}>
                  <cylinderGeometry args={[0.041, 0.041, 0.014, 16]} />
                  <meshStandardMaterial color="#f5ecd8" roughness={0.35} />
                </mesh>
                <mesh position={[0.008, 0.19, 0]} rotation={[0, 0, -0.14]}>
                  <cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />
                  <meshStandardMaterial color="#e3c995" metalness={0.4} roughness={0.3} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* ---------------------------------------------------------- */}
        {/* C. HEATED GLASS PASTRY SHOWCASE: PUFFS, ROLLS & SAMOSAS    */}
        {/* ---------------------------------------------------------- */}
        <group position={[-0.08, 1.03, 1.02]}>
          {/* Dark Mahogany & Brass Showcase Base */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.56, 0.06, 1.38]} />
            <meshStandardMaterial color="#1e100a" roughness={0.4} metalness={0.25} />
          </mesh>
          <mesh position={[-0.285, 0.03, 0]}>
            <boxGeometry args={[0.02, 0.064, 1.40]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>

          {/* Corner & Middle Brass Showcase Frame Posts */}
          {[-0.67, 0, 0.67].map((fz, fi) => (
            <group key={fi}>
              <mesh position={[-0.26, 0.36, fz]}>
                <boxGeometry args={[0.024, 0.62, 0.024]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
              </mesh>
              <mesh position={[0.26, 0.36, fz]}>
                <boxGeometry args={[0.024, 0.62, 0.024]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
              </mesh>
            </group>
          ))}
          {/* Top Brass Header & Light Rail */}
          <mesh position={[0, 0.67, 0]}>
            <boxGeometry args={[0.54, 0.035, 1.38]} />
            <meshStandardMaterial color="#24130d" roughness={0.35} metalness={0.4} />
          </mesh>
          <mesh position={[-0.27, 0.67, 0]}>
            <boxGeometry args={[0.024, 0.04, 1.40]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>
          {/* Warm Emissive Showcase Top Strip Light */}
          <mesh position={[0, 0.648, 0]}>
            <boxGeometry args={[0.08, 0.01, 1.28]} />
            <meshBasicMaterial color="#ffe09c" />
          </mesh>
          <pointLight position={[-0.1, 0.56, -0.25]} intensity={5.2} distance={2.2} color="#ffbe5c" decay={1.6} />
          <pointLight position={[-0.1, 0.56, 0.25]} intensity={5.2} distance={2.2} color="#ffbe5c" decay={1.6} />

          {/* Clear Front & End Glass Panels */}
          <mesh position={[-0.265, 0.36, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.32, 0.60]} />
            <meshPhysicalMaterial
              color="#fff9eb"
              transparent
              opacity={0.14}
              roughness={0.04}
              metalness={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.36, -0.67]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.50, 0.60]} />
            <meshPhysicalMaterial
              color="#fff9eb"
              transparent
              opacity={0.14}
              roughness={0.04}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.36, 0.67]}>
            <planeGeometry args={[0.50, 0.60]} />
            <meshPhysicalMaterial
              color="#fff9eb"
              transparent
              opacity={0.14}
              roughness={0.04}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Upper Warming Shelf (y = 0.36) — MASALA & VEG PUFFS + SAMOSAS */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.46, 0.018, 1.30]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.85} roughness={0.24} />
          </mesh>
          {/* Baking Trays on Top Shelf */}
          {[-0.36, 0.08].map((tz, ti) => (
            <mesh key={ti} position={[0, 0.365, tz]}>
              <boxGeometry args={[0.40, 0.012, 0.40]} />
              <meshStandardMaterial color="#1f1b18" roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
          {/* 8 Flaky Golden Masala Puffs on Top Shelf */}
          {[
            [-0.09, -0.47], [0.06, -0.47],
            [-0.09, -0.34], [0.06, -0.34],
            [-0.09, -0.21], [0.06, -0.21],
            [-0.09, 0.02],  [0.06, 0.02],
            [-0.09, 0.16],  [0.06, 0.16],
          ].map(([px, pz], pi) => (
            <FlakyPuffPastry
              key={`puff-${pi}`}
              position={[px, 0.371, pz]}
              rotY={(pi % 3) * 0.12 - 0.1}
            />
          ))}
          {/* Puffs Price Placard mounted neatly on middle shelf lip */}
          <mesh position={[-0.24, 0.35, -0.32]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.24, 0.08]} />
            <meshBasicMaterial map={textures.puffsLabelTex} toneMapped={false} />
          </mesh>

          {/* Upper Shelf Right Side — Golden Samosas Tray */}
          <mesh position={[0, 0.365, 0.47]}>
            <boxGeometry args={[0.38, 0.012, 0.34]} />
            <meshStandardMaterial color="#1f1b18" roughness={0.5} metalness={0.4} />
          </mesh>
          {[
            [-0.08, 0.39], [0.07, 0.39],
            [-0.08, 0.53], [0.07, 0.53],
            [0.0, 0.46],
          ].map(([sx, sz], si) => (
            <GoldenSamosa key={`sam-${si}`} position={[sx, 0.372, sz]} rotY={si * 0.6} />
          ))}
          <mesh position={[-0.24, 0.35, 0.47]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.20, 0.08]} />
            <meshBasicMaterial map={textures.samosaLabelTex} toneMapped={false} />
          </mesh>

          {/* Lower Warming Shelf (y = 0.07) — PANEER & VEG ROLLS */}
          {[-0.31, 0.31].map((tz, ti) => (
            <mesh key={ti} position={[0, 0.068, tz]}>
              <boxGeometry args={[0.42, 0.012, 0.52]} />
              <meshStandardMaterial color="#1f1b18" roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
          {/* 8 Crispy Golden Stuffed Rolls */}
          {[
            [-0.02, -0.49], [-0.02, -0.37], [-0.02, -0.25], [-0.02, -0.13],
            [-0.02, 0.13],  [-0.02, 0.25],  [-0.02, 0.37],  [-0.02, 0.49],
          ].map(([rx, rz], ri) => (
            <StuffedKathiRoll
              key={`roll-${ri}`}
              position={[rx, 0.074, rz]}
              rotY={(ri % 2) * 0.08 - 0.04}
            />
          ))}
          {/* Rolls Price Placard mounted flush on front base rail under left tray */}
          <mesh position={[-0.298, 0.045, -0.31]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.24, 0.08]} />
            <meshBasicMaterial map={textures.rollsLabelTex} toneMapped={false} />
          </mesh>
        </group>

        {/* ---------------------------------------------------------- */}
        {/* D. NACHOS BOWL & CONDIMENTS AT FAR RIGHT COUNTER END       */}
        {/* ---------------------------------------------------------- */}
        <group position={[-0.12, 1.03, 1.98]}>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.17, 0.11, 0.11, 20]} />
            <meshStandardMaterial color="#19110d" roughness={0.45} metalness={0.25} />
          </mesh>
          {Array.from({ length: 10 }).map((_, ci) => {
            const angle = (ci / 10) * Math.PI * 2;
            const r = ci % 2 === 0 ? 0.07 : 0.035;
            return (
              <mesh
                key={ci}
                position={[Math.cos(angle) * r, 0.12 + (ci % 3) * 0.015, Math.sin(angle) * r]}
                rotation={[0.45, angle, 0.25]}
              >
                <coneGeometry args={[0.048, 0.042, 3]} />
                <meshStandardMaterial color="#dfa03a" roughness={0.78} />
              </mesh>
            );
          })}
          {/* Cheese Dip & Salsa Cups */}
          <mesh position={[-0.14, 0.03, 0.2]}>
            <cylinderGeometry args={[0.048, 0.038, 0.06, 14]} />
            <meshStandardMaterial color="#e8a72e" roughness={0.35} />
          </mesh>
          <mesh position={[0.02, 0.03, 0.22]}>
            <cylinderGeometry args={[0.048, 0.038, 0.06, 14]} />
            <meshStandardMaterial color="#9e2018" roughness={0.45} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 4. LADY ATTENDANT INSIDE THE SNACK STAND (Real 3D GLB)       */}
      {/* ============================================================ */}
      <Suspense fallback={null}>
        <SnackAttendantLady position={[1.48, 0.12, -0.10]} rotationY={-1.22} />
      </Suspense>
      {/* Balanced Warm Facial Key & Subtle Rim Light on Attendant */}
      <pointLight position={[0.72, 1.85, 0.25]} intensity={2.6} distance={3.2} color="#fff2de" decay={1.8} />
      <pointLight position={[1.65, 2.15, -0.45]} intensity={1.8} distance={2.8} color="#ffd088" decay={1.8} />

      {/* ============================================================ */}
      {/* 5. CINEMA SNACKS BACK WALL: MENU BOARD, TUB SHELVES, COOLER */}
      {/*    (Replaces bar cabinet and bar photo/video mural!)         */}
      {/* ============================================================ */}
      <group position={[2.12, 0.12, 0]}>
        {/* Main Dark Mahogany Concession Back Wall */}
        <mesh position={[0.06, 1.5, 0]}>
          <boxGeometry args={[0.26, 3.0, 7.8]} />
          <meshStandardMaterial color="#140c0a" roughness={0.58} metalness={0.14} />
        </mesh>

        {/* Center Illuminated Art Deco Menu Lightbox (clear below marquee & above attendant) */}
        <group position={[-0.10, 2.15, -0.05]}>
          {/* Brass & Walnut Frame */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.88, 2.74]} />
            <meshStandardMaterial color="#24130c" roughness={0.38} metalness={0.3} />
          </mesh>
          <mesh position={[-0.03, 0.44, 0]}>
            <boxGeometry args={[0.04, 0.04, 2.78]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>
          <mesh position={[-0.03, -0.44, 0]}>
            <boxGeometry args={[0.04, 0.04, 2.78]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>
          {/* Glowing Menu Display Screen */}
          <mesh position={[-0.046, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.60, 0.80]} />
            <meshBasicMaterial map={textures.menuBoardTex} toneMapped={false} />
          </mesh>
          <pointLight position={[-0.45, 0.46, 0]} intensity={4.0} distance={4} color="#ffd080" decay={1.6} />
        </group>

        {/* Rear Prep Counter Credenza below Menu Board */}
        <mesh position={[-0.22, 0.45, 0]}>
          <boxGeometry args={[0.42, 0.90, 7.6]} />
          <meshStandardMaterial color="#1b0f0c" roughness={0.48} metalness={0.16} />
        </mesh>
        <mesh position={[-0.22, 0.915, 0]}>
          <boxGeometry args={[0.46, 0.04, 7.6]} />
          <meshStandardMaterial color="#e6dccb" roughness={0.28} metalness={0.08} />
        </mesh>

        {/* Left Back Shelving (z = -2.45): Stacked Popcorn Tubs & Snack Cartons */}
        <group position={[-0.14, 0, -2.45]}>
          {[1.32, 1.88, 2.42].map((sy, si) => (
            <group key={si} position={[0, sy, 0]}>
              <mesh>
                <boxGeometry args={[0.34, 0.03, 1.65]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.86} roughness={0.22} />
              </mesh>
              {/* Stacked striped popcorn buckets on shelf */}
              {[-0.55, -0.22, 0.11, 0.44].map((bz, bi) => (
                <group key={bi} position={[-0.04, 0.015, bz]}>
                  <mesh position={[0, 0.11, 0]}>
                    <cylinderGeometry args={[0.085, 0.062, 0.22, 18]} />
                    <meshStandardMaterial map={textures.stripeTex} roughness={0.5} />
                  </mesh>
                  <mesh position={[0, 0.18, 0]}>
                    <cylinderGeometry args={[0.087, 0.065, 0.18, 18]} />
                    <meshStandardMaterial map={textures.stripeTex} roughness={0.5} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
        </group>

        {/* Right Back Illuminated Beverage Cooler (z = +2.45): Chilled Sodas & Juices */}
        <group position={[-0.14, 1.85, 2.45]}>
          {/* Cooler Outer Housing */}
          <mesh>
            <boxGeometry args={[0.36, 1.85, 1.75]} />
            <meshStandardMaterial color="#111318" roughness={0.35} metalness={0.45} />
          </mesh>
          {/* Cool Backlit Interior Panel */}
          <mesh position={[-0.182, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.56, 1.66]} />
            <meshBasicMaterial color="#202a36" />
          </mesh>
          {/* Cooler Shelves + Colorful Soda Cans & Soft-Drink Bottles */}
          {[-0.56, -0.18, 0.20, 0.56].map((sy, si) => (
            <group key={si} position={[-0.12, sy, 0]}>
              <mesh>
                <boxGeometry args={[0.14, 0.02, 1.56]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.85} roughness={0.2} />
              </mesh>
              {[-0.58, -0.35, -0.12, 0.12, 0.35, 0.58].map((cz, ci) => {
                const canColors = ["#a81822", "#d99220", "#1f6896", "#2a7a42", "#b8361c", "#d4a838"];
                return (
                  <mesh key={ci} position={[-0.03, 0.085, cz]}>
                    <cylinderGeometry args={[0.036, 0.036, 0.14, 12]} />
                    <meshStandardMaterial
                      color={canColors[(ci + si) % canColors.length]}
                      metalness={0.6}
                      roughness={0.25}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}
          {/* Clear Glass Cooler Door + Brass Handle */}
          <mesh position={[-0.19, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.60, 1.70]} />
            <meshPhysicalMaterial
              color="#d8ecff"
              transparent
              opacity={0.14}
              roughness={0.05}
              metalness={0.1}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-0.21, 0, -0.74]}>
            <cylinderGeometry args={[0.012, 0.012, 0.52, 10]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.94} roughness={0.16} />
          </mesh>
          <pointLight position={[-0.32, 0, 0]} intensity={3.5} distance={2.8} color="#d4ebff" decay={1.6} />
        </group>
      </group>
    </group>
  );
}
