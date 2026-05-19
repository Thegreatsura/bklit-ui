"use client";

import { Suspense } from "react";
import { StudioShell } from "@/components/studio/studio-shell";

function StudioFallback() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-muted-foreground text-sm">
      Loading studio…
    </div>
  );
}

export default function StudioPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Suspense fallback={<StudioFallback />}>
        <StudioShell />
      </Suspense>
    </div>
  );
}
