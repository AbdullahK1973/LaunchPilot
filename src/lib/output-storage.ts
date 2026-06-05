"use client";

import type { SavedLaunchOutput } from "@/types/launch";

const STORAGE_KEY = "launchpilot.savedOutputs";

export function getSavedOutputs(): SavedLaunchOutput[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as SavedLaunchOutput[];
  } catch {
    return [];
  }
}

export function saveOutput(output: Omit<SavedLaunchOutput, "id" | "savedAt">) {
  if (typeof window === "undefined") {
    return [];
  }

  const nextOutput: SavedLaunchOutput = {
    ...output,
    id: window.crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  const nextOutputs = [nextOutput, ...getSavedOutputs()].slice(0, 25);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOutputs));

  return nextOutputs;
}
