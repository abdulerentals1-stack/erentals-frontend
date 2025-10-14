'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductTable from '@/components/admin/products/ProductTable';
import { getAllProducts, deleteProduct } from '@/services/productService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AllProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products whenever searchTerm changes
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const columns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Price', accessor: 'basePrice' },
    { label: 'Discount Price', accessor: 'discountPrice' },
    { label: 'Stock', accessor: 'stock' },
    { label: 'ProductCode', accessor: 'productCode' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto mt-12 md:mt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">All Products</h1>
        <Button onClick={() => router.push('/admin/products/add')}>+ Add New</Button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or product code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable
          columns={columns}
          data={filteredProducts} // use filtered data
          onView={(item) => router.push(`/admin/products/view/${item.slug}`)}
          onEdit={(item) => router.push(`/admin/products/add/${item.slug}`)}
          onDelete={(item) => handleDelete(item._id)}
        />
      )}
    </div>
  );
}
