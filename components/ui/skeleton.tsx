import { cn } from "@/lib/utils";
import { getSkeletonColors } from "@/lib/theme/colors";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "light" | "dark";
}

const Skeleton = ({
  className,
  width = "w-full",
  height = "h-4",
  rounded = "md",
  variant = "default",
}: SkeletonProps) => {
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const skeletonColors = getSkeletonColors();
  const colorClass = 
    variant === "light" ? skeletonColors.light :
    variant === "dark" ? skeletonColors.dark :
    skeletonColors.base;

  return (
    <div
      className={cn(
        colorClass,
        width,
        height,
        roundedClasses[rounded],
        className
      )}
    />
  );
};

export default Skeleton;
