import * as THREE from "three";

export type AnimationActionState = "idle" | "walk" | "run" | "pose";

export interface CharacterClipSet {
  idle?: THREE.AnimationClip;
  walk?: THREE.AnimationClip;
  run?: THREE.AnimationClip;
  pose?: THREE.AnimationClip;
}

interface BoneTransformRecord {
  restQuat: THREE.Quaternion;
  restPos: THREE.Vector3;
}

/**
 * Traverses an Object3D hierarchy and discovers all bones with their rest pose quaternions and positions.
 */
function extractBoneRestMap(root: THREE.Object3D): Map<string, BoneTransformRecord> {
  const map = new Map<string, BoneTransformRecord>();

  root.traverse((child) => {
    if ((child as THREE.Bone).isBone || child.type === "Bone") {
      map.set(child.name, {
        restQuat: child.quaternion.clone(),
        restPos: child.position.clone(),
      });
    }
  });

  return map;
}

/**
 * Fallback rest transforms for ReadyPlayerMe standard armature when scene traversal is not available.
 */
function getRPMFallbackBones(): Map<string, BoneTransformRecord> {
  const map = new Map<string, BoneTransformRecord>();
  map.set("Hips", {
    restQuat: new THREE.Quaternion(0.016, 0, 0, 0.999),
    restPos: new THREE.Vector3(0, 1.019, 0.01),
  });
  map.set("Spine", {
    restQuat: new THREE.Quaternion(-0.068, 0, 0, 0.997),
    restPos: new THREE.Vector3(0, 0.098, 0),
  });
  map.set("Spine1", {
    restQuat: new THREE.Quaternion(-0.032, 0, 0, 0.999),
    restPos: new THREE.Vector3(0, 0.130, 0),
  });
  map.set("Spine2", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 0.124, 0),
  });
  map.set("LeftUpLeg", {
    restQuat: new THREE.Quaternion(0.0014, -0.0096, -0.9994, 0.0329),
    restPos: new THREE.Vector3(0.095, 0.005, -0.003),
  });
  map.set("RightUpLeg", {
    restQuat: new THREE.Quaternion(-0.0014, -0.0096, 0.9994, 0.0329),
    restPos: new THREE.Vector3(-0.095, 0.005, -0.003),
  });
  map.set("LeftLeg", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, -0.42, 0),
  });
  map.set("RightLeg", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, -0.42, 0),
  });
  map.set("LeftFoot", {
    restQuat: new THREE.Quaternion(0.707, 0, 0, 0.707),
    restPos: new THREE.Vector3(0, -0.41, 0),
  });
  map.set("RightFoot", {
    restQuat: new THREE.Quaternion(0.707, 0, 0, 0.707),
    restPos: new THREE.Vector3(0, -0.41, 0),
  });
  map.set("LeftArm", {
    restQuat: new THREE.Quaternion(0.476, 0.042, -0.058, 0.876),
    restPos: new THREE.Vector3(0, 0.118, 0),
  });
  map.set("RightArm", {
    restQuat: new THREE.Quaternion(-0.476, 0.042, 0.058, 0.876),
    restPos: new THREE.Vector3(0, 0.118, 0),
  });
  map.set("LeftForeArm", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 0.28, 0),
  });
  map.set("RightForeArm", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 0.28, 0),
  });
  map.set("Neck", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 0.11, 0),
  });
  map.set("Head", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 0.11, 0),
  });
  return map;
}

/**
 * Fallback rest transforms for Mixamo (Michelle) armature when scene traversal is not available.
 */
