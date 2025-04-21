"use client";

import Image from "next/image";
import { useEffect, useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  getUser,
  getUserDetailsByEmail,
  getUserRole,
} from "../../../../../server/user";
import { TUserType, userType } from "@/types/userType";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserInfo, uploadToCloudinary } from "../../_actions/userActions";
import { authClient } from "../../../../../lib/auth-client";
import { Loader2 } from "lucide-react";
import { formatRole } from "@/lib/formatRole";
import { Input } from "@/components/ui/input";
import ImageCover from "./Image";

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [formMessage, setFormMessage] = useState({ text: "", type: "" });
  const [isPending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TUserType>({
    resolver: zodResolver(userType),
  });

  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const passwordFieldsEmpty = !oldPassword && !newPassword && !confirmPassword;

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      const [userDetails] = await Promise.all([
        getUserRole(fetchedUser?.email ?? ""),
      ]);
      setUser(fetchedUser);
      setRole(formatRole(userDetails?.role ?? ""));

      // Set initial form values
      if (fetchedUser) {
        setValue("name", fetchedUser.name);
        setValue("email", fetchedUser.email);
      }
    };
    fetchUser();
  }, [setValue]);

  const handleEditToggle = () => {
    if (isEditing) {
      if (user) {
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("role", role || "");
        setValue("oldPassword", "");
        setValue("newPassword", "");
        setValue("confirmPassword", "");
      }
      // Reset image preview when canceling edit
      setImagePreview(null);
      setImageFile(null);
    }
    setIsEditing(!isEditing);
    setFormMessage({ text: "", type: "" });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const submitForm = async (data: any) => {
    const dataToSubmit: {
      name: string;
      email: string;
      role: string | undefined;
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
      image?: string;
    } = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (!passwordFieldsEmpty) {
      dataToSubmit.oldPassword = data.oldPassword;
      dataToSubmit.newPassword = data.newPassword;
      dataToSubmit.confirmPassword = data.confirmPassword;
    }

    let imageUrl = user?.image;
    if (imageFile) {
      try {
        imageUrl = await uploadToCloudinary(imageFile);
        dataToSubmit.image = imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        setFormMessage({
          text: "Failed to upload image. Please try again.",
          type: "error",
        });
        return;
      }
    }

    if (user) {
      if (!passwordFieldsEmpty) {
        if (dataToSubmit.newPassword !== dataToSubmit.confirmPassword) {
          setFormMessage({
            text: "New password and confirm password do not match.",
            type: "error",
          });
          return;
        }

        const { error } = await authClient.changePassword({
          currentPassword: dataToSubmit.oldPassword!,
          newPassword: dataToSubmit.newPassword!,
        });

        if (error) {
          setFormMessage({
            text: "Failed to change password: " + error.message,
            type: "error",
          });
          return;
        }
      }

      startTransition(async () => {
        try {
          // Update user info including image if it was changed
          const success = await updateUserInfo(
            user.id,
            data.email,
            data.name,
            imageUrl,
          );

          if (!success) {
            setFormMessage({
              text: "Failed to update information in the database.",
              type: "error",
            });
          } else {
            // Update local state
            setUser({
              ...user,
              name: data.name,
              email: data.email,
              image: imageUrl,
            });

            setFormMessage({
              text: "Information updated successfully!",
              type: "success",
            });

            // Clean up any object URLs to prevent memory leaks
            if (imagePreview && imagePreview.startsWith("blob:")) {
              URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(null);
            setImageFile(null);
          }
        } catch (error) {
          console.error("Error in form submission:", error);
          setFormMessage({
            text: "An unexpected error occurred. Please try again.",
            type: "error",
          });
        }
      });
    }

    setIsEditing(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full flex-col gap-8">
      <div className="flex w-full flex-col items-center justify-center gap-2 lg:items-start">
        <p className="mb-10 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
        <div className="relative mb-6">
          {user?.image ? (
            <ImageCover
              publicId={imagePreview || user?.image || "/user.png"}
              className="h-[150px] w-[150px] rounded-full border-2 border-gray-300"
            />
          ) : (
            <Image
              src="/user.png"
              alt="User Profile"
              height={150}
              width={150}
              className="rounded-full border-2 border-gray-300 object-cover"
            />
          )}

          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          )}
        </div>

        {formMessage.text && (
          <div
            className={`mb-4 w-full rounded-md p-3 sm:w-[500px] ${
              formMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <div className="mt-2 w-full sm:w-[500px]">
          {isEditing ? (
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex w-full flex-col space-y-4"
            >
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label
                  htmlFor="picture"
                  className="mb-1 block text-sm font-medium"
                >
                  Profile Picture
                </label>
                <input
                  id="picture"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-colors hover:border-blue-500"
                >
                  {imagePreview ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Image selected</p>
                      <p className="text-xs text-blue-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Click to select an image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
                {errors.name && (
                  <span className="text-sm text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium"
                >
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  {...register("role")}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 focus:outline-none focus:ring focus:ring-blue-500 dark:bg-[#121212]"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="mb-3 text-lg font-medium">Change Password</h2>
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="mb-1 block text-sm font-medium"
                    >
                      Current Password
                    </label>
                    <input
                      id="oldPassword"
                      type="password"
                      {...register("oldPassword")}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.oldPassword && (
                      <span className="text-sm text-red-500">
                        {errors.oldPassword.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-1 block text-sm font-medium"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.newPassword && (
                      <span className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1 block text-sm font-medium"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.confirmPassword && (
                      <span className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
                >
                  {isPending ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleEditToggle}
                  className="flex-1 rounded-md bg-gray-500 py-2 text-white transition duration-200 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Full Name
                  </label>
                  <div className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 dark:bg-[#121212]">
                    {user?.name || "Loading..."}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <div className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 dark:bg-[#121212]">
                    {user?.email || "Loading..."}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Role</label>
                  <div className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 dark:bg-[#121212]">
                    {role || "Loading..."}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEditToggle}
                disabled={isPending || !user || !role}
                className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
