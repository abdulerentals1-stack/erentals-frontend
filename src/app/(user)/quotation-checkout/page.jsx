'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { getQuotationCart } from '@/services/quotationCartServices';
import { getUserAddresses } from '@/services/addressService';
import { submitQuotationRequest } from '@/services/quotationService'; // ✅ new backend service

import CheckoutProductList from '@/components/user/CheckoutProductList';
import AddressSelector from '@/components/user/AddressSelector';
import CouponBox from '@/components/user/CouponBox';
import DeliveryOptions from '@/components/user/DeliveryOptions';
import { Button } from '@/components/ui/button';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';

const schema = z.object({
  addressId: z.string().min(1, "Please select an address"),
  deliveryDate: z.string().min(1, "Select a delivery date"),
  timeSlot: z.string().min(1, "Select a time slot"),
});

export default function QuotationCheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();

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
    },
  });

  const fetchData = async () => {
    try {
      const cartRes = await getQuotationCart();
      const addrRes = await getUserAddresses();

      if (!cartRes?.quotationCart) {
        toast.error("Quotation cart not found");
        setCart({ items: [] });
      } else {
        setCart(cartRes);
      }

      setAddresses(addrRes.data?.addresses || []);
    } catch (err) {
      toast.error("Failed to load quotation cart or addresses.");
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await submitQuotationRequest(data); // ✅ call backend
      toast.success("Quotation request sent successfully!");
      router.push("/myaccount/quotes"); // redirect to quotes page
    } catch (err) {
      toast.error("Failed to send quotation request.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn && !isAdmin) {
      router.push('/login');
    }
  }, [isLoggedIn, isAdmin, ready]);

  if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  if (!cart) return (
    <div className='space-y-2'>
      <Skeleton className="w-full h-20 rounded-xl" />
      <Skeleton className="w-full h-40 rounded-xl" />
      <Skeleton className="w-full h-20 rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Quotation Checkout</h1>

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

      <div className="bg-gray-50 border rounded p-4 space-y-4 mt-4">
        <p className="text-yellow-700 text-sm">
          ⚠️ Transportation charges will be calculated and shared in your quotation.
        </p>

        <div className="text-sm space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>₹{cart?.quotationCart?.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₹{cart?.quotationCart?.discountAmount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (SGST + CGST):</span>
            <span>₹{(cart?.quotationCart?.sgstTotal || 0) + (cart?.quotationCart?.cgstTotal || 0)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Final Amount:</span>
            <span>₹{cart?.quotationCart?.finalAmount}</span>
          </div>
        </div>

        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          Request Quotation
        </Button>
      </div>
    </div>
  );
}
