import React from 'react';
import AddProductForm from '@/components/admin/products/AddProductForm';

export default function AddProductPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 mt-12 md:mt-0">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
      <AddProductForm />
    </div>
  );
}
