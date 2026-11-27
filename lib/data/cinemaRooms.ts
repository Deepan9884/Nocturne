export interface AuditoriumThemeOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
}

export interface CuratedFilmPreset {
  id: string;
  title: string;
  url: string;
  genre: string;
  duration: string;
}

export const AUDITORIUM_THEMES: AuditoriumThemeOption[] = [
  {
    id: "velvet",
    name: "Screen 01 · Royal Velvet IMAX",
    desc: "Plush burgundy recliners, brass sconces, and curved screen.",
    badge: "Most popular",
  },
  {
    id: "cyber",
    name: "Screen 02 · Nocturne Skydeck",
    desc: "Starry skyline views, amber mood lighting, and wide canvas.",
    badge: "Atmospheric",
  },
  {
    id: "indie",
    name: "Screen 03 · Midnight Noir Lounge",
    desc: "Intimate vintage acoustics and warm amber lighting.",
    badge: "Cozy",
  },
  {
    id: "atmos",
    name: "Screen 04 · Dolby Atmos Blackbox",
    desc: "Stealth matte architecture with 32-channel spatial audio.",
    badge: "Hi-Fi audio",
  },
];

export const CURATED_FILM_PRESETS: CuratedFilmPreset[] = [
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077 · Night City Premiere",
    url: "https://www.youtube.com/watch?v=BO8lX3hDU30",
    genre: "Sci-Fi / Action",
    duration: "4K 60fps",
  },
  {
    id: "dune",
    title: "Dune: Part Two · Sandworm Sequence",
    url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    genre: "Sci-Fi Epic",
    duration: "IMAX 4K",
  },
  {
    id: "bunny",
    title: "Big Buck Bunny · 4K Color Grading Test",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Animation",
    duration: "10 mins",
  },
  {
    id: "steel",
    title: "Tears of Steel · VFX Showcase",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Cyberpunk VFX",
    duration: "12 mins",
  },
  {
    id: "lofi",
    title: "Lo-fi Midnight Screening Chill Beats",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    genre: "Atmospheric / Music",
    duration: "Live stream",
  },
];
