"use client";

import { ChartTypeSelector } from "@/components/studio/chart-type-selector";
import { StudioControlGroups } from "@/components/studio/studio-control-groups";
import { StudioPanel } from "@/components/studio/studio-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStudioControlGroups } from "@/lib/studio/control-groups";
import { useStudioState } from "./use-studio-state";

export function StudioSidebar() {
  const {
    state,
    displayState,
    setChart,
    setParam,
    setPreviewParam,
    commitParam,
    config,
  } = useStudioState();
  const groups = getStudioControlGroups(config);

  return (
    <StudioPanel
      className="studio-sidebar flex max-h-[calc(100vh-5.5rem)] min-w-[340px] max-w-[400px] shrink-0 flex-col gap-5"
      variant="ghost"
    >
      <ChartTypeSelector onChange={setChart} value={state.chart} />

      <ScrollArea
        className="min-h-0 flex-1"
        viewportClassName="studio-sidebar-viewport"
      >
        <div className="w-full min-w-0 pr-1">
          <StudioControlGroups
            groups={groups}
            motionPanel={config.motionPanel}
            onChange={setParam}
            onCommit={commitParam}
            onPreview={setPreviewParam}
            state={displayState}
          />
        </div>
      </ScrollArea>
    </StudioPanel>
  );
}
