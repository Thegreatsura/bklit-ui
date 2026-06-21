import {
  usedByLogoClassName,
  usedByLogos,
} from "@/components/brands/used-by-logos";
import { cn } from "@/lib/utils";

export function UsedBySection({ className }: { className?: string }) {
  return (
    <section
      aria-label="Trusted by people at"
      className={cn(
        "container mx-auto px-4 py-10 text-left sm:py-16",
        className
      )}
    >
      <p className="mb-6 font-mono text-muted-foreground text-xs uppercase tracking-widest sm:mb-10">
        Trusted by people at
      </p>
      <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-12 sm:gap-y-8 md:gap-x-16 md:gap-y-10">
        {usedByLogos.map(({ id, name, href, Logo }) => (
          <li
            className="flex items-center justify-center sm:justify-start"
            key={id}
          >
            <a
              className="group flex items-center"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-label={name} className="flex" role="img">
                <Logo className={usedByLogoClassName} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
