"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Playlist,
  CreatePlaylistRequest,
  SpotifyTrack,
  playlistsApi,
  spotifyApi,
} from "@/lib/api";
import {
  Music,
  Search,
  Plus,
  Play,
  Clock,
  ExternalLink,
  Loader2,
  X,
  Check,
} from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const [step, setStep] = useState<"create" | "add-songs">("create");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreatePlaylistRequest>({
    name: "",
    description: "",
    isPublic: false,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep("create");
      setFormData({ name: "", description: "", isPublic: false });
      setSearchQuery("");
      setSearchResults([]);
      setSelectedSongs([]);
      setCreatedPlaylist(null);
    }
  }, [isOpen]);

  const handleCreatePlaylist = async () => {
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const playlist = await playlistsApi.createPlaylist(formData);
      setCreatedPlaylist(playlist);
      setStep("add-songs");
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSongs = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await spotifyApi.searchKPopTracks(searchQuery, 20);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search songs:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSong = (track: SpotifyTrack) => {
    if (!selectedSongs.find((song) => song.id === track.id)) {
      setSelectedSongs([...selectedSongs, track]);
    }
  };

  const handleRemoveSong = (trackId: string) => {
    setSelectedSongs(selectedSongs.filter((song) => song.id !== trackId));
  };

  const handleAddSongsToPlaylist = async () => {
    if (!createdPlaylist || selectedSongs.length === 0) return;

    setIsLoading(true);
    try {
      for (const track of selectedSongs) {
        await playlistsApi.addSpotifyTrackToPlaylist(
          createdPlaylist.id,
          track.id
        );
      }

      // Fetch the updated playlist with the new songs
      const updatedPlaylist = await playlistsApi.getPlaylist(
        createdPlaylist.id
      );
      onPlaylistCreated(updatedPlaylist);
      onClose();
    } catch (error) {
      console.error("Failed to add songs to playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-pink-500" />
            <span>
              {step === "create"
                ? "Create New Playlist"
                : "Add Songs to Playlist"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {step === "create"
              ? "Create a new playlist and start adding your favorite K-pop songs"
              : `Add songs to "${formData.name}" playlist`}
          </DialogDescription>
        </DialogHeader>

        {step === "create" ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Playlist Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="My Awesome K-pop Playlist"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="A collection of my favorite K-pop tracks"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                />
                <Label htmlFor="isPublic" className="text-sm">
                  Make this playlist public
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlaylist}
                disabled={!formData.name.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Playlist
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for K-pop songs..."
                    onKeyPress={(e) => e.key === "Enter" && handleSearchSongs()}
                  />
                </div>
                <Button
                  onClick={handleSearchSongs}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Selected Songs */}
              {selectedSongs.length > 0 && (
                <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-pink-700 dark:text-pink-300">
                    Selected Songs ({selectedSongs.length})
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedSongs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={song.album.images[0]?.url}
                            alt={song.album.name}
                            className="w-8 h-8 rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{song.name}</p>
                            <p className="text-xs text-gray-500">
                              {song.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSong(song.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Search Results</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.album.name}
                          className="w-12 h-12 rounded"
                        />
                        <div>
                          <p className="font-medium">{track.name}</p>
                          <p className="text-sm text-gray-500">
                            {track.artists
                              .map((artist) => artist.name)
                              .join(", ")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {track.album.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(track.duration_ms)}</span>
                        </div>

                        {selectedSongs.find((song) => song.id === track.id) ? (
                          <Button size="sm" variant="outline" disabled>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddSong(track)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            window.open(track.external_urls.spotify, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("create")}>
                Back
              </Button>
              <div className="space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Skip for now
                </Button>
                <Button
                  onClick={handleAddSongsToPlaylist}
                  disabled={selectedSongs.length === 0 || isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Songs...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {selectedSongs.length} Song
                      {selectedSongs.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
