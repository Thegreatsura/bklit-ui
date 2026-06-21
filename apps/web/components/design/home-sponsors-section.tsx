import {
  BecomeSponsorButton,
  HomeSponsorsGrid,
} from "@/components/design/home-sponsors-grid";
import { SectionDotGridShell } from "@/components/design/section-dot-grid-shell";
import { DesignSectionHeader } from "@/components/design/section-header";

export function HomeSponsorsSection() {
  return (
    <section
      aria-labelledby="sponsors-heading"
      className="relative w-full pt-12 md:pt-24"
    >
      <SectionDotGridShell>
        <div className="container mx-auto w-full overflow-visible">
          <DesignSectionHeader
            className="pb-6"
            subtitle="Thank you for believing in what we're building"
            title="Our sponsors"
            titleId="sponsors-heading"
          />
          <div className="mb-12 flex justify-start">
            <BecomeSponsorButton />
          </div>
          <HomeSponsorsGrid />
        </div>
      </SectionDotGridShell>
    </section>
  );
}
