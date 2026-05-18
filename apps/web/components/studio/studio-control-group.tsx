"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sidebar section wrapper for a group of studio controls.
 * Customize layout and styling here as the design evolves.
 */
export function StudioControlGroup({
  title,
  children,
  className,
  fieldsClassName,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  fieldsClassName?: string;
}) {
  return (
    <section
      className={cn("studio-control-group flex flex-col gap-5", className)}
      data-studio-control-group={title}
    >
      <header className="studio-control-group-header">
        <h3 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </header>
      <div
        className={cn(
          "studio-control-group-fields space-y-3.5",
          fieldsClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
