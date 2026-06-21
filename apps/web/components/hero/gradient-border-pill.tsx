"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const STROKE_WIDTH = 1;
const SWEEP_DURATION = 3.75;
const SWEEP_RATIO = 0.34;
const SWEEP_EXPAND_DURATION = 0.42;
const SWEEP_CONTRACT_DURATION = 0.5;
const SWEEP_EASE = [0.645, 0.045, 0.355, 1] as const;
const SWEEP_HOVER_EASE = [0.23, 1, 0.32, 1] as const;

function buildPillPath(width: number, height: number): string {
  const inset = STROKE_WIDTH / 2;
  const w = Math.max(0, width - STROKE_WIDTH);
  const h = Math.max(0, height - STROKE_WIDTH);
  const r = h / 2;
  const x = inset;
  const y = inset;

  return [
    `M ${x + r} ${y}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V ${y + h - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

function getSweepGradientCoords(
  path: SVGPathElement,
  perimeter: number,
  dashOffset: number,
  sweepLength: number
) {
  const leadingEdge = ((-dashOffset % perimeter) + perimeter) % perimeter;
  const center = (leadingEdge + sweepLength / 2) % perimeter;
  const tangentStep = Math.min(1.25, perimeter * 0.01);
  const centerPoint = path.getPointAtLength(center);
  const before = path.getPointAtLength(
    (center - tangentStep + perimeter) % perimeter
  );
  const after = path.getPointAtLength((center + tangentStep) % perimeter);
  const dx = after.x - before.x;
  const dy = after.y - before.y;
  const length = Math.hypot(dx, dy) || 1;
  const halfSpan = sweepLength / 2;

  return {
    x1: centerPoint.x - (dx / length) * halfSpan,
    y1: centerPoint.y - (dy / length) * halfSpan,
    x2: centerPoint.x + (dx / length) * halfSpan,
    y2: centerPoint.y + (dy / length) * halfSpan,
  };
}

function PillBorderSvg({
  width,
  height,
  isHovered,
  reducedMotion,
  sweepGradientId,
  className,
}: {
  width: number;
  height: number;
  isHovered: boolean;
  reducedMotion: boolean | null;
  sweepGradientId: string;
  className?: string;
}) {
  const measurePathRef = useRef<SVGPathElement>(null);
  const sweepPathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const [perimeter, setPerimeter] = useState(0);
  const dashOffset = useMotionValue(0);
  const sweepRatio = useMotionValue(SWEEP_RATIO);

  const pillPath = buildPillPath(width, height);

  // biome-ignore lint/correctness/useExhaustiveDependencies: remeasure path when pill dimensions change
  useLayoutEffect(() => {
    const node = measurePathRef.current;
    if (!node) {
      return;
    }

    setPerimeter(node.getTotalLength());
  }, [width, height]);

  const syncDasharray = useCallback(
    (ratio: number) => {
      const sweepPath = sweepPathRef.current;
      if (!sweepPath || perimeter <= 0) {
        return;
      }

      const sweepLength = perimeter * ratio;
      const sweepGap = Math.max(0, perimeter - sweepLength);
      sweepPath.setAttribute("stroke-dasharray", `${sweepLength} ${sweepGap}`);
    },
    [perimeter]
  );

  const syncGradient = useCallback(
    (offset: number, ratio = sweepRatio.get()) => {
      const path = measurePathRef.current;
      const gradient = gradientRef.current;
      if (!(path && gradient) || perimeter <= 0) {
        return;
      }

      const sweepLength = perimeter * ratio;
      const { x1, y1, x2, y2 } = getSweepGradientCoords(
        path,
        perimeter,
        offset,
        sweepLength
      );

      gradient.setAttribute("x1", String(x1));
      gradient.setAttribute("y1", String(y1));
      gradient.setAttribute("x2", String(x2));
      gradient.setAttribute("y2", String(y2));
    },
    [perimeter, sweepRatio]
  );

  useMotionValueEvent(dashOffset, "change", (offset) => {
    syncGradient(offset);
  });

  useMotionValueEvent(sweepRatio, "change", (ratio) => {
    syncDasharray(ratio);
    syncGradient(dashOffset.get(), ratio);
  });

  useEffect(() => {
    if (perimeter <= 0) {
      return;
    }

    syncDasharray(sweepRatio.get());
    syncGradient(dashOffset.get(), sweepRatio.get());
  }, [perimeter, syncDasharray, syncGradient, dashOffset, sweepRatio]);

  useEffect(() => {
    if (perimeter <= 0) {
      return;
    }

    if (reducedMotion) {
      const staticOffset = perimeter * 0.35;
      dashOffset.set(staticOffset);
      syncGradient(staticOffset);
      return;
    }

    dashOffset.set(0);
    syncGradient(0);

    const controls = animate(dashOffset, [0, -perimeter], {
      duration: SWEEP_DURATION,
      ease: SWEEP_EASE,
      repeat: Number.POSITIVE_INFINITY,
    });

    return () => controls.stop();
  }, [dashOffset, perimeter, reducedMotion, syncGradient]);

  useEffect(() => {
    if (perimeter <= 0) {
      return;
    }

    const targetRatio = isHovered ? 1 : SWEEP_RATIO;

    if (reducedMotion) {
      sweepRatio.set(targetRatio);
      syncDasharray(targetRatio);
      syncGradient(dashOffset.get(), targetRatio);
      return;
    }

    const controls = animate(sweepRatio, targetRatio, {
      duration: isHovered ? SWEEP_EXPAND_DURATION : SWEEP_CONTRACT_DURATION,
      ease: SWEEP_HOVER_EASE,
    });

    return () => controls.stop();
  }, [
    dashOffset,
    isHovered,
    perimeter,
    reducedMotion,
    sweepRatio,
    syncDasharray,
    syncGradient,
  ]);

  const pathProps = {
    d: pillPath,
    fill: "none" as const,
    strokeWidth: STROKE_WIDTH,
  };

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible",
        className
      )}
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>Pill border sweep</title>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={sweepGradientId}
          ref={gradientRef}
          x1={0}
          x2={1}
          y1={0}
          y2={0}
        >
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0" />
          <stop offset="18%" stopColor="var(--chart-1)" stopOpacity="0.55" />
          <stop offset="50%" stopColor="var(--chart-2)" stopOpacity="1" />
          <stop offset="82%" stopColor="var(--chart-2)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        ref={measurePathRef}
        {...pathProps}
        opacity={0.35}
        stroke="var(--chart-1)"
      />

      {perimeter > 0 ? (
        <motion.path
          ref={sweepPathRef}
          {...pathProps}
          stroke={`url(#${sweepGradientId})`}
          strokeDasharray={`${perimeter * SWEEP_RATIO} ${perimeter * (1 - SWEEP_RATIO)}`}
          strokeLinecap="butt"
          style={{ strokeDashoffset: dashOffset }}
        />
      ) : null}
    </svg>
  );
}

