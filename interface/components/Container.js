import { cn } from "@/lib/utils";

function Container({ children, className }) {
  return (
    <div
      className={cn(
        `flex-1 flex flex-col items-center py-12 md:px-32 gap-8`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
