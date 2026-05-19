import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/docs/site-header";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Interactive chart studio — explore every Bklit chart and tune props in real time.",
};

const studioNavLinks = [
  { text: "Introduction", url: "/docs" },
  { text: "Installation", url: "/docs/installation" },
  { text: "Components", url: "/docs/components" },
  { text: "Theming", url: "/docs/theming" },
  { text: "Charts", url: "/charts" },
  { text: "Studio", url: "/studio" },
];

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader
        discordUrl="https://discord.com/invite/9yyK8FwPcU"
        githubUrl="https://github.com/bklit/bklit-ui"
        links={studioNavLinks}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-14">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
    </div>
  );
}
