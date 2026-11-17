"use client";

const TECH_SPECS = [
  {
    symbol: "R3F",
    badge: "3D SCENE GRAPH",
    title: "React Three Fiber",
    desc: "A singular declarative Three.js scene graph comprising the auditorium, velvet drapery, brass sconces, and volumetric light cone, rendering at 60fps with zero layout thrashing.",
  },
  {
    symbol: "GLSL",
    badge: "POST-PROCESSING",
    title: "Cinematic Post-Stack",
    desc: "Real-time EffectComposer pipeline running Bloom on the screen projector rays, subtle 35mm celluloid film grain, and anamorphic barrel vignette.",
  },
  {
    symbol: "P2P",
    badge: "PEER NETWORKING",
    title: "BroadcastChannel Protocol",
    desc: "Cross-tab and multi-window synchronization without any intermediate cloud server or database. Zero latency room synchronization and encrypted local persistence.",
  },
  {
    symbol: "DSP",
    badge: "SPATIAL SOUND",
    title: "Web Audio Synthesizer",
    desc: "Bespoke mathematical sound engine simulating 45Hz sub-frequency room resonance, mechanical shutter flutter, and warm analog acoustic absorption.",
  },
  {
    symbol: "LNS",
    badge: "INERTIAL SCROLL",
    title: "Lenis Motion Rig",
    desc: "Inertial smooth scrolling synchronized with camera transforms and spring damping for an organic cinematic feel that respects reduced-motion accessibility.",
  },
  {
    symbol: "A11Y",
    badge: "UNIVERSAL DESIGN",
    title: "Accessible Architecture",
    desc: "Strict WCAG AAA contrast compliance, keyboard focus rings, screen reader announcements, and automatic prefers-reduced-motion graceful degradation.",
  },
];

export default function TechArchitectureSection() {
  return (
    <div className="tech-architecture-grid">
      {TECH_SPECS.map((tech, idx) => (
        <article key={idx} className="luxury-tech-card" data-cursor="SPEC">
          <div className="tech-card-header">
            <span className="tech-code-pill">{tech.symbol}</span>
            <span className="tech-badge-sub">{tech.badge}</span>
          </div>
          <h3 className="tech-card-title">{tech.title}</h3>
          <p className="tech-card-desc">{tech.desc}</p>
          <div className="tech-card-footer">
            <span className="footer-bracket-left">[</span>
            <span className="footer-status-text">SPEC VERIFIED</span>
            <span className="footer-bracket-right">]</span>
          </div>
        </article>
      ))}
    </div>
  );
}
