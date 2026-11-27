"use client";

import { HUMAN_MODELS, HumanModelMetadata } from "@/lib/data/humanModels";
import { User, Activity } from "lucide-react";

interface HumanModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (model: HumanModelMetadata) => void;
  className?: string;
}

export default function HumanModelSelector({
  selectedModelId,
  onSelectModel,
  className = "",
}: HumanModelSelectorProps) {
  return (
    <div
      className={`studio-pill-group ${className}`}
      role="group"
      aria-label="Character model"
    >
      {HUMAN_MODELS.map((model) => {
        const isSelected = selectedModelId === model.id;
        const IconComponent = model.category === "anatomical" ? Activity : User;

        return (
          <button
            key={model.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectModel(model)}
            className="studio-pill-btn"
            title={`${model.name} — ${model.isRigged ? "Rigged & Animated" : "Static Anatomy"}`}
          >
            <IconComponent size={14} aria-hidden="true" />
            <span>{model.name.replace("Realistic ", "")}</span>
          </button>
        );
      })}
    </div>
  );
}
