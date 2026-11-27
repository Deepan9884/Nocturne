import { AvatarConfig, ModelBase, HairStyle, ExpressionType, OutfitStyle, EyewearType, AccessoryType, SkinFinishType } from "./types";

export const DEFAULT_AVATAR: AvatarConfig = {
  name: "Aria Vance",
  title: "Premiere Director",
  modelBase: "girl",
  skinTone: "#f5d0b5", // Warm peach ivory
  skinFinish: "satin",
  freckles: false,
  hairStyle: "highPonytail",
  hairColor: "#141318", // Obsidian Ink
  hairHighlights: "#c9a86a",
  eyeColor: "#c9a86a", // Nocturne Champagne Gold
  eyeGlow: true,
  eyewear: "none", // Default unobstructed face view
  expression: "confident",
  eyelashes: true,
  lipColor: "#d9777f", // Velvet Rose
  blushColor: "#fb7185",
  facialHair: "none",
  outfit: "directorBlazer", // Luxury Tailored Blazer Dress
  outfitColor: "#1c1824", // Deep Obsidian Plum
  outfitSecondaryColor: "#c9a86a",
  accessory: "none",
  level: 16,
};

export const DEFAULT_BOY_AVATAR: AvatarConfig = {
  name: "Alex Vance",
  title: "VIP Cinematographer",
  modelBase: "boy",
  skinTone: "#f5d0b5",
  skinFinish: "satin",
  freckles: false,
  hairStyle: "spiky",
  hairColor: "#141318",
  hairHighlights: "#3e2723",
  eyeColor: "#c9a86a",
  eyeGlow: true,
  eyewear: "none",
  expression: "smirk",
  eyelashes: false,
  facialHair: "none",
  outfit: "cyberJacket",
  outfitColor: "#121118",
  outfitSecondaryColor: "#c9a86a",
  accessory: "none",
  level: 15,
};

export const SKIN_TONES = [
  { name: "Porcelain Alabaster", value: "#fdf4ed" },
  { name: "Warm Ivory", value: "#ffdfd3" },
  { name: "Warm Peach", value: "#f5d0b5" },
  { name: "Golden Honey", value: "#d9a174" },
  { name: "Warm Caramel", value: "#b07a51" },
  { name: "Deep Bronze", value: "#8c5638" },
  { name: "Rich Espresso", value: "#4e3127" },
  { name: "Cool Bisque", value: "#f3e1d3" },
];

export const SKIN_FINISHES: { id: SkinFinishType; name: string; desc: string }[] = [
  { id: "matte", name: "Soft Matte", desc: "Velvety non-reflective finish" },
  { id: "satin", name: "Cinema Satin", desc: "Subtle specular glow with warm SSS" },
  { id: "dewy", name: "Dewy Radiance", desc: "High-sheen luminous highlight" },
];

export const HAIR_COLORS = [
  { name: "Obsidian Ink", value: "#141318" },
  { name: "Champagne Gold", value: "#c9a86a" },
  { name: "Deep Chestnut", value: "#3e2723" },
  { name: "Royal Oxblood", value: "#4a121a" },
  { name: "Warm Hazel", value: "#6d4c41" },
  { name: "Platinum Bone", value: "#e8dfcf" },
  { name: "Honey Amber", value: "#d97706" },
  { name: "Pastel Lavender", value: "#a78bfa" },
  { name: "Cyber Cyan", value: "#06b6d4" },
];

export const EYE_COLORS = [
  { name: "Champagne Gold", value: "#c9a86a" },
  { name: "Golden Amber", value: "#d97706" },
  { name: "Emerald Ray", value: "#10b981" },
  { name: "Deep Hazel", value: "#78350f" },
  { name: "Sapphire Night", value: "#2563eb" },
  { name: "Starlight Bone", value: "#e5e0d8" },
  { name: "Amethyst Violet", value: "#8b5cf6" },
  { name: "Crimson Velvet", value: "#e11d48" },
];

export const LIP_COLORS = [
  { name: "Velvet Rose", value: "#d9777f" },
  { name: "Peach Nectar", value: "#fb7185" },
  { name: "Cherry Wine", value: "#9f1239" },
  { name: "Champagne Nude", value: "#c4927b" },
  { name: "Deep Burgundy", value: "#4c0519" },
  { name: "Natural Tint", value: "#d48d7d" },
];

export const BLUSH_COLORS = [
  { name: "None", value: "transparent" },
  { name: "Soft Coral", value: "#fb7185" },
  { name: "Rose Petal", value: "#f43f5e" },
  { name: "Warm Apricot", value: "#f97316" },
  { name: "Wine Dust", value: "#be123c" },
];

export const OUTFIT_COLORS = [
  { name: "Royal Oxblood", value: "#2a0d12" },
  { name: "Obsidian Ink", value: "#0c0b0e" },
  { name: "Champagne Silk", value: "#8c7243" },
  { name: "Midnight Navy", value: "#101826" },
  { name: "Deep Bronze", value: "#432818" },
  { name: "Forest Velvet", value: "#0f281e" },
  { name: "Pure Ivory", value: "#f5f3ef" },
  { name: "Electric Violet", value: "#3b174a" },
];

