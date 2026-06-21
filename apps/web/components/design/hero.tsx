import { DesignHeroCanvas } from "@/components/design/design-hero-canvas";
import { HomeShowcaseSection } from "@/components/design/home-showcase-section";
import { HomeSponsorsSection } from "@/components/design/home-sponsors-section";
import { HomeTestimonialsSection } from "@/components/design/home-testimonials-section";
import { LineGrid } from "@/components/design/line-grid";
import { PageCanvasShell } from "@/components/design/page-canvas-shell";
import { UsedBySection } from "@/components/design/used-by-section";

export const DesignHero = () => {
  return (
    <>
      <PageCanvasShell>
        <div className="container mx-auto w-full overflow-visible pt-8 md:pt-16">
          <LineGrid
            className="min-h-[400px] [--grid-cell-height:calc(100%/1)] [--grid-cell-width:calc(100%/1)] md:aspect-6/3 md:min-h-0 md:[--grid-cell-height:calc(100%/3)] md:[--grid-cell-width:calc(100%/6)]"
            columns={1}
            columnsMd={6}
            rows={1}
            rowsMd={3}
            variant="solid"
          >
            <DesignHeroCanvas />
          </LineGrid>
        </div>
      </PageCanvasShell>
      <UsedBySection />
      <HomeShowcaseSection />
      <HomeTestimonialsSection />
      <HomeSponsorsSection />
    </>
  );
};
