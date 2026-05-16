"use client";

import { Gauge, PatternLines, type ChartStatFlowFormat } from "@bklitui/ui/charts";
import { useCallback, useId, useState } from "react";
import { Button } from "@/components/ui/button";

/** Same NumberFlow currency pattern as typical pie demos */
const gaugePieCenterFormat: ChartStatFlowFormat = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

function LabeledRange({
  id,
  label,
  max,
  min,
  onChange,
  step,
  value,
  valueLabel,
}: {
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (n: number) => void;
  step?: number;
  value: number;
  valueLabel?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label className="font-medium text-foreground text-sm" htmlFor={id}>
          {label}
        </label>
        <span className="tabular-nums text-muted-foreground text-xs">
          {valueLabel ?? value}
        </span>
      </div>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        id={id}
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step ?? 1}
        type="range"
        value={value}
      />
    </div>
  );
}

export default function PlaygroundPage() {
  const baseId = useId();
  const [animationKey, setAnimationKey] = useState(0);

  const [value, setValue] = useState(66);
  const [totalNotches, setTotalNotches] = useState(40);
  const [spacing, setSpacing] = useState(25);
  const [notchCornerRadius, setNotchCornerRadius] = useState(0);
  const [chartWidth, setChartWidth] = useState(420);
  const [chartHeight, setChartHeight] = useState(320);
  const [startAngle, setStartAngle] = useState(135);
  const [endAngle, setEndAngle] = useState(405);
  const [useGradient, setUseGradient] = useState(false);
  const [usePatterns, setUsePatterns] = useState(false);
  const [uniformWidth, setUniformWidth] = useState(false);
  const [notchLengthPercent, setNotchLengthPercent] = useState(100);
  const [centerValue, setCenterValue] = useState(284_920);
  const [defaultLabel, setDefaultLabel] = useState("Total Revenue");
  const [prefix, setPrefix] = useState("");

  const replay = useCallback(() => {
    setAnimationKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-6xl gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-4">
          <div>
            <h1 className="font-bold text-2xl">Gauge playground</h1>
            <p className="text-muted-foreground text-sm">
              Interactive <code className="text-xs">Gauge</code> from{" "}
              <code className="text-xs">@bklitui/ui/charts</code> with the same{" "}
              <code className="text-xs">PieCenter</code> stack as donut pies (via{" "}
              <code className="text-xs">PieCenterShell</code>).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={replay} type="button" variant="secondary">
              Replay animation
            </Button>
          </div>
          <div className="flex min-h-[340px] justify-center overflow-x-auto rounded-lg border border-border bg-card px-4 py-10">
            <Gauge
              activeFill={
                usePatterns ? "url(#playground-gauge-active)" : undefined
              }
              centerValue={centerValue}
              defaultLabel={defaultLabel}
              endAngle={endAngle}
              formatOptions={gaugePieCenterFormat}
              height={chartHeight}
              inactiveFill={
                usePatterns ? "url(#playground-gauge-track)" : undefined
              }
              inactiveFillOpacity={0.4}
              key={animationKey}
              notchCornerRadius={notchCornerRadius}
              prefix={prefix || undefined}
              spacing={spacing}
              startAngle={startAngle}
              totalNotches={totalNotches}
              uniformWidth={uniformWidth}
              notchLengthPercent={notchLengthPercent}
              useGradient={usePatterns ? false : useGradient}
              value={value}
              width={chartWidth}
            >
              {usePatterns
                ? [
                    <PatternLines
                      height={6}
                      id="playground-gauge-track"
                      key="playground-gauge-track"
                      orientation={["diagonal"]}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1}
                      width={6}
                    />,
                    <PatternLines
                      height={6}
                      id="playground-gauge-active"
                      key="playground-gauge-active"
                      orientation={["diagonal"]}
                      stroke="var(--chart-1)"
                      strokeWidth={1}
                      width={6}
                    />,
                  ]
                : undefined}
            </Gauge>
          </div>
        </div>

        <aside className="mt-10 max-h-[calc(100vh-5rem)] space-y-4 overflow-y-auto rounded-lg border border-border bg-card p-5 lg:mt-0">
          <h2 className="font-semibold text-foreground text-sm">Controls</h2>

          <LabeledRange
            id={`${baseId}-value`}
            label="Gauge fill (0–100)"
            max={100}
            min={0}
            onChange={setValue}
            value={value}
            valueLabel={`${value}%`}
          />
          <LabeledRange
            id={`${baseId}-center`}
            label="Center value (PieCenter / NumberFlow)"
            max={500_000}
            min={0}
            onChange={setCenterValue}
            step={1000}
            value={centerValue}
          />
          <LabeledRange
            id={`${baseId}-notches`}
            label="Total notches"
            max={80}
            min={4}
            onChange={setTotalNotches}
            value={totalNotches}
          />
          <LabeledRange
            id={`${baseId}-spacing`}
            label="Spacing (% of arc)"
            max={60}
            min={0}
            onChange={setSpacing}
            step={1}
            value={spacing}
            valueLabel={`${spacing}%`}
          />
          <LabeledRange
            id={`${baseId}-notch-len`}
            label="Notch length (% of default depth)"
            max={100}
            min={10}
            onChange={setNotchLengthPercent}
            step={1}
            value={notchLengthPercent}
            valueLabel={`${notchLengthPercent}%`}
          />
          <LabeledRange
            id={`${baseId}-corner`}
            label="Corner radius (px)"
            max={28}
            min={0}
            onChange={setNotchCornerRadius}
            value={notchCornerRadius}
            valueLabel={`${notchCornerRadius}px`}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              checked={uniformWidth}
              className="size-4 rounded border border-input accent-foreground"
              onChange={(e) => setUniformWidth(e.target.checked)}
              type="checkbox"
            />
            Uniform width (rectangular notches)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              checked={useGradient}
              className="size-4 rounded border border-input accent-foreground"
              onChange={(e) => {
                const next = e.target.checked;
                setUseGradient(next);
                if (next) {
                  setUsePatterns(false);
                }
              }}
              type="checkbox"
            />
            Lime → emerald gradient
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              checked={usePatterns}
              className="size-4 rounded border border-input accent-foreground"
              onChange={(e) => {
                const next = e.target.checked;
                setUsePatterns(next);
                if (next) {
                  setUseGradient(false);
                }
              }}
              type="checkbox"
            />
            Pattern fills (diagonal lines, like pie charts)
          </label>

          <LabeledRange
            id={`${baseId}-w`}
            label="Width (px)"
            max={560}
            min={280}
            onChange={setChartWidth}
            value={chartWidth}
          />
          <LabeledRange
            id={`${baseId}-h`}
            label="Height (px)"
            max={480}
            min={240}
            onChange={setChartHeight}
            value={chartHeight}
          />
          <LabeledRange
            id={`${baseId}-start`}
            label="Start angle (°)"
            max={720}
            min={-360}
            onChange={setStartAngle}
            value={startAngle}
            valueLabel={`${startAngle}°`}
          />
          <LabeledRange
            id={`${baseId}-end`}
            label="End angle (°)"
            max={720}
            min={-360}
            onChange={setEndAngle}
            value={endAngle}
            valueLabel={`${endAngle}°`}
          />

          <div className="space-y-1.5">
            <label
              className="font-medium text-foreground text-sm"
              htmlFor={`${baseId}-label`}
            >
              PieCenter defaultLabel
            </label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id={`${baseId}-label`}
              onChange={(e) => setDefaultLabel(e.target.value)}
              type="text"
              value={defaultLabel}
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="font-medium text-foreground text-sm"
              htmlFor={`${baseId}-prefix`}
            >
              Prefix (optional; currency symbol is usually from format)
            </label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              id={`${baseId}-prefix`}
              onChange={(e) => setPrefix(e.target.value)}
              type="text"
              value={prefix}
            />
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Center uses USD currency NumberFlow (
            <code className="text-xs">gaugePieCenterFormat</code> in this page).
          </p>
        </aside>
      </div>
    </div>
  );
}
