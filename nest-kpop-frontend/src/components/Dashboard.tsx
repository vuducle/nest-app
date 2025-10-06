"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Music,
  Sparkles,
  Heart,
  Star,
  Users,
  Play,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  MessageCircle,
  Share2,
  Mic,
  Headphones,
  Zap,
  Trash2,
  Edit,
  User as UserIcon,
} from "lucide-react";
import { CreatePlaylistModal } from "@/components/playlists/CreatePlaylistModal";
import { PlaylistDetailModal } from "@/components/playlists/PlaylistDetailModal";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { FriendsList } from "@/components/friends/FriendsList";
import Link from "next/link";

import { SpotifyWebPlayer } from "@/components/ui/SpotifyWebPlayer";
import { useSpotify } from "@/contexts/SpotifyContext";
import {
  Playlist,
  playlistsApi,
  SpotifyTrack,
  spotifyApi,
  User,
} from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<
    "discover" | "playlists" | "friends" | "community"
  >("discover");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const { isAuthenticated: spotifyConnected, user: spotifyUser } = useSpotify();
  const [recentReleases, setRecentReleases] = useState<SpotifyTrack[]>([]);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);

  // Load user playlists and recent releases
  useEffect(() => {
    loadPlaylists();
    loadRecentReleases();
  }, []);

  // Debug: Monitor recentReleases state changes
  useEffect(() => {
    console.log("recentReleases state changed:", recentReleases);
    console.log("recentReleases length:", recentReleases.length);
  }, [recentReleases]);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#playlists") {
        setActiveTab("playlists");
      } else if (hash === "#discover") {
        setActiveTab("discover");
      } else if (hash === "#friends") {
        setActiveTab("friends");
      } else if (hash === "#community") {
        setActiveTab("community");
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const loadPlaylists = async () => {
    setIsLoadingPlaylists(true);
    try {
      const userPlaylists = await playlistsApi.getMyPlaylists();
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error("Failed to load playlists:", error);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const loadRecentReleases = async () => {
    setIsLoadingReleases(true);
    try {
      console.log("Loading recent releases...");
      console.log(
        "API Base URL:",
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3669"
      );
      console.log(
        "User authentication status:",
        !!localStorage.getItem("access_token")
      );
      const releases = await spotifyApi.getRecentKPopReleases(3);
      console.log("Recent releases loaded:", releases);
      console.log("Number of releases:", releases.length);
      console.log("First release structure:", releases[0]);
      console.log("recentReleases state before set:", recentReleases);
      setRecentReleases(releases);
    } catch (error: unknown) {
      console.error("Failed to load recent releases:", error);
      const errorDetails =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: unknown; status?: number } })
              .response?.data || error.message
          : "Unknown error";
      const errorStatus =
        error instanceof Error && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      console.error("Error details:", errorDetails);
      console.error("Error status:", errorStatus);
    } finally {
      setIsLoadingReleases(false);
    }
  };

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setPlaylists([newPlaylist, ...playlists]);
    setIsCreateModalOpen(false);
  };

  const handleViewPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsDetailModalOpen(true);
  };

  const handlePlaylistUpdated = () => {
    loadPlaylists(); // Reload playlists to get updated data
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await playlistsApi.deletePlaylist(playlistId);
      setPlaylists(playlists.filter((p) => p.id !== playlistId));
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setIsProfileModalOpen(false);
  };

  const getPlaylistGradient = (index: number) => {
    const gradients = [
      "from-pink-500 to-purple-500",
      "from-purple-500 to-blue-500",
      "from-blue-500 to-cyan-500",
      "from-cyan-500 to-green-500",
      "from-green-500 to-yellow-500",
      "from-yellow-500 to-orange-500",
      "from-orange-500 to-red-500",
      "from-red-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSpotifyClick = (spotifyUrl: string) => {
    window.open(spotifyUrl, "_blank");
  };

  const trendingArtists = [
    {
      name: "NewJeans",
      followers: "2.1M",
      color: "from-blue-400 to-purple-400",
      icon: Headphones,
    },
    {
      name: "aespa",
      followers: "1.8M",
      color: "from-cyan-400 to-purple-400",
      icon: Star,
    },
    {
      name: "LE SSERAFIM",
      followers: "1.5M",
      color: "from-pink-400 to-purple-400",
      icon: Zap,
    },
    {
      name: "ITZY",
      followers: "1.3M",
      color: "from-purple-400 to-pink-400",
      icon: Mic,
    },
  ];

  const communityPosts = [
    {
      id: 1,
      user: "kpop_fan_123",
      content: "Just discovered this amazing new song by NewJeans! 🎵",
      likes: 42,
      time: "2h ago",
    },
    {
      id: 2,
      user: "music_lover",
      content: "BTS concert was absolutely incredible last night! 💜",
      likes: 89,
      time: "4h ago",
    },
    {
      id: 3,
      user: "stan_account",
      content: "Creating the perfect K-pop workout playlist 💪",
      likes: 23,
      time: "6h ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Welcome Section */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  {currentUser.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(currentUser.profileImage) || ""}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {currentUser.firstName.charAt(0)}
                        {currentUser.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {currentUser.firstName}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to discover some amazing K-pop today?
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/${currentUser.username}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-pink-500" />
                  <span>Create Playlist</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building your perfect K-pop playlist
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Playlist
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-white/5 border-purple-200 dark:border-purple-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-purple-500" />
                  <span>Discover Music</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Find new K-pop artists and songs
                </p>
                <Button
                  disabled={true}
                  variant="outline"
                  className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  <span>Connect</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the K-pop community
                </p>
                <Button
                  disabled={true}
                  variant="outline"
                  className="w-full border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Spotify Player */}
          <div className="mb-8">
            <SpotifyWebPlayer />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-white/30 dark:bg-white/5 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: "discover", label: "Discover", icon: TrendingUp },
              { id: "playlists", label: "My Playlists", icon: Music },
              { id: "friends", label: "Friends", icon: Users },
              { id: "community", label: "Community", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as "discover" | "playlists" | "friends" | "community"
                  )
                }
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/20"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "discover" && (
            <div className="space-y-8">
              {/* Trending Artists */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-pink-500" />
                  Trending Artists
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {trendingArtists.map((artist, index) => (
                    <Card
                      key={index}
                      className="group bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${artist.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <artist.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-bold text-center mb-1">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center">
                          {artist.followers} followers
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Artist showcase image */}
              </div>

              {/* Recent Releases */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-purple-500" />
                  Recent Releases
                </h2>
                {isLoadingReleases ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg font-medium text-purple-600 dark:text-purple-400">
                        Loading recent releases...
                      </span>
                    </div>
                  </div>
                ) : recentReleases.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No recent releases found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Check back later for the latest K-pop releases!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentReleases.map((track) => (
                      <Card
                        key={track.id}
                        className="group bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              {track.album.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={track.album.images[0].url}
                                  alt={track.album.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                                  <Music className="h-8 w-8 text-white" />
                                </div>
                              )}
                              <button
                                onClick={() =>
                                  handleSpotifyClick(
                                    track.external_urls.spotify
                                  )
                                }
                                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <Play className="h-6 w-6 text-white" />
                              </button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate text-lg">
                                {track.name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.artists
                                  .map((artist) => artist.name)
                                  .join(", ")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatReleaseDate(track.album.release_date)} •{" "}
                                {formatDuration(track.duration_ms)}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <button
                                  onClick={() =>
                                    handleSpotifyClick(
                                      track.external_urls.spotify
                                    )
                                  }
                                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                >
                                  Open in Spotify →
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="space-y-8">
              <FriendsList limit={8} showRecommendations={true} />
            </div>
          )}

          {activeTab === "playlists" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <Music className="h-6 w-6 mr-2 text-pink-500" />
                  My Playlists
                </h2>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>

              {isLoadingPlaylists ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium text-pink-600 dark:text-pink-400">
                      Loading playlists...
                    </span>
                  </div>
                </div>
              ) : playlists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No playlists yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first playlist and start adding your favorite
                    K-pop songs!
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Playlist
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist, index) => (
                    <Card
                      key={playlist.id}
                      className="group bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div
                          className={`w-full h-24 bg-gradient-to-r ${getPlaylistGradient(
                            index
                          )} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                        >
                          <Music className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-bold mb-2 truncate">
                          {playlist.name}
                        </h3>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {playlist.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mb-4">
                          {playlist.playlistSongs.length} song
                          {playlist.playlistSongs.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewPlaylist(playlist)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <Users className="h-6 w-6 mr-2 text-purple-500" />
                  Community Feed
                </h2>
                <Button
                  variant="outline"
                  className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>

              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {post.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link
                              href={`/${post.user}`}
                              className="font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                            >
                              @{post.user}
                            </Link>
                            <span className="text-sm text-muted-foreground">
                              •
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {post.time}
                            </span>
                          </div>
                          <p className="mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-pink-500 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-purple-500 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">Reply</span>
                            </button>
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors">
                              <Share2 className="h-4 w-4" />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />

      {/* Playlist Detail Modal */}
      <PlaylistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPlaylist(null);
        }}
        playlist={selectedPlaylist}
        onPlaylistUpdated={handlePlaylistUpdated}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
};