function getMixamoFallbackBones(): Map<string, BoneTransformRecord> {
  const map = new Map<string, BoneTransformRecord>();
  map.set("mixamorig:Hips", {
    restQuat: new THREE.Quaternion(-0.7071, 0, 0, 0.7071),
    restPos: new THREE.Vector3(0, -0.521, -102.625),
  });
  map.set("mixamorig:Spine", {
    restQuat: new THREE.Quaternion(-0.0028, 0, 0, 0.9999),
    restPos: new THREE.Vector3(0, 5.645, -0.031),
  });
  map.set("mixamorig:Spine1", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 6.586, 0),
  });
  map.set("mixamorig:Spine2", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 7.5, 0),
  });
  map.set("mixamorig:Neck", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 10.0, 0),
  });
  map.set("mixamorig:Head", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 9.0, 0),
  });
  map.set("mixamorig:LeftUpLeg", {
    restQuat: new THREE.Quaternion(-0.00025, -0.00779, -0.99943, 0.03287),
    restPos: new THREE.Vector3(6.620, -8.816, -0.447),
  });
  map.set("mixamorig:RightUpLeg", {
    restQuat: new THREE.Quaternion(0.00025, -0.00779, 0.99943, 0.03287),
    restPos: new THREE.Vector3(-6.620, -8.816, -0.447),
  });
  map.set("mixamorig:LeftLeg", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, -42.0, 0),
  });
  map.set("mixamorig:RightLeg", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, -42.0, 0),
  });
  map.set("mixamorig:LeftFoot", {
    restQuat: new THREE.Quaternion(0.707, 0, 0, 0.707),
    restPos: new THREE.Vector3(0, -41.0, 0),
  });
  map.set("mixamorig:RightFoot", {
    restQuat: new THREE.Quaternion(0.707, 0, 0, 0.707),
    restPos: new THREE.Vector3(0, -41.0, 0),
  });
  map.set("mixamorig:LeftArm", {
    restQuat: new THREE.Quaternion(-0.1495, -0.0012, 0.008, 0.9887),
    restPos: new THREE.Vector3(0, 7.189, 0),
  });
  map.set("mixamorig:RightArm", {
    restQuat: new THREE.Quaternion(0.1495, -0.0012, -0.008, 0.9887),
    restPos: new THREE.Vector3(0, 7.189, 0),
  });
  map.set("mixamorig:LeftForeArm", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 25.0, 0),
  });
  map.set("mixamorig:RightForeArm", {
    restQuat: new THREE.Quaternion(0, 0, 0, 1),
    restPos: new THREE.Vector3(0, 25.0, 0),
  });
  return map;
}

/**
 * Builds a quaternion track oscillating relative to a bone's bind pose quaternion.
 */
