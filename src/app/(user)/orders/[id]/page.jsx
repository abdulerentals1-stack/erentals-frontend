"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/services/orderService";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-4">Loading order details...</div>;
  if (!order) return <div className="p-4 text-red-500">Order not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Order Details</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <Badge>{order.status}</Badge></p>
        <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
        <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()} | <strong>Time Slot:</strong> {order.timeSlot}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold mb-1">Delivery Address</h2>
          <p>{order.user?.name}</p>
          <p>{order.address?.addressLine}</p>
          <p>
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
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
          <div key={i} className="flex justify-between items-center py-2 border-b last:border-none">
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
      <div className="text-sm space-y-1">
        <p>Transportation: ₹{order.transportationCharge || 0}</p>
        <p>SGST (9%): ₹{order.sgst}</p>
        <p>CGST (9%): ₹{order.cgst}</p>
        <p>Discount: ₹{order.discountAmount}</p>
        <p className="font-bold text-lg">Total: ₹{order.finalAmount}</p>
      </div>

      {order.status === "confirmed" && order.invoiceUrl && (
        <div className="mt-6">
          <Button onClick={() => window.open(order.invoiceUrl, "_blank")}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      )}
    </div>
  );
}
