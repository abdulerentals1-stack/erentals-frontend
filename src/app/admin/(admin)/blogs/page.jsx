'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getAllBlogsAdmin, toggleBlogStatus, deleteBlog } from "@/services/blogService";

export default function AdminBlogTable() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogsAdmin();
      setBlogs(res.data.blogs);
    } catch (err) {
      toast.error("Failed to fetch blogs.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = () => {
    router.push("/admin/blogs/add"); // Navigate to add blog page
  };

  const handleEdit = (blogId) => {
    router.push(`/admin/blogs/add/${blogId}`);
  };

  const handleToggle = async (blog) => {
    try {
      await toggleBlogStatus(blog._id);
      toast.success(`Blog ${blog.isActive ? "deactivated" : "activated"} successfully`);
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to update blog status");
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Blogs</h2>
        <Button onClick={handleAddBlog}>Add Blog</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-zinc-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-800">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Active</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                <td className="border p-2">{blog.title}</td>
                <td className="border p-2">{blog.authorName}</td>
                <td className="border p-2">
                  <Checkbox
                    checked={blog.isActive}
                    onCheckedChange={() => handleToggle(blog)}
                  />
                </td>
                <td className="border p-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(blog._id)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(blog._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
