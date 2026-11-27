import { useEffect, useState, useRef } from "react";

export default function CinematicCursor() {
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorElRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Check if device is touch-primary
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Check if hovering over an interactive element with custom cursor attribute
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("button, a, input, [role='button'], [data-cursor]");
        if (interactive) {
          const customText = interactive.getAttribute("data-cursor") || "";
          setIsHovered((prev) => (!prev ? true : prev));
          setCursorText((prev) => (prev !== customText ? customText : prev));
        } else {
          setIsHovered((prev) => (prev ? false : prev));
          setCursorText((prev) => (prev ? "" : prev));
        }
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Direct GPU-accelerated lerp loop without triggering React reconciliations
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentPosRef.current.x = lerp(currentPosRef.current.x, mouseRef.current.x, 0.22);
      currentPosRef.current.y = lerp(currentPosRef.current.y, mouseRef.current.y, 0.22);

      if (cursorElRef.current) {
        cursorElRef.current.style.transform = `translate3d(${Math.round(currentPosRef.current.x)}px, ${Math.round(currentPosRef.current.y)}px, 0)`;
      }

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  if (isMobile || !isVisible) return null;

  return (
    <div
      ref={cursorElRef}
      className={`cinematic-cursor-wrap ${isHovered ? "is-hovered" : ""} ${cursorText ? "has-text" : ""}`}
      style={{
        transform: `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0)`,
        willChange: "transform",
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
