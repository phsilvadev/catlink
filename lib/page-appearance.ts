import type { Draft } from "./schemas/page";

export type PageAppearance = "aurora" | "sunset" | "mint" | "pixel";
export type PageTheme = {
  background: string;
  foreground: string;
  accent: string;
  appearance?: PageAppearance;
};
export function entryTheme(key: string): PageTheme {
  if (key === "sunset")
    return {
      appearance: "sunset",
      background: "#fff8fb",
      foreground: "#662944",
      accent: "#d66b9f",
    };
  if (key === "mint")
    return {
      appearance: "mint",
      background: "#f5fbf8",
      foreground: "#204e49",
      accent: "#438f89",
    };
  if (key === "pixel")
    return {
      appearance: "pixel",
      background: "#fff",
      foreground: "#111827",
      accent: "#6366f1",
    };
  return {
    appearance: "aurora",
    background: "#fff",
    foreground: "#111827",
    accent: "#111827",
  };
}
export function demoProfile(key: string): Draft {
  const pixel = key === "pixel";
  return {
    schemaVersion: 1,
    profile: {
      name: pixel ? "PixelMaster" : "Rock Agency",
      bio: pixel
        ? "Design | Code | Minimalist"
        : "Digital agency specializing in SaaS products.",
    },
    blocks: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        type: pixel ? "link" : "button",
        visible: true,
        label: pixel ? "Latest Video" : "Visit Website",
        url: "https://example.com",
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        type: "link",
        visible: true,
        label: pixel ? "My Portfolio" : "Latest Projects",
        url: "https://example.com",
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        type: "link",
        visible: true,
        label: pixel ? "Twitter Threads" : "Book a Call",
        url: "https://example.com",
      },
      {
        id: "00000000-0000-4000-8000-000000000004",
        type: "social",
        visible: true,
        items: pixel
          ? [
              { label: "Instagram", url: "https://instagram.com" },
              { label: "TikTok", url: "https://tiktok.com" },
              { label: "E-mail", url: "https://example.com" },
            ]
          : [
              { label: "Instagram", url: "https://instagram.com" },
              { label: "X", url: "https://x.com" },
              { label: "LinkedIn", url: "https://linkedin.com" },
            ],
      },
    ],
  };
}
