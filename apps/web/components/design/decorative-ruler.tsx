import { cn } from "@/lib/utils";

const TICK_INTERVAL = 20;
const LABEL_INTERVAL = 100;

function RulerTicks({
  length,
  side,
}: {
  length: number;
  side: "left" | "right";
}) {
  const ticks = Math.ceil(length / TICK_INTERVAL) + 1;
  const isLeft = side === "left";

  return (
    <>
      {Array.from({ length: ticks }, (_, index) => {
        const position = index * TICK_INTERVAL;
        const isMajor = position % LABEL_INTERVAL === 0;
        const tickSize = isMajor ? 10 : 6;

        return (
          <div key={position}>
            <div
              className={cn(
                "absolute bg-foreground/25 opacity-60",
                isMajor && "bg-foreground/40"
              )}
              style={
                isLeft
                  ? {
                      top: position,
                      right: 0,
                      width: tickSize,
                      height: 1,
                    }
                  : {
                      top: position,
                      left: 0,
                      width: tickSize,
                      height: 1,
                    }
              }
            />
            {isMajor ? (
              <span
                className="absolute font-mono text-[9px] text-foreground/45 tabular-nums opacity-60"
                style={
                  isLeft
                    ? {
                        top: position + 4,
                        left: 8,
                        writingMode: "vertical-lr",
                      }
                    : {
                        top: position + 4,
                        right: 8,
                        writingMode: "vertical-rl",
                      }
                }
              >
                {position}
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export function DecorativeRuler({
  side,
  length,
  className,
}: {
  side: "left" | "right";
  length: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none relative row-start-1 w-8 self-stretch overflow-hidden bg-muted/30",
        side === "left"
          ? "col-start-1 border-border border-r"
          : "col-start-3 border-border border-l",
        className
      )}
    >
      {length > 0 ? <RulerTicks length={length} side={side} /> : null}
    </div>
  );
}
