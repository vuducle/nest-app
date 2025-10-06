"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Music,
  Calendar,
  Edit,
  Heart,
  Play,
  Mail,
  Phone,
  ArrowLeft,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  profileApi,
  User as UserType,
  Playlist,
  playlistsApi,
  friendsApi,
} from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import Link from "next/link";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [friendStatus, setFriendStatus] = useState<{
    isFriend: boolean;
    canAddFriend: boolean;
  } | null>(null);
  const [isLoadingFriendStatus, setIsLoadingFriendStatus] = useState(false);

  const isOwnProfile = isAuthenticated && currentUser?.username === username;
  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOwnProfile && currentUser) {
        // Use current user data for own profile
        setProfileUser(currentUser);
      } else {
        // Fetch user profile by username
        const user = await profileApi.getProfileByUsername(username);
        setProfileUser(user);
      }
    } catch (error: unknown) {
      console.error("Failed to load user profile:", error);
      setError("User not found");
    } finally {
      setIsLoading(false);
    }
  }, [isOwnProfile, currentUser, username]);

  const loadUserPlaylists = useCallback(async () => {
    if (isOwnProfile) {
      // For own profile, load user's playlists
      setIsLoadingPlaylists(true);
      try {
        const playlists = await playlistsApi.getMyPlaylists();
        setUserPlaylists(playlists);
      } catch (error) {
        console.error("Failed to load playlists:", error);
      } finally {
        setIsLoadingPlaylists(false);
      }
    } else {
      // For other users, load public playlists only
      setIsLoadingPlaylists(true);
      try {
        const allPlaylists = await playlistsApi.getAllPlaylists();
        const publicPlaylists = allPlaylists.filter(
          (playlist) => playlist.isPublic && playlist.user.username === username
        );
        setUserPlaylists(publicPlaylists);
      } catch (error) {
        console.error("Failed to load public playlists:", error);
      } finally {
        setIsLoadingPlaylists(false);
      }
    }
  }, [isOwnProfile, username]);

  const loadFriendStatus = useCallback(
    async (userId: string) => {
      if (!isAuthenticated || isOwnProfile) return;

      setIsLoadingFriendStatus(true);
      try {
        const status = await friendsApi.getFriendStatus(userId);
        setFriendStatus(status);
      } catch (error) {
        console.error("Failed to load friend status:", error);
      } finally {
        setIsLoadingFriendStatus(false);
      }
    },
    [isAuthenticated, isOwnProfile]
  );

  useEffect(() => {
    if (username) {
      loadUserProfile();
      loadUserPlaylists();
    }
  }, [username, loadUserProfile, loadUserPlaylists]);

  // Separate useEffect for friend status to avoid circular dependency
  useEffect(() => {
    if (!isOwnProfile && isAuthenticated && profileUser) {
      loadFriendStatus(profileUser.id);
    }
  }, [profileUser?.id, isOwnProfile, isAuthenticated, loadFriendStatus]);

  const handleAddFriend = async () => {
    if (!profileUser) return;

    setIsLoadingFriendStatus(true);
    try {
      await friendsApi.addFriend(profileUser.id);
      setFriendStatus({ isFriend: true, canAddFriend: false });
    } catch (error) {
      console.error("Failed to add friend:", error);
    } finally {
      setIsLoadingFriendStatus(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!profileUser) return;

    setIsLoadingFriendStatus(true);
    try {
      await friendsApi.removeFriend(profileUser.id);
      setFriendStatus({ isFriend: false, canAddFriend: true });
    } catch (error) {
      console.error("Failed to remove friend:", error);
    } finally {
      setIsLoadingFriendStatus(false);
    }
  };

  const handleProfileUpdated = (updatedUser: UserType) => {
    setProfileUser(updatedUser);
    setIsProfileModalOpen(false);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-pink-600 dark:text-pink-400">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20 flex items-center justify-center">
        <div className="text-center">
          <UserX className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user &quot;{username}&quot; could not be found.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="outline"
                className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Image */}
                <div className="relative">
                  {profileUser.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(profileUser.profileImage) || ""}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-pink-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center border-4 border-pink-200">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  {isOwnProfile && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <UserCheck className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {profileUser.firstName} {profileUser.lastName}
                      </h1>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xl text-muted-foreground">
                          @{profileUser.username}
                        </p>
                        {friendStatus?.isFriend && (
                          <div className="flex items-center space-x-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                            <Heart className="h-3 w-3" />
                            <span>Friends</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Joined {formatJoinDate(profileUser.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Music className="h-4 w-4" />
                          <span>
                            {userPlaylists.length} playlist
                            {userPlaylists.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {isOwnProfile ? (
                        <Button
                          onClick={() => setIsProfileModalOpen(true)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        isAuthenticated &&
                        friendStatus && (
                          <div className="flex space-x-2">
                            {friendStatus.isFriend ? (
                              <Button
                                onClick={handleRemoveFriend}
                                disabled={isLoadingFriendStatus}
                                variant="outline"
                                className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                {isLoadingFriendStatus
                                  ? "Removing..."
                                  : "Remove Friend"}
                              </Button>
                            ) : friendStatus.canAddFriend ? (
                              <Button
                                onClick={handleAddFriend}
                                disabled={isLoadingFriendStatus}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                {isLoadingFriendStatus
                                  ? "Adding..."
                                  : "Add Friend"}
                              </Button>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  {(profileUser.email || profileUser.phoneNumber) && (
                    <div className="space-y-2">
                      {profileUser.email && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{profileUser.email}</span>
                        </div>
                      )}
                      {profileUser.phoneNumber && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{profileUser.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playlists Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Music className="h-6 w-6 mr-2 text-pink-500" />
                {isOwnProfile ? "My Playlists" : "Public Playlists"}
              </h2>
              {isOwnProfile && (
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Manage Playlists
                  </Button>
                </Link>
              )}
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
            ) : userPlaylists.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isOwnProfile ? "No playlists yet" : "No public playlists"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile
                    ? "Create your first playlist and start adding your favorite K-pop songs!"
                    : "This user hasn&apos;t shared any public playlists yet."}
                </p>
                {isOwnProfile && (
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                      <Music className="h-4 w-4 mr-2" />
                      Create Your First Playlist
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPlaylists.map((playlist, index) => (
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
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>
                          {playlist.playlistSongs.length} song
                          {playlist.playlistSongs.length !== 1 ? "s" : ""}
                        </span>
                        {!isOwnProfile && (
                          <span>by @{playlist.user.username}</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // TODO: Implement playlist view functionality
                          console.log("View playlist:", playlist.id);
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        View Playlist
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isOwnProfile && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
