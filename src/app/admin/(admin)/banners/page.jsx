'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { uploadImage } from '@/services/image';
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBanner,
} from '@/services/banner';

export default function BannerManagerPage() {
  const [banners, setBanners] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [form, setForm] = useState({
    title: '',
    image: { url: '', alt: '' },
    link: '',
    type: 'homepage',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchBanners = async () => {
    const res = await getAllBanners();
    setBanners(res.data.banners);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'url' || name === 'alt') {
      setForm((prev) => ({ ...prev, image: { ...prev.image, [name]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      let imageData = form.image;
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        imageData = { url: uploaded.imageUrl, alt: form.image.alt };
      }

      const payload = { ...form, image: imageData };

      if (editMode) {
        await updateBanner(selectedBanner._id, payload);
      } else {
        await createBanner(payload);
      }

      setDialogOpen(false);
      setEditMode(false);
      setSelectedBanner(null);
      setForm({ title: '', image: { url: '', alt: '' }, link: '', type: 'homepage', order: 0, isActive: true });
      setImageFile(null);
      fetchBanners();
    } catch (err) {
      console.error('Failed to save banner:', err);
    }
  };

  const handleEdit = (banner) => {
    setEditMode(true);
    setSelectedBanner(banner);
    setForm(banner);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteBanner(id);
    fetchBanners();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Banners</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditMode(false);
              setSelectedBanner(null);
              setForm({ title: '', image: { url: '', alt: '' }, link: '', type: 'homepage', order: 0, isActive: true });
              setImageFile(null);
            }}>
              + Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input name="title" value={form.title} onChange={handleChange} />
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
                <Label>Link (optional)</Label>
                <Input name="link" value={form.link} onChange={handleChange} />
              </div>
              <div>
                <Label>Type</Label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="homepage">Homepage</option>
                  <option value="category">Category</option>
                  <option value="promotion">Promotion</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <Label>Order</Label>
                <Input name="order" type="number" value={form.order} onChange={handleChange} />
              </div>
              <Button onClick={handleSubmit}>{editMode ? 'Update' : 'Create'} Banner</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="border rounded-lg overflow-hidden shadow bg-white dark:bg-zinc-900">
            <img src={banner.image.url} alt={banner.image.alt} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{banner.title}</h3>
              <p className="text-sm text-gray-600">{banner.type}</p>
              {banner.link && <a href={banner.link} className="text-blue-600 text-sm" target="_blank">{banner.link}</a>}
              <div className="flex justify-between items-center mt-4">
                <Button size="sm" onClick={() => handleEdit(banner)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner._id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