function makeRelativeRotationTrack(
  boneName: string,
  restQuat: THREE.Quaternion,
  duration: number,
  numFrames: number,
  eulerDeltaFn: (time: number, duration: number) => { x?: number; y?: number; z?: number }
): THREE.QuaternionKeyframeTrack {
  const times: number[] = [];
  const values: number[] = [];
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const qDelta = new THREE.Quaternion();
  const qResult = new THREE.Quaternion();

  for (let i = 0; i < numFrames; i++) {
    const t = (i / (numFrames - 1)) * duration;
    times.push(t);
    const { x = 0, y = 0, z = 0 } = eulerDeltaFn(t, duration);
    euler.set(x, y, z, "YXZ");
    qDelta.setFromEuler(euler);
    qResult.copy(restQuat).multiply(qDelta);
    values.push(qResult.x, qResult.y, qResult.z, qResult.w);
  }

  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

/**
 * Synthesizes a complete set of biologically grounded, in-place humanoid animation clips
 * calculated strictly relative to the character's exact rest pose.
 *
 * This completely avoids:
 * - Backwards limbo folding (caused by mismatched Mixamo pitch axes)
 * - Mesh collapse/squashing (caused by zeroing out Mixamo Hips Z coordinate)
 * - Limb dismemberment (caused by un-retargeted position tracks)
 */
export function buildProceduralHumanoidClips(
  boneMap: Map<string, BoneTransformRecord>,
  isMixamo: boolean,
  nativeDanceClip?: THREE.AnimationClip
): CharacterClipSet {
  const prefix = isMixamo ? "mixamorig:" : "";
  const hipsName = `${prefix}Hips`;
  const hipsInfo = boneMap.get(hipsName);
  const hipsRestPos = hipsInfo
    ? hipsInfo.restPos.clone()
    : new THREE.Vector3(0, isMixamo ? -0.52 : 1.019, isMixamo ? -102.625 : 0.01);

  const getBoneRestQuat = (baseName: string): THREE.Quaternion => {
    const target = `${prefix}${baseName}`;
    const info = boneMap.get(target);
    return info ? info.restQuat.clone() : new THREE.Quaternion(0, 0, 0, 1);
  };

  // -------------------------------------------------------------------------
  // 1. IDLE (Duration 3.2s): Relaxed harmonic diaphragm breathing & micro-sway
  // -------------------------------------------------------------------------
  const idleDuration = 3.2;
  const idleFrames = 48;
  const idleTracks: THREE.KeyframeTrack[] = [];

  // Breathing in Spine / Chest
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine`, getBoneRestQuat("Spine"), idleDuration, idleFrames, (t) => ({
      x: Math.sin(t * (Math.PI * 2 / 3.2)) * 0.012,
    }))
  );
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine1`, getBoneRestQuat("Spine1"), idleDuration, idleFrames, (t) => ({
      x: Math.sin(t * (Math.PI * 2 / 3.2)) * 0.018,
    }))
  );
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine2`, getBoneRestQuat("Spine2"), idleDuration, idleFrames, (t) => ({
      x: Math.sin(t * (Math.PI * 2 / 3.2)) * 0.022,
    }))
  );

  // Relaxed arm micro-sway
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftArm`, getBoneRestQuat("LeftArm"), idleDuration, idleFrames, (t) => ({
      z: Math.sin(t * (Math.PI * 2 / 3.2)) * 0.012,
      x: Math.cos(t * (Math.PI * 2 / 3.2)) * 0.008,
    }))
  );
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}RightArm`, getBoneRestQuat("RightArm"), idleDuration, idleFrames, (t) => ({
      z: -Math.sin(t * (Math.PI * 2 / 3.2)) * 0.012,
      x: Math.cos(t * (Math.PI * 2 / 3.2)) * 0.008,
    }))
  );

  // Subtle lifelike neck and head micro-motion
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}Neck`, getBoneRestQuat("Neck"), idleDuration, idleFrames, (t) => ({
      x: -Math.sin(t * (Math.PI * 2 / 3.2)) * 0.008,
    }))
  );
  idleTracks.push(
    makeRelativeRotationTrack(`${prefix}Head`, getBoneRestQuat("Head"), idleDuration, idleFrames, (t) => ({
      y: Math.cos(t * (Math.PI * 2 / 3.2)) * 0.015,
      x: -Math.sin(t * (Math.PI * 2 / 3.2)) * 0.006,
    }))
  );

  const idleClip = new THREE.AnimationClip("PedestalIdle", idleDuration, idleTracks);

  // -------------------------------------------------------------------------
  // 2. WALK (Duration 1.05s, ~114 steps/min): Natural in-place walking gait
  // -------------------------------------------------------------------------
  const walkDuration = 1.05;
  const walkFrames = 36;
  const walkTracks: THREE.KeyframeTrack[] = [];

  // Hips vertical bounce and lateral weight-transfer sway
  const walkHipTimes: number[] = [];
  const walkHipPositions: number[] = [];
  const bounceScale = isMixamo ? 1.4 : 0.018;
  const swayScale = isMixamo ? 0.9 : 0.012;

  for (let i = 0; i < walkFrames; i++) {
    const t = (i / (walkFrames - 1)) * walkDuration;
    walkHipTimes.push(t);
    const bounce = Math.sin((t / walkDuration) * Math.PI * 4) * bounceScale;
    const sway = Math.sin((t / walkDuration) * Math.PI * 2) * swayScale;
    walkHipPositions.push(hipsRestPos.x + sway, hipsRestPos.y + bounce, hipsRestPos.z);
  }
  walkTracks.push(new THREE.VectorKeyframeTrack(`${hipsName}.position`, walkHipTimes, walkHipPositions));

  // Pelvis / Hips rotation: subtle roll and yaw toward leading leg
  walkTracks.push(
    makeRelativeRotationTrack(hipsName, getBoneRestQuat("Hips"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return {
        x: 0.02,
        y: Math.sin(p) * 0.045,
        z: Math.sin(p) * 0.025,
      };
    })
  );

  // Torso / Spine: subtle upright counter-twist opposite to pelvis
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine`, getBoneRestQuat("Spine"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return {
        x: 0.035, // upright athletic posture
        y: -Math.sin(p) * 0.040, // counter-rotation
      };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine1`, getBoneRestQuat("Spine1"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return {
        x: 0.020,
        y: -Math.sin(p) * 0.020,
      };
    })
  );

  // Legs: LeftUpLeg & RightUpLeg (out of phase by PI)
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftUpLeg`, getBoneRestQuat("LeftUpLeg"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return {
        x: Math.sin(p) * 0.34, // forward/backward stride ~19 deg
        z: -Math.sin(p) * 0.02,
      };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}RightUpLeg`, getBoneRestQuat("RightUpLeg"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2 + Math.PI;
      return {
        x: Math.sin(p) * 0.34,
        z: Math.sin(p) * 0.02,
      };
    })
  );

  // Knees: LeftLeg & RightLeg (flexion on backswing / swing-through)
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftLeg`, getBoneRestQuat("LeftLeg"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      const bend = Math.max(0, -Math.sin(p)) * 0.58;
      return { x: -bend };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}RightLeg`, getBoneRestQuat("RightLeg"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2 + Math.PI;
      const bend = Math.max(0, -Math.sin(p)) * 0.58;
      return { x: -bend };
    })
  );

  // Feet / Ankles: LeftFoot & RightFoot
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftFoot`, getBoneRestQuat("LeftFoot"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return { x: Math.sin(p) * 0.18 };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}RightFoot`, getBoneRestQuat("RightFoot"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2 + Math.PI;
      return { x: Math.sin(p) * 0.18 };
    })
  );

  // Reciprocal Arm Swing: LeftArm swings with RightLeg (phase + PI)
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftArm`, getBoneRestQuat("LeftArm"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2 + Math.PI;
      return {
        x: Math.sin(p) * 0.30,
        z: 0.04,
      };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}RightArm`, getBoneRestQuat("RightArm"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return {
        x: Math.sin(p) * 0.30,
        z: -0.04,
      };
    })
  );

  // Forearms / Elbows: subtle natural flexion during stride
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftForeArm`, getBoneRestQuat("LeftForeArm"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2 + Math.PI;
      return { x: -0.20 - Math.max(0, Math.sin(p)) * 0.15 };
    })
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}RightForeArm`, getBoneRestQuat("RightForeArm"), walkDuration, walkFrames, (t) => {
      const p = (t / walkDuration) * Math.PI * 2;
      return { x: -0.20 - Math.max(0, Math.sin(p)) * 0.15 };
    })
  );

  // Stabilized head and neck gaze during walk
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}Neck`, getBoneRestQuat("Neck"), walkDuration, walkFrames, () => ({
      x: -0.015,
    }))
  );
  walkTracks.push(
    makeRelativeRotationTrack(`${prefix}Head`, getBoneRestQuat("Head"), walkDuration, walkFrames, () => ({
      x: -0.010,
    }))
  );

  const walkClip = new THREE.AnimationClip("PedestalWalk", walkDuration, walkTracks);

  // -------------------------------------------------------------------------
  // 3. RUN (Duration 0.72s, ~166 steps/min): Energetic in-place athletic jog
  // -------------------------------------------------------------------------
  const runDuration = 0.72;
  const runFrames = 30;
  const runTracks: THREE.KeyframeTrack[] = [];

  const runHipTimes: number[] = [];
  const runHipPositions: number[] = [];
  const runBounceScale = isMixamo ? 2.5 : 0.035;

  for (let i = 0; i < runFrames; i++) {
    const t = (i / (runFrames - 1)) * runDuration;
    runHipTimes.push(t);
    const bounce = Math.sin((t / runDuration) * Math.PI * 4) * runBounceScale;
    runHipPositions.push(hipsRestPos.x, hipsRestPos.y + bounce, hipsRestPos.z);
  }
  runTracks.push(new THREE.VectorKeyframeTrack(`${hipsName}.position`, runHipTimes, runHipPositions));

  // Dynamic forward athletic spine lean
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}Spine`, getBoneRestQuat("Spine"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2;
      return {
        x: 0.14, // forward athletic jog posture
        y: -Math.sin(p) * 0.06,
      };
    })
  );

  // Run Thighs: larger stride amplitude (~34 deg)
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftUpLeg`, getBoneRestQuat("LeftUpLeg"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2;
      return { x: Math.sin(p) * 0.60 };
    })
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}RightUpLeg`, getBoneRestQuat("RightUpLeg"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2 + Math.PI;
      return { x: Math.sin(p) * 0.60 };
    })
  );

  // Run Knees: deeper dynamic heel-lift flexion (~50 deg)
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftLeg`, getBoneRestQuat("LeftLeg"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2;
      const bend = Math.max(0, -Math.sin(p)) * 0.90;
      return { x: -bend };
    })
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}RightLeg`, getBoneRestQuat("RightLeg"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2 + Math.PI;
      const bend = Math.max(0, -Math.sin(p)) * 0.90;
      return { x: -bend };
    })
  );

  // Run Arms: athletic 90-deg bent elbow pump
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftArm`, getBoneRestQuat("LeftArm"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2 + Math.PI;
      return { x: Math.sin(p) * 0.55, z: 0.08 };
    })
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}RightArm`, getBoneRestQuat("RightArm"), runDuration, runFrames, (t) => {
      const p = (t / runDuration) * Math.PI * 2;
      return { x: Math.sin(p) * 0.55, z: -0.08 };
    })
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}LeftForeArm`, getBoneRestQuat("LeftForeArm"), runDuration, runFrames, () => ({
      x: -0.90, // athletic bent elbow
    }))
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}RightForeArm`, getBoneRestQuat("RightForeArm"), runDuration, runFrames, () => ({
      x: -0.90,
    }))
  );

  // Focused forward athletic gaze
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}Neck`, getBoneRestQuat("Neck"), runDuration, runFrames, () => ({
      x: -0.06,
    }))
  );
  runTracks.push(
    makeRelativeRotationTrack(`${prefix}Head`, getBoneRestQuat("Head"), runDuration, runFrames, () => ({
      x: -0.04,
    }))
  );

  const runClip = new THREE.AnimationClip("PedestalRun", runDuration, runTracks);

  // -------------------------------------------------------------------------
  // 4. DIRECTOR POSE / SPECIAL DANCE
  // -------------------------------------------------------------------------
  let poseClip: THREE.AnimationClip;

  if (nativeDanceClip && isMixamo) {
    // For Michelle: preserve Michelle's native SambaDance clip exactly,
    // ensuring we do NOT zero out or corrupt her rest-pose Z coordinate!
    const sanitizedTracks: THREE.KeyframeTrack[] = [];
    for (const track of nativeDanceClip.tracks) {
      if (track.name === "mixamorig:Hips.position") {
        // Keep Michelle's native translation but remove horizontal X drift so she stays centered on pedestal
        const cloned = track.clone();
        const vals = cloned.values;
        // Compute average X offset
        let sumX = 0;
        const count = vals.length / 3;
        for (let i = 0; i < vals.length; i += 3) sumX += vals[i];
        const avgX = sumX / count;

        for (let i = 0; i < vals.length; i += 3) {
          vals[i] -= avgX; // center X
          // Preserves native Y bounce and native Z (~ -102.6cm)!
        }
        sanitizedTracks.push(cloned);
      } else {
        sanitizedTracks.push(track.clone());
      }
    }
    poseClip = new THREE.AnimationClip("PedestalPose", nativeDanceClip.duration, sanitizedTracks);
  } else {
    // For Male (Alex Vance): Sophisticated cinematic director stance
    // Left hand gesturing / framing, right arm at side, weight shifted onto back leg
    const poseDuration = 4.0;
    const poseFrames = 40;
    const poseTracks: THREE.KeyframeTrack[] = [];

    // Weight shift in Hips
    poseTracks.push(
      makeRelativeRotationTrack(hipsName, getBoneRestQuat("Hips"), poseDuration, poseFrames, (t) => ({
        z: 0.05 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.008, // weight on right hip
        y: -0.06,
      }))
    );

    // Spine posture
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}Spine`, getBoneRestQuat("Spine"), poseDuration, poseFrames, (t) => ({
        x: 0.03 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.012,
        y: 0.05,
      }))
    );

    // Left Arm raised in director gesture (framing the shot)
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}LeftArm`, getBoneRestQuat("LeftArm"), poseDuration, poseFrames, (t) => ({
        x: -0.65 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.015,
        z: -0.35,
        y: 0.25,
      }))
    );
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}LeftForeArm`, getBoneRestQuat("LeftForeArm"), poseDuration, poseFrames, () => ({
        x: -0.85,
      }))
    );

    // Right Arm relaxed at side
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}RightArm`, getBoneRestQuat("RightArm"), poseDuration, poseFrames, (t) => ({
        z: -0.06 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.008,
      }))
    );

    // Confident director head orientation
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}Neck`, getBoneRestQuat("Neck"), poseDuration, poseFrames, () => ({
        x: 0.015,
        y: 0.03,
      }))
    );
    poseTracks.push(
      makeRelativeRotationTrack(`${prefix}Head`, getBoneRestQuat("Head"), poseDuration, poseFrames, (t) => ({
        z: -0.04,
        x: 0.02 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.008,
        y: 0.06,
      }))
    );

    poseClip = new THREE.AnimationClip("PedestalPose", poseDuration, poseTracks);
  }

  return {
    idle: idleClip,
    walk: walkClip,
    run: runClip,
    pose: poseClip,
  };
}

