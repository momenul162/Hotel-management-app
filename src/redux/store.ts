import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import guestReducer from "./slices/guestSlice";
import settingsReducer from "./slices/settingsSlice";
import bookingReducer from "./slices/bookingSlice";
import inventoryReducer from "./slices/inventorySlice";
import staffReducer from "./slices/staffSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    rooms: roomReducer,
    guests: guestReducer,
    booking: bookingReducer,
    inventory: inventoryReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
