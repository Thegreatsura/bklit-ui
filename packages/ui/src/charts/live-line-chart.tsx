"use client";

import { localPoint } from "@visx/event";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { bisector } from "d3-array";
import {
  Children,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/utils";
import {
  ChartProvider,
  type LineConfig,
  type Margin,
  type TooltipData,
} from "./chart-context";
import type { LiveLineProps } from "./live-line";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiveLinePoint {
  time: number;
  value: number;
}

export interface LiveLineChartProps {
  /** Streaming data — array of { time: unixSeconds, value } */
  data: LiveLinePoint[];
  /** Latest value (smoothly interpolated to) */
  value: number;
  /** Key used for the value field in context data. Default: "value" */
  dataKey?: string;
  /** Visible time window in seconds. Default: 30 */
  window?: number;
  /** Tight Y-axis. Default: false */
  exaggerate?: boolean;
  /** Interpolation speed (0–1). Default: 0.08 */
  lerpSpeed?: number;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Freeze chart scrolling. Default: false */
  paused?: boolean;
  /** Child components (LiveLine, Grid, ChartTooltip, LiveXAxis, LiveYAxis, etc.) */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LERP_SPEED = 0.08;
const DEFAULT_MARGIN: Margin = { top: 24, right: 16, bottom: 32, left: 16 };

interface AnimFrame {
  now: number;
  yMin: number;
  yMax: number;
  displayValue: number;
}

function computeTargetRange(
  data: LiveLinePoint[],
  value: number,
  exaggerate: boolean
) {
  if (data.length === 0) {
    return { yMin: 0, yMax: 100 };
  }
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const d of data) {
    if (d.value < min) {
      min = d.value;
    }
    if (d.value > max) {
      max = d.value;
    }
  }
  if (value < min) {
    min = value;
  }
  if (value > max) {
    max = value;
  }
  const rawRange = max - min;
  const paddingFactor = exaggerate ? 0.03 : 0.15;
  const rangePad = rawRange * paddingFactor || (exaggerate ? 0.04 : 10);
  return { yMin: min - rangePad, yMax: max + rangePad };
}

function nextAnimFrame(
  prev: AnimFrame,
  targetRange: { yMin: number; yMax: number },
  targetValue: number,
  speed: number,
  isPaused: boolean
): AnimFrame {
  const nextNow = isPaused ? prev.now : Date.now();
  const nextYMin =
    targetRange.yMin < prev.yMin
      ? targetRange.yMin
      : prev.yMin + (targetRange.yMin - prev.yMin) * speed;
  const nextYMax =
    targetRange.yMax > prev.yMax
      ? targetRange.yMax
      : prev.yMax + (targetRange.yMax - prev.yMax) * speed;
  const nextValue =
    prev.displayValue + (targetValue - prev.displayValue) * speed;
  return {
    now: nextNow,
    yMin: nextYMin,
    yMax: nextYMax,
    displayValue: nextValue,
  };
}

function interpolateAtTime(
  points: LiveLinePoint[],
  timeSec: number
): number | null {
  if (points.length === 0) {
    return null;
  }
  const firstPt = points[0] as LiveLinePoint;
  const lastPt = points.at(-1) as LiveLinePoint;
  if (timeSec <= firstPt.time) {
    return firstPt.value;
  }
  if (timeSec >= lastPt.time) {
    return lastPt.value;
  }
  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    const midPt = points[mid];
    if (midPt && midPt.time <= timeSec) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const p1 = points[lo];
  if (!p1) {
    return null;
  }
  const p2 = points[hi];
  if (!p2) {
    return null;
  }
  const dt = p2.time - p1.time;
  if (dt === 0) {
    return p1.value;
  }
  const t = (timeSec - p1.time) / dt;
  return p1.value + (p2.value - p1.value) * t;
}

const bisectTime = bisector<LiveLinePoint, number>((d) => d.time).left;

function extractLiveLineConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    const childType = child.type as { displayName?: string; name?: string };
    const name =
      typeof child.type === "function"
        ? childType.displayName || childType.name || ""
        : "";
    const props = child.props as LiveLineProps | undefined;
    if (
      (name === "LiveLine" || (props && "dataKey" in props)) &&
      props?.dataKey
    ) {
      configs.push({
        dataKey: props.dataKey,
        stroke: props.stroke || "var(--chart-line-primary)",
        strokeWidth: props.strokeWidth || 2,
      });
    }
  });
  return configs;
}

// ---------------------------------------------------------------------------
// Inner chart
// ---------------------------------------------------------------------------

