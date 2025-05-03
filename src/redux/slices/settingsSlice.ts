import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { fetchSettings, updateSettings } from "../../utils/api";

type PasswordRequirements = {
  uppercase: boolean;
  numbers: boolean;
  specialChars: boolean;
  minLength: number;
};

export interface SettingsState {
  hotelName: string;
  hotelAddress: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  language: string;
  checkInTime: string;
  checkOutTime: string;
  theme: "light" | "dark";
  animations: boolean;
  compactView: boolean;
  sessionTimeout: number;
  passwordRequirements: PasswordRequirements;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  hotelName: "Luxury Suites",
  hotelAddress: "123 Ocean Drive, Miami, FL 33139",
  contactEmail: "info@luxurysuites.com",
  contactPhone: "+1 (555) 123-4567",
  currency: "USD",
  timezone: "America/New_York",
  language: "English",
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  theme: "light",
  animations: true,
  compactView: false,
  sessionTimeout: 30,
  passwordRequirements: {
    uppercase: true,
    numbers: true,
    specialChars: true,
    minLength: 8,
  },
  loading: false,
  error: null,
};

export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSettings();
      return data;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return rejectWithValue("Failed to load settings. Using defaults.");
    }
  }
);

export const saveSettingsAsync = createAsyncThunk(
  "settings/saveSettings",
  async (settings: Omit<SettingsState, "loading" | "error">, { rejectWithValue }) => {
    try {
      await updateSettings(settings);
      toast.success("Settings saved successfully!");
      return settings;
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
      return rejectWithValue("Failed to save settings.");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSetting: (
      state,
      action: PayloadAction<{ key: keyof Omit<SettingsState, "loading" | "error">; value: any }>
    ) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;

      // Apply visual settings immediately
      if (key === "theme") {
        document.documentElement.classList.toggle("dark", value === "dark");
      } else if (key === "animations") {
        document.documentElement.classList.toggle("animations-disabled", !value);
      } else if (key === "compactView") {
        document.documentElement.classList.toggle("compact-view", value);
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      document.documentElement.classList.toggle("dark", action.payload === "dark");
    },
    setAnimations: (state, action: PayloadAction<boolean>) => {
      state.animations = action.payload;
      document.documentElement.classList.toggle("animations-disabled", !action.payload);
    },
    setCompactView: (state, action: PayloadAction<boolean>) => {
      state.compactView = action.payload;
      document.documentElement.classList.toggle("compact-view", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action: PayloadAction<any>) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
          error: null,
        };
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettingsAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateSetting, setTheme, setAnimations, setCompactView } = settingsSlice.actions;
export default settingsSlice.reducer;
