export type HairStyle =
  | "slick"
  | "pompadour"
  | "spiky"
  | "bob"
  | "afro"
  | "wavy"
  | "buzz";

export type EyewearType =
  | "cinema3d"
  | "cyberVisor"
  | "shades"
  | "goldFrames"
  | "none";

export type OutfitStyle =
  | "tuxedo"
  | "cyberJacket"
  | "hoodie"
  | "kimono"
  | "tee";

export type AccessoryType =
  | "popcorn"
  | "headphones"
  | "directorBadge"
  | "none";

export interface AvatarConfig {
  name: string;
  title: string;
  skinTone: string;
  hairStyle: HairStyle;
  hairColor: string;
  eyeColor: string;
  eyeGlow: boolean;
  eyewear: EyewearType;
  outfit: OutfitStyle;
  outfitColor: string;
  accessory: AccessoryType;
  level: number;
}

export interface RoomPreset {
  id: string;
  name: string;
  theme: "velvet" | "cyber" | "indie" | "rooftop";
  themeLabel: string;
  screenName: string;
  description: string;
  filmTitle: string;
  filmUrl: string;
  viewersCount: number;
  maxSeats: number;
  hostName: string;
  isLive: boolean;
  coverImage?: string;
}

export interface FilmCatalogItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  url: string;
  tagline: string;
  posterBg: string;
  year: string;
}
