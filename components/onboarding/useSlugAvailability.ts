"use client";
import { useEffect, useState } from "react";
import { slugSchema } from "@/lib/schemas/page";

export type SlugStatus =
  "idle" | "invalid" | "waiting" | "checking" | "available" | "taken" | "error";
export function useSlugAvailability(value: string, editVersion = 0) {
  const slug = value.trim().toLowerCase();
  const valid = slugSchema.safeParse(slug).success;
  const [result, setResult] = useState<{
    slug: string;
    status: SlugStatus;
    version: number;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!slug || !valid) return;
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setResult({ slug, version: editVersion, status: "checking" });
      try {
        const response = await fetch(
          `/api/onboarding/slug?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!response.ok) throw new Error("Availability unavailable");
        const result = await response.json();
        if (
          active &&
          result.data?.slug === slug &&
          typeof result.data.available === "boolean"
        )
          setResult({
            slug,
            version: editVersion,
            status: result.data.available ? "available" : "taken",
          });
        else if (active)
          setResult({ slug, version: editVersion, status: "error" });
      } catch {
        if (active) setResult({ slug, version: editVersion, status: "error" });
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [slug, valid, attempt, editVersion]);
  const status: SlugStatus = !slug
    ? "idle"
    : !valid
      ? "invalid"
      : result?.slug === slug && result.version === editVersion
        ? result.status
        : "waiting";
  return { status, retry: () => setAttempt((value) => value + 1) };
}
