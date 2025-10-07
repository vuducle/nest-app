"use client";

import { useState, useEffect, useCallback } from "react";
import { Post, postsApi } from "@/lib/api";

interface PostsCache {
  [key: string]: {
    posts: Post[];
    lastFetch: number;
    hasMore: boolean;
    page: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePostsCache = () => {
  const [cache, setCache] = useState<PostsCache>({});

  const getCacheKey = (userId?: string, page: number = 1) => {
    return userId ? `user-${userId}-${page}` : `feed-${page}`;
  };

  const isCacheValid = (cacheKey: string) => {
    const cached = cache[cacheKey];
    if (!cached) return false;

    const now = Date.now();
    return now - cached.lastFetch < CACHE_DURATION;
  };

  const getCachedPosts = (userId?: string, page: number = 1) => {
    const cacheKey = getCacheKey(userId, page);
    const cached = cache[cacheKey];

    if (cached && isCacheValid(cacheKey)) {
      return {
        posts: cached.posts,
        hasMore: cached.hasMore,
        page: cached.page,
        fromCache: true,
      };
    }

    return null;
  };

  const setCachedPosts = (
    userId: string | undefined,
    page: number,
    posts: Post[],
    hasMore: boolean,
    isAppend: boolean = false
  ) => {
    const cacheKey = getCacheKey(userId, page);
    const now = Date.now();

    setCache((prev) => ({
      ...prev,
      [cacheKey]: {
        posts: isAppend ? [...(prev[cacheKey]?.posts || []), ...posts] : posts,
        lastFetch: now,
        hasMore,
        page,
      },
    }));
  };

  const invalidateCache = (userId?: string) => {
    setCache((prev) => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach((key) => {
        if (userId && key.startsWith(`user-${userId}`)) {
          delete newCache[key];
        } else if (!userId && key.startsWith("feed-")) {
          delete newCache[key];
        }
      });
      return newCache;
    });
  };

  const updatePostInCache = (postId: string, updates: Partial<Post>) => {
    setCache((prev) => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach((key) => {
        const cached = newCache[key];
        if (cached) {
          const updatedPosts = cached.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          );
          newCache[key] = {
            ...cached,
            posts: updatedPosts,
          };
        }
      });
      return newCache;
    });
  };

  const addPostToCache = (post: Post, userId?: string) => {
    setCache((prev) => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach((key) => {
        const cached = newCache[key];
        if (
          cached &&
          (!userId ||
            key.startsWith(`user-${userId}`) ||
            key.startsWith("feed-"))
        ) {
          newCache[key] = {
            ...cached,
            posts: [post, ...cached.posts],
          };
        }
      });
      return newCache;
    });
  };

  return {
    getCachedPosts,
    setCachedPosts,
    invalidateCache,
    updatePostInCache,
    addPostToCache,
    isCacheValid,
  };
};
