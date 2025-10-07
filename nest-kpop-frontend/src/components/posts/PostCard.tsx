"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Post, postsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: (postId: string, liked: boolean) => void;
  onComment?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const result = await postsApi.likePost(post.id);
      // Update with actual result
      setIsLiked(result.liked);
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
      onLike?.(post.id, result.liked);
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    const mediaUrl = getImageUrl(post.mediaUrl);

    switch (post.mediaType) {
      case "image":
        return (
          <img
            src={mediaUrl}
            alt="Post media"
            className="w-full max-h-96 object-cover rounded-lg"
          />
        );

      case "video":
        return (
          <div className="relative w-full">
            <video
              src={mediaUrl}
              controls
              className="w-full max-h-96 rounded-lg"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
          </div>
        );

      case "audio":
        return (
          <div className="w-full p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg">
            <audio
              src={mediaUrl}
              controls
              className="w-full"
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {post.user.profileImage ? (
              <img
                src={getImageUrl(post.user.profileImage)}
                alt={`${post.user.firstName} ${post.user.lastName}`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-pink-200"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">
                  {post.user.firstName.charAt(0)}
                  {post.user.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/${post.user.username}`}
                  className="font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                >
                  {post.user.firstName} {post.user.lastName}
                </Link>
                <span className="text-muted-foreground text-sm">•</span>
                <Link
                  href={`/${post.user.username}`}
                  className="text-muted-foreground text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  @{post.user.username}
                </Link>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Text */}
            <p className="text-sm sm:text-base mb-4 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Media */}
            {renderMedia()}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-pink-100 dark:border-pink-800">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center space-x-1 ${
                    isLiked
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-muted-foreground hover:text-pink-500"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm">{likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComment}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-purple-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post._count.comments}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
