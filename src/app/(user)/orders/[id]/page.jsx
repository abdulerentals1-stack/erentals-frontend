"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, createRemainingPayment } from "@/services/orderService";
import { verifyRemainingPayment } from "@/services/orderService";
import { retryPayment, verifyPayment, reportPaymentFailure } from "@/services/checkoutService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw, AlertTriangle, CheckCircle, CreditCard, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { loadRazorpay } from "@/utils/loadRazorpay";
import OrderTracker from "@/components/user/OrderTracker";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const InvoicePreviewAndDownload = dynamic(
  () => import("@/components/admin/InvoicePreviewAndDownload"),
  { ssr: false }
);

function DetailPageSkeleton({ title }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-black animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
        <div className="space-y-2 w-full md:w-1/3">
          <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
      </div>

      {/* Grid Row 1: Details Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-36 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        <div className="space-y-4">
          <div className="h-36 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        </div>
      </div>

      {/* Grid Row 2: Items & Pricing */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="border border-gray-200/60 rounded-lg p-4 bg-white dark:bg-zinc-900 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-none">
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);



  const handleRetryAdvancePayment = async () => {
    if (paying) return;
    setPaying(true);
    const retryToast = toast.loading("Initializing payment gateway...");

    try {
      const res = await retryPayment({ orderId: order._id });
      const retryData = res.data;

      if (!retryData.success) {
        throw new Error(retryData.message || "Failed to initialize payment retry");
      }

      const options = {
        key: retryData.razorpayKeyId,
        amount: retryData.amount * 100, // paise
        currency: "INR",
        name: "e-Rentals.in",
        description: "Retry Advance Payment",
        order_id: retryData.razorpayOrderId,
        handler: async (response) => {
          const verifToast = toast.loading("Verifying your payment, please wait...");
          try {
            await verifyPayment({
              orderId: order._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.dismiss(verifToast);
            toast.success("Payment verified and order placed!");
            fetchOrder();
          } catch (err) {
            console.error("Verification error:", err);
            toast.dismiss(verifToast);
            toast.warning("Payment verification is taking longer than expected. Please check back shortly.");
            fetchOrder();
          }
        },
        prefill: {
          name: order.user?.name || "",
          email: order.user?.email || "",
        },
        modal: {
          ondismiss: async () => {
            setPaying(false);
            toast.dismiss(retryToast);
            toast.info("Payment retry cancelled");
            try {
              await reportPaymentFailure({
                orderId: order._id,
                error: { description: "Payment cancelled during retry" }
              });
              fetchOrder();
            } catch (err) {
              console.error(err);
            }
          }
        },
        theme: { color: "#0f172a" },
      };

      const RazorpayConstructor = await loadRazorpay();
      const rzp = new RazorpayConstructor(options);
      
      rzp.on("payment.failed", async (response) => {
        setPaying(false);
        toast.dismiss(retryToast);
        toast.error(`Payment failed: ${response.error.description}`);
        try {
          await reportPaymentFailure({
            orderId: order._id,
            error: response.error
          });
          fetchOrder();
        } catch (err) {
          console.error(err);
        }
      });

      toast.dismiss(retryToast);
      rzp.open();
    } catch (err) {
      setPaying(false);
      toast.dismiss(retryToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to launch payment gateway");
    }
  };

  const handleRemainingPayment = async () => {
    try {
      const res = await createRemainingPayment({ orderId: order._id });
      const razorData = res;

      const options = {
        key: razorData.razorpayKeyId,
        amount: razorData.amount * 100,
        currency: "INR",
        name: "e-Rentals.in",
        description: "Remaining Balance Payment",
        order_id: razorData.orderId,
        handler: async (response) => {
          const verifToast = toast.loading("Applying payment...");
          try {
            await verifyRemainingPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            });
            toast.dismiss(verifToast);
            toast.success("Remaining payment successful!");
            fetchOrder();
          } catch (err) {
            console.error(err);
            toast.dismiss(verifToast);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: order.user?.name,
          email: order.user?.email,
        },
        theme: { color: "#0f172a" },
      };

      const RazorpayConstructor = await loadRazorpay();
      const rzp = new RazorpayConstructor(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate remaining payment");
      console.error(err);
    }
  };

  if (loading) return <DetailPageSkeleton title="Order" />;
  if (!order) return <div className="p-4 text-red-500">Order not found.</div>;

  const orderNumberDisplay = order.orderNumber || `Order #${order._id.slice(-6).toUpperCase()}`;

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">{orderNumberDisplay}</h1>
          <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={
            order.status === "placed"
              ? "secondary"
              : order.status === "confirmed" || order.status === "shipped"
              ? "info"
              : order.status === "delivered"
              ? "success"
              : order.status === "cancelled"
              ? "error"
              : "outline"
          } className="capitalize text-xs font-semibold">
            {order.status.replace(/_/g, ' ')}
          </Badge>

          {order.paymentStatus === "paid" ? (
            <Badge variant="success" className="capitalize text-xs font-semibold">
              Payment: Paid
            </Badge>
          ) : order.paymentMethod === "cod" ? (
            <Badge variant="secondary" className="capitalize text-xs font-semibold">
              Pay on Delivery
            </Badge>
          ) : (order.status === "confirmed" || order.status === "placed") ? (
            <Badge
              variant="warning"
              className="capitalize text-xs font-semibold cursor-pointer hover:bg-amber-200 hover:text-amber-900 transition-all duration-205 flex items-center gap-1.5 active:scale-95 shadow-xs border border-amber-200"
              onClick={handleRemainingPayment}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              Proceed for Payment (₹{(order.finalAmount - order.paidAmount).toFixed(2)})
            </Badge>
          ) : (
            <Badge
              variant={order.paymentStatus === "failed" ? "destructive" : "default"}
              className="capitalize text-xs font-semibold"
            >
              Payment: {order.paymentStatus.replace(/_/g, ' ')}
            </Badge>
          )}

          {order.status === "placed" && (
            <Badge variant="warning" className="capitalize text-xs font-semibold animate-pulse">
              Awaiting Admin Confirmation
            </Badge>
          )}
        </div>
      </div>

      {/* Payment Recovery Banners */}
      {order.status === "pending_payment" && order.paymentMethod === "razorpay" && order.paymentStatus !== "failed" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-800">Payment Pending</h3>
            <p className="text-yellow-700 text-sm">Your advance payment is required to confirm this rental order. Please click below to complete checkout.</p>
            <Button onClick={handleRetryAdvancePayment} disabled={paying} className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium">
              <CreditCard className="w-4 h-4 mr-2" /> Complete Advance Payment (₹{order.advancePaid})
            </Button>
          </div>
        </div>
      )}

      {order.status === "pending_payment" && order.paymentStatus === "failed" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r flex items-start gap-3">
          <ShieldAlert className="text-red-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h3 className="font-semibold text-red-800">Payment Failed</h3>
            <p className="text-red-700 text-sm">The previous payment attempt was declined or cancelled. Your items are locked, and you can retry payment to confirm the order.</p>
            <Button onClick={handleRetryAdvancePayment} disabled={paying} className="bg-red-600 hover:bg-red-700 text-white font-medium">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry Payment (₹{order.advancePaid})
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Banner */}
      {order.status === "cancelled" && (
        <div className="bg-gray-100 border-l-4 border-gray-500 p-4 mb-6 rounded-r">
          <h3 className="font-semibold text-gray-800">Order Cancelled</h3>
          <p className="text-gray-700 text-sm mt-1">Reason: <span className="italic">{order.cancellation?.reason || "Not specified"}</span></p>
          {order.paymentMethod === "razorpay" && order.cancellation?.refundStatus !== "none" && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Refund Status: </strong> 
              <span className="capitalize font-medium text-blue-700">
                {order.cancellation.refundStatus.replace(/_/g, ' ')}
              </span> 
              {order.cancellation.refundAmount > 0 && ` (₹${order.cancellation.refundAmount})`}
            </div>
          )}
        </div>
      )}

      {/* Row 1: Tracker & Metadata Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <OrderTracker order={order} />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border text-sm">
            <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Delivery Details</h2>
            <p className="font-medium text-sm text-gray-950">{order.user?.name}</p>
            <p className="text-gray-700 text-sm mt-1">{order.address?.addressLine || "No specific address line"}</p>
            <p className="text-gray-700 text-sm">
              {order.address?.city}, {order.address?.state} -{" "}
              {order.address?.pincode}
            </p>
            <p className="text-gray-600 text-xs mt-2">Email: {order.user?.email}</p>
            <p className="text-gray-600 text-xs">Phone: {order.address?.phone || order.user?.phone}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border text-sm">
            <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Rental Timeline</h2>
            <div className="text-sm space-y-1.5">
              <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Delivery Time Slot:</strong> {order.timeSlot}</p>
              <p><strong>Payment Method:</strong> <span className="uppercase">{order.paymentMethod}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Items Ordered & Price Summary Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6 items-start">
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-3 text-gray-950">Items Ordered</h2>
          <div className="border rounded-lg p-4 bg-white shadow-sm divide-y">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.product?.name || "Rental Product"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.days} days | {item.quantity} units

                    {item.pricingType === "length_width" && item.length > 0 && (
                      <> | {item.length} {item.unit || "ft"}</>
                    )}

                    {item.pricingType === "area" && item.length > 0 && item.width > 0 && (
                      <> | {item.length}x{item.width} {item.unit || "sqft"}</>
                    )}

                    {" | " + (item.withService ? "With Service" : "Without Service")}
                  </p>
                </div>
                <p className="font-medium text-sm text-gray-900">₹{item.finalPrice}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-1.5 h-fit">
            <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Price Summary</h2>
            <div className="flex justify-between">
              <span>Sub Total:</span>
              <span>₹{(() => {
                const s = (order.items || []).reduce((sum, i) => sum + Number(i.finalPrice || 0), 0);
                return (s > 0 ? Math.round(s * 100) / 100 : Number(order.totalAmount || 0)).toFixed(2);
              })()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount:</span>
                <span>-₹{Number(order.discountAmount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Transportation:</span>
              <span>₹{Number(order.transportationCharge || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Labour Charge:</span>
              <span>₹{Number(order.labourCharge || 0).toFixed(2)}</span>
            </div>

            {(() => {
              // Recalculate from items to avoid double-counting transportation in old orders
              const itemsSubTotal = (order.items || []).reduce((sum, item) => sum + Number(item.finalPrice || 0), 0);
              const totalAmount = itemsSubTotal > 0 ? Math.round(itemsSubTotal * 100) / 100 : Number(order.totalAmount || 0);
              const transportationCharge = Number(order.transportationCharge || 0);
              const labourCharge = Number(order.labourCharge || 0);
              const discountAmount = Number(order.discountAmount || 0);
              
              const priceBeforeTax = Math.round((totalAmount - discountAmount + transportationCharge + labourCharge) * 100) / 100;
              const halfGst = 9;
              const cgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
              const sgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
              const finalAmount = Math.round((priceBeforeTax + cgst + sgst) * 100) / 100;

              return (
                <>
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>Total payable before taxes:</span>
                    <span>₹{priceBeforeTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST ({halfGst}%):</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST ({halfGst}%):</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-1 mt-1 text-gray-900">
                    <span>Total Payable:</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </>
              );
            })()}
            {Number(order.paidAmount || 0) > 0 && (
              <div className="border-t pt-2 mt-2 space-y-1 bg-yellow-50/50 p-2 rounded">
                <div className="flex justify-between text-xs text-green-700 font-medium">
                  <span>Advance Paid:</span>
                  <span>₹{Number(order.paidAmount || 0).toFixed(2)}</span>
                </div>
                {order.status !== "cancelled" && order.finalAmount - order.paidAmount > 0 && (
                  <div className="flex justify-between text-xs text-yellow-700 font-semibold">
                    <span>Remaining Balance:</span>
                    <span>₹{Number(order.finalAmount - order.paidAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons inside Summary column */}
          {((["razorpay", "cod"].includes(order.paymentMethod) &&
            ["confirmed", "placed"].includes(order.status) && 
            order.paymentStatus !== "paid" &&
            order.finalAmount - order.paidAmount > 0) || 
            (order.invoiceUrl && ["confirmed", "placed"].includes(order.status))) && (
              <div className="flex flex-col gap-2 w-full">
                {order.paymentMethod === "cod" &&
                  ["confirmed", "placed"].includes(order.status) &&
                  order.paymentStatus !== "paid" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mb-2">
                      <p className="font-semibold mb-1">💡 Skip cash hassles!</p>
                      <p className="mb-2 text-[11px] leading-relaxed text-blue-700">
                        You can convert this order to online payment and pay securely right now via UPI, card, or NetBanking.
                      </p>
                      <Button
                        onClick={handleRemainingPayment}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded text-[11px] w-full"
                      >
                        Pay Online Now (₹{order.finalAmount - order.paidAmount})
                      </Button>
                    </div>
                  )}

                {order.paymentMethod === "razorpay" &&
                  ["confirmed", "placed"].includes(order.status) && 
                  order.paymentStatus !== "paid" &&
                  order.finalAmount - order.paidAmount > 0 && (
                    <Button
                      onClick={handleRemainingPayment}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded text-xs w-full"
                    >
                      Pay Remaining Balance (₹{order.finalAmount - order.paidAmount})
                    </Button>
                  )}

                {order.invoiceUrl && ["confirmed", "placed", "delivered"].includes(order.status) && (
                  <InvoicePreviewAndDownload
                    order={order}
                    className="bg-zinc-800 hover:bg-zinc-900 text-white flex items-center justify-center text-xs w-full py-2"
                  />
                )}
              </div>
          )}
        </div>
      </div>

      {/* Payment History Log */}
      {order.paymentMethod !== "cod" && order.paymentHistory?.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="font-semibold mb-3 text-gray-950">Payment Transactions</h2>
          {/* Desktop Table View */}
          <div className="hidden sm:block border rounded-lg bg-white overflow-hidden shadow-sm overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Razorpay Order ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-800">
                {order.paymentHistory.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-medium text-gray-900">{p.razorpay_payment_id || "N/A"}</td>
                    <td className="p-3 font-mono">{p.razorpay_order_id || "N/A"}</td>
                    <td className="p-3 capitalize font-semibold text-gray-500">{p.type}</td>
                    <td className="p-3 font-medium text-gray-950">
                      <span className={p.amount < 0 ? "text-red-600" : ""}>
                        ₹{p.amount}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant={p.status === "success" ? "success" : p.status === "refunded" || p.status === "failed" ? "error" : "secondary"} className="text-[10px] font-semibold">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(p.paidAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block sm:hidden space-y-3">
            {order.paymentHistory.map((p, i) => (
              <div key={i} className="border rounded-lg bg-white p-4 shadow-sm text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-semibold text-gray-600 capitalize text-sm">{p.type} Payment</span>
                  <Badge variant={p.status === "success" ? "success" : p.status === "refunded" || p.status === "failed" ? "error" : "secondary"} className="text-[10px] font-semibold">
                    {p.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500 font-medium">Payment ID:</span>
                  <span className="col-span-2 font-mono font-medium text-gray-900 break-all">{p.razorpay_payment_id || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="col-span-2 font-mono text-gray-800 break-all">{p.razorpay_order_id || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500 font-medium">Amount:</span>
                  <span className={`col-span-2 font-semibold text-gray-950 ${p.amount < 0 ? "text-red-600" : ""}`}>
                    ₹{p.amount}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500 font-medium">Date:</span>
                  <span className="col-span-2 text-gray-700">{new Date(p.paidAt).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
