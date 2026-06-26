"use client";

import { useEffect, useState } from "react";
import {
  getMyOrders,
  updateOrderStatus,
} from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, CreditCard, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/utils/authUtils";
import { Skeleton } from "@/components/ui/skeleton";
import InvoicePreviewAndDownload from '../../../components/admin/InvoicePreviewAndDownload'

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();
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

  if (loading) return <div className="p-4 flex justify-center items-center min-h-[200px]"><RefreshCw className="animate-spin mr-2" /> Loading orders...</div>;

  if (!orders.length)
    return (
      <div className="p-6 max-w-4xl mx-auto text-black">
        <h2 className="text-xl font-bold">My Orders</h2>
        <p className="text-gray-500 mt-2">No orders found.</p>
      </div>
    );

  return (
    <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28 text-black">
      <h2 className="text-xl font-bold">My Orders</h2>

      {orders.map((order) => {
        const orderNumberDisplay = order.orderNumber || `Order #${order._id.slice(-6).toUpperCase()}`;
        return (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{orderNumberDisplay}</span>
                <Badge
                  variant={
                    order.status === "confirmed" || order.status === "placed"
                      ? "secondary"
                      : order.status === "delivered"
                      ? "success"
                      : order.status === "cancelled"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize text-xs"
                >
                  {order.status.replace(/_/g, ' ')}
                </Badge>
                
                <Badge
                  variant={
                    order.paymentStatus === "paid"
                      ? "success"
                      : order.paymentStatus === "partial"
                      ? "warning"
                      : order.paymentStatus === "failed"
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize text-xs"
                >
                  Payment: {order.paymentStatus === "not_required" ? "Pay on Delivery" : order.paymentStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              <p className="text-sm font-medium">Amount: ₹{order.finalAmount}</p>
              <p className="text-xs text-gray-600">Delivery Date: {new Date(order.deliveryDate).toLocaleDateString("en-IN")}</p>
              <p className="text-xs text-gray-600">Payment: <span className="uppercase">{order.paymentMethod}</span></p>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() => route.push(`/orders/${order._id}`)}
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View Details
              </Button>

              {(order.status === "pending_payment") && order.paymentMethod === "razorpay" && (
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                  onClick={() => route.push(`/orders/${order._id}`)}
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Complete Payment
                </Button>
              )}

              {order.invoiceUrl && ["delivered", "confirmed"].includes(order.status) && (
                <InvoicePreviewAndDownload order={order} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
