"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { CopyButton } from "@/components/copy-button";
import { codeThemes } from "@/lib/code-theme";
import { cn } from "@/lib/utils";

/**
 * Syntax-highlighted code block styled like docs Usage MDX fences and chart gallery sheets.
 */
export function DocsCodeBlock({
  code,
  lang = "tsx",
  className,
  showCopy = true,
}: {
  code: string;
  lang?: string;
  className?: string;
  showCopy?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden [&_figure]:my-0! [&_pre]:my-0!",
        className
      )}
    >
      <DynamicCodeBlock
        code={code}
        codeblock={{ allowCopy: false, className: "my-0" }}
        lang={lang}
        options={{ themes: codeThemes }}
      />
      {showCopy ? (
        <CopyButton className="absolute top-2 right-2 z-10" text={code} />
      ) : null}
    </div>
  );
}
