"use client";

import { ChartTooltip, Grid, Line, LineChart, XAxis } from "@bklitui/ui/charts";
import { useState } from "react";
import { FpsCounter } from "@/components/playground/fps-counter";
import { PlaygroundShell } from "@/components/playground/playground-shell";
import { PlaygroundToolbar } from "@/components/playground/playground-toolbar";
import {
  ResizablePreview,
  VIEWPORT_PRESETS,
  type ViewportPreset,
} from "@/components/playground/resizable-preview";
import { useReplayKey } from "@/components/playground/use-replay-key";

const demoData = [
  { date: new Date("2025-01-01"), users: 1200, pageviews: 3400 },
  { date: new Date("2025-01-02"), users: 1350, pageviews: 3600 },
  { date: new Date("2025-01-03"), users: 1280, pageviews: 3550 },
  { date: new Date("2025-01-04"), users: 1420, pageviews: 3900 },
  { date: new Date("2025-01-05"), users: 1510, pageviews: 4100 },
  { date: new Date("2025-01-06"), users: 1480, pageviews: 4050 },
  { date: new Date("2025-01-07"), users: 1620, pageviews: 4300 },
];

export default function PlaygroundPage() {
  const [replayKey, replay] = useReplayKey();
  const [viewport, setViewport] = useState<ViewportPreset>("desktop");
  const preset = VIEWPORT_PRESETS[viewport];
  const frameWidth = preset.width ?? 960;
  const [size, setSize] = useState({ width: frameWidth, height: preset.height });

  const handleViewportChange = (next: ViewportPreset) => {
    setViewport(next);
    const nextPreset = VIEWPORT_PRESETS[next];
    setSize({
      width: nextPreset.width ?? 960,
      height: nextPreset.height,
    });
  };

  return (
    <PlaygroundShell
      description="Local chart playground — gitignored route for prototyping. Replace the chart below with your work-in-progress component."
      overlay={<FpsCounter />}
      title="Playground"
      toolbar={
        <PlaygroundToolbar
          height={size.height}
          onReplay={replay}
          onViewportChange={handleViewportChange}
          viewport={viewport}
          width={size.width}
        />
      }
    >
      <ResizablePreview
        defaultHeight={size.height}
        defaultWidth={size.width}
        onSizeChange={setSize}
      >
        <div className="h-full w-full" key={replayKey}>
          <LineChart data={demoData}>
            <Grid horizontal />
            <Line dataKey="users" stroke="var(--chart-line-primary)" />
            <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
            <XAxis />
            <ChartTooltip />
          </LineChart>
        </div>
      </ResizablePreview>
    </PlaygroundShell>
  );
}
