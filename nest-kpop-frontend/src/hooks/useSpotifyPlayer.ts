"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Extend Window interface for Spotify Web Playback SDK
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// Spotify Web Playback SDK types
interface SpotifyPlayer {
  addListener: (event: string, callback: Function) => void;
  connect: () => void;
  disconnect: () => void;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
}

interface SpotifySDK {
  Player: new (options: any) => SpotifyPlayer;
}

interface SpotifyPlayerState {
  position: number;
  duration: number;
  paused: boolean;
  track_window: {
    current_track: {
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string; height?: number; width?: number }>;
      };
      duration_ms: number;
    };
    previous_tracks: any[];
    next_tracks: any[];
  };
}

interface UseSpotifyPlayerReturn {
  player: any;
  deviceId: string | null;
  isReady: boolean;
  isPlaying: boolean;
  currentTrack: any;
  position: number;
  duration: number;
  volume: number;
  play: (spotifyUri: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  transferPlayback: () => Promise<void>;
}

export const useSpotifyPlayer = (
  accessToken: string | null
): UseSpotifyPlayerReturn => {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef<any>(null);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new (window as any).Spotify.Player({
        name: "K-Pop Playlist Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Ready
      (spotifyPlayer as any).addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
          setIsReady(true);
          setPlayer(spotifyPlayer);
          playerRef.current = spotifyPlayer;
          // Attempt to auto-transfer playback to this device as soon as it's ready
          try {
            fetch("https://api.spotify.com/v1/me/player", {
              method: "PUT",
              body: JSON.stringify({ device_ids: [device_id], play: false }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }).catch((e) => console.warn("Transfer playback failed:", e));
          } catch (e) {
            console.warn("Transfer playback try/catch error:", e);
          }
        }
      );

      // Not Ready
      (spotifyPlayer as any).addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          setIsReady(false);
        }
      );

      // Initial State
      (spotifyPlayer as any).addListener(
        "initial_state",
        (state: SpotifyPlayerState) => {
          setIsPlaying(!state.paused);
          setCurrentTrack(state.track_window.current_track);
          setPosition(state.position);
          setDuration(state.duration);
        }
      );

      // State Changed
      (spotifyPlayer as any).addListener(
        "player_state_changed",
        (state: SpotifyPlayerState) => {
          if (!state) return;

          setIsPlaying(!state.paused);
          setCurrentTrack(state.track_window.current_track);
          setPosition(state.position);
          setDuration(state.duration);
        }
      );

      // Error
      (spotifyPlayer as any).addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          console.error("Failed to authenticate:", message);
        }
      );

      (spotifyPlayer as any).addListener(
        "account_error",
        ({ message }: { message: string }) => {
          console.error("Failed to validate Spotify account:", message);
        }
      );

      (spotifyPlayer as any).addListener(
        "playback_error",
        ({ message }: { message: string }) => {
          console.error("Failed to perform playback:", message);
        }
      );

      // Connect to the player
      spotifyPlayer.connect();
    };

    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [accessToken]);

  const play = useCallback(
    async (spotifyUri: string) => {
      if (!player || !deviceId) return;

      try {
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error playing track:", error);
      }
    },
    [player, deviceId, accessToken]
  );

  const pause = useCallback(async () => {
    if (!player || !deviceId) return;

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error pausing playback:", error);
    }
  }, [player, deviceId, accessToken]);

  const resume = useCallback(async () => {
    if (!player || !deviceId) return;

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error resuming playback:", error);
    }
  }, [player, deviceId, accessToken]);

  const seek = useCallback(
    async (positionMs: number) => {
      if (!player || !deviceId) return;

      try {
        await fetch(
          `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error seeking:", error);
      }
    },
    [player, deviceId, accessToken]
  );

  const updateVolume = useCallback(
    async (newVolume: number) => {
      if (!player || !deviceId) return;

      try {
        await fetch(
          `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}&device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setVolume(newVolume);
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    },
    [player, deviceId, accessToken]
  );

  const getCurrentState =
    useCallback(async (): Promise<SpotifyPlayerState | null> => {
      if (!player) return null;
      return await player.getCurrentState();
    }, [player]);

  const transferPlayback = useCallback(async () => {
    if (!deviceId) return;

    try {
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        body: JSON.stringify({ device_ids: [deviceId] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  }, [deviceId, accessToken]);

  return {
    player,
    deviceId,
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
    setVolume: updateVolume,
    getCurrentState,
    transferPlayback,
  };
};
