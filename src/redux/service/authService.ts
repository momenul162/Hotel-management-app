import { createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../../utils/base-url";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  try {
    const { data } = await baseURL.get(`/auth/current-user`);
    return data;
  } catch (error: any) {
    return error.response?.data;
  }
});

export const getUserById = createAsyncThunk("auth/fetchUserById", async (userId: string) => {
  const { data } = await baseURL.get(`/auth/users/${userId}`);
  return data;
});

export const login = async (data: { email: string; password: string }) => {
  const response = await baseURL.post("/auth/login", data);
  return response.data;
};
