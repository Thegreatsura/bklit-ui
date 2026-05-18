"use client";

import { SliderInputGroup } from "@/components/studio/controls/slider-input-group";
import {
  MOTION_EASE_IDS,
  MOTION_EASE_PRESETS,
  type MotionType,
} from "@/lib/studio/motion-config";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";
import { cn } from "@/lib/utils";
import { MotionCurveEditor } from "./motion-curve-editor";

function MotionTypeToggle({
  value,
  onChange,
}: {
  value: MotionType;
  onChange: (v: MotionType) => void;
}) {
  return (
    <fieldset className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {(["ease", "spring"] as const).map((type) => (
        <button
          aria-pressed={value === type}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 font-medium text-xs capitalize transition-colors",
            value === type
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          key={type}
          onClick={() => onChange(type)}
          type="button"
        >
          {type}
        </button>
      ))}
    </fieldset>
  );
}

export function MotionControl({
  state,
  onChange,
  onPreview,
  onCommit,
}: {
  state: StudioUrlState;
  onChange: <K extends keyof StudioUrlState>(
    key: K,
    value: StudioUrlState[K]
  ) => void;
  onPreview: <K extends keyof StudioUrlState>(
    key: K,
    value: StudioUrlState[K]
  ) => void;
  onCommit: <K extends keyof StudioUrlState>(
    key: K,
    value: StudioUrlState[K]
  ) => void;
}) {
  const motionSlice = {
    motionType: state.motionType,
    motionDuration: state.motionDuration,
    motionBounce: state.motionBounce,
    motionEase: state.motionEase,
    motionBezier: state.motionBezier,
  };

  return (
    <div className="space-y-4">
      <MotionTypeToggle
        onChange={(v) => onChange("motionType", v)}
        value={state.motionType}
      />

      <MotionCurveEditor
        onCommit={onCommit}
        onPreview={onPreview}
        state={motionSlice}
      />

      <div className="space-y-3">
        <SliderInputGroup
          label="Duration (s)"
          max={2}
          min={0.2}
          onCommit={(v) => onCommit("motionDuration", v)}
          onPreview={(v) => onPreview("motionDuration", v)}
          step={0.1}
          value={state.motionDuration}
        />

        {state.motionType === "spring" ? (
          <SliderInputGroup
            label="Bounce"
            max={1}
            min={0}
            onCommit={(v) => onCommit("motionBounce", v)}
            onPreview={(v) => onPreview("motionBounce", v)}
            step={0.05}
            value={state.motionBounce}
          />
        ) : (
          <div className="space-y-2">
            <span className="font-medium text-muted-foreground text-xs">
              Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {MOTION_EASE_IDS.filter((id) => id !== "custom").map((id) => (
                <button
                  aria-pressed={state.motionEase === id}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                    state.motionEase === id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  key={id}
                  onClick={() => {
                    onChange("motionEase", id);
                    const b = MOTION_EASE_PRESETS[id].bezier;
                    onChange(
                      "motionBezier",
                      `${b[0]}, ${b[1]}, ${b[2]}, ${b[3]}`
                    );
                  }}
                  type="button"
                >
                  {MOTION_EASE_PRESETS[id].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
