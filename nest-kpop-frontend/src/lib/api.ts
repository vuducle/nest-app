import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3669";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  getStatus: async (): Promise<{ isAuthenticated: boolean; user: User }> => {
    const response = await api.get("/auth/status");
    return response.data;
  },
};
