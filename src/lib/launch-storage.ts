"use client";

import { sampleLaunch } from "@/data/mock-launch";
import type { LaunchFormData } from "@/types/launch";

const STORAGE_KEY = "launchpilot.currentLaunch";

export function saveLaunch(data: LaunchFormData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLaunch(): LaunchFormData {
  if (typeof window === "undefined") {
    return sampleLaunch;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return sampleLaunch;
  }

  try {
    return { ...sampleLaunch, ...JSON.parse(stored) };
  } catch {
    return sampleLaunch;
  }
}
