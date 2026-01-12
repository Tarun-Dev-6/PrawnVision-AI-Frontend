import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  variant = "default",
  className,
}: StatCardProps) => {
  const variants = {
    default: "bg-card",
    primary: "ocean-gradient text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    primary: "bg-white/20 text-white",
    accent: "bg-white/20 text-white",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-card transition-all hover:shadow-elevated animate-scale-in",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "rounded-xl p-2.5",
            iconVariants[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              variant === "default"
                ? trend.isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                : "bg-white/20"
            )}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p
          className={cn(
            "text-2xl font-bold",
            variant === "default" ? "text-foreground" : ""
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "text-sm mt-1",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
};
