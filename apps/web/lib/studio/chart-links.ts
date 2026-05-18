import type { ChartSlug } from "./types";

export const REGISTRY_ORIGIN = "https://ui.bklit.com";

export function registryJsonUrlForName(name: string) {
  return `${REGISTRY_ORIGIN}/r/${name}.json`;
}

export function studioRegistryJsonUrl(slug: ChartSlug) {
  return registryJsonUrlForName(slug);
}

export function studioChartDocsHref(slug: ChartSlug) {
  return `/docs/components/${slug}`;
}

/** @see https://ui.shadcn.com/docs/registry/open-in-v0 */
export function studioOpenInV0Href(slug: ChartSlug) {
  return `https://v0.dev/chat/api/open?url=${encodeURIComponent(studioRegistryJsonUrl(slug))}`;
}
