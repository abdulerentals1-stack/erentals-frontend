"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById, createRemainingPayment } from "@/services/orderService";
import { verifyRemainingPayment } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleRemainingPayment = async () => {
  try {
    const res = await createRemainingPayment({ orderId: order._id });
    const razorData = res;

    const options = {
      key: razorData.razorpayKeyId,
      amount: razorData.amount * 100,
      currency: "INR",
      name: "eRentals",
      description: "Remaining Amount Payment",
      order_id: razorData.orderId,
      handler: async (response) => {
        try {
          const verifyRes = await verifyRemainingPayment({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderId: order._id, // ✅ Pass here
          });

          toast.success("Remaining payment successful");
          fetchOrder();
        } catch (err) {
          console.error(err);
          toast.error("Error verifying payment");
        }
      },
      prefill: {
        name: order.user?.name,
        email: order.user?.email,
      },
      theme: { color: "#0f172a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Failed to initiate remaining payment");
    console.error(err);
  }
};

  if (loading) return <div className="p-4">Loading order details...</div>;
  if (!order) return <div className="p-4 text-red-500">Order not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <h1 className="text-xl font-bold mb-4">Order Details</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>
          <strong>Status:</strong>{" "}
          <Badge variant={order.status === "placed" ? "secondary" : "default"}>
            {order.status}
          </Badge>
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentMethod} (
          <Badge
            variant={
              order.paymentStatus === "paid"
                ? "success"
                : order.paymentStatus === "partial"
                ? "warning"
                : "default"
            }
          >
            {order.paymentStatus}
          </Badge>
          )
        </p>
        <p>
          <strong>Delivery Date:</strong>{" "}
          {new Date(order.deliveryDate).toLocaleDateString()} |{" "}
          <strong>Time Slot:</strong> {order.timeSlot}
        </p>
        <p>
          <strong>Rental Duration:</strong>{" "}
          {order.items?.[0]?.days || 1} day(s)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold mb-1">Delivery Address</h2>
          <p>{order.user?.name}</p>
          <p>{order.address?.addressLine}</p>
          <p>
            {order.address?.city}, {order.address?.state} -{" "}
            {order.address?.pincode}
          </p>
          <p>Email: {order.user?.email}</p>
          <p>Phone: {order.address?.phone}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Erentals</h2>
          <p>Erentals</p>
          <p>123 Rental Lane</p>
          <p>Delhi, India</p>
          <p>support@erentals.in</p>
          <p>+91-9876543210</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Items Ordered</h2>
      <div className="border rounded-lg p-4 mb-6">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <div>
              <p className="font-medium">{item.product?.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.pricingType === "length_width"
                  ? `${item.length} x ${item.width}`
                  : `${item.quantity} pcs`}{" "}
                | {item.days} days | Type: {item.pricingType}
              </p>
            </div>
            <p>₹{item.finalPrice}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">Charges</h2>
      <div className="text-sm space-y-1 mb-6">
        <p>Base Amount: ₹{order.totalAmount}</p>
        <p>Service Charge (10%): ₹{(order.totalAmount * 0.1).toFixed(2)}</p>
        <p>Transportation: ₹{order.transportationCharge || 0}</p>
        <p>SGST (9%): ₹{order.sgst}</p>
        <p>CGST (9%): ₹{order.cgst}</p>
        <p>Discount: ₹{order.discountAmount}</p>
        <p><strong>Advance Paid:</strong> ₹{order.advancePaid}</p>
        <p className="font-bold text-lg">Total: ₹{order.finalAmount}</p>
        <p className="text-green-700">Paid: ₹{order.paidAmount}</p>
        {order.finalAmount - order.paidAmount > 0 && (
          <p className="text-yellow-700 font-semibold">
            Remaining: ₹{order.finalAmount - order.paidAmount}
          </p>
        )}
      </div>

      {/* ✅ Pay Remaining Button */}
      {order.paymentMethod === "razorpay" &&
        order.paymentStatus !== "paid" &&
        order.finalAmount - order.paidAmount > 0 && (
          <Button
            onClick={handleRemainingPayment}
            className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto"
          >
            Pay Remaining Amount
          </Button>
        )}

      {/* ✅ Download Invoice */}
      {order.invoiceUrl && (
        <div className="mt-6">
          <Button onClick={() => window.open(order.invoiceUrl, "_blank")}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      )}

      {/* ✅ Payment History */}
      {order.paymentHistory?.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold mb-2">Payment History</h2>
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            {order.paymentHistory.map((p, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2 last:border-none"
              >
                <div>
                  <p><strong>ID:</strong> {p.razorpay_payment_id}</p>
                  <p><strong>Type:</strong> {p.type}</p>
                  <p><strong>Method:</strong> {p.method}</p>
                </div>
                <div className="text-right">
                  <p>₹{p.amount}</p>
                  <p>{new Date(p.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
