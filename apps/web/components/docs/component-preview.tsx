import type { ReactNode } from "react";
import { isChartSlug } from "@/components/charts/chart-slugs";
import { OpenInStudioButton } from "@/components/docs/open-in-studio-button";
import { OpenInV0Button } from "@/components/docs/open-in-v0-button";
import {
  registryJsonUrlForName,
  registryV0ExampleJsonUrl,
} from "@/lib/studio/chart-links";
import { cn } from "@/lib/utils";

/**
 * Primary docs preview with optional Open in v0 / Studio actions.
 * Kept as a Server Component so heavy chart MDX pages do not pull this into the client bundle.
 */
export function ComponentPreview({
  children,
  className,
  registryName,
}: {
  children: ReactNode;
  className?: string;
  /** Registry item name for Open in v0 / Studio actions on the primary preview. */
  registryName?: string;
}) {
  let registryJsonUrl: string | undefined;
  if (registryName) {
    registryJsonUrl = isChartSlug(registryName)
      ? registryV0ExampleJsonUrl(registryName)
      : registryJsonUrlForName(registryName);
  }
  const studioSlug =
    registryName && isChartSlug(registryName) ? registryName : undefined;

  return (
    <div className={cn("not-prose my-6", className)}>
      {registryJsonUrl ? (
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="m-0 font-semibold text-foreground text-lg tracking-tight">
            Preview
          </h2>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {studioSlug ? <OpenInStudioButton slug={studioSlug} /> : null}
            <OpenInV0Button registryJsonUrl={registryJsonUrl} />
          </div>
        </div>
      ) : null}
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
