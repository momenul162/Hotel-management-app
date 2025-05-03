import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { RoomStatus } from "../types";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { BedDouble, Filter, Search } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { RoomCard } from "../components/RoomCard";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../redux/service/roomService";
import { AddRoomDialog } from "../components/rooms/AddRoomDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { debounce } from "lodash";
import { RoomCardSkeleton } from "../components/ui/skeleton/room-card-skeleton";

export default function Rooms() {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, roomLoading } = useSelector((state: RootState) => state.rooms);

  const [filter, setFilter] = useState<RoomStatus | "all">(
    (searchParams.get("status") as RoomStatus | "all") || "all"
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [roomType, setRoomType] = useState(searchParams.get("type") || "all");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "number-asc");

  // Fetch rooms on component mount
  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  // Debounced search term update
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // Memoized filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesStatus = filter === "all" || room.status === filter;
      const matchesType = roomType === "all" || room.type.toLowerCase() === roomType.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [rooms, filter, roomType, searchTerm]);

  // Memoized sorted rooms
  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      switch (sortOrder) {
        case "number-asc":
          return a.number.localeCompare(b.number);
        case "number-desc":
          return b.number.localeCompare(a.number);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [filteredRooms, sortOrder]);

  // Update URL parameters based on filters
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter !== "all") params.status = filter;
    if (roomType !== "all") params.type = roomType;
    if (searchTerm) params.search = searchTerm;
    if (sortOrder !== "number-asc") params.sort = sortOrder;

    setSearchParams(params, { replace: true });
  }, [filter, roomType, searchTerm, sortOrder, setSearchParams]);

  // Handlers for filter buttons
  const handleFilterChange = useCallback((status: RoomStatus | "all") => {
    setFilter(status);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilter("all");
    setRoomType("all");
    setSearchTerm("");
    setSortOrder("number-asc");
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Rooms</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage room inventory and status</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <BedDouble className="h-4 w-4 mr-2" />
                Add New Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px]">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Enter the details for the new room. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <AddRoomDialog setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full md:w-64 shrink-0">
            <CardContent className="p-4">
              <div className="space-y-1.5 mb-4">
                <h3 className="font-semibold">Filter Rooms</h3>
                <p className="text-xs text-muted-foreground">Filter rooms by status</p>
              </div>

              <div className="space-y-2">
                <StatusButton active={filter === "all"} onClick={() => handleFilterChange("all")}>
                  All Rooms
                </StatusButton>
                <StatusButton
                  active={filter === "available"}
                  className="bg-green-50 border-green-100"
                  activeClass="bg-green-100 border-green-200"
                  onClick={() => handleFilterChange("available")}
                >
                  Available
                </StatusButton>
                <StatusButton
                  active={filter === "occupied"}
                  className="bg-blue-50 border-blue-100"
                  activeClass="bg-blue-100 border-blue-200"
                  onClick={() => handleFilterChange("occupied")}
                >
                  Occupied
                </StatusButton>
                <StatusButton
                  active={filter === "reserved"}
                  className="bg-amber-50 border-amber-100"
                  activeClass="bg-amber-100 border-amber-200"
                  onClick={() => handleFilterChange("reserved")}
                >
                  Reserved
                </StatusButton>
                <StatusButton
                  active={filter === "maintenance"}
                  className="bg-red-50 border-red-100"
                  activeClass="bg-red-100 border-red-200"
                  onClick={() => handleFilterChange("maintenance")}
                >
                  Maintenance
                </StatusButton>
              </div>

              <div className="border-t my-4 pt-4">
                <h3 className="font-semibold mb-2">Advanced Filters</h3>

                <div>
                  <label className="text-sm font-medium mb-1 block">Room Type</label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-3 gap-2"
                  onClick={handleResetFilters}
                >
                  <Filter className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by room number or type..."
                  className="pl-8 w-full"
                  onChange={handleSearchChange}
                />
              </div>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number-asc">Number (Ascending)</SelectItem>
                  <SelectItem value="number-desc">Number (Descending)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomLoading &&
                Array.from({ length: sortedRooms.length }, (_, index) => (
                  <RoomCardSkeleton key={index} />
                ))}

              {!roomLoading && sortedRooms.length > 0 ? (
                sortedRooms.map((room) => <RoomCard key={room._id} room={room} />)
              ) : (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                  No rooms match your filters. Try adjusting your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatusButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  activeClass?: string;
}

function StatusButton({ active, onClick, children, className, activeClass }: StatusButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border transition-colors ${
        active ? activeClass || "bg-accent" : className || "bg-background hover:bg-muted/50"
      }`}
    >
      <span>{children}</span>
    </button>
  );
}
