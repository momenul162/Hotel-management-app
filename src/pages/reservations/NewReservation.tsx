import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchAllRooms } from "../../redux/service/roomService";
import { fetchAllGuests } from "../../redux/service/guestService";
import { createBooking, updateBooking } from "../../redux/service/bookingService";
import { Booking, Room } from "../../types";

// Define form schema
const formSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  guestId: z.string().min(1, "Guest is required"),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z
    .date({
      required_error: "Check-out date is required",
    })
    .refine((date) => date > new Date(), {
      message: "Check-out date must be in the future",
    }),
  totalAmount: z.number().positive("Amount must be greater than 0"),
  status: z.string(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewReservation() {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, roomLoading } = useSelector((state: RootState) => state.rooms);
  const { guests, guestLoading } = useSelector((state: RootState) => state.guests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const editBooking = state?.editBooking as Booking;

  // Load rooms and guests on component mount
  useEffect(() => {
    dispatch(fetchAllRooms());
    dispatch(fetchAllGuests());
  }, [dispatch]);

  const availableRooms = useMemo(() => {
    return rooms.filter((room: Room) => room.status === "available");
  }, [rooms]);

  // Create form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editBooking
      ? {
          roomId: editBooking?.roomId._id,
          guestId: editBooking?.guestId?._id,
          checkIn: new Date(editBooking?.checkIn),
          checkOut: new Date(editBooking?.checkOut),
          paymentStatus: editBooking?.paymentStatus,
          totalAmount: editBooking?.totalAmount,
          status: editBooking?.status,
        }
      : {
          roomId: "",
          guestId: "",
          checkIn: new Date(),
          checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
          paymentStatus: "pending",
          totalAmount: 0,
          status: "confirmed",
        },
  });

  // Handle form submission
  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...data,
          checkIn: data.checkIn.toISOString(),
          checkOut: data.checkOut.toISOString(),
        };

        const result = editBooking
          ? await dispatch(updateBooking({ id: editBooking._id, bookingData: payload }))
          : await dispatch(createBooking(payload));

        if (result.type.includes("fulfilled")) {
          toast.success(
            editBooking ? "Reservation updated successfully!" : "Reservation created successfully!"
          );
          navigate("/reservations");
        }
      } catch (error) {
        console.error("Error submitting reservation:", error);
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, editBooking, navigate]
  );

  // Autofill amount based on selected room and dates
  const watchRoomId = form.watch("roomId");
  const watchCheckIn = form.watch("checkIn");
  const watchCheckOut = form.watch("checkOut");

  useEffect(() => {
    if (watchRoomId && watchCheckIn && watchCheckOut) {
      const selectedRoom = rooms.find((room) => room._id === watchRoomId);
      if (selectedRoom) {
        const checkInDate = new Date(watchCheckIn);
        const checkOutDate = new Date(watchCheckOut);
        const nights = Math.max(
          1,
          Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        );
        const totalAmount = selectedRoom.price * nights;
        form.setValue("totalAmount", totalAmount);
      }
    }
  }, [watchRoomId, watchCheckIn, watchCheckOut, rooms, form]);

  const handleCancel = useCallback(() => {
    navigate("/reservations");
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {editBooking ? "Edit Reservation" : "New Reservation"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editBooking ? "Update the reservation details" : "Create a new guest reservation"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>Enter the details for the new reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Selection */}
                  <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={roomLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomLoading ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading rooms...
                              </div>
                            ) : (
                              rooms.length > 0 &&
                              availableRooms.map((room) => (
                                <SelectItem key={room._id} value={room._id}>
                                  Room {room.number} - {room.type} (${room.price}/night)
                                </SelectItem>
                              ))
                            )}
                            {rooms.length < 0 && (
                              <div className="p-2 text-center text-muted-foreground">
                                No available rooms
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>Only available rooms are shown</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Guest Selection */}
                  <FormField
                    control={form.control}
                    name="guestId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={guestLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a guest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {guestLoading ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading guests...
                              </div>
                            ) : guests.length > 0 ? (
                              guests.map((guest) => (
                                <SelectItem key={guest._id} value={guest._id}>
                                  {guest.name} {guest.vip && "⭐"}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-muted-foreground">
                                No guests found
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select a guest or{" "}
                          <a href="/guests/new" className="text-primary underline">
                            create new
                          </a>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Check-in Date */}
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-in Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The day the guest will arrive</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Check-out Date */}
                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-out Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <= form.getValues("checkIn") || date < new Date()
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The day the guest will depart</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount */}
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Total amount for the stay</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Status */}
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Current status of payment</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editBooking ? "Updating..." : "Creating..."}
                      </>
                    ) : editBooking ? (
                      "Update Reservation"
                    ) : (
                      "Create Reservation"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
