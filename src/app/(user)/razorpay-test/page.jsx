'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreditCard, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { loadRazorpay } from '@/utils/loadRazorpay';

export default function RazorpayTestPage() {
  const router = useRouter();
  const { isLoggedIn, loading, ready } = useAuthStatus();

  const [amount, setAmount] = useState('1.00'); // amount in INR
  const [receipt, setReceipt] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed' | null
  const [verificationDetails, setVerificationDetails] = useState(null);

  // Generate random receipt on mount
  useEffect(() => {
    setReceipt(`rec_test_${Math.floor(Math.random() * 1000000)}`);
  }, []);

  // Protect route
  useEffect(() => {
    if (ready && !loading && !isLoggedIn) {
      toast.error("Please login to access the test checkout page");
      router.push('/login?redirect=/razorpay-test');
    }
  }, [ready, loading, isLoggedIn]);

  if (!ready) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <Skeleton className="w-full h-12 rounded-xl" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  const handlePayment = async () => {
    if (loadingPayment) return;
    setLoadingPayment(true);
    setPaymentStatus(null);
    setVerificationDetails(null);

    const amountInPaise = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      toast.error("Minimum transaction amount is ₹1.00 (100 paise)");
      setLoadingPayment(false);
      return;
    }

    const orderToast = toast.loading("Creating checkout order...");

    try {
      // 1. Call Backend to Create Order
      const res = await api.post('/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || undefined
      });

      toast.dismiss(orderToast);

      if (!res.data || !res.data.success) {
        throw new Error(res.data?.message || "Order creation failed");
      }

      const { order_id, currency } = res.data;

      // 2. Load Razorpay and Trigger checkout modal
      const RazorpayConstructor = await loadRazorpay();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T8xVC83ZASgYFF",
        amount: amountInPaise,
        currency: currency || "INR",
        name: "e-Rentals.in",
        description: "Razorpay Standard Checkout Test",
        order_id: order_id,
        handler: async function (response) {
          const verifyToast = toast.loading("Verifying payment signature...");
          try {
            // 3. Send payment details to verification endpoint
            const verifyRes = await api.post('/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.dismiss(verifyToast);

            if (verifyRes.data && verifyRes.data.success) {
              toast.success("Payment verified successfully!");
              setPaymentStatus('success');
              setVerificationDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              });
            } else {
              throw new Error("Verification response did not indicate success");
            }
          } catch (err) {
            toast.dismiss(verifyToast);
            toast.error(err.response?.data?.message || err.message || "Payment verification failed");
            setPaymentStatus('failed');
          } finally {
            setLoadingPayment(false);
          }
        },
        prefill: {
          name: "Test Customer",
          email: "customer@e-rentals.in",
          contact: "9999999999"
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment checkout cancelled");
            setLoadingPayment(false);
          }
        },
        theme: { color: "#0f172a" }
      };

      const rzp = new RazorpayConstructor(options);
      
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description || "Gateway Error"}`);
        setPaymentStatus('failed');
        setLoadingPayment(false);
      });

      rzp.open();

    } catch (err) {
      toast.dismiss(orderToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Something went wrong during checkout initiation");
      setLoadingPayment(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="border rounded-2xl bg-white shadow-xl overflow-hidden text-black">
        <div className="bg-slate-900 text-white p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold">Standard Web Checkout</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">Test payment gateway integration using Razorpay Standard Checkout SDK</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Payment Amount (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.00"
                min="1.00"
                step="0.01"
                className="pl-8 text-lg font-semibold"
                disabled={loadingPayment}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Equivalent to {Math.round(parseFloat(amount || '0') * 100)} paise (minimum 100 paise)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Receipt ID</label>
            <Input
              type="text"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
              placeholder="rec_test_12345"
              className="font-mono text-xs"
              disabled={loadingPayment}
            />
          </div>

          <Button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-md font-bold rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50"
            disabled={loadingPayment || !amount || parseFloat(amount) < 1}
          >
            {loadingPayment ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5 mr-2" />
                Processing Checkout...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>

          {/* Payment Results */}
          {paymentStatus === 'success' && verificationDetails && (
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Payment Verified Successfully</span>
              </div>
              <div className="text-emerald-700 font-mono space-y-1 mt-2">
                <p><span className="font-semibold text-emerald-900">Payment ID:</span> {verificationDetails.paymentId}</p>
                <p><span className="font-semibold text-emerald-900">Order ID:</span> {verificationDetails.orderId}</p>
                <p className="truncate"><span className="font-semibold text-emerald-900">Signature:</span> {verificationDetails.signature}</p>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-4 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-red-800 font-bold text-sm">Transaction Failed</h3>
                <p className="text-red-700 leading-relaxed">Payment failed or signature verification failed. Please check backend server logs for more details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
