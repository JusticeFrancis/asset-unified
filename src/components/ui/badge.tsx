import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-2 py-px text-[10px] font-normal leading-none",
  {
    variants: {
      variant: {
        default: "bg-[#d0e6f1] text-[#6fb2d3]",
        neutral: "bg-[#f5f7f8] text-[#787878]",
        positive: "bg-[#cff7d3] text-[#009951]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