interface InnerProps {
  data: LiveLinePoint[];
  value: number;
  dataKey: string;
  windowSecs: number;
  exaggerate: boolean;
  lerpSpeed: number;
  margin: Margin;
  paused: boolean;
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

function LiveLineChartInner({
  data,
  value,
  dataKey,
  windowSecs,
  exaggerate,
  lerpSpeed,
  margin,
  paused,
  width,
  height,
  containerRef,
  children,
}: InnerProps) {
  const windowMs = windowSecs * 1000;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ---- Animation state ----
  const animRef = useRef<AnimFrame>({
    now: Date.now(),
    yMin: 0,
    yMax: 100,
    displayValue: value,
  });
  const [frame, setFrame] = useState<AnimFrame>({
    now: Date.now(),
    yMin: 0,
    yMax: 100,
    displayValue: value,
  });

  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const targetRange = useMemo(
    () => computeTargetRange(data, value, exaggerate),
    [data, value, exaggerate]
  );

  const lines = useMemo(() => extractLiveLineConfigs(children), [children]);

  // ---- rAF loop ----
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const next = nextAnimFrame(
        animRef.current,
        targetRange,
        value,
        lerpSpeed,
        pausedRef.current
      );
      animRef.current = next;
      setFrame(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetRange, value, lerpSpeed]);

  // ---- Scales ----
  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [new Date(frame.now - windowMs), new Date(frame.now)],
        range: [0, innerWidth],
      }),
    [frame.now, windowMs, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [frame.yMin, frame.yMax],
        range: [innerHeight, 0],
        nice: true,
      }),
    [frame.yMin, frame.yMax, innerHeight]
  );

  // ---- Build context-compatible data ----
  // Convert LiveLinePoint[] to Record<string, unknown>[] with a virtual tip
  const contextData = useMemo(() => {
    const windowStart = frame.now - windowMs;
    let startIdx = bisectTime(data, windowStart / 1000, 0);
    if (startIdx > 0) {
      startIdx--;
    }
    const sliced = data.slice(startIdx);
    const records: Record<string, unknown>[] = sliced.map((p) => ({
      date: new Date(p.time * 1000),
      [dataKey]: p.value,
    }));
    // Virtual leading-edge point
    records.push({
      date: new Date(frame.now),
      [dataKey]: frame.displayValue,
    });
    return records;
  }, [data, frame.now, frame.displayValue, windowMs, dataKey]);

  // ---- X accessor ----
  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date =>
      d.date instanceof Date ? d.date : new Date(d.date as number),
    []
  );

  // ---- Tooltip (crosshair) state ----
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Custom interaction: pin crosshair to cursor pixel, interpolate value
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const coords = localPoint(event);
      if (!coords) {
        return;
      }
      const cursorX = coords.x - margin.left;
      if (cursorX < 0 || cursorX > innerWidth) {
        setTooltipData(null);
        return;
      }
      const timeMs = xScale.invert(cursorX).getTime();
      const timeSec = timeMs / 1000;
      const val = interpolateAtTime(
        [
          ...data.filter((p) => p.time >= (frame.now - windowMs) / 1000),
          { time: frame.now / 1000, value: frame.displayValue },
        ],
        timeSec
      );
      if (val === null) {
        setTooltipData(null);
        return;
      }
      setTooltipData({
        point: { date: new Date(timeMs), [dataKey]: val },
        index: 0,
        x: cursorX,
        yPositions: { [dataKey]: yScale(val) ?? 0 },
      });
    },
    [
      margin.left,
      innerWidth,
      xScale,
      yScale,
      data,
      dataKey,
      frame.now,
      frame.displayValue,
      windowMs,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  // Date labels (for ChartTooltip's DateTicker — not used in live but needed for context)
  const dateLabels = useMemo(
    () =>
      contextData.map((d) =>
        xAccessor(d).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      ),
    [contextData, xAccessor]
  );

  const columnWidth = useMemo(() => {
    if (contextData.length < 2) {
      return 0;
    }
    return innerWidth / (contextData.length - 1);
  }, [innerWidth, contextData.length]);

  if (innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  const contextValue = {
    data: contextData,
    xScale,
    yScale,
    width,
    height,
    innerWidth,
    innerHeight,
    margin,
    columnWidth,
    tooltipData,
    setTooltipData,
    containerRef,
    lines,
    isLoaded: true,
    animationDuration: 0,
    xAccessor,
    dateLabels,
  };

  return (
    <ChartProvider value={contextValue}>
      <svg
        aria-hidden="true"
        height={height}
        width={width}
        className="overflow-visible"
      >
        {/* biome-ignore lint/a11y/noStaticElementInteractions: SVG group for mouse tracking */}
        <g
          transform={`translate(${margin.left},${margin.top})`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: "crosshair" }}
        >
          <rect
            fill="transparent"
            height={innerHeight}
            width={innerWidth}
            x={0}
            y={0}
          />
          {children}
        </g>
      </svg>
    </ChartProvider>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function LiveLineChart({
  data,
  value,
  dataKey = "value",
  window: windowSecs = 30,
  exaggerate = false,
  lerpSpeed = LERP_SPEED,
  margin: marginProp,
  paused = false,
  children,
  className,
  style,
}: LiveLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height: 300, touchAction: "none", ...style }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <LiveLineChartInner
            data={data}
            value={value}
            dataKey={dataKey}
            windowSecs={windowSecs}
            exaggerate={exaggerate}
            lerpSpeed={lerpSpeed}
            margin={margin}
            paused={paused}
            width={width}
            height={height}
            containerRef={containerRef}
          >
            {children}
          </LiveLineChartInner>
        )}
      </ParentSize>
    </div>
  );
}

export default LiveLineChart;
