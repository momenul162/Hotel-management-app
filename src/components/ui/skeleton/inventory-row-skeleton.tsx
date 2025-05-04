import { TableRow, TableCell } from "../table";
import { Skeleton } from "../skeleton";

export function InventoryRowSkeleton() {
  return (
    <TableRow>
      {/* Item Name Skeleton */}
      <TableCell>
        <Skeleton className="h-4 w-3/4" />
      </TableCell>

      {/* Category Skeleton */}
      <TableCell>
        <Skeleton className="h-4 w-1/2" />
      </TableCell>

      {/* Quantity Skeleton */}
      <TableCell>
        <Skeleton className="h-4 w-1/4 mx-auto" />
      </TableCell>

      {/* Supplier Skeleton */}
      <TableCell>
        <Skeleton className="h-4 w-3/4" />
      </TableCell>

      {/* Last Restocked Skeleton */}
      <TableCell>
        <Skeleton className="h-4 w-1/2" />
      </TableCell>

      {/* Actions Skeleton */}
      <TableCell>
        <div className="flex gap-2 justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </TableCell>
    </TableRow>
  );
}
