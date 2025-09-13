"use client";

import { useState } from "react";
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
} from "lucide-react";

interface DashboardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<
    "discover" | "playlists" | "community"
  >("discover");

  const recentPlaylists = [
    {
      id: 1,
      name: "My K-pop Favorites",
      songCount: 24,
      color: "from-pink-500 to-purple-500",
    },
    {
      id: 2,
      name: "BTS Essentials",
      songCount: 18,
      color: "from-purple-500 to-blue-500",
    },
    {
      id: 3,
      name: "Chill K-pop Vibes",
      songCount: 32,
      color: "from-blue-500 to-cyan-500",
    },
  ];

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
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user.firstName}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Ready to discover some amazing K-pop today?
                </p>
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
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
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

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-white/30 dark:bg-white/5 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: "discover", label: "Discover", icon: TrendingUp },
              { id: "playlists", label: "My Playlists", icon: Music },
              { id: "community", label: "Community", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <Card
                      key={item}
                      className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              New Song Title {item}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Artist Name
                            </p>
                            <p className="text-xs text-muted-foreground">
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "playlists" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <Music className="h-6 w-6 mr-2 text-pink-500" />
                  My Playlists
                </h2>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPlaylists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="group bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-full h-24 bg-gradient-to-r ${playlist.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Music className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold mb-2">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {playlist.songCount} songs
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                            <span className="font-semibold">@{post.user}</span>
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
    </div>
  );
};
