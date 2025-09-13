"use client";

import { Button } from "@/components/ui/button";
import {
  Music,
  Sparkles,
  Heart,
  Star,
  Users,
  Play,
  Mic,
  Headphones,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onOpenAuthModal: (mode: "login" | "signup") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background K-pop inspired elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl animate-pulse delay-2000" />
        </div>

        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Music className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
                <Heart className="h-5 w-5 text-pink-400 absolute -bottom-1 -left-1 animate-pulse" />
              </div>

              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                K-pop Hub
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
                Your ultimate destination for K-pop music, community, and
                discovery. Join thousands of fans and immerse yourself in the
                vibrant world of Korean pop culture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button
                onClick={() => onOpenAuthModal("signup")}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started
              </Button>
              <Button
                onClick={() => onOpenAuthModal("login")}
                variant="outline"
                size="lg"
                className="border-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Button>
            </div>

            {/* K-pop Artist Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
              {[
                {
                  name: "BTS",
                  color: "from-purple-500 to-pink-500",
                  icon: Mic,
                },
                {
                  name: "BLACKPINK",
                  color: "from-pink-500 to-black",
                  icon: Zap,
                },
                {
                  name: "NewJeans",
                  color: "from-blue-400 to-purple-400",
                  icon: Headphones,
                },
                {
                  name: "aespa",
                  color: "from-cyan-400 to-purple-400",
                  icon: Star,
                },
              ].map((artist, index) => (
                <div
                  key={artist.name}
                  className="group relative overflow-hidden rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-pink-200 dark:border-pink-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className={`h-32 bg-gradient-to-br ${artist.color} flex items-center justify-center relative`}
                  >
                    <artist.icon className="h-12 w-12 text-white opacity-80" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-center text-gray-800 dark:text-gray-200">
                      {artist.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Image Section */}
            <div className="mb-20">
              <div className="max-w-2xl mx-auto">
                <img
                  src="/kpop-hero.svg"
                  alt="K-pop Music and Community"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose K-pop Hub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the best of K-pop culture with our comprehensive
              platform designed for true fans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Discover Music
              </h3>
              <p className="text-muted-foreground text-center">
                Explore the latest K-pop hits, discover new artists, and create
                your perfect playlist with our advanced music discovery engine.
              </p>
            </div>

            <div className="group p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-purple-200 dark:border-purple-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Join Community
              </h3>
              <p className="text-muted-foreground text-center">
                Connect with fellow K-pop fans, share your favorites, and be
                part of the global community that celebrates Korean pop culture.
              </p>
            </div>

            <div className="group p-8 bg-white/50 dark:bg-white/5 rounded-2xl border border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Personalized Experience
              </h3>
              <p className="text-muted-foreground text-center">
                Get personalized recommendations and create custom playlists
                tailored to your unique taste in K-pop music.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Fans" },
              { number: "50K+", label: "Songs" },
              { number: "100+", label: "Artists" },
              { number: "24/7", label: "Community" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <Heart className="h-16 w-16 text-pink-500 mx-auto" />
              <Star className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
              <Sparkles className="h-4 w-4 text-purple-500 absolute -bottom-1 -left-1" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Ready to Join the K-pop Revolution?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your journey today and become part of the most vibrant K-pop
              community in the world.
            </p>
          </div>

          <Button
            onClick={() => onOpenAuthModal("signup")}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            Join K-pop Hub Now
          </Button>
        </div>
      </section>
    </div>
  );
};
