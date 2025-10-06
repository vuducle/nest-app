"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, UserPlus, Users, Heart, Music, Calendar } from "lucide-react";
import { friendsApi, FriendUser } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

interface FriendsListProps {
  limit?: number;
  showRecommendations?: boolean;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  limit = 8,
  showRecommendations = true,
}) => {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [recommendations, setRecommendations] = useState<FriendUser[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(true);
  const [addingFriend, setAddingFriend] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
    if (showRecommendations) {
      loadRecommendations();
    }
  }, []);

  const loadFriends = async () => {
    setIsLoadingFriends(true);
    try {
      console.log("Loading friends...");
      const friendsList = await friendsApi.getFriends();
      console.log("Friends loaded:", friendsList);
      setFriends(friendsList.slice(0, limit));
    } catch (error) {
      console.error("Failed to load friends:", error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const loadRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const recs = await friendsApi.getFriendRecommendations(6);
      setRecommendations(recs);
    } catch (error) {
      console.error("Failed to load friend recommendations:", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    setAddingFriend(friendId);
    try {
      await friendsApi.addFriend(friendId);
      // Remove from recommendations and refresh friends list
      setRecommendations((prev) => prev.filter((rec) => rec.id !== friendId));
      // Refresh the friends list to show the newly added friend
      await loadFriends();
    } catch (error) {
      console.error("Failed to add friend:", error);
    } finally {
      setAddingFriend(null);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Friends List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-pink-500" />
            My Friends
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFriends}
              disabled={isLoadingFriends}
            >
              Refresh
            </Button>
            {friends.length > limit && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>
        </div>

        {isLoadingFriends ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading friends...
              </span>
            </div>
          </div>
        ) : friends.length === 0 ? (
          <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">No friends yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your K-pop community by adding friends!
              </p>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Find Friends
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <Link key={friend.id} href={`/${friend.username}`}>
                <Card className="group bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      {friend.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageUrl(friend.profileImage) || ""}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 mb-2"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center border-2 border-pink-200 mb-2">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <h4 className="font-semibold text-sm truncate w-full">
                        {friend.firstName} {friend.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate w-full">
                        @{friend.username}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Heart className="h-3 w-3 text-pink-500" />
                        <span className="text-xs text-muted-foreground">
                          {friend._count?.playlists || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Friend Recommendations */}
      {showRecommendations && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-purple-500" />
              Suggested Friends
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadRecommendations}
              disabled={isLoadingRecommendations}
            >
              Refresh
            </Button>
          </div>

          {isLoadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Finding friends...
                </span>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            <Card className="bg-white/50 dark:bg-white/5 border-purple-200 dark:border-purple-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">No suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  All available users are already your friends!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((user) => (
                <Card
                  key={user.id}
                  className="group bg-white/50 dark:bg-white/5 border-purple-200 dark:border-purple-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {user.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageUrl(user.profileImage) || ""}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-200">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/${user.username}`} className="block">
                          <h4 className="font-semibold text-sm truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </p>
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Music className="h-3 w-3" />
                        <span>{user._count?.playlists || 0} playlists</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatJoinDate(user.createdAt)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAddFriend(user.id)}
                      disabled={addingFriend === user.id}
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {addingFriend === user.id ? "Adding..." : "Add Friend"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
