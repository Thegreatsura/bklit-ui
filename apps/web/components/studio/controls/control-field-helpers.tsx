"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import type { StudioControl } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

export const studioControlLabelClass = "w-32 shrink-0 text-xs leading-tight";

export const studioControlRowClass = "flex items-center gap-3";

const GROUP_LABELED_TYPES = new Set<StudioControl["type"]>([
  "pattern",
  "curve",
  "pieFill",
  "orientation",
  "lineCap",
  "pieHoverEffect",
  "funnelEdges",
  "graticuleToggle",
]);

export function StudioControlRow({
  label,
  htmlFor,
  children,
  alignControl = "stretch",
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  /** `end` for switches; `stretch` for inputs and sliders */
  alignControl?: "stretch" | "end";
}) {
  return (
    <div className={studioControlRowClass}>
      <Label className={studioControlLabelClass} htmlFor={htmlFor}>
        {label}
      </Label>
      <div
        className={cn(
          "min-w-0 flex-1",
          alignControl === "end" && "flex justify-end"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ControlFieldLabel({ control }: { control: StudioControl }) {
  if (GROUP_LABELED_TYPES.has(control.type)) {
    return <Label className="text-xs">{control.label}</Label>;
  }
  return (
    <Label className="text-xs" htmlFor={String(control.key)}>
      {control.label}
    </Label>
  );
}

export function isGroupLabeledControlType(type: StudioControl["type"]) {
  return GROUP_LABELED_TYPES.has(type);
}
