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
import {
  placeOrder,
  createAdvancePayment,
  verifyRazorpayPayment,
} from '@/services/checkoutService'; 

import CheckoutProductList from '@/components/user/CheckoutProductList';
import AddressSelector from '@/components/user/AddressSelector';
import CouponBox from '@/components/user/CouponBox';
import DeliveryOptions from '@/components/user/DeliveryOptions';
import PaymentMethodSelector from '@/components/user/PaymentMethodSelector';
import { Button } from '@/components/ui/button';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import Script from "next/script";


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

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(window.Razorpay);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject("Razorpay SDK failed to load");
    document.body.appendChild(script);
  });



  useEffect(() => {
    fetchData();
  }, []);

 const onSubmit = async (data) => {
  try {
    if (data.paymentMethod === "cod") {
      // ✅ COD flow
      await placeOrder(data);
      toast.success("Order placed!");
      router.push("/orders");
    } else {
      // ✅ Razorpay advance payment flow
      const res = await createAdvancePayment(data); // 🔁 Use your service
      const razorData = res.data;

      if (!razorData.success) {
        throw new Error(razorData.message || "Payment initiation failed");
      }

      const options = {
        key: razorData.razorpayKeyId,
        amount: razorData.amount * 100, // in paise
        currency: "INR",
        name: "eRentals",
        description: "Advance Payment",
        order_id: razorData.orderId,
        handler: async function (response) {
          try {
              await verifyRazorpayPayment({
                addressId: data.addressId,
                deliveryDate: data.deliveryDate,
                timeSlot: data.timeSlot,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

            toast.success("Order placed with advance payment!");
            router.push("/orders");
          } catch (err) {
            toast.error("Payment succeeded but order creation failed.");
            console.error(err);
          }
        },
        prefill: {
          name: razorData.name,
          email: razorData.email,
        },
        theme: { color: "#0f172a" },
      };

      const RazorpayConstructor = await loadRazorpay();
      const rzp = new RazorpayConstructor(options);
      rzp.open();
    }
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong during checkout");
  }
};

   useEffect(() => {
          if (!ready) return; // avoid flickering during hydration
      
          if (!isLoggedIn) {
            router.push('/login');
          } else if (isAdmin) {
            router.push('/admin/dashboard');
          }
        }, [isLoggedIn, isAdmin, ready]);
      
  if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  if (!cart) return <div className='space-y-2'>
    <Skeleton className="w-full h-20 rounded-xl" />
    <Skeleton className="w-full h-40 rounded-xl" />
    <Skeleton className="w-full h-20 rounded-xl" />
  </div>;


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
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