export function GradientBorderPill({
  children,
  className,
  href,
  ...props
}: ComponentProps<typeof Link> & { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sweepGradientId = `studio-pill-sweep-${useId().replace(/:/g, "")}`;

  const measure = useCallback(() => {
    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    const { width, height } = node.getBoundingClientRect();
    setSize({
      width: Math.max(0, Math.round(width)),
      height: Math.max(0, Math.round(height)),
    });
  }, []);

  useLayoutEffect(() => {
    measure();

    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      className="relative inline-flex overflow-visible rounded-full"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      ref={wrapperRef}
      style={{ padding: STROKE_WIDTH }}
    >
      <Link
        className={cn(
          "group/studio-pill relative z-0 inline-flex w-full items-center gap-0 rounded-full bg-background/60 px-0.5 py-0.5 text-xs shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-200 group-hover/studio-pill:bg-background/75 group-hover/studio-pill:shadow-md dark:bg-background/40 dark:group-hover/studio-pill:bg-background/55",
          className
        )}
        href={href}
        {...props}
      >
        {children}
      </Link>

      {size.width > 0 && size.height > 0 ? (
        <PillBorderSvg
          className="z-10"
          height={size.height}
          isHovered={isHovered}
          reducedMotion={reducedMotion}
          sweepGradientId={sweepGradientId}
          width={size.width}
        />
      ) : null}
    </div>
  );
}
