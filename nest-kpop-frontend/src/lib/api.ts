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

export interface Song {
  id: string;
  spotifyId?: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  releaseDate: string;
  genre?: string;
  imageUrl?: string;
  audioUrl?: string;
  previewUrl?: string;
  spotifyUrl?: string;
  popularity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  order: number;
  addedAt: string;
  song: Song;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  playlistSongs: PlaylistSong[];
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height?: number; width?: number }[];
    release_date: string;
  };
  duration_ms: number;
  external_urls: { spotify: string };
  preview_url: string | null;
  popularity: number;
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

export const playlistsApi = {
  getMyPlaylists: async (): Promise<Playlist[]> => {
    const response = await api.get("/playlists/my");
    return response.data;
  },

  getAllPlaylists: async (): Promise<Playlist[]> => {
    const response = await api.get("/playlists");
    return response.data;
  },

  getPlaylist: async (id: string): Promise<Playlist> => {
    const response = await api.get(`/playlists/${id}`);
    return response.data;
  },

  createPlaylist: async (data: CreatePlaylistRequest): Promise<Playlist> => {
    const response = await api.post("/playlists", data);
    return response.data;
  },

  updatePlaylist: async (
    id: string,
    data: Partial<CreatePlaylistRequest>
  ): Promise<Playlist> => {
    const response = await api.patch(`/playlists/${id}`, data);
    return response.data;
  },

  deletePlaylist: async (id: string): Promise<void> => {
    await api.delete(`/playlists/${id}`);
  },

  addSongToPlaylist: async (
    playlistId: string,
    songId: string
  ): Promise<void> => {
    await api.post(`/playlists/${playlistId}/songs/${songId}`);
  },

  removeSongFromPlaylist: async (
    playlistId: string,
    songId: string
  ): Promise<void> => {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`);
  },

  addSpotifyTrackToPlaylist: async (
    playlistId: string,
    spotifyTrackId: string
  ): Promise<void> => {
    await api.post(`/playlists/${playlistId}/spotify-tracks/${spotifyTrackId}`);
  },
};

// Create a separate axios instance for Spotify API calls without auth interceptors
const spotifyApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const spotifyApi = {
  searchTracks: async (
    query: string,
    limit: number = 20
  ): Promise<SpotifyTrack[]> => {
    const response = await spotifyApiClient.get(
      `/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  },

  searchKPopTracks: async (
    query: string,
    limit: number = 20
  ): Promise<SpotifyTrack[]> => {
    const response = await spotifyApiClient.get(
      `/spotify/search/kpop?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  },

  getPopularKPopTracks: async (limit: number = 20): Promise<SpotifyTrack[]> => {
    const response = await spotifyApiClient.get(
      `/spotify/popular/kpop?limit=${limit}`
    );
    return response.data;
  },

  getRecentKPopReleases: async (limit: number = 3): Promise<SpotifyTrack[]> => {
    const response = await spotifyApiClient.get(
      `/spotify/recent/kpop?limit=${limit}`
    );
    return response.data;
  },
};
