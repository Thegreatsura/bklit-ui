"use client";

import { StudioPreview } from "./studio-preview";
import { StudioSidebar } from "./studio-sidebar";
import { StudioStateProvider } from "./studio-state-provider";

export function StudioShell() {
  return (
    <StudioStateProvider>
      <div className="flex h-full min-h-0 flex-1 flex-col px-20 py-14">
        <div className="grid h-full min-h-0 flex-1 gap-24 lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)] lg:grid-rows-1 [&>*]:h-full [&>*]:min-h-0">
          <StudioSidebar />
          <StudioPreview />
        </div>
      </div>
    </StudioStateProvider>
  );
}
