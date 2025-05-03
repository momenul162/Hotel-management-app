import axios from "axios";
import { toast } from "sonner";

// Since process.env is not available in browser environments without setup,
// let's use a default URL or import.meta.env which is available in Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for headers, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

// Reports API
export const fetchReports = async () => {
  const response = await api.get("/reports");
  return response.data;
};

export const fetchReportById = async (id: string) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const createReport = async (reportData: any) => {
  const response = await api.post("/reports", reportData);
  return response.data;
};

// Rooms API
export const fetchRooms = async (filters?: any) => {
  const response = await api.get("/rooms", { params: filters });
  return response.data;
};

export const fetchRoomById = async (id: string) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

export const createRoom = async (roomData: any) => {
  const response = await api.post("/rooms", roomData);
  return response.data;
};

export const updateRoom = async (id: string, roomData: any) => {
  const response = await api.put(`/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

// Bookings/Reservations API
export const fetchBookings = async (filters?: any) => {
  const response = await api.get("/bookings", { params: filters });
  return response.data;
};

export const fetchBookingById = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (bookingData: any) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const updateBooking = async (id: string, bookingData: any) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Guests API
export const fetchGuests = async (query?: string) => {
  const params = query ? { query } : undefined;
  const response = await api.get("/guests", { params });
  return response.data;
};

export const fetchGuestById = async (id: string) => {
  const response = await api.get(`/guests/${id}`);
  return response.data;
};

export const createGuest = async (guestData: any) => {
  const response = await api.post("/guests", guestData);
  return response.data;
};

export const updateGuest = async (id: string, guestData: any) => {
  const response = await api.put(`/guests/${id}`, guestData);
  return response.data;
};

export const deleteGuest = async (id: string) => {
  const response = await api.delete(`/guests/${id}`);
  return response.data;
};

// Staff API
export const fetchStaff = async () => {
  const response = await api.get("/staff");
  return response.data;
};

export const fetchStaffMemberById = async (id: string) => {
  const response = await api.get(`/staff/${id}`);
  return response.data;
};

export const createStaffMember = async (staffData: any) => {
  const response = await api.post("/staff", staffData);
  return response.data;
};

export const updateStaffMember = async (id: string, staffData: any) => {
  const response = await api.put(`/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaffMember = async (id: string) => {
  const response = await api.delete(`/staff/${id}`);
  return response.data;
};

// Inventory API
export const fetchInventory = async () => {
  const response = await api.get("/inventory");
  return response.data;
};

export const fetchInventoryItemById = async (id: string) => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};

export const createInventoryItem = async (itemData: any) => {
  const response = await api.post("/inventory", itemData);
  return response.data;
};

export const updateInventoryItem = async (id: string, itemData: any) => {
  const response = await api.put(`/inventory/${id}`, itemData);
  return response.data;
};

export const deleteInventoryItem = async (id: string) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

// Settings API
export const fetchSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (settingsData: any) => {
  const response = await api.put("/settings", settingsData);
  return response.data;
};

// Auth API
export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Search API
export const globalSearch = async (query: string) => {
  const response = await api.get("/search", { params: { query } });
  return response.data;
};
