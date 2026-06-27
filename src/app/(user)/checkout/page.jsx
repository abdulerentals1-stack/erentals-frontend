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
  initiateCheckout,
  verifyPayment,
  reportPaymentFailure,
} from '@/services/checkoutService'; 

import CheckoutProductList from '@/components/user/CheckoutProductList';
import AddressSelector from '@/components/user/AddressSelector';
import CouponBox from '@/components/user/CouponBox';
import DeliveryOptions from '@/components/user/DeliveryOptions';
import PaymentMethodSelector from '@/components/user/PaymentMethodSelector';
import TransportationNotice from '@/components/user/TransportationNotice';
import { Button } from '@/components/ui/button';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import Script from "next/script";
import api from '@/lib/axios';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Poll for order status recovery (in case verification request times out)
  const pollOrderStatus = async (orderId, maxAttempts = 5) => {
    let attempt = 0;
    const interval = 2000; // 2s
    
    return new Promise((resolve) => {
      const checkStatus = setInterval(async () => {
        attempt++;
        try {
          const res = await api.get(`/orders/${orderId}`);
          const order = res.data?.order;
          if (order && order.status !== "pending_payment") {
            clearInterval(checkStatus);
            resolve(true);
            return;
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
        
        if (attempt >= maxAttempts) {
          clearInterval(checkStatus);
          resolve(false);
        }
      }, interval);
    });
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Generate UUID v4 equivalent for idempotency
    const idempotencyKey = crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      // Save checkout intent locally for session crash protection
      sessionStorage.setItem("pending_checkout_idempotency_key", idempotencyKey);

      const initiateRes = await initiateCheckout({ ...data, idempotencyKey });
      const checkoutData = initiateRes.data;

      if (!checkoutData.success) {
        throw new Error(checkoutData.message || "Checkout initiation failed");
      }

      const orderId = checkoutData.orderId;

      if (data.paymentMethod === "cod") {
        toast.success("Order placed successfully with Cash on Delivery!");
        sessionStorage.removeItem("pending_checkout_idempotency_key");
        router.push("/orders");
      } else {
        // Razorpay Payment Flow
        const razorpayOrderId = checkoutData.razorpayOrderId;
        const amount = checkoutData.amount;

        const options = {
          key: checkoutData.razorpayKeyId,
          amount: amount * 100, // paise
          currency: "INR",
          name: "e-Rentals.in",
          description: "Rental Advance Payment",
          order_id: razorpayOrderId,
          handler: async function (response) {
            const verifToast = toast.loading("Verifying your payment, please wait...");
            try {
              const verifyRes = await verifyPayment({
                orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              toast.dismiss(verifToast);
              if (verifyRes.data.success) {
                toast.success("Advance payment verified! Order placed successfully.");
                sessionStorage.removeItem("pending_checkout_idempotency_key");
                router.push(`/orders/${orderId}`);
              } else {
                throw new Error("Payment verification failed on server");
              }
            } catch (err) {
              console.error("Verification failed, attempting recovery...", err);
              // Network timeout recovery — poll order status
              const isRecovered = await pollOrderStatus(orderId);
              toast.dismiss(verifToast);
              
              if (isRecovered) {
                toast.success("Order payment confirmed!");
                sessionStorage.removeItem("pending_checkout_idempotency_key");
                router.push(`/orders/${orderId}`);
              } else {
                toast.warning("Payment verification is taking longer than expected. We will update the status once confirmed.");
                router.push("/orders");
              }
            }
          },
          prefill: {
            name: checkoutData.name,
            email: checkoutData.email,
          },
          modal: {
            ondismiss: async function () {
              setIsSubmitting(false);
              toast.info("Payment cancelled. You can complete this payment anytime from your orders list.");
              try {
                await reportPaymentFailure({
                  orderId,
                  error: { description: "Payment cancelled/dismissed by customer" }
                });
              } catch (err) {
                console.error("Failed to report payment cancellation:", err);
              }
              // Redirect to order details so they can retry paying
              router.push(`/orders/${orderId}`);
            }
          },
          theme: { color: "#0f172a" },
        };

        const RazorpayConstructor = await loadRazorpay();
        const rzp = new RazorpayConstructor(options);
        
        rzp.on("payment.failed", async function (response) {
          setIsSubmitting(false);
          toast.error(`Payment failed: ${response.error.description}`);
          try {
            await reportPaymentFailure({
              orderId,
              error: response.error
            });
          } catch (err) {
            console.error("Failed to report payment failure:", err);
          }
          router.push(`/orders/${orderId}`);
        });

        rzp.open();
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || err.message || "Something went wrong during checkout");
    }
  };

  useEffect(() => {
    if (!ready) return; // avoid flickering during hydration

    if (!isLoggedIn && !isAdmin) {
      router.push('/login');
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
        advancePercentage={cart?.advancePercentage || 100}
      />
      {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}

      {/* Transportation charge notice & final summary */}
      <div className="bg-gray-50 border rounded p-4 space-y-4 mt-4 text-black">
        <TransportationNotice advancePercentage={cart?.advancePercentage || 100} />

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

        <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
