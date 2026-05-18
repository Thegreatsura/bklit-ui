"use client";

import NumberFlow from "@number-flow/react";

export const STUDIO_RULER_OFFSET = 16;

function RulerValue({ value }: { value: number }) {
  return (
    <span className="font-medium text-[10px] text-muted-foreground tabular-nums leading-none">
      <NumberFlow
        format={{ maximumFractionDigits: 0 }}
        suffix="px"
        value={value}
        willChange
      />
    </span>
  );
}

/** Width dimension line below the frame */
export function StudioFrameRulerX({ width }: { width: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 z-30 flex flex-col items-stretch gap-1"
      style={{
        top: `calc(100% + ${STUDIO_RULER_OFFSET}px)`,
        width,
      }}
    >
      <div aria-hidden className="flex w-full items-center">
        <span className="h-2 w-px shrink-0 bg-foreground/50" />
        <span className="h-px min-w-0 flex-1 bg-foreground/50" />
        <span className="h-2 w-px shrink-0 bg-foreground/50" />
      </div>
      <div className="flex justify-center">
        <RulerValue value={width} />
      </div>
    </div>
  );
}

/** Height dimension line to the right of the frame */
export function StudioFrameRulerY({ height }: { height: number }) {
  return (
    <div
      className="pointer-events-none absolute top-0 z-30 flex items-center gap-1.5"
      style={{
        left: `calc(100% + ${STUDIO_RULER_OFFSET}px)`,
        height,
      }}
    >
      <div aria-hidden className="flex h-full flex-col items-center">
        <span className="h-px w-2 shrink-0 bg-foreground/50" />
        <span className="min-h-0 w-px flex-1 bg-foreground/50" />
        <span className="h-px w-2 shrink-0 bg-foreground/50" />
      </div>
      <RulerValue value={height} />
    </div>
  );
}
