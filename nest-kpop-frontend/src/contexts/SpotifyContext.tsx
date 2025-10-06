"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height?: number; width?: number }>;
  country: string;
  product: string; // 'premium' or 'free'
}

interface SpotifyContextType {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const DEFAULT_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/callback`
    : "http://localhost:3000/callback";
const SPOTIFY_REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || DEFAULT_REDIRECT_URI;
const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  // Required for Web Playback SDK
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-library-modify",
].join(" ");

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem("spotify_access_token");
    const tokenExpiry = localStorage.getItem("spotify_token_expiry");

    if (token && tokenExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(tokenExpiry);

      if (now < expiry) {
        setAccessToken(token);
        setIsAuthenticated(true);
        fetchUserProfile(token);
      } else {
        // Token expired, clear it
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expiry");
        localStorage.removeItem("spotify_refresh_token");
      }
    }

    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching Spotify user profile:", error);
      logout();
    }
  };

  const login = () => {
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SPOTIFY_SCOPES)}&` +
      `show_dialog=true`;

    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem("spotify_refresh_token");
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: SpotifyContextType = {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    isLoading,
  };

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
