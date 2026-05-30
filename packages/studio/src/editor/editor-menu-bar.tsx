"use client";

import {
  Maximize2,
  Minus,
  Monitor,
  Plus,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useEffect } from "react";
import { EditorReplayButton } from "@/editor/editor-replay-button";
import { EditorSidebarToggle } from "@/editor/editor-sidebar-toggle";
import { EditorThemeToggle } from "@/editor/editor-theme-toggle";
import type { ViewportPreset } from "@/editor/viewport-presets";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";

const VIEWPORT_ICONS = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
} as const;

const VIEWPORT_LABELS: Record<ViewportPreset, string> = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return (
    target.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
}

function ViewportButton({
  preset,
  active,
  onSelect,
}: {
  preset: ViewportPreset;
  active: boolean;
  onSelect: (preset: ViewportPreset) => void;
}) {
  const Icon = VIEWPORT_ICONS[preset];

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button
          aria-label={VIEWPORT_LABELS[preset]}
          aria-pressed={active}
          className={cn("size-8", active && "bg-muted text-foreground")}
          onClick={() => onSelect(preset)}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{VIEWPORT_LABELS[preset]}</TooltipContent>
    </Tooltip>
  );
}

export function EditorMenuBar({
  className,
  viewport,
  width,
  height,
  sidebarsOpen,
  showSidebarToggle = true,
  showViewportToggles = true,
  onSidebarsOpenChange,
  onViewportChange,
  onReplay,
  actions,
  showZoomControls = false,
  canvasScale = 1,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetZoom,
}: {
  className?: string;
  viewport: ViewportPreset | null;
  width: number;
  height: number;
  sidebarsOpen: boolean;
  showSidebarToggle?: boolean;
  showViewportToggles?: boolean;
  showZoomControls?: boolean;
  canvasScale?: number;
  onSidebarsOpenChange: (open: boolean) => void;
  onViewportChange: (preset: ViewportPreset) => void;
  onReplay: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onResetZoom?: () => void;
  actions?: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "r" && event.key !== "R") {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      onReplay();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onReplay]);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 shadow-lg backdrop-blur-sm",
          className
        )}
      >
        {showSidebarToggle ? (
          <>
            <EditorSidebarToggle
              onToggle={() => onSidebarsOpenChange(!sidebarsOpen)}
              open={sidebarsOpen}
            />

            <Separator className="mx-0.5 h-5" orientation="vertical" />
          </>
        ) : null}

        {showViewportToggles ? (
          <>
            {(Object.keys(VIEWPORT_ICONS) as ViewportPreset[]).map((preset) => (
              <ViewportButton
                active={viewport === preset}
                key={preset}
                onSelect={onViewportChange}
                preset={preset}
              />
            ))}

            <Separator className="mx-0.5 h-5" orientation="vertical" />
          </>
        ) : null}

        <EditorReplayButton onReplay={onReplay} />

        <Separator className="mx-0.5 h-5" orientation="vertical" />

        <EditorThemeToggle />

        {showZoomControls ? (
          <>
            <Separator className="mx-0.5 h-5 shrink-0" orientation="vertical" />

            <Tooltip>
              <TooltipTrigger render={<span className="inline-flex" />}>
                <Button
                  aria-label="Zoom out"
                  className="size-8"
                  onClick={onZoomOut}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Minus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>

            <button
              className="min-w-12 shrink-0 px-1 font-mono text-[11px] text-muted-foreground tabular-nums hover:text-foreground"
              onClick={onResetZoom}
              type="button"
            >
              {Math.round(canvasScale * 100)}%
            </button>

            <Tooltip>
              <TooltipTrigger render={<span className="inline-flex" />}>
                <Button
                  aria-label="Zoom in"
                  className="size-8"
                  onClick={onZoomIn}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<span className="inline-flex" />}>
                <Button
                  aria-label="Zoom to fit"
                  className="size-8"
                  onClick={onFitView}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Maximize2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom to fit (double-click canvas)</TooltipContent>
            </Tooltip>
          </>
        ) : null}

        {actions ? (
          <>
            <Separator className="mx-0.5 h-5 shrink-0" orientation="vertical" />
            <div className="flex shrink-0 items-center gap-1">{actions}</div>
          </>
        ) : null}

        <Separator className="mx-0.5 h-5 shrink-0" orientation="vertical" />

        <span className="shrink-0 whitespace-nowrap px-2 font-mono text-[11px] text-muted-foreground tabular-nums">
          {width} × {height}
        </span>
      </div>
    </TooltipProvider>
  );
}
