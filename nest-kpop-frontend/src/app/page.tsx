"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Sparkles, Heart, Star, Users, Play } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-pink-600 dark:text-pink-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music className="h-8 w-8 text-pink-500" />
              <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              K-pop Hub
            </h1>
          </div>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex space-x-3">
              <Button
                onClick={() => openAuthModal("login")}
                variant="outline"
                className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
              >
                Sign In
              </Button>
              <Button
                onClick={() => openAuthModal("signup")}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {isAuthenticated ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <div className="relative inline-block mb-6">
                  <Heart className="h-16 w-16 text-pink-500 mx-auto" />
                  <Star className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
                  <Sparkles className="h-4 w-4 text-purple-500 absolute -bottom-1 -left-1" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome to K-pop Hub!
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  You're now part of the amazing K-pop community. Discover your
                  favorite artists, create playlists, and connect with fellow
                  fans around the world.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm">
                  <Play className="h-8 w-8 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Discover Music</h3>
                  <p className="text-muted-foreground">
                    Explore the latest K-pop hits and discover new favorites.
                  </p>
                </div>

                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-xl border border-purple-200 dark:border-purple-800 backdrop-blur-sm">
                  <Users className="h-8 w-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <p className="text-muted-foreground">
                    Join the community and share your love for K-pop.
                  </p>
                </div>

                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm">
                  <Star className="h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Create Playlists
                  </h3>
                  <p className="text-muted-foreground">
                    Build your perfect K-pop playlist collection.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-12">
                <div className="relative inline-block mb-8">
                  <Music className="h-20 w-20 text-pink-500 mx-auto" />
                  <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2" />
                  <Heart className="h-5 w-5 text-pink-400 absolute -bottom-1 -left-1" />
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Welcome to K-pop Hub
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Your ultimate destination for K-pop music, community, and
                  discovery. Join thousands of fans and immerse yourself in the
                  vibrant world of Korean pop culture.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  onClick={() => openAuthModal("signup")}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg px-8 py-3"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => openAuthModal("login")}
                  variant="outline"
                  size="lg"
                  className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 text-lg px-8 py-3"
                >
                  Sign In
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Discover Music
                  </h3>
                  <p className="text-muted-foreground">
                    Explore the latest K-pop hits, discover new artists, and
                    create your perfect playlist.
                  </p>
                </div>

                <div className="p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-purple-200 dark:border-purple-800 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Join Community
                  </h3>
                  <p className="text-muted-foreground">
                    Connect with fellow K-pop fans, share your favorites, and be
                    part of the global community.
                  </p>
                </div>

                <div className="p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Personalized Experience
                  </h3>
                  <p className="text-muted-foreground">
                    Get personalized recommendations and create custom playlists
                    tailored to your taste.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
