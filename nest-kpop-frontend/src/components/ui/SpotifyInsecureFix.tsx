"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SpotifyInsecureFix: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");

  const testLocalhostUris = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

    if (!clientId) {
      setTestResult("❌ Client ID not found");
      return;
    }

    // Test with explicit localhost (should work with Spotify)
    const testUris = [
      "http://localhost:3000/callback",
      "http://localhost:3000/spotify/callback",
      "http://127.0.0.1:3000/callback",
      "http://127.0.0.1:3000/spotify/callback",
    ];

    setTestResult(
      `Testing localhost URIs with your client ID: ${clientId}\n\nThese should work with Spotify:\n${testUris.join(
        "\n"
      )}\n\nTry each one in your Spotify Developer Dashboard.`
    );
  };

  const openSpotifyDashboard = () => {
    window.open("https://developer.spotify.com/dashboard", "_blank");
    setTestResult(
      "Opened Spotify Developer Dashboard. Make sure to add the redirect URI: http://localhost:3000/callback"
    );
  };

  const generateAuthUrl = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = "http://localhost:3000/callback";

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state&` +
      `show_dialog=true`;

    setTestResult(
      `Generated auth URL for localhost:\n\n${authUrl}\n\nCopy this URL and test it in your browser.`
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
      <h3 className="font-semibold mb-4 text-orange-700 dark:text-orange-300">
        🔒 Fix Insecure Redirect URI
      </h3>

      <div className="space-y-4">
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
          <p className="font-medium text-orange-800 dark:text-orange-200 mb-2">
            The Issue:
          </p>
          <p className="text-orange-700 dark:text-orange-300">
            Spotify is rejecting HTTP redirect URIs for security. However,{" "}
            <strong>localhost</strong> should be an exception.
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={testLocalhostUris}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Test Localhost URIs
          </Button>

          <Button
            onClick={openSpotifyDashboard}
            className="bg-green-500 hover:bg-green-600 text-white w-full"
            size="sm"
          >
            Open Spotify Dashboard
          </Button>

          <Button
            onClick={generateAuthUrl}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Generate Test Auth URL
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-line">
            {testResult}
          </div>
        )}

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            💡 Quick Fix Steps:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Go to Spotify Developer Dashboard</li>
            <li>Find your app (Client ID: fdfac30d5fa5496aa5e4152499db962e)</li>
            <li>Click "Edit Settings"</li>
            <li>
              Add redirect URI: <code>http://localhost:3000/callback</code>
            </li>
            <li>Save and try again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};


