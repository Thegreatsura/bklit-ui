import type { ComponentType } from "react";
import { OpenPanel } from "./openpanel";
import { Prisma } from "./prisma";
import { Vercel } from "./vercel";

interface BrandLogoProps {
  className?: string;
}

export interface UsedByLogo {
  id: string;
  name: string;
  href: string;
  Logo: ComponentType<BrandLogoProps>;
}

function trustedByHref(origin: string, brand: string) {
  const url = new URL(origin);
  url.searchParams.set("utm_source", "bklit");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "homepage");
  url.searchParams.set("utm_content", "trusted-by");
  url.searchParams.set("utm_term", brand);
  return url.toString();
}

/** Add new entries here as brand SVGs land in `components/brands/`. */
export const usedByLogos: UsedByLogo[] = [
  {
    id: "vercel",
    name: "Vercel",
    href: trustedByHref("https://vercel.com", "vercel"),
    Logo: Vercel,
  },
  {
    id: "prisma",
    name: "Prisma",
    href: trustedByHref("https://www.prisma.io", "prisma"),
    Logo: Prisma,
  },
  {
    id: "openpanel",
    name: "OpenPanel",
    href: trustedByHref("https://openpanel.dev", "openpanel"),
    Logo: OpenPanel,
  },
];

export const usedByLogoClassName =
  "h-auto w-[72px] max-w-full text-muted-foreground transition-colors duration-[180ms] ease-[cubic-bezier(0.33,1,0.68,1)] sm:w-[96px] md:w-[110px] lg:w-[126px] group-hover:text-foreground";
