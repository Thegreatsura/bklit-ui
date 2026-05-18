"use client";

import { Gauge } from "@bklitui/ui/charts";
import { useEffect, useState } from "react";
import { studioFitAspectSize } from "@/components/studio/charts/studio-chart-layout";
import { studioEnterStaggerScale } from "@/lib/studio/chart-animation";
import {
  motionSignature,
  studioMotionToTransition,
} from "@/lib/studio/motion-config";
import type { StudioRenderContext } from "@/lib/studio/render-context";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";

const gaugeFormat = {
  style: "currency" as const,
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

/** Remounts gauge when motion settings change (debounced) so enter animation replays. */
export function GaugeStudioPreview({
  state,
  ctx,
}: {
  state: StudioUrlState;
  ctx: StudioRenderContext;
}) {
  const sig = motionSignature(state);
  const [motionRemountKey, setMotionRemountKey] = useState(sig);

  useEffect(() => {
    const timer = window.setTimeout(() => setMotionRemountKey(sig), 280);
    return () => window.clearTimeout(timer);
  }, [sig]);

  const { width, height } = studioFitAspectSize(ctx.frame, 21 / 16);

  return (
    <Gauge
      activeFill={ctx.patternFill}
      activeFillOpacity={state.activeFillOpacity}
      centerValue={state.centerValue}
      defaultLabel={state.gaugeLabel}
      endAngle={state.endAngle}
      enterStaggerScale={studioEnterStaggerScale(state)}
      enterTransition={studioMotionToTransition(state)}
      formatOptions={gaugeFormat}
      height={height}
      inactiveFillOpacity={state.inactiveFillOpacity}
      key={`${ctx.animationKey}-${motionRemountKey}`}
      notchCornerRadius={state.notchCornerRadius}
      notchLengthPercent={state.notchLengthPercent}
      spacing={state.spacing}
      startAngle={state.startAngle}
      totalNotches={state.totalNotches}
      uniformWidth={state.uniformWidth}
      useGradient={state.useGradient}
      value={state.value}
      width={width}
    >
      {ctx.patternDefs}
    </Gauge>
  );
}
