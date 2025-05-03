import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../service/authService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  currentUser: User | null;
  loading: boolean;
  error: null;
}

const initialState: AuthState = {
  token: null,
  currentUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      (state.currentUser = action.payload.user), (state.token = action.payload.token);
    },
    logout(state: AuthState) {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("jwt-token");
    },
  },

  extraReducers: (builder) => {
    builder
      /* Get current user */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
