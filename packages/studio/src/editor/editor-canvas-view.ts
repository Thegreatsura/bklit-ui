export const EDITOR_CANVAS_MIN_SCALE = 0.25;
export const EDITOR_CANVAS_MAX_SCALE = 4;
export const EDITOR_CANVAS_SESSION_KEY = "bklit-studio-canvas-view";
export const EDITOR_CANVAS_VIEW_PADDING = 64;

export interface EditorCanvasView {
  scale: number;
  panX: number;
  panY: number;
}

export function clampCanvasScale(scale: number) {
  return Math.min(
    EDITOR_CANVAS_MAX_SCALE,
    Math.max(EDITOR_CANVAS_MIN_SCALE, scale)
  );
}

export function pickWorldTickInterval(scale: number) {
  const targetScreenPx = 48;
  const worldInterval = targetScreenPx / Math.max(scale, 0.01);
  const magnitude = 10 ** Math.floor(Math.log10(worldInterval));
  const normalized = worldInterval / magnitude;

  if (normalized < 2) {
    return magnitude;
  }
  if (normalized < 5) {
    return 2 * magnitude;
  }
  return 5 * magnitude;
}

export function computeFitView({
  viewportWidth,
  viewportHeight,
  artboardWidth,
  artboardHeight,
  padding = EDITOR_CANVAS_VIEW_PADDING,
}: {
  viewportWidth: number;
  viewportHeight: number;
  artboardWidth: number;
  artboardHeight: number;
  padding?: number;
}): EditorCanvasView {
  const availableWidth = Math.max(viewportWidth - padding, 120);
  const availableHeight = Math.max(viewportHeight - padding, 120);
  const scale = clampCanvasScale(
    Math.min(availableWidth / artboardWidth, availableHeight / artboardHeight)
  );

  return {
    scale,
    panX: (viewportWidth - artboardWidth * scale) / 2,
    panY: (viewportHeight - artboardHeight * scale) / 2,
  };
}

export function computeCenterView({
  viewportWidth,
  viewportHeight,
  artboardWidth,
  artboardHeight,
  scale,
}: {
  viewportWidth: number;
  viewportHeight: number;
  artboardWidth: number;
  artboardHeight: number;
  scale: number;
}): Pick<EditorCanvasView, "panX" | "panY"> {
  return {
    panX: (viewportWidth - artboardWidth * scale) / 2,
    panY: (viewportHeight - artboardHeight * scale) / 2,
  };
}

export function zoomAtPoint({
  view,
  pointX,
  pointY,
  nextScale,
}: {
  view: EditorCanvasView;
  pointX: number;
  pointY: number;
  nextScale: number;
}): EditorCanvasView {
  const scale = clampCanvasScale(nextScale);
  const worldX = (pointX - view.panX) / view.scale;
  const worldY = (pointY - view.panY) / view.scale;

  return {
    scale,
    panX: pointX - worldX * scale,
    panY: pointY - worldY * scale,
  };
}

export function readPersistedCanvasView(): EditorCanvasView | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(EDITOR_CANVAS_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as EditorCanvasView;
    if (
      !(
        Number.isFinite(parsed.scale) &&
        Number.isFinite(parsed.panX) &&
        Number.isFinite(parsed.panY)
      )
    ) {
      return null;
    }

    return {
      scale: clampCanvasScale(parsed.scale),
      panX: parsed.panX,
      panY: parsed.panY,
    };
  } catch {
    return null;
  }
}

export function persistCanvasView(view: EditorCanvasView) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(EDITOR_CANVAS_SESSION_KEY, JSON.stringify(view));
  } catch {
    // Ignore quota / private mode errors.
  }
}
