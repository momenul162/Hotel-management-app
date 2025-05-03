import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Booking, BookingStatus } from "../types";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Search, Plus, Calendar, Download, MoreHorizontal } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllBookings } from "../redux/service/bookingService";
import TableRowSkeleton from "../components/ui/skeleton/talbe-row-skeleton";

export default function Reservations() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, bookingLoading } = useSelector((state: RootState) => state.booking);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const navigate = useNavigate();

  // Fetch bookings on component mount
  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter = statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch =
        booking.guestId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomId.number.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Memoized status color functions
  const getStatusColor = useCallback((status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "checked-in":
        return "bg-green-100 text-green-800 border-green-200";
      case "checked-out":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getPaymentStatusColor = useCallback((status: Booking["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  // Utility function for date formatting
  const formatDate = useCallback((date: string | undefined) => {
    if (!date) return "Invalid date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Handlers for navigation
  const handleEditReservation = useCallback(
    (booking: Booking) => {
      navigate(`/reservations/new`, { state: { editBooking: booking } });
    },
    [navigate]
  );

  const handleChangeStatus = useCallback(
    (booking: Booking) => {
      navigate(`/reservations/status-change`, {
        state: {
          status: booking.status,
          bookingId: booking._id,
          open: true,
        },
      });
    },
    [navigate]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Reservations</h1>
            <p className="text-sm text-muted-foreground mt-1">View and manage all reservations</p>
          </div>
          <Button className="shrink-0" asChild>
            <Link to="/reservations/new">
              <Plus className="h-4 w-4 mr-2" />
              New Reservation
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "confirmed", "checked-in", "checked-out", "canceled"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as BookingStatus | "all")}
                className="text-xs h-8"
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reservations..."
                className="pl-8 h-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button variant="outline" size="sm" className="gap-1 h-8">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Date Range</span>
            </Button>

            <Button variant="outline" size="sm" className="h-8 px-2">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="hidden md:table-cell">Check-in</TableHead>
                <TableHead className="hidden md:table-cell">Check-out</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-left">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingLoading && <TableRowSkeleton />}
              {!bookingLoading && filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">{`00${index + 1}`}</TableCell>
                    <TableCell>{booking.guestId?.name}</TableCell>
                    <TableCell>{booking.roomId.number}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(booking.checkIn)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(booking.checkOut)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPaymentStatusColor(booking.paymentStatus)}
                      >
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left font-medium">${booking?.totalAmount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditReservation(booking)}>
                            Edit Reservation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(booking)}>
                            Change Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No reservations found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
