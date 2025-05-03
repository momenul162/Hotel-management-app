import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";

// Fetch all rooms
export const fetchAllRooms = createAsyncThunk("rooms/fetchAllRooms", async () => {
  const { data } = await baseURL.get("/rooms");
  return data;
});

// Fetch room by ID
export const fetchRoomById = createAsyncThunk("rooms/fetchRoomById", async (roomId: string) => {
  const { data } = await baseURL.get(`/rooms/${roomId}`);
  return data;
});

export interface RoomCreate {
  number: string;
  type: "Standard" | "Deluxe" | "Suite" | "Executive";
  capacity: number;
  price: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  features: string[];
  image?: string;
}

// Create a new room (protected route)
export const createRoom = createAsyncThunk("rooms/createRoom", async (roomData: RoomCreate) => {
  const response = await baseURL.post("/rooms/create", roomData);
  return response.data;
});

export interface RoomUpdate {
  number?: string;
  type?: "Standard" | "Deluxe" | "Suite" | "Executive";
  capacity?: number;
  price?: number;
  status?: "available" | "occupied" | "maintenance" | "reserved";
  features?: string[];
  image?: string;
}

// Update a room (protected route)
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ roomId, roomData }: { roomId: string; roomData: RoomUpdate }) => {
    const response = await baseURL.patch(`/rooms/update/${roomId}`, roomData);
    return response.data;
  }
);

// Delete a room (protected route)
export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (roomId: string) => {
  await baseURL.delete(`/rooms/${roomId}`);
  return roomId;
});
