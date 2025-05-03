// src/redux/slices/roomSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllRooms,
  fetchRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../service/roomService";
import { Room } from "../../types";

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  roomLoading: boolean;
  roomError: string | null;
}

const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  roomLoading: false,
  roomError: null,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Fetch all rooms
    builder
      .addCase(fetchAllRooms.pending, (state) => {
        state.roomLoading = true;
        state.roomError = null;
      })
      .addCase(fetchAllRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.roomLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchAllRooms.rejected, (state, action: PayloadAction<any>) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      })

      // Fetch room by ID
      .addCase(fetchRoomById.pending, (state) => {
        state.roomLoading = true;
        state.roomError = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action: PayloadAction<Room>) => {
        state.roomLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action: PayloadAction<any>) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      })

      // Create room
      .addCase(createRoom.pending, (state) => {
        state.roomLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.roomLoading = false;
        state.rooms.push(action.payload); // Add new room to the list
      })
      .addCase(createRoom.rejected, (state, action: PayloadAction<any>) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      })

      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.roomLoading = true;
      })
      .addCase(updateRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.roomLoading = false;

        const index = state.rooms.findIndex((room) => room._id === action.payload._id);

        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })

      .addCase(updateRoom.rejected, (state, action: PayloadAction<any>) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      })

      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.roomLoading = true;
      })
      .addCase(deleteRoom.fulfilled, (state, action: PayloadAction<string>) => {
        state.roomLoading = false;
        state.rooms = state.rooms.filter((room) => room._id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action: PayloadAction<any>) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      });
  },
});

export default roomSlice.reducer;
