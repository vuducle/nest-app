"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSpotify } from "@/contexts/SpotifyContext";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { Play, Pause, ExternalLink } from "lucide-react";
import { Song } from "@/lib/api";

interface SpotifyTrackPlayerProps {
  song: Song;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SpotifyTrackPlayer: React.FC<SpotifyTrackPlayerProps> = ({
  song,
  size = "sm",
  className = "",
}) => {
  const { isAuthenticated, login, accessToken } = useSpotify();
  const { isReady, isPlaying, currentTrack, play, pause } =
    useSpotifyPlayer(accessToken);

  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const isCurrentTrack = currentTrack?.id === song.spotifyId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = async () => {
    console.log("SpotifyTrackPlayer handlePlay:", {
      isAuthenticated,
      isReady,
      songId: song.spotifyId,
      songTitle: song.title,
    });

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!isReady) {
      console.log("Player not ready yet");
      return;
    }

    if (isCurrentTrack) {
      if (isPlaying) {
        await pause();
      } else {
        await play(`spotify:track:${song.spotifyId}`);
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log("Playing track:", `spotify:track:${song.spotifyId}`);
      await play(`spotify:track:${song.spotifyId}`);
    } catch (error) {
      console.error("Error playing track:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotifyLink = () => {
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, "_blank");
    }
  };

  if (!song.spotifyId) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={`${sizeClasses[size]} ${className}`}
        title="No Spotify track available"
      >
        <Play className={iconSizes[size]} />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlay}
        disabled={isLoading || (!isAuthenticated && !isReady)}
        className={`${sizeClasses[size]} ${className} ${
          isCurrentlyPlaying ? "text-green-500" : ""
        }`}
        title={
          !isAuthenticated
            ? "Connect to Spotify to play"
            : isCurrentlyPlaying
            ? "Pause track"
            : "Play track on Spotify"
        }
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
        ) : isCurrentlyPlaying ? (
          <Pause className={iconSizes[size]} />
        ) : (
          <Play className={iconSizes[size]} />
        )}
      </Button>

      {song.spotifyUrl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSpotifyLink}
          className="h-6 w-6"
          title="Open in Spotify"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
