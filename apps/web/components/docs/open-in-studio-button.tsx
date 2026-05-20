import Link from "next/link";
import type { ChartSlug } from "@/components/charts/chart-slugs";
import { Button } from "@/components/ui/button";
import { studioChartHref } from "@/lib/studio/chart-links";

export function OpenInStudioButton({ slug }: { slug: ChartSlug }) {
  return (
    <Button
      asChild
      className="h-8 gap-1 rounded-[6px] bg-black px-3 text-white text-xs hover:bg-black hover:text-white dark:bg-white dark:text-black"
    >
      <Link href={studioChartHref(slug)}>Open in Studio</Link>
    </Button>
  );
}
