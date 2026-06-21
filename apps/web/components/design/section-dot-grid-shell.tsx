import type { ReactNode } from "react";
import { DotGridBackground } from "@/components/design/dot-grid-background";
import { cn } from "@/lib/utils";

const sectionDotGridFadeClass =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%),linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] [mask-composite:intersect]";

export function SectionDotGridShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-visible", className)}>
      <DotGridBackground className={sectionDotGridFadeClass} />
      <div className="relative z-1 w-full overflow-visible">{children}</div>
    </div>
  );
}
