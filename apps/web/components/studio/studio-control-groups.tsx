"use client";

import { ControlField } from "@/components/studio/controls/control-field";
import { isGroupLabeledControlType } from "@/components/studio/controls/control-field-helpers";
import { CssRevealMotionControl } from "@/components/studio/controls/css-reveal-motion-control";
import { MotionControl } from "@/components/studio/controls/motion-control";
import { MotionStaggerControl } from "@/components/studio/controls/motion-stagger-control";
import { StudioControlGroup } from "@/components/studio/studio-control-group";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";
import type {
  StudioChartConfig,
  StudioControlGroup as StudioControlGroupConfig,
} from "@/lib/studio/types";

export function StudioControlGroups({
  groups,
  state,
  motionPanel,
  onChange,
  onPreview,
  onCommit,
}: {
  groups: StudioControlGroupConfig[];
  state: StudioUrlState;
  motionPanel?: StudioChartConfig["motionPanel"];
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
  return (
    <div className="studio-control-groups w-full min-w-0 space-y-7 pb-4">
      {motionPanel === "gauge" ? (
        <StudioControlGroup className="studio-motion-section" title="Motion">
          <MotionControl
            onChange={onChange}
            onCommit={onCommit}
            onPreview={onPreview}
            state={state}
          />
        </StudioControlGroup>
      ) : null}
      {motionPanel === "css-reveal" ? (
        <StudioControlGroup className="studio-motion-section" title="Motion">
          <CssRevealMotionControl
            onChange={onChange}
            onCommit={onCommit}
            onPreview={onPreview}
            state={state}
          />
        </StudioControlGroup>
      ) : null}
      {motionPanel === "motion-enter" ? (
        <StudioControlGroup className="studio-motion-section" title="Motion">
          <MotionControl
            onChange={onChange}
            onCommit={onCommit}
            onPreview={onPreview}
            state={state}
          />
        </StudioControlGroup>
      ) : null}
      {motionPanel === "motion-stagger" ? (
        <StudioControlGroup className="studio-motion-section" title="Motion">
          <MotionStaggerControl
            onCommit={onCommit}
            onPreview={onPreview}
            state={state}
          />
        </StudioControlGroup>
      ) : null}

      {groups.map((group) => (
        <StudioControlGroup key={group.title} title={group.title}>
          {group.controls.map((control) => (
            <ControlField
              control={control}
              hideGroupLabel={isGroupLabeledControlType(control.type)}
              key={control.key}
              onChange={onChange}
              onCommit={onCommit}
              onPreview={onPreview}
              state={state}
            />
          ))}
        </StudioControlGroup>
      ))}
    </div>
  );
}
