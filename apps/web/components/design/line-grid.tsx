import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const gridDotSize = "10px";

function gridAxisFraction(
  index: number,
  count: number,
  weights?: number[]
): number {
  const segments =
    weights?.length === count
      ? weights
      : Array.from({ length: count }, () => 1);
  const total = segments.reduce((sum, weight) => sum + weight, 0);
  const leading = segments
    .slice(0, index)
    .reduce((sum, weight) => sum + weight, 0);
  return leading / total;
}

function gridAxisPosition(
  index: number,
  count: number,
  weights?: number[]
): string {
  const fraction = gridAxisFraction(index, count, weights);
  return `calc(${gridDotSize} / 2 + ${fraction} * (100% - ${gridDotSize}))`;
}

function lineGridVars(
  columns: number,
  rows: number,
  options?: { responsiveLayout?: boolean }
): CSSProperties {
  const base = {
    "--columns": columns,
    "--rows": rows,
    "--grid-dot-size": gridDotSize,
  };

  if (options?.responsiveLayout) {
    return base as CSSProperties;
  }

  return {
    ...base,
    "--grid-cell-width": `calc(100% / ${columns})`,
    "--grid-cell-height": `calc(100% / ${rows})`,
    aspectRatio: `${columns} / ${rows}`,
  } as CSSProperties;
}

function GridLinesOverlay({
  columns,
  rows,
  className,
}: {
  columns: number;
  rows: number;
  className?: string;
}) {
  const cells = Array.from({ length: columns * rows }, (_, index) => index);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-2 grid", className)}
      data-grid-lines
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((index) => {
        const isFirstRow = index < columns;
        const isFirstColumn = index % columns === 0;

        return (
          <div
            className={cn(
              "border-border border-r border-b",
              isFirstRow && "border-t",
              isFirstColumn && "border-l"
            )}
            key={index}
          />
        );
      })}
    </div>
  );
}

export const lineGridClass = (
  options: {
    columns: number;
    rows: number;
    variant: "solid" | "ghost";
  },
  className?: string
) =>
  cn(
    "relative overflow-visible [&>:not([data-grid-dots]):not([data-grid-fill]):not([data-grid-lines]):not([data-grid-surface])]:relative [&>:not([data-grid-dots]):not([data-grid-lines]):not([data-grid-surface])]:z-1 [&>[data-grid-fill]]:relative [&>[data-grid-fill]]:z-10",
    options.variant === "ghost" && "bg-transparent",
    options.columns === 6 && options.rows === 3 && "w-full",
    className
  );

export function GridCornerDots({
  columns,
  rows,
  columnWeights,
  rowWeights,
  className,
}: {
  columns: number;
  rows: number;
  columnWeights?: number[];
  rowWeights?: number[];
  /** Use z-1 when dots sit on a composite grid wrapper above panel backgrounds. */
  className?: string;
}) {
  const dots = Array.from(
    { length: (rows + 1) * (columns + 1) },
    (_, index) => ({
      col: index % (columns + 1),
      row: Math.floor(index / (columns + 1)),
      key: index,
    })
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute z-0", className)}
      data-grid-dots
      style={{ inset: `calc(-1 * ${gridDotSize} / 2)` }}
    >
      {dots.map(({ col, row, key }) => (
        <span
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-white dark:bg-background"
          key={key}
          style={{
            left: gridAxisPosition(col, columns, columnWeights),
            top: gridAxisPosition(row, rows, rowWeights),
          }}
        />
      ))}
    </div>
  );
}

export function LineGrid({
  columns,
  rows,
  columnsMd,
  rowsMd,
  variant,
  className,
  children,
}: {
  columns: number;
  rows: number;
  /** Column count from the `md` breakpoint up. Defaults to `columns`. */
  columnsMd?: number;
  /** Row count from the `md` breakpoint up. Defaults to `rows`. */
  rowsMd?: number;
  variant: "solid" | "ghost";
  className?: string;
  children?: ReactNode;
}) {
  const desktopColumns = columnsMd ?? columns;
  const desktopRows = rowsMd ?? rows;
  const isResponsive = desktopColumns !== columns || desktopRows !== rows;

  return (
    <div
      className={lineGridClass(
        { columns: desktopColumns, rows: desktopRows, variant },
        cn(isResponsive && "w-full", className)
      )}
      style={lineGridVars(columns, rows, { responsiveLayout: isResponsive })}
    >
      {variant === "solid" ? (
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-white dark:bg-background"
          data-grid-surface
        />
      ) : null}
      {isResponsive ? (
        <>
          <GridCornerDots
            className="z-3 md:hidden"
            columns={columns}
            rows={rows}
          />
          <GridCornerDots
            className="z-3 hidden md:block"
            columns={desktopColumns}
            rows={desktopRows}
          />
        </>
      ) : (
        <GridCornerDots className="z-3" columns={columns} rows={rows} />
      )}
      {children}
      {isResponsive ? (
        <>
          <GridLinesOverlay
            className="md:hidden"
            columns={columns}
            rows={rows}
          />
          <GridLinesOverlay
            className="hidden md:grid"
            columns={desktopColumns}
            rows={desktopRows}
          />
        </>
      ) : (
        <GridLinesOverlay columns={columns} rows={rows} />
      )}
    </div>
  );
}
