"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const pillSurfaceClassName =
  "relative z-0 inline-flex w-full items-center rounded-full bg-background/60 px-0.5 py-0.5 text-xs shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-200 hover:bg-background/75 hover:shadow-md dark:bg-background/40 dark:hover:bg-background/55";

export function StaticBorderPill({
  children,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { children: ReactNode }) {
  return (
    <div className="relative inline-flex overflow-visible rounded-full p-px ring-1 ring-chart-1/35">
      <button
        className={cn(pillSurfaceClassName, className)}
        type={type}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
