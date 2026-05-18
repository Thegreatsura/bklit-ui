import type { StudioControl, StudioControlGroup } from "./types";

/** Wrap controls in a titled sidebar section. */
export function controlGroup(
  title: string,
  controls: StudioControl[]
): StudioControlGroup {
  return { title, controls };
}

export const designGroup = (controls: StudioControl[]) =>
  controlGroup("Design", controls);

export const lineGroup = (controls: StudioControl[]) =>
  controlGroup("Line", controls);

export const axesGroup = (controls: StudioControl[]) =>
  controlGroup("Axes", controls);

/** Standard curve control — use inside Line group; picker renders `studio-control-card`. */
export const curveControl = (): StudioControl => ({
  type: "curve",
  key: "curve",
  label: "Curve",
});

/** Standard pattern control — use inside Design group. */
export const patternControl = (): StudioControl => ({
  type: "pattern",
  key: "pattern",
  label: "Pattern",
});
