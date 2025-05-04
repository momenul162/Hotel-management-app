import { Card, CardContent } from "../card";
import { Skeleton } from "../skeleton";

export function StaffCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          {/* Avatar Skeleton */}
          <Skeleton className="h-12 w-12 rounded-full mr-4" />

          <div className="flex-1">
            {/* Name and Role Skeleton */}
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3 mb-4" />

            {/* Badge Skeleton */}
            <Skeleton className="h-4 w-20 mb-3" />

            {/* Email and Phone Skeleton */}
            <Skeleton className="h-3 w-2/3 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Department Skeleton */}
        <div className="bg-muted/40 px-4 py-2">
          <Skeleton className="h-3 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}
