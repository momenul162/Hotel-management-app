import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { BedDouble, Calendar, Search, User, Users } from "lucide-react";
import { Guest, Room, Booking } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
// import { fetchAllBookings } from "../redux/service/bookingService";
// import { fetchAllRooms } from "../redux/service/roomService";
// import { fetchAllGuests } from "../redux/service/guestService";

type SearchResult = {
  type: "guest" | "room" | "booking";
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  avatarUrl?: string;
  route: string;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const { rooms } = useSelector((state: RootState) => state.rooms);
  const { guests } = useSelector((state: RootState) => state.guests);
  const { bookings } = useSelector((state: RootState) => state.booking);

  // useEffect(() => {
  //   dispatch(fetchAllBookings());
  //   dispatch(fetchAllRooms());
  //   dispatch(fetchAllGuests());
  // }, [dispatch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search guests
    const filteredGuests = guests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(lowerSearchTerm) ||
        guest.email.toLowerCase().includes(lowerSearchTerm)
    );

    filteredGuests.forEach((guest: Guest) => {
      searchResults.push({
        type: "guest",
        id: guest._id,
        title: guest.name,
        subtitle: guest.email,
        icon: <User className="h-4 w-4 text-primary" />,
        avatarUrl: guest.avatar,
        route: `/guests/edit/${guest._id}`,
      });
    });

    // Search rooms
    const filteredRooms = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(lowerSearchTerm) ||
        room.type.toLowerCase().includes(lowerSearchTerm)
    );

    filteredRooms.forEach((room: Room) => {
      searchResults.push({
        type: "room",
        id: room._id,
        title: `Room ${room.number}`,
        subtitle: `${room.type} - ${room.status}`,
        icon: <BedDouble className="h-4 w-4 text-primary" />,
        route: `/rooms`,
      });
    });

    // Search bookings
    const filteredBookings = bookings.filter(
      (booking) =>
        booking._id.includes(lowerSearchTerm) ||
        booking.guestId.name.toLowerCase().includes(lowerSearchTerm)
    );

    filteredBookings.forEach((booking: Booking) => {
      searchResults.push({
        type: "booking",
        id: booking._id,
        title: `Booking #${booking._id}`,
        subtitle: `${booking.guestId.name} - ${booking.roomId.number}`,
        icon: <Calendar className="h-4 w-4 text-primary" />,
        route: `/reservations`,
      });
    });

    setResults(searchResults.slice(0, 8)); // Limit to 8 results
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.route);
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search for guests, rooms, or bookings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <Button
                  key={`${result.type}-${result.id}-${index}`}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-3">
                    {result.type === "guest" && result.avatarUrl ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatarUrl} alt={result.title} />
                        <AvatarFallback>
                          {result.title
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                        {result.icon}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </div>
                </Button>
              ))}
              <div className="pt-2 text-center text-xs text-muted-foreground">
                {results.length === 8 ? (
                  <p>Showing top 8 results. Refine your search for more specific results.</p>
                ) : (
                  <p>Found {results.length} results.</p>
                )}
              </div>
            </div>
          ) : searchTerm ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't find anything matching "{searchTerm}". Try something else.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Start searching</h3>
              <p className="text-sm text-muted-foreground">Search for guests, rooms, or bookings</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("Suite")}>
                  <BedDouble className="mr-2 h-3.5 w-3.5" />
                  Suites
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("Johnson")}>
                  <User className="mr-2 h-3.5 w-3.5" />
                  Johnson
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("VIP")}>
                  <Users className="mr-2 h-3.5 w-3.5" />
                  VIP Guests
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
