import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { RecentBookings } from "../components/dashboard/RecentBookings";
import { Button } from "../components/ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { RoomCard } from "../components/RoomCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect } from "react";
import { fetchAllRooms } from "../redux/service/roomService";
import { Link } from "react-router-dom";
import { Booking, Room } from "../types";
import { RoomState } from "../components/dashboard/RoomState";
import { RoomStateSkeleton } from "../components/ui/skeleton/room-state-skeleton";
import { RoomCardSkeleton } from "../components/ui/skeleton/room-card-skeleton";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, roomLoading } = useSelector((state: RootState) => state.rooms);
  const { bookings } = useSelector((state: RootState) => state.booking);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, []);

  // Get rooms with available status for the available rooms section
  const bookedRoomNumbers = bookings.map((b: Booking) => b.roomId.number);
  const availableRooms = rooms.filter(
    (room: Room) => !bookedRoomNumbers.includes(room.number) && room.status === "available"
  );

  return (
    // <AuthGuard>chCurrentUser()
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {currentUser?.name}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <DashboardStats className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roomLoading && <RoomStateSkeleton className="col-span-1 lg:col-span-2" />}
          {!roomLoading && <RoomState className="col-span-1 lg:col-span-2" />}

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start p-3 border rounded-lg">
                  <div className="text-center mr-3">
                    <div className="text-sm font-bold">09:30</div>
                    <div className="text-xs text-muted-foreground">AM</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Executive Meeting</div>
                    <div className="text-xs text-muted-foreground">Conference Room A</div>
                  </div>
                </div>

                <div className="flex items-start p-3 border rounded-lg">
                  <div className="text-center mr-3">
                    <div className="text-sm font-bold">11:00</div>
                    <div className="text-xs text-muted-foreground">AM</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Smith Family Check-in</div>
                    <div className="text-xs text-muted-foreground">VIP Suite 401</div>
                  </div>
                </div>

                <div className="flex items-start p-3 border rounded-lg">
                  <div className="text-center mr-3">
                    <div className="text-sm font-bold">02:15</div>
                    <div className="text-xs text-muted-foreground">PM</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Maintenance Check</div>
                    <div className="text-xs text-muted-foreground">Room 302</div>
                  </div>
                </div>

                <div className="flex items-start p-3 border rounded-lg">
                  <div className="text-center mr-3">
                    <div className="text-sm font-bold">04:30</div>
                    <div className="text-xs text-muted-foreground">PM</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Staff Shift Change</div>
                    <div className="text-xs text-muted-foreground">Staff Lounge</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <RecentBookings className="mb-6" />

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Available Rooms</CardTitle>
              <Link to={"/rooms"}>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roomLoading &&
                Array.from({ length: 3 }, (_, index) => <RoomCardSkeleton key={index} />)}

              {availableRooms.slice(0, 3).map((room: Room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    // </AuthGuard>
  );
}
