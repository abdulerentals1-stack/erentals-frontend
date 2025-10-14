"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";

import { getUserProfile, updateUserProfile } from "@/services/userService";
import { uploadImage } from "@/services/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ------------------ Zod Schema ------------------
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dob: z.string().optional(),
  aadharFront: z.string().url().optional(),
  aadharBack: z.string().url().optional(),
  panCard: z.string().url().optional(),
  profilePic: z.string().url().optional(),
});

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      aadharFront: "",
      aadharBack: "",
      panCard: "",
      profilePic: "",
    },
  });

  const watchedProfilePic = watch("profilePic");
  const watchedAadharFront = watch("aadharFront");
  const watchedAadharBack = watch("aadharBack");
  const watchedPan = watch("panCard");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data.user);
        setValue("name", data.user?.name || "");
        setValue("email", data.user?.email || "");
        setValue("dob", data.user?.dob ? data.user.dob.split("T")[0] : "");
        setValue("profilePic", data.user?.profilePic || "");
        setValue("aadharFront", data.user?.aadharFront || "");
        setValue("aadharBack", data.user?.aadharBack || "");
        setValue("panCard", data.user?.panCard || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const handleImageUpload = async (file, field) => {
    try {
      const res = await uploadImage(file);
      setValue(field, res.imageUrl, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleImageDelete = (field) => {
    setValue(field, "");
    toast.success("Image removed");
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      const { data: updated } = await updateUserProfile(data);
      setUser(updated.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register("name")} placeholder="Enter your name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input {...register("email")} placeholder="Enter your email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={user?.phone || ""} disabled />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input type="date" {...register("dob")} />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <ImageUploadField
            label="Profile Picture"
            image={watchedProfilePic}
            field="profilePic"
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />

          <ImageUploadField
            label="Aadhaar Front"
            image={watchedAadharFront}
            field="aadharFront"
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />

          <ImageUploadField
            label="Aadhaar Back"
            image={watchedAadharBack}
            field="aadharBack"
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />

          <ImageUploadField
            label="PAN Card"
            image={watchedPan}
            field="panCard"
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-full mt-4">
          <Button type="submit" disabled={updating} className="bg-blue-600 hover:bg-blue-700 w-full">
            {updating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

const ImageUploadField = ({ label, image, field, handleImageUpload, handleImageDelete }) => (
  <div>
    <Label>{label}</Label>
    <div className="flex items-center gap-4">
      {image ? (
        <div className="relative">
          <Image src={image} alt={label} width={120} height={80} className="rounded-md border object-cover" />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
            onClick={() => handleImageDelete(field)}
          >
            ✕
          </button>
        </div>
      ) : (
        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], field)} />
      )}
    </div>
  </div>
);
