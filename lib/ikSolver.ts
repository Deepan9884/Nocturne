import * as THREE from "three";

/**
 * Procedural Inverse Kinematics (IK) & Look-At Tracking Engine
 *
 * Provides biologically constrained, non-accumulative head, neck, and upper-spine
 * orientation targeting 3D coordinates (such as the cursor in screen space).
 *
 * Employs bounded quaternion delta transforms relative to cached bind poses,
 * ensuring zero integration drift, zero gimbal lock, and preventing figure collapse.
 */

export interface IKTarget {
  x: number; // Normalized -1 to +1
  y: number; // Normalized -1 to +1
}

export interface IKBoneReferences {
  head?: THREE.Bone | THREE.Object3D | null;
  neck?: THREE.Bone | THREE.Object3D | null;
  spine2?: THREE.Bone | THREE.Object3D | null;
  spine1?: THREE.Bone | THREE.Object3D | null;
}

export interface IKSolverOptions {
  enabled?: boolean;
  maxHeadYaw?: number; // radians (default ~32 deg)
  maxHeadPitch?: number; // radians (default ~22 deg)
  damping?: number; // lerp alpha (default 0.12)
}

const DEFAULT_OPTIONS: Required<IKSolverOptions> = {
  enabled: true,
  maxHeadYaw: THREE.MathUtils.degToRad(32),
  maxHeadPitch: THREE.MathUtils.degToRad(22),
  damping: 0.12,
};

export class ProceduralIKSolver {
  private currentYaw = 0;
  private currentPitch = 0;
  private options: Required<IKSolverOptions>;
  private bindQuaternions: Map<THREE.Object3D, THREE.Quaternion> = new Map();
  private eulerDelta = new THREE.Euler(0, 0, 0, "YXZ");
  private qDelta = new THREE.Quaternion();

  constructor(options?: IKSolverOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Find humanoid spine and head bones from an Object3D hierarchy,
   * supporting both Mixamo prefixes ("mixamorig:Head") and standard glTF ("Head", "Neck").
   * Automatically captures and caches initial bind quaternions.
   */
  public static discoverBones(root: THREE.Object3D): IKBoneReferences {
    const bones: IKBoneReferences = {};

    root.traverse((node) => {
      const name = node.name.toLowerCase();

      if (!bones.head && name.includes("head") && !name.includes("top") && !name.includes("wear")) {
        bones.head = node;
      } else if (!bones.neck && name.includes("neck")) {
        bones.neck = node;
      } else if (!bones.spine2 && (name.includes("spine2") || name.includes("chest"))) {
        bones.spine2 = node;
      } else if (!bones.spine1 && name.includes("spine1")) {
        bones.spine1 = node;
      }
    });

    return bones;
  }

  /**
   * Registers bone references and stores their rest pose quaternions.
   */
  public registerBones(bones: IKBoneReferences): void {
    if (bones.head && !this.bindQuaternions.has(bones.head)) {
      this.bindQuaternions.set(bones.head, bones.head.quaternion.clone());
    }
    if (bones.neck && !this.bindQuaternions.has(bones.neck)) {
      this.bindQuaternions.set(bones.neck, bones.neck.quaternion.clone());
    }
    if (bones.spine2 && !this.bindQuaternions.has(bones.spine2)) {
      this.bindQuaternions.set(bones.spine2, bones.spine2.quaternion.clone());
    }
  }

  /**
   * Update bone rotations each animation frame based on normalized target [-1, 1].
   * Uses bounded quaternion deltas relative to bind quaternions, preventing infinite integration drift.
   */
  public update(
    bones: IKBoneReferences,
    target: IKTarget,
    _elapsedTime: number,
    delta: number,
    customEnabled?: boolean
  ): void {
    // Lazily cache bind quaternions if not yet registered
    this.registerBones(bones);

    const isEnabled = customEnabled ?? this.options.enabled;

    // Calculate clamped yaw and pitch
    const targetYaw = isEnabled
      ? THREE.MathUtils.clamp(-target.x * this.options.maxHeadYaw, -this.options.maxHeadYaw, this.options.maxHeadYaw)
      : 0;

    const targetPitch = isEnabled
      ? THREE.MathUtils.clamp(-target.y * this.options.maxHeadPitch, -this.options.maxHeadPitch, this.options.maxHeadPitch)
      : 0;

    // Smooth spherical damping
    const lerpFactor = Math.min(1.0, this.options.damping * (delta * 60));
    this.currentYaw = THREE.MathUtils.lerp(this.currentYaw, targetYaw, lerpFactor);
    this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, targetPitch, lerpFactor);

    // If completely settled at 0 and disabled, no quaternion mutation is needed
    if (!isEnabled && Math.abs(this.currentYaw) < 0.0001 && Math.abs(this.currentPitch) < 0.0001) {
      this.resetBones(bones);
      return;
    }

    // Apply distributed look-at rotations:
    // Head: 60% yaw, 65% pitch (primary look focus)
    // Neck: 30% yaw, 25% pitch (cervical support)
    // Spine2: 10% yaw, 10% pitch (upper thoracic lean)
    this.applyBoneRotation(bones.head, 0.65, 0.60);
    this.applyBoneRotation(bones.neck, 0.25, 0.30);
    this.applyBoneRotation(bones.spine2, 0.10, 0.10);
  }

  private applyBoneRotation(bone: THREE.Object3D | null | undefined, pitchWeight: number, yawWeight: number): void {
    if (!bone) return;

    const baseQ = this.bindQuaternions.get(bone);
    if (!baseQ) return;

    const p = this.currentPitch * pitchWeight;
    const y = this.currentYaw * yawWeight;

    this.eulerDelta.set(p, y, 0, "YXZ");
    this.qDelta.setFromEuler(this.eulerDelta);

    // bone.quaternion = baseQ * qDelta (strictly non-accumulative)
    bone.quaternion.copy(baseQ).multiply(this.qDelta);
  }

  private resetBones(bones: IKBoneReferences): void {
    if (bones.head && this.bindQuaternions.has(bones.head)) {
      bones.head.quaternion.copy(this.bindQuaternions.get(bones.head)!);
    }
    if (bones.neck && this.bindQuaternions.has(bones.neck)) {
      bones.neck.quaternion.copy(this.bindQuaternions.get(bones.neck)!);
    }
    if (bones.spine2 && this.bindQuaternions.has(bones.spine2)) {
      bones.spine2.quaternion.copy(this.bindQuaternions.get(bones.spine2)!);
    }
  }

  public reset(): void {
    this.currentYaw = 0;
    this.currentPitch = 0;
  }
}
