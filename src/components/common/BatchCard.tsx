import { Calendar, Hash, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Batch {
  id: string;
  name: string;
  createdAt: string;
  totalCount: number;
  imageCount: number;
  status: "active" | "completed" | "pending";
}

interface BatchCardProps {
  batch: Batch;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BatchCard = ({ batch, onClick, className, style }: BatchCardProps) => {
  const statusStyles = {
    active: "bg-green-100 text-green-700",
    completed: "bg-primary/10 text-primary",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "w-full bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-all text-left group animate-slide-up",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full",
                statusStyles[batch.status]
              )}
            >
              {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
            {batch.name}
          </h3>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(batch.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="h-4 w-4" />
              {batch.imageCount} scans
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gradient">{batch.totalCount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Count</p>
        </div>
      </div>
      <div className="flex items-center justify-end mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium">View Details</span>
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
