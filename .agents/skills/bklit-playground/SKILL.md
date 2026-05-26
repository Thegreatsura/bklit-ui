---
name: bklit-playground
description: >
  bklit-ui monorepo contributors only. Scaffold or edit the gitignored playground
  at apps/web/app/playground/ for chart debugging, animation testing, and
  responsive QA.
disable-model-invocation: true
---

# Bklit Playground Skill

**Monorepo contributors only.** Use this skill when working inside a cloned `bklit/bklit-ui` repo to prototype charts on a local, gitignored route before shipping via **bklit-ship**.

## When to use

- Creating or editing `apps/web/app/playground/page.tsx` (never committed — see `.gitignore`).
- Debugging chart animations, responsiveness, or performance during development.
- Building a focused test page before moving code into `packages/ui`.

## Workflow

### 1. Create the playground route

Copy the template to the gitignored path:

```
.agents/skills/bklit-playground/templates/page.tsx
  → apps/web/app/playground/page.tsx
```

Visit `http://localhost:3000/playground` while the dev server is running.

### 2. Use committed dev tools

Import from `@/components/playground/*` — do not rebuild these from scratch:

| Export | Purpose |
|--------|---------|
| `PlaygroundShell` | Page layout, title, toolbar slot, overlay slot |
| `PlaygroundToolbar` | Viewport presets, dimensions, replay button |
| `ResizablePreview` | Drag-resize chart frame |
| `FpsCounter` | rAF FPS overlay |
| `useReplayKey` | `[key, replay]` hook to remount charts |

### 3. Wire the dev toolbar

- **Replay animation** — call `replay()` from `useReplayKey()` and pass `key={replayKey}` to the chart wrapper (or change `revealSignature`).
- **Responsive testing** — `PlaygroundToolbar` presets: Mobile (375px), Tablet (768px), Desktop (full width). Users can also drag-resize via `ResizablePreview` handles.
- **FPS counter** — pass `<FpsCounter />` to `PlaygroundShell` `overlay` prop.

### 4. Replace the demo chart

Swap the template `LineChart` with your work-in-progress component. Keep imports from `@bklitui/ui/charts` once the chart lives in the package, or colocate prototype components under `apps/web/app/playground/` until ready to ship.

For live/streaming charts, add pause/play controls and multiple card examples (see Live Line PR notes in `.github/PULL_REQUEST_TEMPLATE_LIVELINE.md`).

### 5. Ship when ready

When the API and variants are stable, follow `.agents/skills/bklit-ship/SKILL.md` to move the chart into `packages/ui`, add docs, gallery examples, and registry entries.

## File reference

| Item | Path |
|------|------|
| Playground route (gitignored) | `apps/web/app/playground/page.tsx` |
| Dev tool components | `apps/web/components/playground/` |
| Template | `.agents/skills/bklit-playground/templates/page.tsx` |
| Ship checklist | `.agents/skills/bklit-ship/SKILL.md` |
| Gitignore entry | `.gitignore` → `apps/web/app/playground/` |

## Checklist

- [ ] `apps/web/app/playground/page.tsx` created from template
- [ ] Replay, viewport presets, and FPS counter wired
- [ ] Chart prototype renders without console errors
- [ ] When done prototyping → run **bklit-ship** skill
