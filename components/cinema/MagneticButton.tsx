import { useRef, MouseEvent, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;

    btnRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    btnRef.current.style.transition = "none";

    if (innerRef.current) {
      innerRef.current.style.transform = `translate3d(${deltaX * 0.25}px, ${deltaY * 0.25}px, 0)`;
      innerRef.current.style.transition = "none";
    }
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = "translate3d(0, 0, 0)";
    btnRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

    if (innerRef.current) {
      innerRef.current.style.transform = "translate3d(0, 0, 0)";
      innerRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-button-wrap ${className}`}
      {...props}
    >
      <span
        ref={innerRef}
        className="magnetic-inner-content"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "inherit",
        }}
      >
        {children}
      </span>
    </button>
  );
}
