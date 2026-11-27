export interface HumanModelMetadata {
  id: string;
  name: string;
  subtitle: string;
  category: "male" | "female" | "anatomical";
  modelPath: string;
  meshoptPath: string;
  fileSize: string;
  triangleCount: number;
  vertexCount: number;
  materialCount: number;
  isRigged: boolean;
  jointCount: number;
  isAnimatable: boolean;
  availableClips: string[];
  scale: [number, number, number];
  position: [number, number, number];
  description: string;
}

export const HUMAN_MODELS: HumanModelMetadata[] = [
  {
    id: "male",
    name: "Realistic Male Human",
    subtitle: "Alex Vance · VIP Cinematographer",
    category: "male",
    modelPath: "/models/humans/male-human.glb",
    meshoptPath: "/models/humans/male-human.meshopt.glb",
    fileSize: "1.75 MB (1.29 MB Meshopt)",
    triangleCount: 15817,
    vertexCount: 9596,
    materialCount: 9,
    isRigged: true,
    jointCount: 67,
    isAnimatable: true,
    availableClips: ["Idle", "Walk", "Run", "Director Pose"],
    scale: [1.05, 1.05, 1.05],
    position: [0, -1.60, 0],
    description:
      "Full-body anatomically proportionate adult male in neutral A-pose. Equipped with 67-joint humanoid skeleton, complete skinning weights, and modern luxury tailored tuxedo.",
  },
  {
    id: "female",
    name: "Realistic Female Human",
    subtitle: "Aria Vance · Premiere Director",
    category: "female",
    modelPath: "/models/humans/female-human.glb",
    meshoptPath: "/models/humans/female-human.meshopt.glb",
    fileSize: "3.13 MB (1.22 MB Meshopt)",
    triangleCount: 28106,
    vertexCount: 16340,
    materialCount: 1,
    isRigged: true,
    jointCount: 65,
    isAnimatable: true,
    availableClips: ["Idle", "Walk", "Run", "Director Pose", "SambaDance"],
    scale: [1.16, 1.16, 1.16],
    position: [0, -1.60, 0],
    description:
      "Full-body anatomically proportionate adult female in neutral A-pose. Features 65-joint Mixamo armature, clean edge loops around shoulders and knees, and luxury diffuse PBR texture.",
  },
  {
    id: "anatomical",
    name: "Anatomical Human Figure",
    subtitle: "Full-Body Skeletal & Muscular Study",
    category: "anatomical",
    modelPath: "/models/humans/anatomical-human.glb",
    meshoptPath: "/models/humans/anatomical-human.meshopt.glb",
    fileSize: "11.71 MB (8.90 MB Meshopt)",
    triangleCount: 290886,
    vertexCount: 176122,
    materialCount: 2,
    isRigged: false,
    jointCount: 0,
    isAnimatable: false,
    availableClips: [],
    scale: [1.0, 1.0, 1.0],
    position: [0, -1.60, 0],
    description:
      "Detailed anatomical human figure comprising 826 named skeletal and muscular structures (axial skeleton, cranium, pectoral girdle, extremities). Unskinned static geometry for anatomical inspection and future auto-rigging.",
  },
];
