import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-cyan-200/80 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800",
        className,
      )}
      {...props}
    />
  );
}
