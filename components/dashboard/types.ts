export type ModelBase = "girl" | "boy" | "anatomical";

export type HairStyle =
  | "slick"
  | "pompadour"
  | "spiky"
  | "bob"
  | "afro"
  | "wavy"
  | "buzz"
  // Expanded styles from character sheets
  | "curtainBob"
  | "highPonytail"
  | "longWavy"
  | "sideBraid"
  | "afroPuffs"
  | "pixieCut"
  | "texturedCrop";

export type ExpressionType =
  | "neutral"
  | "smile"
  | "confident"
  | "surprised"
  | "curious"
  | "focused"
  | "smirk";

export type FacialHairType = "none" | "stubble" | "goatee";

export type SkinFinishType = "matte" | "satin" | "dewy";

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
  | "tee"
  // Expanded character sheet dresses & outfits
  | "directorBlazer"
  | "eveningGown"
  | "urbanOversized"
  | "tuxedoFemme"
  | "cropStreetwear"
  | "layeredCoat";

export type AccessoryType =
  | "popcorn"
  | "headphones"
  | "directorBadge"
  | "none";

export interface AvatarConfig {
  name: string;
  title: string;
  modelBase?: ModelBase;
  skinTone: string;
  skinFinish?: SkinFinishType;
  freckles?: boolean;
  hairStyle: HairStyle;
  hairColor: string;
  hairHighlights?: string;
  eyeColor: string;
  eyeGlow: boolean;
  eyewear: EyewearType;
  expression?: ExpressionType;
  eyelashes?: boolean;
  lipColor?: string;
  blushColor?: string;
  facialHair?: FacialHairType;
  outfit: OutfitStyle;
  outfitColor: string;
  outfitSecondaryColor?: string;
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
