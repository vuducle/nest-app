"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSpotify } from "@/contexts/SpotifyContext";

export const SpotifyAuthTest: React.FC = () => {
  const { isAuthenticated, user, login, accessToken, isLoading } = useSpotify();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testAuth = () => {
    const info = {
      isAuthenticated,
      user: user?.display_name || "No user",
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length || 0,
      isLoading,
      envVars: {
        clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? "Set" : "Missing",
        redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "Missing",
        apiUrl: process.env.NEXT_PUBLIC_API_URL || "Missing",
      },
    };
    setDebugInfo(info);
    console.log("Spotify Auth Debug Info:", info);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <h3 className="font-semibold mb-4">🔧 Spotify Authentication Test</h3>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              isAuthenticated
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {isAuthenticated ? "✅ Connected" : "❌ Not Connected"}
          </span>
        </div>

        {user && (
          <div className="text-sm">
            <span className="font-medium">User:</span> {user.display_name}
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={login}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? "Connecting..." : "Connect to Spotify"}
          </Button>

          <Button onClick={testAuth} variant="outline" size="sm">
            Debug Info
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};


