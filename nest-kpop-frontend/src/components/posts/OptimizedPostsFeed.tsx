"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { CommentModal } from "./CommentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, MessageCircle } from "lucide-react";
import { Post, postsApi } from "@/lib/api";
import { usePostsCache } from "@/hooks/usePostsCache";

interface OptimizedPostsFeedProps {
  userId?: string;
  showCreateButton?: boolean;
  limit?: number;
  useVirtualization?: boolean;
}

export const OptimizedPostsFeed: React.FC<OptimizedPostsFeedProps> = ({
  userId,
  showCreateButton = true,
  limit = 20,
  useVirtualization = false,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {
    getCachedPosts,
    setCachedPosts,
    invalidateCache,
    updatePostInCache,
    addPostToCache,
  } = usePostsCache();

  const loadPosts = useCallback(
    async (pageNum: number = 1, reset: boolean = false) => {
      try {
        // Check cache first
        const cached = getCachedPosts(userId, pageNum);
        if (cached && !reset) {
          setPosts(cached.posts);
          setHasMore(cached.hasMore);
          setPage(cached.page);
          setIsLoading(false);
          return;
        }

        if (reset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = userId
          ? await postsApi.getUserPosts(userId, pageNum, limit)
          : await postsApi.getPosts(pageNum, limit);

        const newPosts = response.posts || [];

        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(newPosts.length === limit);
        setPage(pageNum);

        // Cache the results
        setCachedPosts(
          userId,
          pageNum,
          newPosts,
          newPosts.length === limit,
          !reset
        );
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [userId, limit]
  );

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  const handlePostCreated = useCallback(
    (newPost: Post) => {
      setPosts((prev) => [newPost, ...prev]);
      addPostToCache(newPost, userId);
      setIsCreating(false);
    },
    [addPostToCache, userId]
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadPosts(page + 1, false);
    }
  }, [isLoadingMore, hasMore, loadPosts, page]);

  const handleComment = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
  }, []);

  const handleCommentAdded = useCallback(
    (comment: any) => {
      const updatedPost = {
        _count: {
          comments: 1,
          likes: 0,
        },
      };

      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPostId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  comments: post._count.comments + 1,
                },
              }
            : post
        )
      );

      // Update cache
      if (selectedPostId) {
        updatePostInCache(selectedPostId, {
          _count: {
            comments: 1,
            likes: 0,
          },
        });
      }
    },
    [selectedPostId, updatePostInCache]
  );

  const handleLike = useCallback(
    (postId: string, liked: boolean) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likes: liked ? post._count.likes + 1 : post._count.likes - 1,
                },
              }
            : post
        )
      );

      // Update cache
      updatePostInCache(postId, {
        _count: {
          likes: liked ? 1 : -1,
          comments: 0,
        },
      });
    },
    [updatePostInCache]
  );

  // Memoized post items for better performance
  const postItems = useMemo(
    () =>
      posts.map((post) => (
        <div key={post.id} className="mb-6">
          <PostCard post={post} onLike={handleLike} onComment={handleComment} />
        </div>
      )),
    [posts, handleLike, handleComment]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="text-lg font-medium text-pink-600 dark:text-pink-400">
            Loading posts...
          </span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-6">
          {userId
            ? "This user hasn't posted anything yet."
            : "Be the first to share something with the community!"}
        </p>
        {showCreateButton && !userId && (
          <Button
            onClick={() => alert("Post creation coming soon! 🚀")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCreateButton && !userId && (
        <Card className="bg-white/50 dark:bg-white/5 border-pink-200 dark:border-pink-800 backdrop-blur-sm">
          <CardContent className="p-4">
            <Button
              onClick={() => {
                console.log("Create post button clicked");
                setIsCreating(true);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-6">{postItems}</div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => {
          setCommentModalOpen(false);
          setSelectedPostId(null);
        }}
        postId={selectedPostId || ""}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};
