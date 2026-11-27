"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AvatarConfig } from "./types";
import { DEFAULT_AVATAR, DEFAULT_BOY_AVATAR, saveAvatarToStorage } from "./avatarStorage";
import { Sparkles, RotateCw, Check, X, Gauge, ExternalLink } from "lucide-react";
import { AnimationActionState } from "@/lib/animationController";
import { HUMAN_MODELS, HumanModelMetadata } from "@/lib/data/humanModels";
import HumanModelSelector from "@/components/three/HumanModelSelector";
import HumanAnimationController from "@/components/three/HumanAnimationController";
import HumanViewer from "@/components/three/HumanViewer";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
}

export default function AvatarCustomizerModal({
  isOpen,
  onClose,
  currentConfig,
  onSave,
}: AvatarCustomizerModalProps) {
  const [draft, setDraft] = useState<AvatarConfig>(() => ({
    ...DEFAULT_AVATAR,
    ...currentConfig,
    modelBase: currentConfig.modelBase || "girl",
  }));

  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState<number | undefined>(undefined);
  const [isFaceFocus, setIsFaceFocus] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<AnimationActionState>("idle");
  const [ikEnabled, setIkEnabled] = useState(true);
  const [activeDpr, setActiveDpr] = useState(1.5);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  const selectedModel = useMemo<HumanModelMetadata>(() => {
    if (draft.modelBase === "anatomical") return HUMAN_MODELS[2];
    if (draft.modelBase === "boy") return HUMAN_MODELS[0];
    return HUMAN_MODELS[1];
  }, [draft.modelBase]);

  if (!isOpen) return null;

  const handleSelectModel = (model: HumanModelMetadata) => {
    setSelectedAngle(0);
    setIsSpinning(false);

    if (model.id === "male") {
      setDraft((prev) => ({
        ...DEFAULT_BOY_AVATAR,
        modelBase: "boy",
        name:
          prev.name &&
          prev.name !== "Aria Vance" &&
          prev.name !== "Anatomical Human Figure"
            ? prev.name
            : "Alex Vance",
        level: prev.level || 15,
      }));
    } else if (model.id === "female") {
      setDraft((prev) => ({
        ...DEFAULT_AVATAR,
        modelBase: "girl",
        name:
          prev.name &&
          prev.name !== "Alex Vance" &&
          prev.name !== "Anatomical Human Figure"
            ? prev.name
            : "Aria Vance",
        level: prev.level || 16,
      }));
    } else {
      setDraft((prev) => ({
        ...DEFAULT_AVATAR,
        modelBase: "anatomical",
        name: "Anatomical Human Figure",
        title: "Full-Body Skeletal & Muscular Study",
        level: 20,
      }));
    }
  };

  const handleAngleClick = (angleRad: number) => {
    setIsSpinning(false);
    setSelectedAngle(angleRad);
  };

  const handleSaveAndClose = () => {
    saveAvatarToStorage(draft);
    onSave(draft);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="dash-root dash-dialog dash-dialog--studio"
      aria-labelledby="studio-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="dash-dialog-shell">
        <div className="dash-dialog-head">
          <div className="dash-dialog-title-group">
            <span className="dash-dialog-icon" aria-hidden="true">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 id="studio-dialog-title" className="dash-dialog-title">
                3D character studio
              </h2>
              <p className="dash-dialog-sub">
                glTF 2.0 character rig and procedural look-at IK
              </p>
            </div>
          </div>

          <div className="dash-dialog-actions">
            <HumanModelSelector
              selectedModelId={selectedModel.id}
              onSelectModel={handleSelectModel}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dash-icon-close"
            aria-label="Close character studio"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="studio-toolbar">
          <div className="studio-meta">
            <strong>{selectedModel.name}</strong>
            <span className="studio-meta-sep" aria-hidden="true" />
            <span>{selectedModel.triangleCount.toLocaleString()} triangles</span>
            <span className="studio-meta-sep" aria-hidden="true" />
            <span
              className={
                selectedModel.isRigged ? "studio-status-rigged" : "studio-status-static"
              }
            >
              {selectedModel.isRigged ? "Rigged and animatable" : "Static anatomy"}
            </span>
            <span className="studio-meta-sep" aria-hidden="true" />
            <span className="studio-anim-label">
              <Gauge size={13} aria-hidden="true" />
              <span>{activeDpr.toFixed(1)}× DPR</span>
            </span>
            <span className="studio-meta-sep" aria-hidden="true" />
            <span>{selectedModel.fileSize}</span>
          </div>

          <div className="studio-camera-bar">
            <div className="studio-pill-group" role="group" aria-label="Turnaround angle">
              {[
                { label: "Front (0°)", angle: 0 },
                { label: "3/4 (45°)", angle: Math.PI * 0.25 },
                { label: "Side (90°)", angle: Math.PI * 0.5 },
                { label: "Back (180°)", angle: Math.PI },
              ].map((pos) => (
                <button
                  key={pos.label}
                  type="button"
                  aria-pressed={selectedAngle === pos.angle}
                  onClick={() => handleAngleClick(pos.angle)}
                  className="studio-pill-btn"
                >
                  {pos.label}
                </button>
              ))}
            </div>

            <div className="studio-pill-group" role="group" aria-label="Camera framing">
              <button
                type="button"
                aria-pressed={!isFaceFocus}
                onClick={() => setIsFaceFocus(false)}
                className="studio-pill-btn"
              >
                Full runway
              </button>
              <button
                type="button"
                aria-pressed={isFaceFocus}
                onClick={() => setIsFaceFocus(true)}
                className="studio-pill-btn"
              >
                Face closeup
              </button>
            </div>
          </div>
        </div>

        <div className="studio-stage">
          <HumanViewer
            selectedModel={selectedModel}
            activeAnimation={activeAnimation}
            ikEnabled={ikEnabled}
            isSpinning={isSpinning}
            manualAngle={selectedAngle}
            isFaceFocus={isFaceFocus}
            onDprChange={setActiveDpr}
            config={draft}
          />
        </div>

        <div className="studio-bottom-bar">
          <HumanAnimationController
            activeAnimation={activeAnimation}
            onSelectAnimation={setActiveAnimation}
            isAnimatable={selectedModel.isAnimatable}
            ikEnabled={ikEnabled}
            onToggleIK={() => setIkEnabled(!ikEnabled)}
          />

          <button
            type="button"
            aria-pressed={isSpinning}
            onClick={() => {
              setIsSpinning(!isSpinning);
              setSelectedAngle(undefined);
            }}
            className={`dash-btn ${isSpinning ? "dash-btn--secondary" : "dash-btn--quiet"}`}
          >
            <RotateCw
              size={14}
              className={isSpinning ? "studio-spin-icon--active" : ""}
              aria-hidden="true"
            />
            <span>{isSpinning ? "Auto-spin on" : "360° spin"}</span>
          </button>
        </div>

        <div className="dash-dialog-foot">
          <div className="dash-row-actions">
            <p className="dash-dialog-sub">WebGL 2.0 PBR pipeline</p>
            <a
              href="https://three.ws/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="dash-btn dash-btn--quiet"
              title="Launch three.ws 3D Studio & AI Forge"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>three.ws Studio</span>
            </a>
          </div>

          <div className="dash-row-actions">
            <button type="button" onClick={onClose} className="dash-btn dash-btn--quiet">
              Close
            </button>

            <button
              type="button"
              onClick={handleSaveAndClose}
              className="dash-btn dash-btn--primary"
            >
              <Check size={15} aria-hidden="true" />
              <span>Equip {selectedModel.name.replace("Realistic ", "")}</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
