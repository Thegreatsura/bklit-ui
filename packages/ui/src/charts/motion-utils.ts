import type { Transition } from "motion/react";

export interface SpringOptions {
  stiffness: number;
  damping: number;
  mass?: number;
}

export function springOptionsFromTransition(
  transition?: Transition,
  fallback: SpringOptions = { stiffness: 60, damping: 20 }
): SpringOptions {
  if (!transition) {
    return fallback;
  }
  if (transition.type === "spring") {
    return {
      stiffness:
        typeof transition.stiffness === "number"
          ? transition.stiffness
          : fallback.stiffness,
      damping:
        typeof transition.damping === "number"
          ? transition.damping
          : fallback.damping,
      mass:
        typeof transition.mass === "number" ? transition.mass : fallback.mass,
    };
  }
  const duration =
    "duration" in transition && typeof transition.duration === "number"
      ? transition.duration
      : 0.8;
  return {
    stiffness: Math.min(500, Math.max(40, 280 / duration)),
    damping: Math.min(40, Math.max(12, 18 + duration * 4)),
  };
}
