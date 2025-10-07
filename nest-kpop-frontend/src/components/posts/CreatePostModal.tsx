"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image, Video, Music, X, Upload, Loader2, Send } from "lucide-react";
import { postsApi, Post } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(
        file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
          ? "audio"
          : "unknown"
      );

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) {
      alert("Please add some content or media to your post");
      return;
    }

    setIsCreating(true);
    try {
      let mediaUrl: string | undefined;
      let finalMediaType: string | undefined;

      // Upload media if present
      if (mediaFile) {
        setIsUploading(true);
        const uploadResult = await postsApi.uploadMedia(mediaFile);
        mediaUrl = uploadResult.mediaUrl;
        finalMediaType = uploadResult.mediaType;
        setIsUploading(false);
      }

      // Create post
      const post = await postsApi.createPost({
        content: content.trim(),
        mediaUrl,
        mediaType: finalMediaType,
      });

      onPostCreated(post);
      handleClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsCreating(false);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    onClose();
  };

  const getMediaIcon = () => {
    switch (mediaType) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  console.log("CreatePostModal render - isOpen:", isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[9999] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the K-pop community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share your favorite K-pop moments, thoughts, or discoveries..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={500}
          />

          {mediaPreview && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getMediaIcon()}
                  <span className="text-sm font-medium">
                    {mediaType === "image"
                      ? "Image"
                      : mediaType === "video"
                      ? "Video"
                      : mediaType === "audio"
                      ? "Audio"
                      : "Media"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveMedia}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {mediaType === "image" && (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="max-w-full max-h-64 object-cover rounded-lg"
                />
              )}

              {mediaType === "video" && (
                <video
                  src={mediaPreview}
                  controls
                  className="max-w-full max-h-64 rounded-lg"
                />
              )}

              {mediaType === "audio" && (
                <audio src={mediaPreview} controls className="w-full" />
              )}
            </Card>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isCreating}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {content.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={isUploading || isCreating}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
