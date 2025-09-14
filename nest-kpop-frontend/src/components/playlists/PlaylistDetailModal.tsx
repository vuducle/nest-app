"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Playlist, playlistsApi } from "@/lib/api";
import { AddSongsToPlaylistModal } from "./AddSongsToPlaylistModal";
import {
  Music,
  Play,
  Clock,
  ExternalLink,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";

interface PlaylistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  onPlaylistUpdated: () => void;
}

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  isOpen,
  onClose,
  playlist,
  onPlaylistUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(
    playlist
  );

  // Update currentPlaylist when playlist prop changes
  useEffect(() => {
    setCurrentPlaylist(playlist);
  }, [playlist]);

  const refreshPlaylist = async () => {
    if (!currentPlaylist) return;

    try {
      const updatedPlaylist = await playlistsApi.getPlaylist(
        currentPlaylist.id
      );
      setCurrentPlaylist(updatedPlaylist);
    } catch (error) {
      console.error("Failed to refresh playlist:", error);
    }
  };

  const handleSongsAdded = async () => {
    await refreshPlaylist();
    onPlaylistUpdated(); // Also notify parent component
  };

  if (!currentPlaylist) return null;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRemoveSong = async (songId: string) => {
    if (
      !confirm("Are you sure you want to remove this song from the playlist?")
    )
      return;

    setIsLoading(true);
    try {
      await playlistsApi.removeSongFromPlaylist(currentPlaylist.id, songId);
      await refreshPlaylist();
      onPlaylistUpdated();
    } catch (error) {
      console.error("Failed to remove song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDuration = currentPlaylist.playlistSongs.reduce(
    (total, playlistSong) => {
      return total + playlistSong.song.duration;
    },
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-pink-500" />
            <span>{currentPlaylist.name}</span>
          </DialogTitle>
          <DialogDescription>
            {currentPlaylist.description ||
              "A collection of amazing K-pop tracks"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Playlist Info */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                  {currentPlaylist.name}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {currentPlaylist.playlistSongs.length} song
                  {currentPlaylist.playlistSongs.length !== 1 ? "s" : ""} •{" "}
                  {formatDuration(totalDuration)}
                </p>
                {currentPlaylist.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentPlaylist.description}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Play className="h-4 w-4 mr-2" />
                  Play All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSongsModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Songs
                </Button>
              </div>
            </div>
          </div>

          {/* Songs List */}
          {currentPlaylist.playlistSongs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
              <p className="text-muted-foreground mb-6">
                Add some songs to make this playlist amazing!
              </p>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={() => setIsAddSongsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Songs
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Songs</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {currentPlaylist.playlistSongs.map((playlistSong, index) => (
                  <div
                    key={playlistSong.id}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      {playlistSong.song.imageUrl && (
                        <img
                          src={playlistSong.song.imageUrl}
                          alt={
                            playlistSong.song.album || playlistSong.song.title
                          }
                          className="w-12 h-12 rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{playlistSong.song.title}</p>
                        <p className="text-sm text-gray-500">
                          {playlistSong.song.artist}
                        </p>
                        {playlistSong.song.album && (
                          <p className="text-xs text-gray-400">
                            {playlistSong.song.album}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDuration(playlistSong.song.duration)}
                        </span>
                      </div>

                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>

                      {playlistSong.song.spotifyUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            window.open(playlistSong.song.spotifyUrl, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSong(playlistSong.song.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Add Songs Modal */}
      <AddSongsToPlaylistModal
        isOpen={isAddSongsModalOpen}
        onClose={() => setIsAddSongsModalOpen(false)}
        playlist={currentPlaylist}
        onSongsAdded={handleSongsAdded}
      />
    </Dialog>
  );
};
