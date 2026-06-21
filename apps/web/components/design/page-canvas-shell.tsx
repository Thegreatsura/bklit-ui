"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { DecorativeRuler } from "@/components/design/decorative-ruler";
import { DotGridBackground } from "@/components/design/dot-grid-background";
import { cn } from "@/lib/utils";

const canvasFadeClass =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_82%,transparent_100%)]";

export function PageCanvasShell({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      setHeight(element.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-[32px_minmax(0,1fr)_32px]">
      <DecorativeRuler
        className={cn(canvasFadeClass, "hidden md:block")}
        length={height}
        side="left"
      />
      <div
        className="relative min-w-0 md:col-start-2 md:row-start-1"
        ref={contentRef}
      >
        <DotGridBackground className={canvasFadeClass} />
        <div className="relative z-1">{children}</div>
      </div>
      <DecorativeRuler
        className={cn(canvasFadeClass, "hidden md:block")}
        length={height}
        side="right"
      />
    </div>
  );
}
