import { AvatarConfig } from "./types";

export const DEFAULT_AVATAR: AvatarConfig = {
  name: "Alex Vance",
  title: "Premiere Director",
  skinTone: "#f5d0b5", // Warm peach ivory
  hairStyle: "slick",
  hairColor: "#141318", // Obsidian Ink
  eyeColor: "#c9a86a", // Nocturne Champagne Gold
  eyeGlow: true,
  eyewear: "cinema3d", // Iconic 3D cinema glasses
  outfit: "tuxedo", // Luxury Velvet Tuxedo
  outfitColor: "#2a0d12", // Royal Oxblood Velvet
  accessory: "popcorn", // Fresh butter popcorn bucket
  level: 14,
};

export const SKIN_TONES = [
  { name: "Warm Ivory", value: "#ffdfd3" },
  { name: "Warm Peach", value: "#f5d0b5" },
  { name: "Golden Honey", value: "#d9a174" },
  { name: "Warm Caramel", value: "#b07a51" },
  { name: "Deep Bronze", value: "#8c5638" },
  { name: "Rich Espresso", value: "#4e3127" },
  { name: "Alabaster", value: "#f7eee3" },
];

export const HAIR_COLORS = [
  { name: "Obsidian Ink", value: "#141318" },
  { name: "Champagne Gold", value: "#c9a86a" },
  { name: "Deep Chestnut", value: "#3e2723" },
  { name: "Royal Oxblood", value: "#4a121a" },
  { name: "Warm Hazel", value: "#6d4c41" },
  { name: "Platinum Bone", value: "#e8dfcf" },
  { name: "Honey Amber", value: "#d97706" },
];

export const EYE_COLORS = [
  { name: "Champagne Gold", value: "#c9a86a" },
  { name: "Golden Amber", value: "#d97706" },
  { name: "Emerald Ray", value: "#10b981" },
  { name: "Deep Hazel", value: "#78350f" },
  { name: "Sapphire Night", value: "#2563eb" },
  { name: "Starlight Bone", value: "#e5e0d8" },
];

export const OUTFIT_COLORS = [
  { name: "Royal Oxblood", value: "#2a0d12" },
  { name: "Obsidian Ink", value: "#0c0b0e" },
  { name: "Champagne Silk", value: "#8c7243" },
  { name: "Midnight Navy", value: "#101826" },
  { name: "Deep Bronze", value: "#432818" },
  { name: "Forest Velvet", value: "#0f281e" },
];

export const PRESET_AVATARS: AvatarConfig[] = [
  {
    name: "Alex Vance",
    title: "Premiere Director",
    skinTone: "#f5d0b5",
    hairStyle: "slick",
    hairColor: "#141318",
    eyeColor: "#c9a86a",
    eyeGlow: true,
    eyewear: "cinema3d",
    outfit: "tuxedo",
    outfitColor: "#2a0d12",
    accessory: "popcorn",
    level: 14,
  },
  {
    name: "Elena Thorne",
    title: "IMAX Sound Architect",
    skinTone: "#ffdfd3",
    hairStyle: "bob",
    hairColor: "#c9a86a",
    eyeColor: "#10b981",
    eyeGlow: true,
    eyewear: "goldFrames",
    outfit: "cyberJacket",
    outfitColor: "#0c0b0e",
    accessory: "headphones",
    level: 19,
  },
  {
    name: "Darius Sterling",
    title: "VIP Lounge Host",
    skinTone: "#8c5638",
    hairStyle: "afro",
    hairColor: "#141318",
    eyeColor: "#d97706",
    eyeGlow: false,
    eyewear: "shades",
    outfit: "tuxedo",
    outfitColor: "#2a0d12",
    accessory: "directorBadge",
    level: 22,
  },
  {
    name: "Julian Cross",
    title: "Indie Film Curator",
    skinTone: "#d9a174",
    hairStyle: "wavy",
    hairColor: "#3e2723",
    eyeColor: "#c9a86a",
    eyeGlow: false,
    eyewear: "cinema3d",
    outfit: "hoodie",
    outfitColor: "#432818",
    accessory: "popcorn",
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
  name: "Alex Vance",
  email: "alex@nocturne.cinema",
  tier: "VIP Director",
  isLoggedIn: true,
  avatarConfig: DEFAULT_AVATAR,
};

export function loadStoredUser(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    return JSON.parse(raw);
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

export function saveAvatarToStorage(avatar: AvatarConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar));
  } catch {
    // fallback
  }
}
