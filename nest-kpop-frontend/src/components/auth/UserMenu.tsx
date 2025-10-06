"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/utils";
import {
  User,
  LogOut,
  Music,
  Sparkles,
  Settings,
  Heart,
  HelpCircle,
  Bell,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors">
        <div className="relative">
          {user.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl(user.profileImage) || ""}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
          )}
          <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-white dark:bg-gray-900 border-pink-200 dark:border-pink-800 shadow-xl">
        {/* User Info Header */}
        <div className="p-4 border-b border-pink-100 dark:border-pink-800">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(user.profileImage) || ""}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </span>
                </div>
              )}
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                @{user.username}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3 text-sm text-pink-600 dark:text-pink-400">
            <Music className="h-4 w-4" />
            <span>K-pop Enthusiast</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20">
            <UserCircle className="h-5 w-5 text-pink-500" />
            <span>View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              // This will be handled by the parent component
              window.location.hash = "#playlists";
            }}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            <Heart className="h-5 w-5 text-pink-500" />
            <span>My Playlists</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={true}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            <Bell className="h-5 w-5 text-purple-500" />
            <span>Notifications</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            disabled={true}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            <Settings className="h-5 w-5 text-gray-500" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={true}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            <HelpCircle className="h-5 w-5 text-gray-500" />
            <span>Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onSelect={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </>
            )}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
