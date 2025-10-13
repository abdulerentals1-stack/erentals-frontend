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
import { toast } from "sonner";
import { useAuthStatus } from "@/utils/authUtils";
import { Skeleton } from "@/components/ui/skeleton";
import InvoicePreviewAndDownload from '../../../components/admin/InvoicePreviewAndDownload'

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const route = useRouter()
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();



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

      useEffect(() => {
        if (!ready) return; // avoid flickering during hydration
    
        if (!isLoggedIn) {
          route.push("/login");
        } else if (isAdmin) {
          route.push("/admin/dashboard");
        }
      }, [isLoggedIn, isAdmin, ready]);
    
      if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  if (loading) return <div className="p-4">Loading orders...</div>;

  if (!orders.length)
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">My Orders</h2>
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    );

  return (
    <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28">
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
              className='cursor-pointer'
              onClick={() => route.push(`/orders/${order._id}`)}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View Details
            </Button>


              {order.invoiceUrl && ["delivered", "picked_up"].includes(order.status) && (
                  <InvoicePreviewAndDownload order={order} />
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
