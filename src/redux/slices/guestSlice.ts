import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createGuest,
  deleteGuest,
  fetchAllGuests,
  fetchGuestById,
  updateGuest,
} from "../service/guestService";
import { Guest } from "../../types";

interface GuestState {
  guests: Guest[];
  currentGuest: Guest | null;
  guestLoading: boolean;
  guestError: string | null;
}

const initialState: GuestState = {
  guests: [],
  currentGuest: null,
  guestLoading: false,
  guestError: null,
};

const guestSlice = createSlice({
  name: "guests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all guests
    builder
      .addCase(fetchAllGuests.pending, (state) => {
        state.guestLoading = true;
        state.guestError = null;
      })
      .addCase(fetchAllGuests.fulfilled, (state, action: PayloadAction<Guest[]>) => {
        state.guestLoading = false;
        state.guests = action.payload;
      })
      .addCase(fetchAllGuests.rejected, (state, action: PayloadAction<any>) => {
        state.guestLoading = false;
        state.guestError = action.payload;
      })

      // Fetch guest by ID
      .addCase(fetchGuestById.pending, (state) => {
        state.guestLoading = true;
        state.guestError = null;
      })
      .addCase(fetchGuestById.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.guestLoading = false;
        state.currentGuest = action.payload;
      })
      .addCase(fetchGuestById.rejected, (state, action: PayloadAction<any>) => {
        state.guestLoading = false;
        state.guestError = action.payload;
      })

      // Create guest
      .addCase(createGuest.pending, (state) => {
        state.guestLoading = true;
      })
      .addCase(createGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.guestLoading = false;
        state.guests.push(action.payload); // Add new guest to the list
      })
      .addCase(createGuest.rejected, (state, action: PayloadAction<any>) => {
        state.guestLoading = false;
        state.guestError = action.payload;
      })

      // Update guest
      .addCase(updateGuest.pending, (state) => {
        state.guestLoading = true;
      })
      .addCase(updateGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.guestLoading = false;
        const index = state.guests.findIndex((guest) => guest._id === action.payload._id);
        if (index !== -1) {
          state.guests[index] = action.payload; // Update guest in the list
        }
      })
      .addCase(updateGuest.rejected, (state, action: PayloadAction<any>) => {
        state.guestLoading = false;
        state.guestError = action.payload;
      })

      // Delete guest
      .addCase(deleteGuest.pending, (state) => {
        state.guestLoading = true;
      })
      .addCase(deleteGuest.fulfilled, (state, action: PayloadAction<string>) => {
        state.guestLoading = false;
        state.guests = state.guests.filter((guest) => guest._id !== action.payload); // Remove deleted guest
      })
      .addCase(deleteGuest.rejected, (state, action: PayloadAction<any>) => {
        state.guestLoading = false;
        state.guestError = action.payload;
      });
  },
});

export default guestSlice.reducer;