/**
 * Universal clip builder: builds clean, stable, in-place humanoid clips
 * supporting both THREE.Object3D (scene root) and legacy clip array signatures.
 */
export function buildCharacterClips(
  sceneOrAnimations: THREE.Object3D | THREE.AnimationClip[],
  isRPMModel = false,
  extraDanceClip?: THREE.AnimationClip
): CharacterClipSet {
  let boneMap: Map<string, BoneTransformRecord>;
  const isMixamo = !isRPMModel;

  if (sceneOrAnimations && (sceneOrAnimations as THREE.Object3D).isObject3D) {
    boneMap = extractBoneRestMap(sceneOrAnimations as THREE.Object3D);
  } else {
    boneMap = isRPMModel ? getRPMFallbackBones() : getMixamoFallbackBones();
  }

  // If scene has missing bones in the map, augment with fallbacks
  if (isRPMModel) {
    const fallbacks = getRPMFallbackBones();
    for (const [k, v] of fallbacks.entries()) {
      if (!boneMap.has(k)) boneMap.set(k, v);
    }
  } else {
    const fallbacks = getMixamoFallbackBones();
    for (const [k, v] of fallbacks.entries()) {
      if (!boneMap.has(k)) boneMap.set(k, v);
    }
  }

  return buildProceduralHumanoidClips(boneMap, isMixamo, extraDanceClip);
}

