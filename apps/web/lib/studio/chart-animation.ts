import {
  clampMotionDuration,
  getMotionBezier,
  type MotionStateSlice,
  motionSignature,
  motionStaggerScale,
} from "./motion-config";
import type { StudioUrlState } from "./studio-parsers";

export type MotionPanelKind =
  | "gauge"
  | "css-reveal"
  | "motion-enter"
  | "motion-stagger";

export function motionSliceFromState(state: StudioUrlState): MotionStateSlice {
  return {
    motionType: state.motionType,
    motionDuration: state.motionDuration,
    motionBounce: state.motionBounce,
    motionEase: state.motionEase,
    motionBezier: state.motionBezier,
  };
}

/** Ms duration for CSS clip-reveal charts (synced from motion panel). */
export function motionDurationToAnimationMs(seconds: number): number {
  return Math.round(clampMotionDuration(seconds) * 1000);
}

export function studioAnimationDurationMs(
  state: Pick<StudioUrlState, "motionDuration">
): number {
  return motionDurationToAnimationMs(state.motionDuration);
}

export function studioAnimationEasingCss(state: MotionStateSlice): string {
  const [x1, y1, x2, y2] = getMotionBezier(state);
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

export function studioEnterStaggerScale(state: StudioUrlState): number {
  return motionStaggerScale(state) * state.motionStaggerScale;
}

export function getStudioCssRevealProps(state: StudioUrlState) {
  const motion = motionSliceFromState(state);
  return {
    animationDuration: studioAnimationDurationMs(state),
    animationEasing: studioAnimationEasingCss(motion),
  };
}

/** Remount key suffix when motion settings change. */
export function studioMotionChartKey(
  animationKey: number,
  state: StudioUrlState
): string {
  return `${animationKey}-${motionSignature(motionSliceFromState(state))}-s${state.motionStaggerScale.toFixed(2)}`;
}
