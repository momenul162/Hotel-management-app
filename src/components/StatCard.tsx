import { cn } from "../lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { DashboardStat } from "../types";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const { title, value, description, change, icon } = stat;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]",
        "animate-in fade-in-delay slide-up",
        className
      )}
      style={{ "--index": "1" } as React.CSSProperties}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              <span className="text-muted-foreground text-sm">{description}</span>
            </div>

            <div className="flex items-center mt-2">
              {change > 0 ? (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-xs font-medium">{change}%</span>
                </>
              ) : change < 0 ? (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 text-xs font-medium">{Math.abs(change)}%</span>
                </>
              ) : (
                <span className="text-muted-foreground text-xs font-medium">No change</span>
              )}
              <span className="text-muted-foreground text-xs ml-1">vs last week</span>
            </div>
          </div>

          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
