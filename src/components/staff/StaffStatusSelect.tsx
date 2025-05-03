import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CheckSquare, Filter } from "lucide-react";

type StaffStatus = "active" | "on-leave" | "inactive";

interface StaffStatusSelectProps {
  onStatusChange: (statuses: StaffStatus[]) => void;
}

export function StaffStatusSelect({ onStatusChange }: StaffStatusSelectProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<StaffStatus[]>([
    "active",
    "on-leave",
    "inactive",
  ]);

  const allStatuses: { value: StaffStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "on-leave", label: "On Leave" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleStatusChange = (status: StaffStatus) => {
    let newStatuses: StaffStatus[];

    if (selectedStatuses.includes(status)) {
      // If every status is selected and we're unchecking one, just remove it
      if (selectedStatuses.length === allStatuses.length) {
        newStatuses = selectedStatuses.filter((s) => s !== status);
      }
      // If only one is selected and we're unchecking it, select all
      else if (selectedStatuses.length === 1 && selectedStatuses[0] === status) {
        newStatuses = allStatuses.map((s) => s.value);
      }
      // Otherwise, just remove the status
      else {
        newStatuses = selectedStatuses.filter((s) => s !== status);
      }
    } else {
      // Add the status
      newStatuses = [...selectedStatuses, status];
    }

    setSelectedStatuses(newStatuses);
    onStatusChange(newStatuses);
  };

  const getLabel = () => {
    if (selectedStatuses.length === allStatuses.length) {
      return "All Statuses";
    } else if (selectedStatuses.length === 0) {
      return "No Status Selected";
    } else if (selectedStatuses.length === 1) {
      return allStatuses.find((s) => s.value === selectedStatuses[0])?.label || "Status";
    } else {
      return `${selectedStatuses.length} Statuses`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>{getLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.value}
            checked={selectedStatuses.includes(status.value)}
            onCheckedChange={() => handleStatusChange(status.value)}
          >
            <div className="flex items-center gap-2">
              {selectedStatuses.includes(status.value) && <CheckSquare className="h-4 w-4" />}
              <span>{status.label}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
