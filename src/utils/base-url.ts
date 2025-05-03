import axios from "axios";

// Define the API URL (it can be dynamic or static based on environment)
const API_URL = "http://localhost:24/api";

// Create an axios instance
const baseURL = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Optional: timeout for requests
});

// Add a request interceptor to attach the JWT token to the headers
baseURL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token validation errors (e.g., 401 Unauthorized)
baseURL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or invalid token, and redirect to login
      console.log("Token is invalid or expired. Please login again.");
      localStorage.removeItem("jwt-token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default baseURL;
