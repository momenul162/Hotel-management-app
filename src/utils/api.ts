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

// Settings API
export const fetchSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (settingsData: any) => {
  const response = await api.put("/settings", settingsData);
  return response.data;
};

// Search API
export const globalSearch = async (query: string) => {
  const response = await api.get("/search", { params: { query } });
  return response.data;
};
