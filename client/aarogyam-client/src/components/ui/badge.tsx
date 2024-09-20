import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

// Define a utility function for creating badge variants using `cva`
const badgeVariants = cva(
  "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold",
  {
    variants: {
      variant: {
        solid: "text-white bg-red-500", // Solid style for a red badge
        subtle: "text-red-500 bg-red-100", // Subtle style
      },
      size: {
        small: "text-xs", // Small size
        medium: "text-sm", // Medium size
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "small",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {props.children}
    </div>
  );
}
