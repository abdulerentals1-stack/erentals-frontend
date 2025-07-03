'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { addOrUpdateCartItem } from '@/services/cartService';
import { useRouter } from 'next/navigation';

export default function AddToRentalButton({ product }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAdd = async () => {
    if (!user) {
      toast.error('Please login to continue.');
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
      } else {
        payload.length = 1;
        payload.width = 1;
      }

      await addOrUpdateCartItem(payload);
      toast.success('Added to cart. Redirecting to checkout...');
      router.push('/checkout');
    } catch {
      toast.error('Failed to proceed to rental');
    }
  };

  return (
    <Button onClick={handleAdd} variant="default" className="w-full rounded-none">
      Add To Rental
    </Button>
  );
}
