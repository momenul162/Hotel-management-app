import { BarChart2, BedDouble, Calendar, CreditCard, Percent, Users } from "lucide-react";
import { StatCard } from "../StatCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchAllRooms } from "../../redux/service/roomService";
import { useEffect, useMemo } from "react";
import { fetchAllBookings } from "../../redux/service/bookingService";
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks } from "date-fns";
import { DashboardStatSkeleton } from "../ui/skeleton/dashboard-state-skeleton";

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, roomLoading } = useSelector((state: RootState) => state.rooms);
  const { bookings } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(fetchAllRooms());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.status === "available").length;
    const occupiedRooms = totalRooms - availableRooms;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Define date ranges for current week and last week
    const today = new Date();
    const currentWeekStart = startOfWeek(today);
    const currentWeekEnd = endOfWeek(today);
    const lastWeekStart = startOfWeek(subWeeks(today, 1));
    const lastWeekEnd = endOfWeek(subWeeks(today, 1));

    // Filter bookings for current week and last week
    const currentWeekBookings = bookings.filter((booking) =>
      isWithinInterval(new Date(booking.checkIn), { start: currentWeekStart, end: currentWeekEnd })
    );

    const lastWeekBookings = bookings.filter((booking) =>
      isWithinInterval(new Date(booking.checkIn), { start: lastWeekStart, end: lastWeekEnd })
    );

    // Calculate stats for current week
    const revenueThisWeek = currentWeekBookings.reduce(
      (total, booking) => total + booking.totalAmount,
      0
    );
    const revenueLastWeek = lastWeekBookings.reduce(
      (total, booking) => total + booking.totalAmount,
      0
    );

    const newBookingsThisWeek = currentWeekBookings.length;
    const newBookingsLastWeek = lastWeekBookings.length;

    const guestCheckInsThisWeek = currentWeekBookings.length; // Assuming check-ins are the same as bookings
    const guestCheckInsLastWeek = lastWeekBookings.length;

    const averageRoomRateThisWeek =
      currentWeekBookings.length > 0
        ? Math.round(
            currentWeekBookings.reduce((total, booking) => total + booking.totalAmount, 0) /
              currentWeekBookings.length
          )
        : 0;

    const averageRoomRateLastWeek =
      lastWeekBookings.length > 0
        ? Math.round(
            lastWeekBookings.reduce((total, booking) => total + booking.totalAmount, 0) /
              lastWeekBookings.length
          )
        : 0;

    return [
      {
        title: "Occupancy Rate",
        value: `${occupancyRate}%`,
        description: "of rooms",
        change: 0, // Occupancy rate change can be calculated if historical room data is available
        icon: <Percent className="h-6 w-6" />,
      },
      {
        title: "Revenue This Week",
        value: `$${revenueThisWeek.toLocaleString()}`,
        description: "",
        change: revenueThisWeek - revenueLastWeek,
        icon: <CreditCard className="h-6 w-6" />,
      },
      {
        title: "Available Rooms",
        value: `${availableRooms}`,
        description: `of ${totalRooms} total`,
        change: 0, // Available rooms change can be calculated if historical room data is available
        icon: <BedDouble className="h-6 w-6" />,
      },
      {
        title: "New Bookings",
        value: `${newBookingsThisWeek}`,
        description: "this week",
        change: newBookingsThisWeek - newBookingsLastWeek,
        icon: <Calendar className="h-6 w-6" />,
      },
      {
        title: "Guest Check-ins",
        value: `${guestCheckInsThisWeek}`,
        description: "this week",
        change: guestCheckInsThisWeek - guestCheckInsLastWeek,
        icon: <Users className="h-6 w-6" />,
      },
      {
        title: "Average Room Rate",
        value: `$${averageRoomRateThisWeek}`,
        description: "per night",
        change: averageRoomRateThisWeek - averageRoomRateLastWeek,
        icon: <BarChart2 className="h-6 w-6" />,
      },
    ];
  }, [rooms, bookings]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomLoading &&
          Array.from({ length: stats.length }).map((_, index) => (
            <DashboardStatSkeleton key={index} />
          ))}
        {!roomLoading && stats.map((stat, index) => <StatCard key={index} stat={stat} />)}
      </div>
    </div>
  );
}