export const PRESET_AVATARS: AvatarConfig[] = [
  // GIRL PRESETS (Directly matching Nano Banana Character Sheet)
  {
    name: "Aria Vance",
    title: "Premiere Director",
    modelBase: "girl",
    skinTone: "#f5d0b5",
    skinFinish: "satin",
    freckles: false,
    hairStyle: "highPonytail",
    hairColor: "#141318",
    hairHighlights: "#c9a86a",
    eyeColor: "#c9a86a",
    eyeGlow: true,
    eyewear: "none",
    expression: "confident",
    eyelashes: true,
    lipColor: "#d9777f",
    blushColor: "#fb7185",
    facialHair: "none",
    outfit: "directorBlazer",
    outfitColor: "#1c1824",
    outfitSecondaryColor: "#c9a86a",
    accessory: "none",
    level: 16,
  },
  {
    name: "Elena Thorne",
    title: "IMAX Sound Architect",
    modelBase: "girl",
    skinTone: "#ffdfd3",
    skinFinish: "dewy",
    freckles: true,
    hairStyle: "curtainBob",
    hairColor: "#c9a86a",
    hairHighlights: "#e8dfcf",
    eyeColor: "#10b981",
    eyeGlow: true,
    eyewear: "none",
    expression: "smile",
    eyelashes: true,
    lipColor: "#fb7185",
    blushColor: "#fb7185",
    facialHair: "none",
    outfit: "eveningGown",
    outfitColor: "#2a0d12",
    outfitSecondaryColor: "#e3c995",
    accessory: "headphones",
    level: 19,
  },
  {
    name: "Chloe Dupont",
    title: "Indie Cinema Curator",
    modelBase: "girl",
    skinTone: "#d9a174",
    skinFinish: "matte",
    freckles: false,
    hairStyle: "longWavy",
    hairColor: "#3e2723",
    hairHighlights: "#d97706",
    eyeColor: "#d97706",
    eyeGlow: false,
    eyewear: "none",
    expression: "smile",
    eyelashes: true,
    lipColor: "#c4927b",
    blushColor: "#f97316",
    facialHair: "none",
    outfit: "urbanOversized",
    outfitColor: "#432818",
    outfitSecondaryColor: "#f1e9db",
    accessory: "none",
    level: 12,
  },
  // BOY PRESETS (Directly matching Nano Banana Character Sheet)
  {
    name: "Alex Vance",
    title: "VIP Cinematographer",
    modelBase: "boy",
    skinTone: "#f5d0b5",
    skinFinish: "satin",
    freckles: false,
    hairStyle: "spiky",
    hairColor: "#141318",
    hairHighlights: "#3e2723",
    eyeColor: "#c9a86a",
    eyeGlow: true,
    eyewear: "none",
    expression: "smirk",
    eyelashes: false,
    facialHair: "none",
    outfit: "cyberJacket",
    outfitColor: "#121118",
    outfitSecondaryColor: "#c9a86a",
    accessory: "none",
    level: 14,
  },
  {
    name: "Darius Sterling",
    title: "VIP Lounge Host",
    modelBase: "boy",
    skinTone: "#8c5638",
    skinFinish: "satin",
    freckles: false,
    hairStyle: "afro",
    hairColor: "#141318",
    hairHighlights: "#6d4c41",
    eyeColor: "#d97706",
    eyeGlow: false,
    eyewear: "none",
    expression: "confident",
    eyelashes: false,
    facialHair: "stubble",
    outfit: "tuxedo",
    outfitColor: "#2a0d12",
    outfitSecondaryColor: "#c9a86a",
    accessory: "directorBadge",
    level: 22,
  },
  {
    name: "Julian Cross",
    title: "Acoustic Stage Engineer",
    modelBase: "boy",
    skinTone: "#d9a174",
    skinFinish: "matte",
    freckles: true,
    hairStyle: "texturedCrop",
    hairColor: "#3e2723",
    hairHighlights: "#c9a86a",
    eyeColor: "#2563eb",
    eyeGlow: true,
    eyewear: "goldFrames",
    expression: "focused",
    eyelashes: false,
    facialHair: "goatee",
    outfit: "hoodie",
    outfitColor: "#101826",
    outfitSecondaryColor: "#c9a86a",
    accessory: "headphones",
    level: 11,
  },
];

const STORAGE_KEY = "nocturne_user_avatar_config";
const USER_STORAGE_KEY = "nocturne_user_profile";

export interface UserProfile {
  name: string;
  email: string;
  tier: "VIP Director" | "Cinephile Standard";
  isLoggedIn: boolean;
  avatarConfig?: AvatarConfig;
}

export const DEFAULT_USER: UserProfile = {
  name: "Aria Vance",
  email: "aria@nocturne.cinema",
  tier: "VIP Director",
  isLoggedIn: true,
  avatarConfig: DEFAULT_AVATAR,
};

export function loadSavedAvatar(): AvatarConfig {
  if (typeof window === "undefined") return DEFAULT_AVATAR;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AVATAR;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AVATAR, ...parsed };
  } catch {
    return DEFAULT_AVATAR;
  }
}

export function saveAvatarToStorage(config: AvatarConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    const userRaw = localStorage.getItem(USER_STORAGE_KEY);
    if (userRaw) {
      const user = JSON.parse(userRaw);
      user.avatarConfig = config;
      user.name = config.name;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    // fallback
  }
}

export function loadStoredUser(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER,
      ...parsed,
      avatarConfig: parsed.avatarConfig ? { ...DEFAULT_AVATAR, ...parsed.avatarConfig } : DEFAULT_AVATAR,
    };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // fallback
  }
}
