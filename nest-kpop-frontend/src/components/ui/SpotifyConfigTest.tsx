"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SpotifyConfigTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");

  const testSpotifyConfig = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId) {
      setTestResult("❌ NEXT_PUBLIC_SPOTIFY_CLIENT_ID is missing");
      return;
    }

    if (!redirectUri) {
      setTestResult("❌ NEXT_PUBLIC_SPOTIFY_REDIRECT_URI is missing");
      return;
    }

    // Test the authorization URL
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-private%20user-read-email&` +
      `show_dialog=true`;

    setTestResult(
      `✅ Configuration looks good!\n\nAuth URL: ${authUrl}\n\nClick the button below to test the OAuth flow.`
    );
  };

  const testOAuthFlow = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      setTestResult("❌ Missing environment variables");
      return;
    }

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state&` +
      `show_dialog=true`;

    window.open(authUrl, "_blank");
    setTestResult(
      "🔄 Opened Spotify authorization in new tab. Check if it redirects correctly."
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <h3 className="font-semibold mb-4">⚙️ Spotify Configuration Test</h3>

      <div className="space-y-3">
        <div className="text-sm">
          <div>
            <strong>Client ID:</strong>{" "}
            {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
              ? "✅ Set"
              : "❌ Missing"}
          </div>
          <div>
            <strong>Redirect URI:</strong>{" "}
            {process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "❌ Missing"}
          </div>
          <div>
            <strong>API URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_API_URL || "❌ Missing"}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={testSpotifyConfig} variant="outline" size="sm">
            Test Config
          </Button>

          <Button
            onClick={testOAuthFlow}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            Test OAuth Flow
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-line">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};


