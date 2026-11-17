"use client";

import { useState } from "react";
import { ArrowRightIcon, SparklesIcon } from "./icons";
import { cinematicAudio } from "@/lib/cinematicSound";

interface HowItWorksSectionProps {
  onEnterTheatre: () => void;
}

export default function HowItWorksSection({ onEnterTheatre }: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [dimmerValue, setDimmerValue] = useState(25); // House lights dimmer

  const steps = [
    {
      num: "01",
      tag: "THE REPERTOIRE",
      title: "Drop your film source",
      desc: "Paste any YouTube, Vimeo, direct MP4/WebM URL, or high-resolution banner image into the box office terminal. Metadata, aspect ratio, and color palette are parsed instantaneously on your local machine with zero upload waiting times.",
      preview: (
        <div className="step-live-widget ingestion-widget">
          <div className="mini-terminal-bar">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-filename">source_stream.mp4</span>
          </div>
          <div className="terminal-stream-data">
            <div className="data-line">
              <span className="key">RESOLVED PROTOCOL:</span>
              <span className="val gold">HTTPS / DIRECT STREAM</span>
            </div>
            <div className="data-line">
              <span className="key">CONTAINER:</span>
              <span className="val">AV1 / VP9 LOSSLESS</span>
            </div>
            <div className="data-line">
              <span className="key">BUFFER LATENCY:</span>
              <span className="val gold">0.0 ms (LOCAL DECODE)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "02",
      tag: "THE ARRIVAL",
      title: "Cross the velvet threshold",
      desc: "Select Enter the Theatre. The brass-trimmed mahogany doors part smoothly. The camera sweeps through the lobby, glides past the warm sconces of the orchestra aisle, and seats you in centre orchestra row F, seat 07.",
      preview: (
        <div className="step-live-widget aisle-widget">
          <div className="theatre-perspective-box">
            <div className="perspective-curtain left" />
            <div className="perspective-screen">
              <span className="screen-title">SCREEN 04</span>
              <span className="screen-tag">ROW F · SEAT 07</span>
            </div>
            <div className="perspective-curtain right" />
            <div className="perspective-aisle-light" />
          </div>
        </div>
      ),
    },
    {
      num: "03",
      tag: "THE PREMIERE",
      title: "House lights dim to black",
      desc: "Press Play Film. The ambient sconces fade out smoothly. The curtain draws open, revealing the panoramic 2.39:1 cinemascope display. Bring friends into your private room with a one-click invite code.",
      preview: (
        <div className="step-live-widget premiere-widget">
          <div
            className="dimmer-room-canvas"
            style={{
              backgroundColor: `rgba(18, 14, 10, ${dimmerValue / 100})`,
              boxShadow: `0 0 50px rgba(231, 194, 138, ${(100 - dimmerValue) / 300})`,
            }}
          >
            <div className="dimmer-screen-glow">
              <span className="dimmer-status">
                {dimmerValue < 20 ? "PREMIERE IN PROGRESS" : "HOUSE LIGHTS DIMMING"}
              </span>
              <span className="dimmer-pct">LUMENS: {dimmerValue}%</span>
            </div>
          </div>
          <div className="dimmer-slider-wrap">
            <span className="slider-label">INTERACTIVE LIGHT DIMMER</span>
            <input
              type="range"
              min="0"
              max="100"
              value={dimmerValue}
              onChange={(e) => {
                cinematicAudio.playClick(500 + Number(e.target.value) * 3);
                setDimmerValue(Number(e.target.value));
              }}
              className="dimmer-range-slider"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="how-it-works-container">
      <div className="how-steps-timeline">
        {steps.map((step, idx) => {
          const isCurrent = activeStep === idx;
          return (
            <div
              key={idx}
              className={`timeline-step-card ${isCurrent ? "is-focused" : ""}`}
              onClick={() => {
                cinematicAudio.playClick(620);
                setActiveStep(idx);
              }}
              data-cursor="SELECT"
            >
              <div className="step-badge-row">
                <span className="step-number-tag">{step.num} {"//"}</span>
                <span className="step-category">{step.tag}</span>
              </div>
              <h3 className="step-main-title">{step.title}</h3>
              <p className="step-description">{step.desc}</p>
              <div className="step-preview-container">{step.preview}</div>
            </div>
          );
        })}
      </div>

      <div className="how-cta-strip">
        <div className="how-cta-copy">
          <h4>Your private screening room is reserved.</h4>
          <p>No waiting lists. No subscriptions. Unadulterated cinema.</p>
        </div>
        <button
          type="button"
          className="btn-primary-cinematic"
          onClick={onEnterTheatre}
          data-cursor="ENTER"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Launch Screening Room</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
