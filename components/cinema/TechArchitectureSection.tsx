"use client";

import { useState } from "react";

interface TechSpec {
  symbol: string;
  badge: string;
  title: string;
  purpose: string;
  desc: string;
}

const PIPELINE_SPECS: TechSpec[] = [
  {
    symbol: "VTE",
    badge: "FRONTEND",
    title: "React 19 + Vite",
    purpose: "Website architecture",
    desc: "Lightning-fast HMR and optimized production bundling powering Nocturne's client-side SPA routing and UI overlay chassis.",
  },
  {
    symbol: "R187",
    badge: "3D ENGINE",
    title: "Three.js (r187)",
    purpose: "Rendering and animation",
    desc: "Physically-based WebGL 2.0 rendering engine supporting ACESFilmic tone mapping, PCF soft shadows, and custom GLSL shader pipelines.",
  },
  {
    symbol: "R3F",
    badge: "REACT INTEGRATION",
    title: "React Three Fiber",
    purpose: "Declarative 3D components",
    desc: "Singular declarative Three.js scene graph comprising the auditorium, velvet drapery, brass sconces, and volumetric light cone rendering at 60fps.",
  },
  {
    symbol: "DRI",
    badge: "UTILITIES",
    title: "Drei Ecosystem",
    purpose: "Model loading & scene helpers",
    desc: "Preloaded GLTF loaders, MeshReflectorMaterial, ContactShadows, Sparkles, and camera rigs with zero layout thrashing.",
  },
  {
    symbol: "BLD",
    badge: "CHARACTER CREATION",
    title: "Blender 3D",
    purpose: "Human modeling and rigging",
    desc: "High-definition human anatomy sculpting, retopo, weight painting, and full skeletal deformation rigs for luxury avatars.",
  },
  {
    symbol: "GLB",
    badge: "CHARACTER FORMAT",
    title: "GLB / glTF 2.0",
    purpose: "Efficient 3D assets",
    desc: "Standardized binary glTF transmission format bundling meshes, morph targets, PBR material textures, and animation channels.",
  },
  {
    symbol: "MIX",
    badge: "ANIMATION",
    title: "AnimationMixer",
    purpose: "Walking, running, gestures",
    desc: "Multi-track animation system enabling smooth cross-fades, action blending, and loop control across Idle, Walk, Run, and Pose states.",
  },
  {
    symbol: "IK",
    badge: "ADVANCED MOTION",
    title: "Inverse Kinematics (IK)",
    purpose: "Realistic limb & look-at movement",
    desc: "Procedural biomechanical Look-At solver with spherical damping, cervical spine rotation clamping, and organic breathing sway.",
  },
  {
    symbol: "MXM",
    badge: "ANIMATION AUTHORING",
    title: "Blender / Mixamo",
    purpose: "Rigged animation clips",
    desc: "Seamless retargeting between Mixamo armature conventions and ReadyPlayerMe human male/female bone hierarchies.",
  },
  {
    symbol: "OPT",
    badge: "MODEL OPTIMIZATION",
    title: "glTF Transform + Meshopt",
    purpose: "Smaller models & faster loading",
    desc: "Geometry quantization, vertex cache reordering, deduplication, and Meshopt compression reducing payload sizes by up to 60%.",
  },
  {
    symbol: "KTX",
    badge: "TEXTURE OPTIMIZATION",
    title: "KTX2 / Basis Universal",
    purpose: "Reduced GPU texture memory",
    desc: "GPU-compressed texture transcoding (ETC1S/UASTC) with anisotropic filtering and mipmapping for instantaneous VRAM uploads.",
  },
  {
    symbol: "LOD",
    badge: "PERFORMANCE",
    title: "Adaptive DPR + LOD",
    purpose: "Low-end device support",
    desc: "Real-time PerformanceMonitor dynamically throttling resolution (0.8x-2.0x) and geometry levels to maintain locked 60 FPS.",
  },
];

export default function TechArchitectureSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "core" | "motion" | "optimization">("all");

  const filteredSpecs = PIPELINE_SPECS.filter((spec) => {
    if (activeFilter === "core") return ["VTE", "R187", "R3F", "DRI"].includes(spec.symbol);
    if (activeFilter === "motion") return ["BLD", "GLB", "MIX", "IK", "MXM"].includes(spec.symbol);
    if (activeFilter === "optimization") return ["OPT", "KTX", "LOD"].includes(spec.symbol);
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[
          { id: "all" as const, label: "Full 12-Layer 3D Pipeline" },
          { id: "core" as const, label: "Core 3D Engine" },
          { id: "motion" as const, label: "Character & IK Motion" },
          { id: "optimization" as const, label: "Optimization & Scaling" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === tab.id
                ? "bg-[#c9a86a] text-[#09080d] font-bold shadow-[0_0_15px_rgba(201,168,106,0.35)]"
                : "bg-black/60 text-[#cfc4b3]/80 border border-[#c9a86a]/20 hover:text-[#f1e9db] hover:bg-[#c9a86a]/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 12-Layer Tech Architecture Grid */}
      <div className="tech-architecture-grid">
        {filteredSpecs.map((tech) => (
          <article key={tech.symbol} className="luxury-tech-card" data-cursor="SPEC">
            <div className="tech-card-header">
              <span className="tech-code-pill">{tech.symbol}</span>
              <span className="tech-badge-sub">{tech.badge}</span>
            </div>
            <h3 className="tech-card-title">{tech.title}</h3>
            <div className="text-[11px] font-mono text-[#c9a86a]/80 mb-2">
              {tech.purpose}
            </div>
            <p className="tech-card-desc">{tech.desc}</p>
            <div className="tech-card-footer">
              <span className="footer-bracket-left">[</span>
              <span className="footer-status-text">SPEC VERIFIED</span>
              <span className="footer-bracket-right">]</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
