"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Camera, Upload, X, Save, AlertCircle } from "lucide-react";
import { profileApi, User as UserType, UpdateProfileRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/utils";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (user: UserType) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setUser(currentUser);
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        username: currentUser.username,
        phoneNumber: currentUser.phoneNumber || "",
      });
      setPreviewImage(currentUser.profileImage || null);
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const updatedUser = await profileApi.uploadProfileImage(file);
      setUser(updatedUser);
      setPreviewImage(updatedUser.profileImage || null);
      setSuccess("Profile image updated successfully!");

      // Update the auth context
      updateUser(updatedUser);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to upload image";
      setError(errorMessage || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: UpdateProfileRequest = {};

      // Only include changed fields
      if (formData.firstName !== user?.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName !== user?.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }
      if (formData.phoneNumber !== (user?.phoneNumber || "")) {
        updateData.phoneNumber = formData.phoneNumber || undefined;
      }

      const updatedUser = await profileApi.updateProfile(updateData);
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");

      // Update the auth context
      updateUser(updatedUser);

      onProfileUpdated(updatedUser);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update profile";
      setError(errorMessage || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setPreviewImage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Edit Profile</span>
          </DialogTitle>
          <DialogDescription>
            Update your profile information and upload a profile image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(previewImage) || ""}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center border-4 border-pink-200">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}

                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2 cursor-pointer transition-colors"
                    title="Upload new image"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Profile Image</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a profile image. Max size: 5MB. Supported formats:
                    JPEG, PNG, GIF.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click the camera icon to upload
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
              {user && user.usernameChangeCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Username changes: {user.usernameChangeCount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                <Save className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  {success}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading || isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
