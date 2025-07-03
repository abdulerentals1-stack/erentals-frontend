"use client";

import { useEffect, useState } from "react";
import {
  getMyOrders,
  updateOrderStatus,
  getOrderById,
} from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, EyeIcon, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const route = useRouter()

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    const data = await getOrderById(orderId);
    setSelectedOrder(data.order);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await updateOrderStatus(orderId, "cancelled");
      fetchOrders(); // Refresh
    } catch (error) {
      alert("Failed to cancel order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;

  if (!orders.length)
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">My Orders</h2>
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">Order ID: <span className="font-mono">{order._id}</span></p>
            <p className="text-sm">Customer: {order.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">Amount: ₹{order.finalAmount}</p>
            <p className="text-sm">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p className="text-sm">Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus})</p>
            <Badge
              variant={
                order.status === "confirmed"
                  ? "default"
                  : order.status === "cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
           <Button
              size="sm"
              variant="outline"
              onClick={() => route.push(`/orders/${order._id}`)}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View Details
            </Button>

            {["pending", "placed"].includes(order.status) && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancelOrder(order._id)}
              >
                <XIcon className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}

            {order.status === "confirmed" && order.invoiceUrl && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.open(order.invoiceUrl, "_blank")}
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Invoice
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
