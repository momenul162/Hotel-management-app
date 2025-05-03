// src/redux/service/guestService.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";

// Fetch all guests
export const fetchAllGuests = createAsyncThunk("guests/fetchAllGuests", async () => {
  const { data } = await baseURL.get("/guests");
  return data;
});

// Fetch guest by ID
export const fetchGuestById = createAsyncThunk("guests/fetchGuestById", async (guestId: string) => {
  const { data } = await baseURL.get(`/guests/${guestId}`);
  return data;
});

interface GuestCreate {
  name: string;
  phone: string;
  nationality: string;
  visits: number | null;
  email?: string | null;
  vip?: boolean | false;
  passportOrNID?: string | null;
  avatar?: string | null;
}

// Create a new guest (protected route)
export const createGuest = createAsyncThunk(
  "guests/createGuest",
  async (guestData: GuestCreate) => {
    const response = await baseURL.post("/guests/create", guestData);
    return response.data;
  }
);

interface GuestUpdate {
  name?: string;
  email?: string | null;
  phone?: string;
  nationality?: string;
  vip?: boolean;
  visits?: number | null;
  passportOrNID?: string | null;
  avatar?: string;
}

// Update a guest (protected route)
export const updateGuest = createAsyncThunk(
  "guests/updateGuest",
  async ({ guestId, guestData }: { guestId: string; guestData: GuestUpdate }) => {
    const response = await baseURL.patch(`/guests/update/${guestId}`, guestData);
    return response.data;
  }
);

// Delete a guest (protected route)
export const deleteGuest = createAsyncThunk(
  "guests/deleteGuest",
  async (guestId: string, { getState }) => {
    const { token } = (getState() as any).auth;
    await baseURL.delete(`/guests/${guestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return guestId; // Return guest ID to remove it from the state
  }
);
