"use client";

import { curveMonotoneX } from "@visx/curve";
import { AreaClosed, LinePath } from "@visx/shape";
import { useCallback, useId, useMemo } from "react";
import { chartCssVars, useChart } from "./chart-context";

type Momentum = "up" | "down" | "flat";

function detectMomentum(
  data: Record<string, unknown>[],
  dataKey: string,
  lookback = 20
): Momentum {
  if (data.length < 5) {
    return "flat";
  }
  const start = Math.max(0, data.length - lookback);
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = start; i < data.length; i++) {
    const v = data[i]?.[dataKey];
    if (typeof v === "number") {
      if (v < min) {
        min = v;
      }
      if (v > max) {
        max = v;
      }
    }
  }
  const range = max - min;
  if (range === 0) {
    return "flat";
  }
  const tailStart = Math.max(start, data.length - 5);
  const first = (data[tailStart]?.[dataKey] as number) ?? 0;
  const last = (data.at(-1)?.[dataKey] as number) ?? 0;
  const delta = last - first;
  const threshold = range * 0.12;
  if (delta > threshold) {
    return "up";
  }
  if (delta < -threshold) {
    return "down";
  }
  return "flat";
}

export interface LiveLineProps {
  /** Key in data to use for y values */
  dataKey: string;
  /** Stroke color. Default: var(--chart-line-primary) */
  stroke?: string;
  /** Stroke width. Default: 2 */
  strokeWidth?: number;
  /** Show gradient fill under the curve. Default: true */
  fill?: boolean;
  /** Show pulsing live dot at the right edge. Default: true */
  pulse?: boolean;
  /** Show value badge pill at the live tip. Default: true */
  badge?: boolean;
  /** Value label formatter for the badge */
  formatValue?: (v: number) => string;
}

LiveLine.displayName = "LiveLine";

export function LiveLine({
  dataKey,
  stroke = chartCssVars.linePrimary,
  strokeWidth = 2,
  fill = true,
  pulse = true,
  badge = true,
  formatValue = (v: number) => v.toFixed(2),
}: LiveLineProps) {
  const { data, xScale, yScale, innerWidth, innerHeight, xAccessor, lines } =
    useChart();

  const uid = useId();
  const gradientId = `live-line-grad-${uid}`;
  const areaGradientId = `live-area-grad-${uid}`;
  const fadeId = `live-fade-${uid}`;
  const fadeMaskId = `live-fade-mask-${uid}`;

  const getX = useCallback(
    (d: Record<string, unknown>) => xScale(xAccessor(d)) ?? 0,
    [xScale, xAccessor]
  );

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const v = d[dataKey];
      return typeof v === "number" ? (yScale(v) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  // The last data point is the virtual "live tip" appended by LiveLineChart
  const lastPoint = data.at(-1);
  const liveValue =
    lastPoint && typeof lastPoint[dataKey] === "number"
      ? (lastPoint[dataKey] as number)
      : 0;

  const liveDotX = innerWidth;
  const liveDotY = yScale(liveValue) ?? 0;

  const momentum = useMemo(
    () => detectMomentum(data, dataKey),
    [data, dataKey]
  );

  const MOMENTUM_COLORS = {
    up: "var(--color-emerald-500)",
    down: "var(--color-red-500)",
    flat: stroke,
  };
  const dotColor = MOMENTUM_COLORS[momentum];

  // Find the line config for this dataKey to get the resolved stroke
  const lineConfig = lines.find((l) => l.dataKey === dataKey);
  const resolvedStroke = lineConfig?.stroke ?? stroke;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedStroke} stopOpacity={1} />
          <stop offset="100%" stopColor={resolvedStroke} stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedStroke} stopOpacity={0.1} />
          <stop offset="100%" stopColor={resolvedStroke} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="4%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={1} />
        </linearGradient>
        <mask id={fadeMaskId}>
          <rect
            x={0}
            y={-20}
            width={innerWidth}
            height={innerHeight + 40}
            fill={`url(#${fadeId})`}
          />
        </mask>
      </defs>

      {/* Area fill */}
      {fill && data.length > 1 && (
        <g mask={`url(#${fadeMaskId})`}>
          <AreaClosed
            data={data}
            x={getX}
            y={getY}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={`url(#${areaGradientId})`}
            strokeWidth={0}
          />
        </g>
      )}

      {/* Line */}
      {data.length > 1 && (
        <g mask={`url(#${fadeMaskId})`}>
          <LinePath
            data={data}
            x={getX}
            y={getY}
            curve={curveMonotoneX}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Dashed horizontal line at current value */}
      <line
        x1={0}
        x2={innerWidth}
        y1={liveDotY}
        y2={liveDotY}
        stroke={resolvedStroke}
        strokeWidth={1}
        strokeDasharray="4,4"
        opacity={0.25}
      />

      {/* Live pulsing dot */}
      <g>
        {pulse && (
          <circle
            cx={liveDotX}
            cy={liveDotY}
            r={8}
            fill="none"
            stroke={dotColor}
            strokeWidth={1.5}
            opacity={0.4}
          >
            <animate
              attributeName="r"
              from="4"
              to="14"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        <circle
          cx={liveDotX}
          cy={liveDotY}
          r={5}
          fill={dotColor}
          opacity={0.1}
        />
        <circle
          cx={liveDotX}
          cy={liveDotY}
          r={3}
          fill={dotColor}
          stroke={chartCssVars.background}
          strokeWidth={2}
        />
      </g>

      {/* Badge */}
      {badge && (
        <g transform={`translate(${liveDotX + 12},${liveDotY})`}>
          <rect
            x={0}
            y={-12}
            width={formatValue(liveValue).length * 7.5 + 16}
            height={24}
            rx={6}
            fill={resolvedStroke}
            opacity={0.95}
          />
          <text
            x={8}
            y={4}
            fill="white"
            fontSize={11}
            fontWeight={500}
            fontFamily="SF Mono, Menlo, Monaco, monospace"
          >
            {formatValue(liveValue)}
          </text>
        </g>
      )}
    </>
  );
}

export default LiveLine;
