"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs";
import { V0Icon } from "@/components/icons/v0";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  studioChartDocsHref,
  studioOpenInV0Href,
} from "@/lib/studio/chart-links";
import { generateStudioCode } from "@/lib/studio/codegen";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";

const DocsCodeBlock = dynamic(
  () =>
    import("@/components/docs/docs-code-block").then(
      (mod) => mod.DocsCodeBlock
    ),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-lg border bg-muted/30 p-4 font-mono text-muted-foreground text-xs">
        Loading…
      </div>
    ),
  }
);

export function StudioCodeSheet({ state }: { state: StudioUrlState }) {
  const [open, setOpen] = useState(false);
  const generated = useMemo(
    () => generateStudioCode(state.chart, state),
    [state]
  );
  const { code, data, title } = generated;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="h-10 px-4 text-sm" type="button" variant="outline">
          Get code
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-col gap-3 pr-8">
            <div>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                Install, then copy the snippet — props match your committed
                studio settings.
              </SheetDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                className="h-8 text-xs"
                size="sm"
                variant="outline"
              >
                <Link href={studioChartDocsHref(state.chart)}>
                  Documentation
                </Link>
              </Button>
              <Button
                asChild
                className="h-8 gap-1 text-xs"
                size="sm"
                // variant="secondary"
              >
                <a
                  aria-label="Open in v0"
                  href={studioOpenInV0Href(state.chart)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open in <V0Icon className="h-2.5" />
                </a>
              </Button>
            </div>
          </div>
        </SheetHeader>
        {open ? (
          <div className="space-y-6 px-6 pb-6">
            <section className="space-y-2">
              <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Install
              </h3>
              <PackageManagerTabs name={state.chart} />
            </section>
            <section className="space-y-2">
              <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Usage
              </h3>
              <DocsCodeBlock code={code} lang="tsx" />
            </section>
            {data ? (
              <section className="space-y-2">
                <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Data
                </h3>
                <DocsCodeBlock code={data} lang="tsx" />
              </section>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
