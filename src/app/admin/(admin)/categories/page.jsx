'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '@/services/category';
import { uploadImage } from '@/services/image';

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    image: { url: '', alt: '' },
  });

  const fetchCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'url' || name === 'alt') {
      setForm((prev) => ({
        ...prev,
        image: { ...prev.image, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      image: { url: '', alt: '' },
    });
    setImageFile(null);
    setEditMode(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async () => {
    try {
      let imageData = form.image;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        imageData = { url: uploaded.imageUrl, alt: form.image.alt };
      }

      const payload = {
        ...form,
        image: imageData,
        metaKeywords: form.metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      };

      if (editMode) {
        await updateCategory(selectedCategory._id, payload);
      } else {
        await createCategory(payload);
      }

      setDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setSelectedCategory(category);
    setForm({
      name: category.name,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      metaKeywords: category.metaKeywords?.join(', ') || '',
      image: {
        url: category.image?.url || '',
        alt: category.image?.alt || '',
      },
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-12 md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Categories</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>+ Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <Label>Image Upload</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {!imageFile && form.image?.url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current Image Preview:</p>
                    <img
                      src={form.image.url}
                      alt={form.image.alt}
                      className="h-28 rounded-md border mt-1"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Image Alt</Label>
                <Input name="alt" value={form.image.alt} onChange={handleChange} />
              </div>
              <div>
                <Label>Meta Title</Label>
                <Input name="metaTitle" value={form.metaTitle} onChange={handleChange} />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Input name="metaDescription" value={form.metaDescription} onChange={handleChange} />
              </div>
              <div>
                <Label>Meta Keywords (comma separated)</Label>
                <Input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} />
              </div>
              <Button onClick={handleSubmit}>
                {editMode ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-start items-center flex-wrap gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="border w-xs rounded-lg p-4 bg-white dark:bg-zinc-900 shadow">
            {cat.image?.url && (
              <img
                src={cat.image.url}
                alt={cat.image.alt}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">{cat.name}</h3>
            <p className="text-sm text-gray-500">Slug: {cat.slug}</p>
            <div className="text-sm text-gray-600 mt-1">
              {cat.metaKeywords?.length > 0 && (
                <p>Keywords: {cat.metaKeywords.join(', ')}</p>
              )}
              {cat.metaDescription && <p>Description: {cat.metaDescription}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" onClick={() => handleEdit(cat)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(cat._id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
