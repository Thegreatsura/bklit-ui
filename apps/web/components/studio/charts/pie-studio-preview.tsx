"use client";

import { PieCenter, PieChart, PieSlice } from "@bklitui/ui/charts";
import { useEffect, useState } from "react";
import {
  StudioRadialCenter,
  studioRadialSize,
} from "@/components/studio/charts/studio-chart-layout";
import { studioEnterStaggerScale } from "@/lib/studio/chart-animation";
import { pieData } from "@/lib/studio/demo-data";
import {
  motionSignature,
  studioMotionToTransition,
} from "@/lib/studio/motion-config";
import {
  studioPiePatternDefs,
  studioPieSlicePatternFill,
} from "@/lib/studio/patterns";
import type { StudioRenderContext } from "@/lib/studio/render-context";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";

export function PieStudioPreview({
  state,
  ctx,
}: {
  state: StudioUrlState;
  ctx: StudioRenderContext;
}) {
  const sig = motionSignature(state);
  const [motionRemountKey, setMotionRemountKey] = useState(sig);
  const useLines = state.pieFillMode === "lines";

  useEffect(() => {
    const timer = window.setTimeout(() => setMotionRemountKey(sig), 280);
    return () => window.clearTimeout(timer);
  }, [sig]);

  return (
    <StudioRadialCenter frame={ctx.frame}>
      <PieChart
        cornerRadius={state.pieCornerRadius}
        data={pieData}
        endAngle={(state.pieEndAngleDeg * Math.PI) / 180}
        enterStaggerScale={studioEnterStaggerScale(state)}
        enterTransition={studioMotionToTransition(state)}
        hoverOffset={state.pieHoverOffset}
        innerRadius={state.innerRadius || undefined}
        key={`${ctx.animationKey}-${motionRemountKey}`}
        padAngle={state.padAngle}
        size={studioRadialSize(ctx.frame, state.pieSize)}
        startAngle={(state.pieStartAngleDeg * Math.PI) / 180}
      >
        {useLines ? studioPiePatternDefs(pieData.length) : null}
        {pieData.map((item, index) => (
          <PieSlice
            fill={useLines ? studioPieSlicePatternFill(index) : undefined}
            hoverEffect={state.pieHoverEffect}
            index={index}
            key={item.label}
            showGlow={false}
          />
        ))}
        {state.innerRadius > 0 ? <PieCenter defaultLabel="Total" /> : null}
      </PieChart>
    </StudioRadialCenter>
  );
}
