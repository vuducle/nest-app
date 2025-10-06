"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSpotify } from "@/contexts/SpotifyContext";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ExternalLink,
} from "lucide-react";

interface SpotifyWebPlayerProps {
  className?: string;
}

export const SpotifyWebPlayer: React.FC<SpotifyWebPlayerProps> = ({
  className = "",
}) => {
  const { isAuthenticated, user, login, accessToken } = useSpotify();
  const {
    isReady,
    isPlaying,
    currentTrack,
    position,
    duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume,
  } = useSpotifyPlayer(accessToken);

  const [isExpanded, setIsExpanded] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("SpotifyWebPlayer Debug:", {
      isAuthenticated,
      isReady,
      isPlaying,
      currentTrack: currentTrack ? "Track loaded" : "No track",
      user: user?.display_name,
      accessToken: accessToken ? "Token present" : "No token",
    });
  }, [isAuthenticated, isReady, isPlaying, currentTrack, user, accessToken]);

  const formatTime = (ms: number) => {
    if (isNaN(ms)) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    seek(newPosition);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                Connect to Spotify
              </h3>
              <p className="text-sm text-muted-foreground">
                Play full songs with Spotify Premium
              </p>
            </div>
          </div>
          <Button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Connect Spotify
          </Button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div
        className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-300">
              Connecting to Spotify...
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we connect to your Spotify account
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div
        className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                🎵 Spotify Player Ready
              </h3>
              <p className="text-sm text-muted-foreground">
                Connected as {user?.display_name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Click play on any song to start listening!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
              ✓ Ready
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                🎧 <strong>How to use:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Click the play button on any song in your playlists</li>
                <li>The song will start playing in this Spotify player</li>
                <li>Use the controls below to pause, seek, or adjust volume</li>
                <li>
                  You can also use the "Play All" button to play entire
                  playlists
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                onClick={() => play("spotify:track:4iV5W9uYEdYUVa79Axb7Rh")} // Test with a popular K-pop track
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                🎵 Test with BTS - Dynamite
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 ${className}`}
    >
      {/* Current Track Info */}
      <div className="flex items-center space-x-4 mb-4">
        {currentTrack.album.images[0] && (
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.album.name}
            className="w-12 h-12 rounded"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{currentTrack.name}</h4>
          <p className="text-xs text-muted-foreground">
            {currentTrack.artists.map((artist: any) => artist.name).join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTrack.album.name}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open(
              `https://open.spotify.com/track/${currentTrack.id}`,
              "_blank"
            )
          }
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={position}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            title="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            title="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-muted-foreground text-center">
          Playing via Spotify • {user?.display_name}
        </p>
      </div>
    </div>
  );
};
