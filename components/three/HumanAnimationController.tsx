"use client";

import { Activity, Eye, AlertCircle, Sparkles, Footprints, Zap, Clapperboard } from "lucide-react";
import { AnimationActionState } from "@/lib/animationController";

interface HumanAnimationControllerProps {
  activeAnimation: AnimationActionState;
  onSelectAnimation: (anim: AnimationActionState) => void;
  isAnimatable: boolean;
  ikEnabled: boolean;
  onToggleIK: () => void;
}

const ANIMATION_ACTIONS: {
  id: AnimationActionState;
  label: string;
  Icon: typeof Sparkles;
}[] = [
  { id: "idle", label: "Idle", Icon: Sparkles },
  { id: "walk", label: "Walk", Icon: Footprints },
  { id: "run", label: "Run", Icon: Zap },
  { id: "pose", label: "Director pose", Icon: Clapperboard },
];

export default function HumanAnimationController({
  activeAnimation,
  onSelectAnimation,
  isAnimatable,
  ikEnabled,
  onToggleIK,
}: HumanAnimationControllerProps) {
  if (!isAnimatable) {
    return (
      <div className="studio-notice" role="status">
        <AlertCircle size={15} aria-hidden="true" />
        <span>Static anatomical mesh. Skeletal animation requires an armature rig.</span>
      </div>
    );
  }

  return (
    <div className="studio-anim-group">
      <div className="studio-anim-label">
        <Activity size={14} aria-hidden="true" />
        <span>Motion</span>
      </div>

      <div className="studio-pill-group" role="group" aria-label="Character animation">
        {ANIMATION_ACTIONS.map((action) => {
          const Icon = action.Icon;
          return (
            <button
              key={action.id}
              type="button"
              aria-pressed={activeAnimation === action.id}
              onClick={() => onSelectAnimation(action.id)}
              className="studio-pill-btn"
            >
              <Icon size={14} aria-hidden="true" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-pressed={ikEnabled}
        onClick={onToggleIK}
        className={`dash-btn ${ikEnabled ? "dash-btn--secondary" : "dash-btn--quiet"}`}
        title="Procedural IK tracks mouse coordinates with head, neck, and spine bone rotation"
      >
        <Eye size={14} aria-hidden="true" />
        <span>Look-at IK {ikEnabled ? "on" : "off"}</span>
      </button>
    </div>
  );
}
