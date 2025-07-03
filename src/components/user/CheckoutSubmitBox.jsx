'use client';

import { useState } from 'react';
import { placeOrder } from '@/services/checkoutService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CheckoutSubmitBox({ cart, deliveryDetails }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!deliveryDetails.addressId || !deliveryDetails.deliveryDate || !deliveryDetails.timeSlot) {
      return toast.error('Please fill all delivery details.');
    }

    try {
      setLoading(true);

      const { data } = await placeOrder({
        addressId: deliveryDetails.addressId,
        deliveryDate: deliveryDetails.deliveryDate,
        timeSlot: deliveryDetails.timeSlot,
        paymentMethod: deliveryDetails.paymentMethod,
      });

      toast.success('Order placed successfully!');
      router.push('/myaccount/orders');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-4 mt-4 bg-gray-50">
      <p className="text-sm text-yellow-600">
        ⚠️ Transportation charges will be calculated by admin before confirming your order.
      </p>

      <div className="flex justify-between font-medium text-sm">
        <span>Total Amount:</span>
        <span>₹{cart.finalAmount}</span>
      </div>

      <Button disabled={loading} onClick={handlePlaceOrder} className="w-full">
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </div>
  );
}
