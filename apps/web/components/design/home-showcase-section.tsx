import { HomeShowcaseGrid } from "@/components/design/home-showcase-grid";
import { SectionDotGridShell } from "@/components/design/section-dot-grid-shell";

export function HomeShowcaseSection() {
  return (
    <section className="relative w-full">
      <SectionDotGridShell>
        <div className="container mx-auto w-full overflow-visible">
          <HomeShowcaseGrid />
        </div>
      </SectionDotGridShell>
    </section>
  );
}
