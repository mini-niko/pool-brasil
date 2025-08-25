import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-pool-dark/20 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
