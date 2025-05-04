import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";
import { StaffCreate } from "../../types";

interface StaffUpdate extends Partial<StaffCreate> {}

// Fetch all staff
export const fetchAllStaff = createAsyncThunk("staff/fetchAll", async () => {
  const { data } = await baseURL.get("/staff");
  return data;
});

// Fetch single staff member
export const fetchStaffById = createAsyncThunk("staff/fetchById", async (id: string) => {
  const { data } = await baseURL.get(`/staff/${id}`);
  return data;
});

// Create staff member
export const createStaff = createAsyncThunk("staff/create", async (staffData: StaffCreate) => {
  const { data } = await baseURL.post("/staff/create", staffData);
  return data;
});

// Update staff member
export const updateStaff = createAsyncThunk(
  "staff/update",
  async ({ id, staffData }: { id: string; staffData: StaffUpdate }) => {
    const { data } = await baseURL.patch(`/staff/update/${id}`, staffData);
    return data;
  }
);

// Delete staff member
export const deleteStaff = createAsyncThunk("staff/delete", async (id: string) => {
  await baseURL.delete(`/staff/${id}`);
  return id;
});
