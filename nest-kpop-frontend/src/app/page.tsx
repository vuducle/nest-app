"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Sparkles } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-pink-200 dark:border-pink-800">
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
      <main className="pt-20">
        {isAuthenticated && user ? (
          <Dashboard user={user} />
        ) : (
          <LandingPage onOpenAuthModal={openAuthModal} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
