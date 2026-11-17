# Nocturne (ノクターン) — Luxury Cinematic Virtual Theatre

> A luxury virtual cinema and synchronized screening room built with Next.js 16, React 19, Three.js, React Three Fiber, GSAP, and Lenis.

---

## Overview

**Nocturne** transforms private film viewing into an architectural luxury experience. Designed with warm analog lighting, champagne brass accents, and acoustically rich 432Hz ambient soundscapes, Nocturne pairs a 3D virtual auditorium with real-time video playback and peer-to-peer room synchronization.

Whether hosting a private premiere or exploring the spatial theatre hall, Nocturne delivers uncompromising aesthetic direction, fluid 60fps animations, and zero-compromise typography.

---

## Key Features

- **Spatial 3D Theatre Auditorium**:
  - Declarative Three.js scene graph via `@react-three/fiber` and `@react-three/drei`.
  - Velvet seating rows, brass sconces, dynamic projector beam cone, and screen shader reflections.
  - Interactive smooth camera transitions across multiple theatre viewpoints (Lobby, Balcony, Orchestra, Screen View).

- **Cinematic Storytelling Landing Experience**:
  - Inertial smooth-scrolling spatial tour powered by **Lenis** and **GSAP ScrollTrigger**.
  - Interactive 4-stage exploration:
    1. *Foyer & Grand Entrance*
    2. *Seating Architecture & Viewpoints*
    3. *Artisanal Concessions & Lounge*
    4. *Screen 05 VIP Premiere Showcase*
  - Anamorphic lens flare, film grain effects, and custom magnetic cursor interactions.

- **Private Screening Rooms & Synchronized Playback**:
  - Zero-latency multi-window and cross-tab peer synchronization via native `BroadcastChannel`.
  - Streamlined room invitations, participant status, and interactive in-theatre chat dock.
  - Support for custom streaming video sources, sample reels, and high-definition local clips.

- **VIP Director Dashboard & 3D Avatar Customization**:
  - Private VIP screening room hub (`/dashboard`).
  - Interactive 3D avatar preview chamber with customizable hairstyles, velvet tuxedos, accessories (champagne pins, acoustic monitors, popcorn buckets), and persistent local state.

- **Acoustic Soundscape Engine**:
  - Web Audio synthesizer generating 432Hz harmonic room resonance, projector shutter flutter, and tactile UI click feedback.

- **Responsive & Accessible**:
  - Dark luxury palette (`#050506` ink, `#c9a86a` champagne, `#f1e9db` bone).
  - Respects `prefers-reduced-motion` with graceful static fallbacks and WCAG AAA contrast ratios.

---

## Tech Stack

| Domain | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **3D & Shaders** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Post-Processing** | `@react-three/postprocessing`, `postprocessing` |
| **Motion & Scroll** | [GSAP](https://greensock.com/gsap/) (ScrollTrigger), [Lenis](https://lenis.darkroom.engineering/), [Framer Motion](https://www.framer.com/motion/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Project Structure

```text
nocturne/
├── app/
│   ├── dashboard/             # VIP Director dashboard & room management
│   │   └── page.tsx
│   ├── login/                 # Authentication / VIP member sign in
│   │   └── page.tsx
│   ├── signup/                # Member registration & concierge onboarding
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css            # Luxury design tokens, typography & cinematic shaders
│   ├── icon.svg
│   ├── layout.tsx             # Root layout with Cormorant & Manrope font families
│   └── page.tsx               # Main entry point (Landing & Theatre Experience)
├── components/
│   ├── auth/                  # Authentication chasses & glassmorphic inputs
│   │   └── AuthPage.tsx
│   ├── cinema/                # 3D canvas, HUD, audio & theatre interactions
│   │   ├── AudioController.tsx
│   │   ├── BoxOfficeWidget.tsx
│   │   ├── ChatDock.tsx
│   │   ├── CinemaExperience.tsx
│   │   ├── CinematicCursor.tsx
│   │   ├── CinematicDirectorHUD.tsx
│   │   ├── CinematicJourneyCanvas.tsx
│   │   ├── CinematicStageOverlays.tsx
│   │   ├── CinematicStatementBanner.tsx
│   │   ├── CinematicTicket.tsx
│   │   ├── ExperienceShowcase.tsx
│   │   ├── FilmPlayer.tsx
│   │   ├── FilmStripMarquee.tsx
│   │   ├── HeroCinemaScene.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── NocturneLogo.tsx
│   │   ├── PosterImage.tsx
│   │   ├── TechArchitectureSection.tsx
│   │   ├── TheatreCanvas.tsx
│   │   ├── TheatreGatewaySection.tsx
│   │   ├── TheatreHUD.tsx
│   │   ├── icons.tsx
│   │   └── useRoom.ts
│   └── dashboard/             # 3D avatar studio & room creator
│       ├── Avatar3DCharacter.tsx
│       ├── Avatar3DViewer.tsx
│       ├── AvatarCustomizerModal.tsx
│       ├── avatarStorage.ts
│       ├── CinemaDashboard.tsx
│       ├── CreateRoomModal.tsx
│       └── types.ts
├── lib/
│   ├── cinematicSound.ts      # Web Audio API spatial frequency synthesizer
│   └── movie.ts               # Video metadata parsing & poster resolution
├── public/
│   ├── films/                 # High-definition video reels & poster assets
│   ├── favicon.svg
│   └── logo.svg
├── .gitignore
├── eslint.config.mjs          # Flat ESLint configuration with Next.js presets
├── next.config.ts             # Next.js configuration with package transpilation
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Deepan9884/Nocturne.git
   cd Nocturne
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev` — Starts the local Next.js development server with Turbopack.
- `npm run build` — Compiles and builds the production bundle with TypeScript checking.
- `npm run start` — Starts the Next.js production server.
- `npm run lint` — Runs ESLint across the codebase.

---

## License

Private and proprietary. Designed with passion for cinematic craftsmanship.
