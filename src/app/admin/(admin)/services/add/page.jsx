'use client';

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

import RichTextEditor from "@/lib/RichTextEditor";

import {
  createService,
  updateService,
  getServiceById,
} from "@/services/serviceService";

import { uploadImage } from "@/services/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorName: z.string().min(1, "Author name is required"),
  content: z.string().min(1, "Content is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  isActive: z.boolean().optional(),
});

export default function AddServiceForm() {
  const [coverImage, setCoverImage] = useState([]);
  const [images, setImages] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const router = useRouter();
  const params = useParams();
  const serviceIdFromParams = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authorName: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isActive: true,
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        coverImage: coverImage[0] || null,
        images: images,
        metaKeywords: values.metaKeywords
          ? values.metaKeywords.split(",").map((s) => s.trim())
          : [],
      };

      if (serviceIdFromParams) {
        await updateService(serviceId, payload);
        toast.success("Service updated successfully");
      } else {
        await createService(payload);
        toast.success("Service created successfully");
      }

      router.push("/admin/services");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Something went wrong.";
      toast.error(message);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceIdFromParams) return;

      try {
        const res = await getServiceById(serviceIdFromParams);
        const serviceItem = res.data.service;
        setServiceId(serviceItem._id);
        setCoverImage(serviceItem.coverImage?.url ? [serviceItem.coverImage] : []);
        setImages(serviceItem.images || []);

        reset({
          title: serviceItem.title || "",
          authorName: serviceItem.authorName || "",
          content: serviceItem.content || "",
          metaTitle: serviceItem.metaTitle || "",
          metaDescription: serviceItem.metaDescription || "",
          metaKeywords: serviceItem.metaKeywords?.join(", ") || "",
          isActive: !!serviceItem.isActive,
        });
      } catch (err) {
        toast.error("Failed to fetch service data.");
      }
    };

    fetchService();
  }, [serviceIdFromParams, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 py-20 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-5xl mx-auto"
    >
      {/* 🧾 Basic Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label>Service Title</Label>
          <Input {...register("title")} placeholder="Enter service title" />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label>Author Name</Label>
          <Input {...register("authorName")} placeholder="Enter author name" />
          {errors.authorName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.authorName.message}
            </p>
          )}
        </div>
      </div>

      {/* 🖼️ Cover Image */}
      <div>
        <Label>Cover Image (Main Service Banner)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
              const uploaded = await uploadImage(file);
              setCoverImage([{ url: uploaded.imageUrl, public_id: uploaded.public_id }]);
            } catch (err) {
              toast.error("Failed to upload image");
            }
          }}
        />
        {coverImage[0]?.url && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current Image Preview:</p>
            <img
              src={coverImage[0].url}
              alt="Cover Image"
              className="h-32 rounded-md border mt-1"
            />
          </div>
        )}
      </div>

      {/* 📸 Multiple Portfolio Slider Images */}
      <div className="border p-4 rounded-lg bg-gray-50/50 dark:bg-zinc-800/30">
        <Label className="font-bold text-[#003459] dark:text-blue-400">Multiple Portfolio Slider Images (In addition to Cover Image)</Label>
        <p className="text-xs text-gray-500 mb-2">Upload multiple pictures to represent your work in a dynamic carousel slider on the front-end page.</p>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const toastId = toast.loading("Uploading showcase images...");
            const uploadedList = [];

            for (const file of files) {
              try {
                const uploaded = await uploadImage(file);
                uploadedList.push({ url: uploaded.imageUrl, public_id: uploaded.public_id });
              } catch (err) {
                toast.error(`Failed to upload ${file.name}`);
              }
            }

            setImages((prev) => [...prev, ...uploadedList]);
            toast.success("Showcase images uploaded successfully!", { id: toastId });
          }}
        />
        
        {/* Uploaded List Preview with Remove Buttons */}
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Active Slider Images ({images.length}):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden h-24 bg-white dark:bg-zinc-900">
                  <img
                    src={img.url}
                    alt={`Slider Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== index))}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full h-5 w-5 flex items-center justify-center p-0 shadow transition opacity-0 group-hover:opacity-100 text-xs font-bold leading-none"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✍️ Service Content */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div>
            <Label>
              Service Description Content 
            </Label>
            <RichTextEditor {...field} onChange={(val) => field.onChange(val)} />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
        )}
      />

      {/* 🔍 SEO Fields */}
      <div>
        <Label>
          Meta Title 
        </Label>
        <Input {...register("metaTitle")} placeholder="SEO Title" />
      </div>

      <div>
        <Label>
          Meta Description 
        </Label>
        <Textarea
          rows={3}
          {...register("metaDescription")}
          placeholder="SEO description..."
        />
      </div>

      <div>
        <Label>Meta Keywords (comma separated)</Label>
        <Input {...register("metaKeywords")} placeholder="keyword1, keyword2, ..." />
      </div>

      {/* ✅ Active / Inactive */}
      <div className="flex items-center space-x-2">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="isActive"
              />
              <Label htmlFor="isActive">Active</Label>
            </>
          )}
        />
      </div>

      {/* 🧩 Debug */}
      <pre className="text-red-500 text-xs">{JSON.stringify(errors, null, 2)}</pre>

      {/* 🚀 Submit */}
      <Button type="submit" className="w-full md:w-auto">
        {serviceIdFromParams ? "Update Service Setup" : "Create Service Setup"}
      </Button>
    </form>
  );
}
