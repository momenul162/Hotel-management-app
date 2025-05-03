import { Card, CardContent } from "../card";
import { Skeleton } from "../skeleton";

export function DashboardStatSkeleton() {
  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
