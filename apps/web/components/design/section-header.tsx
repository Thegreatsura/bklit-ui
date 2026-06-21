import { cn } from "@/lib/utils";

export function DesignSectionHeader({
  title,
  subtitle,
  className,
  titleId,
}: {
  title: string;
  subtitle: string;
  className?: string;
  titleId?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 pt-4 pb-8 sm:pb-12",
        className
      )}
    >
      <h2
        className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
        id={titleId}
      >
        {title}
      </h2>
      <p className="font-mono text-base text-muted-foreground sm:text-lg md:text-xl lg:text-2xl">
        {subtitle}
      </p>
    </div>
  );
}