/**
 * Manages active AnimationActions with smooth cross-fading
 */
export class AnimationStateManager {
  private mixer: THREE.AnimationMixer;
  private actions: Map<AnimationActionState, THREE.AnimationAction> = new Map();
  private currentActionState: AnimationActionState | null = null;

  constructor(root: THREE.Object3D, clips: CharacterClipSet) {
    this.mixer = new THREE.AnimationMixer(root);

    if (clips.idle) {
      const act = this.mixer.clipAction(clips.idle);
      act.setLoop(THREE.LoopRepeat, Infinity);
      this.actions.set("idle", act);
    }

    if (clips.walk) {
      const act = this.mixer.clipAction(clips.walk);
      act.setLoop(THREE.LoopRepeat, Infinity);
      this.actions.set("walk", act);
    }

    if (clips.run) {
      const act = this.mixer.clipAction(clips.run);
      act.setLoop(THREE.LoopRepeat, Infinity);
      this.actions.set("run", act);
    }

    if (clips.pose) {
      const act = this.mixer.clipAction(clips.pose);
      act.setLoop(THREE.LoopRepeat, Infinity);
      this.actions.set("pose", act);
    }
  }

  public play(state: AnimationActionState, transitionDuration = 0.45): void {
    if (this.currentActionState === state) return;

    const nextAction = this.actions.get(state) || this.actions.get("idle");
    if (!nextAction) return;

    if (this.currentActionState) {
      const prevAction = this.actions.get(this.currentActionState);
      if (prevAction) {
        prevAction.fadeOut(transitionDuration);
      }
    }

    nextAction.reset().fadeIn(transitionDuration).play();
    this.currentActionState = state;
  }

  public update(delta: number): void {
    this.mixer.update(delta);
  }

  public dispose(): void {
    this.mixer.stopAllAction();
  }

  public getCurrentState(): AnimationActionState | null {
    return this.currentActionState;
  }
}
