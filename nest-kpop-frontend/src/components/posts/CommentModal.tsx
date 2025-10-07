"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { Comment, postsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded?: (comment: Comment) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postId,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadComments = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await postsApi.getComments(postId, pageNum, 20);
      const newComments = response.comments || [];

      if (reset) {
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, ...newComments]);
      }

      setHasMore(newComments.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComments(1, true);
    }
  }, [isOpen, postId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await postsApi.createComment(postId, newComment.trim());
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      onCommentAdded?.(comment);
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadComments(page + 1, false);
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-purple-500" />
            Comments
          </DialogTitle>
          <DialogDescription>Join the conversation</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* New Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {newComment.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {isLoading && comments.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
                  <span className="text-lg font-medium text-pink-600 dark:text-pink-400">
                    Loading comments...
                  </span>
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                <p className="text-muted-foreground">
                  Be the first to comment on this post!
                </p>
              </div>
            ) : (
              <>
                {comments.map((comment) => (
                  <Card
                    key={comment.id}
                    className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {comment.user.profileImage ? (
                            <img
                              src={getImageUrl(comment.user.profileImage || "")}
                              alt={`${comment.user.firstName} ${comment.user.lastName}`}
                              className="w-8 h-8 rounded-full object-cover border-2 border-pink-200"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {comment.user.firstName.charAt(0)}
                                {comment.user.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Link
                              href={`/${comment.user.username}`}
                              className="font-semibold text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                            >
                              {comment.user.firstName} {comment.user.lastName}
                            </Link>
                            <span className="text-muted-foreground text-sm">
                              •
                            </span>
                            <Link
                              href={`/${comment.user.username}`}
                              className="text-muted-foreground text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                            >
                              @{comment.user.username}
                            </Link>
                            <span className="text-muted-foreground text-sm">
                              •
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      variant="outline"
                      className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Comments"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
