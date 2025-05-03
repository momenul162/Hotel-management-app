import React from "react";
import { Skeleton } from "../skeleton";
import { Card, CardContent, CardFooter } from "../card";

export const GuestCartSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden transition-all duration-300">
      <CardContent className="p-5 flex flex-col items-center text-center">
        {/* Avatar Skeleton */}
        <Skeleton className="h-20 w-20 rounded-full mb-3" />

        {/* Name and Nationality Skeleton */}
        <div className="space-y-1 mb-3">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-3 w-1/2 mx-auto" />
        </div>

        {/* VIP Badge Skeleton */}
        <Skeleton className="h-6 w-24 mx-auto mb-3" />

        {/* Email and Phone Skeleton */}
        <div className="w-full space-y-2 mt-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>

        {/* Visits Skeleton */}
        <div className="mt-4">
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </div>
      </CardContent>

      <CardFooter className="border-t p-3 flex justify-center">
        {/* Button Skeleton */}
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
};
