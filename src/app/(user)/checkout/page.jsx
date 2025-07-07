// app/(user)/checkout/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { getCart } from '@/services/cartService';
import { getUserAddresses } from '@/services/addressService';
import { placeOrder } from '@/services/checkoutService';

import CheckoutProductList from '@/components/user/CheckoutProductList';
import AddressSelector from '@/components/user/AddressSelector';
import CouponBox from '@/components/user/CouponBox';
import DeliveryOptions from '@/components/user/DeliveryOptions';
import PaymentMethodSelector from '@/components/user/PaymentMethodSelector';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  addressId: z.string().min(1, "Please select an address"),
  deliveryDate: z.string().min(1, "Select a delivery date"),
  timeSlot: z.string().min(1, "Select a time slot"),
  paymentMethod: z.enum(["cod", "razorpay"]),
});

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const { user } = useAuth();



  if (!user) {
    toast.error('Please login to add items to cart.');
    return router.push('/login');
  }

  if (user?.role === 'admin') {
    toast.error('Admin not able to Checkout cart.');
    return router.push('/admin/dashboard');
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      addressId: '',
      deliveryDate: '',
      timeSlot: '',
      paymentMethod: 'cod',
    },
  });

 const fetchData = async () => {
  try {
    const cartRes = await getCart();
    const addrRes = await getUserAddresses();

    if (!cartRes?.cart) {
      toast.error("Cart not found");
      setCart({ items: [] }); // fallback empty cart
    } else {
      setCart(cartRes);
    }

    setAddresses(addrRes.data?.addresses || []);
  } catch (err) {
    toast.error("Failed to load cart or addresses.");
    setCart({ items: [] }); // to avoid infinite loading
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await placeOrder(data);
      toast.success('Order placed!');
      router.push('/myaccount/orders');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Order failed');
    }
  };

  if (!cart) return <p>Loading cart...</p>;


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <CheckoutProductList cart={cart} onUpdated={fetchData} />

      <CouponBox onUpdated={fetchData} />

      <AddressSelector
            addresses={addresses}
            selected={watch("addressId")}
            onSelect={(id) => setValue("addressId", id)}
            onRefresh={fetchData}
            />
      {errors.addressId && <p className="text-sm text-red-500">{errors.addressId.message}</p>}
 
      <DeliveryOptions
        selectedDate={watch("deliveryDate")}
        selectedSlot={watch("timeSlot")}
        setDate={(val) => setValue("deliveryDate", val)}
        setSlot={(val) => setValue("timeSlot", val)}
      />
      {(errors.deliveryDate || errors.timeSlot) && (
        <p className="text-sm text-red-500">
          {errors.deliveryDate?.message || errors.timeSlot?.message}
        </p>
      )}

      <PaymentMethodSelector
        selected={watch("paymentMethod")}
        onChange={(val) => setValue("paymentMethod", val)}
      />
      {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}

      {/* Transportation charge notice & final summary */}
      <div className="bg-gray-50 border rounded p-4 space-y-4 mt-4">
        <p className="text-yellow-700 text-sm">
          ⚠️ Transportation charges will be calculated by admin before confirming your order.
        </p>

        <div className="text-sm space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>₹{cart?.cart?.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₹{cart?.cart?.discountAmount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (SGST + CGST):</span>
            <span>₹{(cart?.cart?.sgstTotal || 0) + (cart?.cart?.cgstTotal || 0)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Final Amount:</span>
            <span>₹{cart?.cart?.finalAmount}</span>
          </div>
        </div>

        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          Place Order
        </Button>
      </div>
    </div>
  );
}
