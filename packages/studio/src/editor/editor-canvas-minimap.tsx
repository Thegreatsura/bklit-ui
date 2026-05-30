"use client";

import type { RefObject } from "react";
import { useCallback } from "react";
import type { EditorCanvasView } from "@/editor/editor-canvas-view";
import { cn } from "@/lib/utils";

export function EditorCanvasMinimap({
  className,
  viewportRef,
  view,
  artboardWidth,
  artboardHeight,
  onPanTo,
}: {
  className?: string;
  viewportRef: RefObject<HTMLElement | null>;
  view: EditorCanvasView;
  artboardWidth: number;
  artboardHeight: number;
  onPanTo: (panX: number, panY: number) => void;
}) {
  const minimapWidth = 120;
  const minimapHeight = 80;
  const padding = 8;
  const scale = Math.min(
    (minimapWidth - padding * 2) / artboardWidth,
    (minimapHeight - padding * 2) / artboardHeight
  );
  const boardW = artboardWidth * scale;
  const boardH = artboardHeight * scale;
  const boardX = (minimapWidth - boardW) / 2;
  const boardY = (minimapHeight - boardH) / 2;

  const viewport = viewportRef.current;
  const viewportWidth = viewport?.clientWidth ?? 0;
  const viewportHeight = viewport?.clientHeight ?? 0;

  const lensWidth = Math.min(
    (viewportWidth / view.scale) * scale,
    minimapWidth
  );
  const lensHeight = Math.min(
    (viewportHeight / view.scale) * scale,
    minimapHeight
  );
  const lensX =
    boardX +
    Math.max(
      0,
      Math.min((-view.panX / view.scale) * scale, boardW - lensWidth)
    );
  const lensY =
    boardY +
    Math.max(
      0,
      Math.min((-view.panY / view.scale) * scale, boardH - lensHeight)
    );

  const handlePointer = useCallback(
    (clientX: number, clientY: number, target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const worldX = (localX - boardX) / scale;
      const worldY = (localY - boardY) / scale;

      onPanTo(
        viewportWidth / 2 - worldX * view.scale,
        viewportHeight / 2 - worldY * view.scale
      );
    },
    [boardX, boardY, onPanTo, scale, view.scale, viewportHeight, viewportWidth]
  );

  return (
    <div
      className={cn(
        "pointer-events-auto absolute right-3 bottom-16 z-20 rounded-md border border-border/70 bg-background/90 p-1 shadow-md backdrop-blur-sm",
        className
      )}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        handlePointer(event.clientX, event.clientY, event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          return;
        }
        handlePointer(event.clientX, event.clientY, event.currentTarget);
      }}
      style={{ width: minimapWidth, height: minimapHeight }}
    >
      <svg
        aria-label="Canvas minimap"
        className="size-full"
        role="img"
        viewBox={`0 0 ${minimapWidth} ${minimapHeight}`}
      >
        <rect
          fill="color-mix(in oklch, var(--foreground) 8%, transparent)"
          height={boardH}
          rx={2}
          stroke="color-mix(in oklch, var(--foreground) 20%, transparent)"
          width={boardW}
          x={boardX}
          y={boardY}
        />
        <rect
          fill="color-mix(in oklch, var(--accent) 18%, transparent)"
          height={lensHeight}
          rx={1}
          stroke="var(--accent)"
          strokeWidth={1}
          width={lensWidth}
          x={lensX}
          y={lensY}
        />
      </svg>
    </div>
  );
}
