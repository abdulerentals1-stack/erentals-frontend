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
  createBlog,
  updateBlog,
  getBlogById,
} from "@/services/blogService";

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

export default function AddBlogForm() {
  const [coverImage, setCoverImage] = useState([]);
  const [blogId, setBlogId] = useState(null);
  const router = useRouter();
  const params = useParams();
  const blogIdFromParams = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  console.clear()
  console.log(params, blogIdFromParams)

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
        metaKeywords: values.metaKeywords
          ? values.metaKeywords.split(",").map((s) => s.trim())
          : [],
      };

      if (blogIdFromParams) {
        await updateBlog(blogId, payload);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(payload);
        toast.success("Blog created successfully");
      }

      router.push("/admin/blogs");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Something went wrong.";
      toast.error(message);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogIdFromParams) return;

      try {
        const res = await getBlogById(blogIdFromParams);
        const blog = res.data.blog;
        setBlogId(blog._id);
        setCoverImage(blog.coverImage?.url ? [blog.coverImage] : []);

        reset({
          title: blog.title || "",
          authorName: blog.authorName || "",
          content: blog.content || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          metaKeywords: blog.metaKeywords?.join(", ") || "",
          isActive: !!blog.isActive,
        });
      } catch (err) {
        toast.error("Failed to fetch blog data.");
      }
    };

    fetchBlog();
  }, [blogIdFromParams, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-5xl mx-auto"
    >
      {/* 🧾 Basic Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label>Blog Title</Label>
          <Input {...register("title")} placeholder="Enter blog title" />
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
        <Label>Cover Image (Main Blog Banner)</Label>
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


      {/* ✍️ Blog Content */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div>
            <Label>
              Blog Content 
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
        {blogIdFromParams ? "Update Blog" : "Create Blog"}
      </Button>
    </form>
  );
}
