import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M3.5 10h13M11.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return <ArrowRight {...props} />;
}

export function LinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M8.1 11.9a3.3 3.3 0 0 0 4.7 0l2.05-2.05a3.3 3.3 0 0 0-4.67-4.67L9 6.36M11.9 8.1a3.3 3.3 0 0 0-4.7 0L5.15 10.15a3.3 3.3 0 0 0 4.67 4.67L11 13.64" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m7.1 4.9 8 5.1-8 5.1V4.9Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M6.6 4.5v11M13.4 4.5v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M16.5 9.1a6.2 6.2 0 0 1-6.7 6.1 7 7 0 0 1-2.5-.5L3.5 16l1.25-3.35A6.1 6.1 0 0 1 3.5 9.1a6.2 6.2 0 0 1 6.5-6 6.2 6.2 0 0 1 6.5 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8.8h6M7 11.5h3.8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M7.4 3.8H3.8v3.6M12.6 3.8h3.6v3.6M16.2 12.6v3.6h-3.6M7.4 16.2H3.8v-3.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="7.4" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.3 15.5c.35-2.35 2-3.75 4.1-3.75s3.75 1.4 4.1 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12.6 5.25a2.25 2.25 0 0 1 0 4.3M14.2 11.95c1.55.3 2.45 1.45 2.65 3.15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m3.6 3.8 12.8 6.2-12.8 6.2 1.35-6.2-1.35-6.2Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M4.95 10h7.3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function TicketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M3.3 6.5h13.4v2.15a1.4 1.4 0 0 0 0 2.7v2.15H3.3v-2.15a1.4 1.4 0 0 0 0-2.7V6.5Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" strokeDasharray="0.1 0" />
      <path d="M11.7 6.7v6.6" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1.4 1.4" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 8h2.6L10 5.2v9.6L6.6 12H4V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12.7 7.2a4 4 0 0 1 0 5.6M14.8 5.2a7 7 0 0 1 0 9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="4.8" y="8.7" width="10.4" height="7.5" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.1 8.7V6.9a2.9 2.9 0 1 1 5.8 0v1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="3.2" y="4.2" width="13.6" height="11.6" rx="1" stroke="currentColor" strokeWidth="1.15" />
      <path d="M6.4 4.3v11.4M13.6 4.3v11.4M3.3 7.7h3.1M3.3 10h3.1M3.3 12.3h3.1M13.6 7.7h3.1M13.6 10h3.1M13.6 12.3h3.1" stroke="currentColor" strokeWidth="0.95" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="6.8" stroke="currentColor" strokeWidth="1.1" />
      <path d="m12.6 7.4-1.5 3.7-3.7 1.5 1.5-3.7 3.7-1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m4.6 10.2 3.4 3.4 7.4-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M5.5 5.5l1.4 1.4M13.1 13.1l1.4 1.4M5.5 14.5l1.4-1.4M13.1 6.9l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function VolumeMuteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 8h2.6L10 5.2v9.6L6.6 12H4V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m13 8 4 4M17 8l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ProjectorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="7" width="15" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="13" cy="10.7" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="10.7" r="0.9" fill="currentColor" />
      <circle cx="8.5" cy="10.7" r="0.9" fill="currentColor" />
      <path d="M4.5 14.5v1.8M15.5 14.5v1.8M8 7V4.5M12 7V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function LaurelLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 21C8 19 6 15 6 10C6 6 8 3 10 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 7.5C5 7 3.5 8 3.5 9.5C3.5 11 5 12 7 11.5M7 13.5C5.5 13 4 14 4 15.5C4 17 5.5 18 7.5 17.5M8 18C7 18 6 19 6 20C6 21 7.5 21.5 9 20.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function LaurelRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 21C16 19 18 15 18 10C18 6 16 3 14 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17.5 7.5C19 7 20.5 8 20.5 9.5C20.5 11 19 12 17 11.5M17 13.5C18.5 13 20 14 20 15.5C20 17 18.5 18 16.5 17.5M16 18C17 18 18 19 18 20C18 21 16.5 21.5 15 20.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 2.5 3.5 5.5v4.8c0 4.2 2.8 7.2 6.5 8.2 3.7-1 6.5-4 6.5-8.2V5.5L10 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m7.2 10 2 2 3.8-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

