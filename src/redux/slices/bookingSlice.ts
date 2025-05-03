// src/redux/slices/bookingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllBookings,
  fetchBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../service/bookingService";
import { Booking } from "../../types";

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  bookingLoading: boolean;
  bookingError: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  bookingLoading: false,
  bookingError: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.bookingLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action: PayloadAction<any>) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      .addCase(fetchBookingById.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookingLoading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action: PayloadAction<any>) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookingLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action: PayloadAction<any>) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      .addCase(updateBooking.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookingLoading = false;
        const index = state.bookings.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action: PayloadAction<any>) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      .addCase(deleteBooking.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<string>) => {
        state.bookingLoading = false;
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action: PayloadAction<any>) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      });
  },
});

export default bookingSlice.reducer;
