import { Card, CardContent, CardFooter } from "../card";
import { Skeleton } from "../skeleton";

export function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-3 flex justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}
