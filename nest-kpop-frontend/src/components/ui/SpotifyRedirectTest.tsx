"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SpotifyRedirectTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");

  const commonRedirectUris = [
    "https://localhost:3000/spotify/callback",
    "https://localhost:3000/callback",
    "https://localhost:3000/auth/callback",
    "https://localhost:3000",
    "http://localhost:3000/spotify/callback",
    "http://localhost:3000/callback",
    "http://localhost:3000/auth/callback",
    "http://localhost:3000",
    "http://127.0.0.1:3000/spotify/callback",
    "http://127.0.0.1:3000/callback",
  ];

  const testRedirectUri = (redirectUri: string) => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

    if (!clientId) {
      setTestResult("❌ Client ID not found");
      return;
    }

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-private%20user-read-email&` +
      `show_dialog=true`;

    setTestResult(
      `Testing redirect URI: ${redirectUri}\n\nAuth URL: ${authUrl}\n\nClick to test this URI.`
    );

    // Open in new tab for testing
    window.open(authUrl, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <h3 className="font-semibold mb-4">🔄 Test Different Redirect URIs</h3>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Try these common redirect URIs to see which one works:
        </p>

        <div className="grid grid-cols-1 gap-2">
          {commonRedirectUris.map((uri, index) => (
            <Button
              key={index}
              onClick={() => testRedirectUri(uri)}
              variant="outline"
              size="sm"
              className="justify-start text-left"
            >
              Test: {uri}
            </Button>
          ))}
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-line">
            {testResult}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200">
            💡 Instructions:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-700 dark:text-blue-300">
            <li>Click each "Test" button above</li>
            <li>See which one doesn't give "INVALID_CLIENT" error</li>
            <li>That's the correct redirect URI for your Spotify app</li>
            <li>Update your environment variables to use that URI</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
