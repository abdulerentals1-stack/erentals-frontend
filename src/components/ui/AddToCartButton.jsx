'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { addOrUpdateCartItem } from '@/services/cartService';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }) {
  const { user } = useAuth();
  const router = useRouter();

 const handleAdd = async () => {
  if (!user) {
    toast.error('Please login to add items to cart.');
    return router.push('/auth/login');
  }

  try {
    const payload = {
      productId: product._id,
      pricingType: product.pricingType,
      withService: false,
      days: 1,
    };

    if (product.pricingType === 'quantity') {
      payload.quantity = 1;
    } else if (product.pricingType === 'length_width') {
      payload.length = 1;
    }else if (product.pricingType === 'area'){
      payload.length = 1;
      payload.width = 1;
    }

    await addOrUpdateCartItem(payload);
    toast.success('Item added to cart');
  } catch {
    toast.error('Failed to add to cart');
  }
};


  return (
    <Button onClick={handleAdd} variant="ghost" className="rounded-none border-r">
      🛒 Cart
    </Button>
  );
}
