import type { StudioChartConfig, StudioControlGroup } from "./types";

export function getStudioControlGroups(
  config: StudioChartConfig
): StudioControlGroup[] {
  if (config.controlGroups?.length) {
    return config.controlGroups;
  }
  return [{ title: "Settings", controls: config.controls }];
}
