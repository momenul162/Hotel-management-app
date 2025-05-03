import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { format } from "date-fns";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, Check, CreditCard, User } from "lucide-react";
import { fetchGuestById } from "../../utils/api";
import { Guest, Room } from "../../types";
import { fetchRooms } from "../../utils/api";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function BookStay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [isBooking, setIsBooking] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // Load guest
        const guestData = await fetchGuestById(id);
        setGuest(guestData);

        // Load available rooms
        const rooms: [Room] = await fetchRooms();
        setAvailableRooms(rooms.filter((room) => room.status === "available"));
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load guest or room data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const room = availableRooms.find((r) => r.id === selectedRoom);
      if (room) {
        // Calculate number of nights
        const nights = Math.max(
          1,
          Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        );
        setTotalPrice(room.price * nights);
      }
    }
  }, [selectedRoom, checkInDate, checkOutDate, availableRooms]);

  const handleBook = async () => {
    if (!guest || !selectedRoom || !checkInDate || !checkOutDate) {
      toast.error("Please fill in all required booking information");
      return;
    }

    try {
      setIsBooking(true);

      // In a real app, this would call an API to create a booking
      // Simulate a booking creation
      setTimeout(() => {
        toast.success("Booking successfully created!");
        navigate("/reservations");
      }, 1500);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin mb-4">⌛</div>
            <p>Loading booking information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!guest) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Guest not found</h2>
          <p className="text-muted-foreground mb-6">
            The guest you're trying to book for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/guests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guests
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">New Reservation</h1>
            <p className="text-sm text-muted-foreground mt-1">Book a new stay for guest</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/guests`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guests
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>Enter the details for the new reservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{guest.name}</h3>
                  <p className="text-sm text-muted-foreground">{guest.email}</p>
                </div>
                {guest.vip && <Badge className="ml-auto">VIP</Badge>}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomType">Select Room</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger id="roomType">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.number} - {room.type} (${room.price}/night)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No rooms available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          initialFocus
                          disabled={(date) =>
                            checkInDate
                              ? date <= checkInDate
                              : date <= new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adults">Number of Adults</Label>
                    <Input id="adults" type="number" min="1" max="4" defaultValue="1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="children">Number of Children</Label>
                    <Input id="children" type="number" min="0" max="4" defaultValue="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests</Label>
                  <Input id="requests" placeholder="Any special requests for this stay" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Reservation Summary</CardTitle>
              <CardDescription>Review and confirm booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedRoom ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guest:</span>
                      <span className="font-medium">{guest.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">
                        {availableRooms.find((r) => r.id === selectedRoom)?.number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Type:</span>
                      <span className="font-medium">
                        {availableRooms.find((r) => r.id === selectedRoom)?.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="font-medium">
                        {checkInDate ? format(checkInDate, "MMMM d, yyyy") : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="font-medium">
                        {checkOutDate ? format(checkOutDate, "MMMM d, yyyy") : "Not selected"}
                      </span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Price per Night:</span>
                      <span className="font-medium">
                        ${availableRooms.find((r) => r.id === selectedRoom)?.price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Number of Nights:</span>
                      <span className="font-medium">
                        {checkInDate && checkOutDate
                          ? Math.max(
                              1,
                              Math.ceil(
                                (checkOutDate.getTime() - checkInDate.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between font-semibold text-lg mt-4">
                      <span>Total Price:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center p-2 border rounded-md">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>Credit Card ending in 4242</span>
                      <Check className="h-4 w-4 ml-auto text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The guest will be charged upon check-in.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Select a room to view the booking summary</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                className="w-full"
                disabled={!selectedRoom || !checkInDate || !checkOutDate || isBooking}
                onClick={handleBook}
              >
                {isBooking ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span> Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/guests")}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
