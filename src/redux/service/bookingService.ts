import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";
import { BookingCreate, BookingStatus, RoomType } from "../../types";

// Fetch all bookings
export const fetchAllBookings = createAsyncThunk("bookings/fetchAll", async () => {
  const { data } = await baseURL.get("/bookings");
  return data;
});

// Fetch booking by ID
export const fetchBookingById = createAsyncThunk("bookings/fetchById", async (id: string) => {
  const { data } = await baseURL.get(`/bookings/${id}`);
  return data;
});

// Create a booking
export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData: BookingCreate, { getState }) => {
    const { token } = (getState() as any).auth;
    const { data } = await baseURL.post("/bookings/create", bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

interface BookingUpdate {
  guestId?: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
}

// Update a booking
export const updateBooking = createAsyncThunk(
  "bookings/update",
  async ({ id, bookingData }: { id: string; bookingData: BookingUpdate }) => {
    const { data } = await baseURL.patch(`/bookings/update/${id}`, bookingData);
    return data;
  }
);

// Delete a booking
export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (id: string, { getState }) => {
    const { token } = (getState() as any).auth;
    await baseURL.delete(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);
