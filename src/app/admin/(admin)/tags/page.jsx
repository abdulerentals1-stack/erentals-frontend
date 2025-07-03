'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createTag, deleteTag, getAllTags, updateTag } from '@/services/tag';

export default function TagManagerPage() {
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [form, setForm] = useState({
    name: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '', // comma separated input
  });

  const fetchTags = async () => {
    const res = await getAllTags();
    setTags(res.data.tags);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        metaKeywords: form.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      };

      if (editMode) {
        await updateTag(selectedTag._id, payload);
      } else {
        await createTag(payload);
      }

      setDialogOpen(false);
      setForm({ name: '', metaTitle: '', metaDescription: '', metaKeywords: '' });
      fetchTags();
    } catch (err) {
      console.error('Failed to save tag:', err);
    }
  };

  const handleEdit = (tag) => {
    setEditMode(true);
    setSelectedTag(tag);
    setForm({
      name: tag.name,
      metaTitle: tag.metaTitle || '',
      metaDescription: tag.metaDescription || '',
      metaKeywords: tag.metaKeywords?.join(', ') || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteTag(id);
    fetchTags();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Tags</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditMode(false);
              setForm({ name: '', metaTitle: '', metaDescription: '', metaKeywords: '' });
            }}>+ Add Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
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
              <Button onClick={handleSubmit}>{editMode ? 'Update' : 'Create'} Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <div key={tag._id} className="border rounded-lg p-4 bg-white shadow dark:bg-zinc-900">
            <h3 className="font-semibold text-lg mb-1">{tag.name}</h3>
            <p className="text-sm text-gray-600 mb-1"><strong>Meta Title:</strong> {tag.metaTitle}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Meta Description:</strong> {tag.metaDescription}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Meta Keywords:</strong> {tag.metaKeywords?.join(', ')}</p>
            <div className="flex justify-between items-center mt-2">
              <Button size="sm" onClick={() => handleEdit(tag)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(tag._id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
