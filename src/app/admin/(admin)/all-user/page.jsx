"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";

import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
} from "@/services/userService";
import { uploadImage } from "@/services/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ------------------ Zod Schema ------------------
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dob: z.string().optional(),
  aadharFront: z.string().url().optional(),
  aadharBack: z.string().url().optional(),
  panCard: z.string().url().optional(),
  profilePic: z.string().url().optional(),
  phone: z.string().optional(),
  kycStatus: z
    .enum(["not_submitted", "pending", "verified", "rejected"])
    .optional(),
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      aadharFront: "",
      aadharBack: "",
      panCard: "",
      profilePic: "",
      phone: "",
      kycStatus: "not_submitted",
    },
  });

  const watchedProfilePic = watch("profilePic");
  const watchedAadharFront = watch("aadharFront");
  const watchedAadharBack = watch("aadharBack");
  const watchedPan = watch("panCard");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openUserProfile = async (id) => {
    try {
      const { data } = await getUserById(id);
      setSelectedUser(data.user);

      // populate form
      setValue("name", data.user.name || "");
      setValue("email", data.user.email || "");
      setValue("dob", data.user.dob ? data.user.dob.split("T")[0] : "");
      setValue("profilePic", data.user.profilePic || "");
      setValue("aadharFront", data.user.aadharFront || "");
      setValue("aadharBack", data.user.aadharBack || "");
      setValue("panCard", data.user.panCard || "");
      setValue("phone", data.user.phone || "");
      setValue("kycStatus", data.user.kycStatus || "not_submitted");

      setOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user profile");
    }
  };

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
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const { data: updated } = await updateUserByAdmin(selectedUser._id, data);
      toast.success("User profile updated successfully");
      setSelectedUser(updated.user);

      // refresh list
      const updatedUsers = users.map((u) =>
        u._id === updated.user._id ? updated.user : u
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">All Users</h1>
      <div className="gap-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">KYC Status</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    {user.kycStatus.replace("_", " ")}
                  </td>
                  <td className="border p-2">
                    <Button size="sm" onClick={() => openUserProfile(user._id)}>
                      View/Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} disabled />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" {...register("dob")} />
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob.message}</p>
                )}
              </div>
              <div>
                <Label>KYC Status</Label>
                <select
                  {...register("kycStatus")}
                  className="w-full border rounded p-2"
                >
                  <option value="not_submitted">Not Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

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

            <div className="col-span-full mt-4">
              <Button
                type="submit"
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ImageUploadField = ({
  label,
  image,
  field,
  handleImageUpload,
  handleImageDelete,
}) => (
  <div>
    <Label>{label}</Label>
    <div className="flex items-center gap-4">
      {image ? (
        <div className="relative">
          <Image
            src={image}
            alt={label}
            width={120}
            height={80}
            className="rounded-md border object-cover"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
            onClick={() => handleImageDelete(field)}
          >
            ✕
          </button>
        </div>
      ) : (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], field)}
        />
      )}
    </div>
  </div>
);
