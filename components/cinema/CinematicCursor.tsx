"use client";

import { useEffect, useState, useRef } from "react";

export default function CinematicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reqRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device is touch-primary
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over an interactive element with custom cursor attribute
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("button, a, input, [role='button'], [data-cursor]");
        if (interactive) {
          setIsHovered(true);
          const customText = interactive.getAttribute("data-cursor") || "";
          setCursorText(customText);
        } else {
          setIsHovered(false);
          setCursorText("");
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth lerp animation loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentPosRef.current.x = lerp(currentPosRef.current.x, mouseRef.current.x, 0.22);
      currentPosRef.current.y = lerp(currentPosRef.current.y, mouseRef.current.y, 0.22);

      setPos({
        x: currentPosRef.current.x,
        y: currentPosRef.current.y,
      });

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      className={`cinematic-cursor-wrap ${isHovered ? "is-hovered" : ""} ${cursorText ? "has-text" : ""}`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div className="cursor-dot" />
      <div className="cursor-ring">
        {cursorText && <span className="cursor-text">{cursorText}</span>}
      </div>
    </div>
  );
}
