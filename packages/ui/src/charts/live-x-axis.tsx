"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useChart } from "./chart-context";

const TICKER_HALF_WIDTH = 50;
const FADE_BUFFER = 20;

function labelFadeOpacity(
  labelX: number,
  crosshairX: number | null,
  isHovering: boolean
): number {
  if (!isHovering || crosshairX === null) {
    return 1;
  }
  const distance = Math.abs(labelX - crosshairX);
  if (distance < TICKER_HALF_WIDTH) {
    return 0;
  }
  if (distance < TICKER_HALF_WIDTH + FADE_BUFFER) {
    return (distance - TICKER_HALF_WIDTH) / FADE_BUFFER;
  }
  return 1;
}

export interface LiveXAxisProps {
  /** Number of time labels. Default: 5 */
  numTicks?: number;
  /** Time formatter. Default: HH:MM:SS */
  formatTime?: (t: number) => string;
}

const defaultFormatTime = (t: number) => {
  const d = new Date(t);
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function LiveXAxis({
  numTicks = 5,
  formatTime = defaultFormatTime,
}: LiveXAxisProps) {
  const { xScale, margin, tooltipData, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const domain = xScale.domain();
  const startMs = domain[0]?.getTime() ?? 0;
  const endMs = domain[1]?.getTime() ?? 0;

  const labels = useMemo(() => {
    const step = (endMs - startMs) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => {
      const t = startMs + i * step;
      const x = (xScale(new Date(t)) ?? 0) + margin.left;
      return { x, label: formatTime(t), stableKey: i };
    });
  }, [startMs, endMs, numTicks, xScale, margin.left, formatTime]);

  const isHovering = tooltipData !== null;
  const crosshairX = tooltipData ? tooltipData.x + margin.left : null;

  // Time pill label
  const pillLabel = useMemo(() => {
    if (!tooltipData) {
      return null;
    }
    const timeMs = xScale.invert(tooltipData.x).getTime();
    return formatTime(timeMs);
  }, [tooltipData, xScale, formatTime]);

  const container = containerRef.current;
  if (!(mounted && container)) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      {/* Time labels */}
      {labels.map((l) => (
        <div
          key={l.stableKey}
          className="absolute"
          style={{
            left: l.x,
            bottom: 12,
            width: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.span
            animate={{
              opacity: labelFadeOpacity(l.x, crosshairX, isHovering),
            }}
            className="whitespace-nowrap text-chart-label text-xs"
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {l.label}
          </motion.span>
        </div>
      ))}

      {/* Time pill at crosshair */}
      {isHovering && tooltipData && pillLabel && (
        <motion.div
          className="absolute z-50"
          style={{
            left: tooltipData.x + margin.left,
            transform: "translateX(-50%)",
            bottom: 4,
          }}
        >
          <div className="overflow-hidden rounded-full bg-zinc-900 px-4 py-1 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
            <span className="whitespace-nowrap font-medium text-sm">
              {pillLabel}
            </span>
          </div>
        </motion.div>
      )}
    </div>,
    container
  );
}

LiveXAxis.displayName = "LiveXAxis";

export default LiveXAxis;
