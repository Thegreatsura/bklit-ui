"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export function StudioExportSvgButton({
  disabled,
  onExport,
}: {
  disabled?: boolean;
  onExport: () => void;
}) {
  return (
    <Button
      aria-label="Export SVG"
      className="size-10"
      disabled={disabled}
      onClick={onExport}
      size="icon"
      title="Export SVG"
      type="button"
      variant="outline"
    >
      <HugeiconsIcon icon={Download01Icon} size={20} strokeWidth={1.5} />
    </Button>
  );
}
