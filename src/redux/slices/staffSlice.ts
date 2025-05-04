import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllStaff,
  fetchStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../service/staffService";
import { Staff } from "../../types";

interface StaffState {
  staffList: Staff[];
  currentStaff: Staff | null;
  staffLoading: boolean;
  staffError: string | null;
}

const initialState: StaffState = {
  staffList: [],
  currentStaff: null,
  staffLoading: false,
  staffError: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllStaff.pending, (state) => {
        state.staffLoading = true;
        state.staffError = null;
      })
      .addCase(fetchAllStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
        state.staffLoading = false;
        state.staffList = action.payload;
      })
      .addCase(fetchAllStaff.rejected, (state, action) => {
        state.staffLoading = false;
        state.staffError = action.error.message || "Failed to fetch staff";
      })

      // Fetch one
      .addCase(fetchStaffById.pending, (state) => {
        state.staffLoading = true;
        state.staffError = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.staffLoading = false;
        state.currentStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.staffLoading = false;
        state.staffError = action.error.message || "Failed to fetch staff member";
      })

      // Create
      .addCase(createStaff.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(createStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.staffLoading = false;
        state.staffList.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.staffLoading = false;
        state.staffError = action.error.message || "Failed to create staff member";
      })

      // Update
      .addCase(updateStaff.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(updateStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.staffLoading = false;
        const index = state.staffList.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.staffList[index] = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.staffLoading = false;
        state.staffError = action.error.message || "Failed to update staff member";
      })

      // Delete
      .addCase(deleteStaff.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(deleteStaff.fulfilled, (state, action: PayloadAction<string>) => {
        state.staffLoading = false;
        state.staffList = state.staffList.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.staffLoading = false;
        state.staffError = action.error.message || "Failed to delete staff member";
      });
  },
});

export default staffSlice.reducer;
