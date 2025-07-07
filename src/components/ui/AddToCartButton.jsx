'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { addOrUpdateCartItem } from '@/services/cartService';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useState, useRef } from 'react';

export default function AddToCartButton({ product }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      toast.error('Please login to add items to cart.');
      return router.push('/login');
    }

    if (isDisabled) return; // block if already clicked

    setIsDisabled(true); // disable button immediately

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
      } else if (product.pricingType === 'area') {
        payload.length = 1;
        payload.width = 1;
      }

      await addOrUpdateCartItem(payload);
      toast.success('Item added to cart');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setIsDisabled(false); // re-enable after request
    }
  };

  return (
    <Button
      onClick={handleAdd}
      variant="ghost"
      className="rounded-none border-r gap-2"
      disabled={isDisabled}
    >
      <ShoppingCart className="w-4 h-4" style={{ color: '#003459' }} />
      {isDisabled ? 'Adding...' : 'Cart'}
    </Button>
  );
}
