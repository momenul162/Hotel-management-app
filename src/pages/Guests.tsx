import { useEffect, useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Guest } from "../types";
import { GuestCard } from "../components/GuestCard";
import { AddEditGuestDialog } from "../components/guests/AddGuestDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { deleteGuest, fetchAllGuests } from "../redux/service/guestService";
import { debounce } from "lodash";
import { GuestCartSkeleton } from "../components/ui/skeleton/guest-card-skeleton";

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vipOnly, setVipOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "visits">("name");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { guests, guestLoading } = useSelector((state: RootState) => state.guests);

  // Fetch guests on component mount
  useEffect(() => {
    dispatch(fetchAllGuests());
  }, [dispatch]);

  // Debounced search term update
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // Memoized filtered and sorted guests
  const filteredGuests = useMemo(() => {
    return guests
      .filter((guest) => {
        const matchesSearch =
          guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVip = vipOnly ? guest.vip : true;

        return matchesSearch && matchesVip;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else {
          return b.visits - a.visits;
        }
      });
  }, [guests, searchTerm, vipOnly, sortBy]);

  const handleViewDetails = useCallback(
    (id: string) => {
      const guest = guests.find((g) => g._id === id);
      if (guest) {
        setSelectedGuest(guest);
        setViewDetailsOpen(true);
      }
    },
    [guests]
  );

  const handleRemove = useCallback((_id: string) => {
    setConfirmRemoveOpen(true);
  }, []);

  const confirmRemove = useCallback(() => {
    if (selectedGuest) {
      dispatch(deleteGuest(selectedGuest._id));
      setViewDetailsOpen(false);
      setConfirmRemoveOpen(false);
    }
  }, [dispatch, selectedGuest]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Guests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage guest information and profiles
            </p>
          </div>
          <AddEditGuestDialog />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search guests by name or email..."
              className="pl-8 w-full"
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={vipOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setVipOnly(!vipOnly)}
              className="text-xs h-9"
            >
              VIP Only
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Advanced Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as "name" | "visits")}
                >
                  <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="visits">Most Visits</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="h-9 px-2">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>

        {guestLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <GuestCartSkeleton key={index} />
            ))}
          </div>
        )}

        {!guestLoading && filteredGuests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGuests.map((guest) => (
              <GuestCard key={guest._id} guest={guest} onViewDetails={handleViewDetails} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No guests found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                We couldn't find any guests that match your search criteria. Try adjusting your
                filters or add a new guest.
              </p>
              <AddEditGuestDialog />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Guest Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Guest Details</DialogTitle>
            <DialogDescription>Detailed information about the guest</DialogDescription>
          </DialogHeader>

          {selectedGuest && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={selectedGuest.avatar} alt={selectedGuest.name} />
                  <AvatarFallback className="text-lg">
                    {selectedGuest.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{selectedGuest.name}</h2>
                    {selectedGuest.vip && <Badge>VIP</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedGuest.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedGuest.phone}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="outline">{selectedGuest.nationality}</Badge>
                    <Badge variant="secondary">{selectedGuest.visits} visits</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">ID/Passport</Label>
                  <p>{selectedGuest.passportOrNID}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Status</Label>
                  <p>{selectedGuest.vip ? "VIP Guest" : "Regular Guest"}</p>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                {selectedGuest.activities && selectedGuest.activities.length > 0 ? (
                  <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                ) : (
                  <h3 className="text-sm font-medium mb-2">No Recent Activity</h3>
                )}

                <div className="space-y-2">
                  {selectedGuest.activities &&
                    selectedGuest.activities.map((activity) => (
                      <p key={activity._id} className="text-xs text-muted-foreground">
                        Last check-in: {new Date(activity.checkedIn).toLocaleDateString()} - Last
                        check-out: {new Date(activity.checkedOut).toLocaleDateString()}
                      </p>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant={"outline"}
                  className="bg-red-300 text-red-600 hover:bg-red-200"
                  onClick={() => handleRemove(selectedGuest._id)}
                >
                  Remove Guest
                </Button>
                <AddEditGuestDialog guest={selectedGuest} setViewDetailsOpen={setViewDetailsOpen} />
                <Button variant={"outline"}>Book New Stay</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Removal Dialog */}
      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this guest? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmRemoveOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
