"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useChart } from "./chart-context";

const yAxisSpring = { type: "spring" as const, stiffness: 120, damping: 20 };

function tickKey(value: number): string {
  return value.toPrecision(10);
}

function niceGridTicks(min: number, max: number, count = 5): number[] {
  const range = max - min;
  if (range <= 0) {
    return [];
  }
  const rawStep = range / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  let niceStep: number;
  if (residual <= 1.5) {
    niceStep = magnitude;
  } else if (residual <= 3) {
    niceStep = 2 * magnitude;
  } else if (residual <= 7) {
    niceStep = 5 * magnitude;
  } else {
    niceStep = 10 * magnitude;
  }
  const ticks: number[] = [];
  const start = Math.ceil(min / niceStep) * niceStep;
  for (let v = start; v <= max; v += niceStep) {
    ticks.push(v);
  }
  return ticks;
}

export interface LiveYAxisProps {
  /** Number of ticks. Default: 5 */
  numTicks?: number;
  /** Position. Default: "left" */
  position?: "left" | "right";
  /** Value formatter */
  formatValue?: (v: number) => string;
}

export function LiveYAxis({
  numTicks = 5,
  position = "left",
  formatValue = (v: number) => v.toFixed(2),
}: LiveYAxisProps) {
  const { yScale, margin, innerHeight, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const domain = yScale.domain() as [number, number];
  const yTicks = useMemo(
    () => niceGridTicks(domain[0], domain[1], numTicks),
    [domain[0], domain[1], numTicks]
  );

  const tickData = useMemo(
    () =>
      yTicks.map((tick) => ({
        value: tick,
        y: (yScale(tick) ?? 0) + margin.top,
        label: formatValue(tick),
        key: tickKey(tick),
      })),
    [yTicks, yScale, margin.top, formatValue]
  );

  const isLeft = position === "left";

  const container = containerRef.current;
  if (!(mounted && container)) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute overflow-hidden"
        style={{
          top: margin.top,
          height: innerHeight,
          ...(isLeft
            ? { left: 0, width: margin.left }
            : { right: 0, width: margin.right }),
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <AnimatePresence initial={false}>
          {tickData.map((tick) => (
            <motion.div
              key={tick.key}
              className="absolute w-full"
              style={{
                ...(isLeft
                  ? { right: 0, paddingRight: 8, textAlign: "right" }
                  : { left: 0, paddingLeft: 8, textAlign: "left" }),
              }}
              initial={{ opacity: 0, y: tick.y - margin.top }}
              animate={{ opacity: 1, y: tick.y - margin.top }}
              exit={{ opacity: 0 }}
              transition={yAxisSpring}
            >
              <span className="font-mono text-chart-label text-xs">
                {tick.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>,
    container
  );
}

LiveYAxis.displayName = "LiveYAxis";

export default LiveYAxis;
