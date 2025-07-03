'use client';

import { useRef, useState } from 'react';
import { uploadImage, deleteImage } from '@/services/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

export default function ImageUploader({ images, setImages }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null); // ✅ Reference to clear input

  // ✅ Upload image and store exact public_id from backend
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { imageUrl, public_id } = await uploadImage(file);

      setImages((prev) => [
        ...prev,
        {
          url: imageUrl,
          public_id,
          alt: '',
          type: 'gallery',
        },
      ]);

      if (inputRef.current) {
        inputRef.current.value = ''; // ✅ Clear file input after upload
      }
    } catch (err) {
      console.error('Image upload failed:', err?.message || err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete image by correct public_id
  const handleDelete = async (index) => {
    try {
      const imageToDelete = images[index];

      if (imageToDelete?.public_id) {
        await deleteImage(imageToDelete.public_id);
      }

      const filtered = images.filter((_, i) => i !== index);
      setImages(filtered);
    } catch (err) {
      console.error('Failed to delete image:', err?.message || err);
    }
  };

  const updateImageField = (index, field, value) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Upload Product Images</Label>
      <Input
        ref={inputRef} // ✅ Attach ref
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {images.map((img, index) => (
          <div key={index} className="border rounded-md p-2 space-y-2">
            <img
              src={img.url}
              alt={img.alt || 'Product image'}
              className="w-full h-32 object-cover rounded"
            />

            <div className="space-y-1">
              <Label>Alt Text</Label>
              <Input
                value={img.alt || ''}
                onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                placeholder="Front view / top view..."
              />
            </div>

            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                value={img.type || 'gallery'}
                onValueChange={(value) => updateImageField(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="thumbnail">Thumbnail</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => handleDelete(index)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
