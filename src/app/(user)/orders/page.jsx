"use client";

import { useEffect, useState } from "react";
import {
  getMyOrders,
  updateOrderStatus,
} from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, CreditCard, RefreshCw, ChevronRight } from "lucide-react";
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
            onClick={() => route.push(`/orders/${order._id}`)}
            className="group border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{orderNumberDisplay}</span>
                <Badge
                  variant={
                    order.status === "placed"
                      ? "secondary"
                      : order.status === "confirmed" || order.status === "shipped"
                      ? "info"
                      : order.status === "delivered"
                      ? "success"
                      : order.status === "cancelled"
                      ? "error"
                      : "outline"
                  }
                  className="capitalize text-xs font-semibold"
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
                      ? "error"
                      : "secondary"
                  }
                  className="capitalize text-xs font-semibold"
                >
                  Payment: {order.paymentStatus === "not_required" ? "Pay on Delivery" : order.paymentStatus.replace(/_/g, ' ')}
                </Badge>

                {order.status === "placed" && (
                  <Badge variant="warning" className="capitalize text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    Awaiting Admin Confirmation
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              <p className="text-sm font-medium">Amount: ₹{order.finalAmount}</p>
              <p className="text-xs text-gray-600">Delivery Date: {new Date(order.deliveryDate).toLocaleDateString("en-IN")}</p>
              <p className="text-xs text-gray-600">Payment: <span className="uppercase">{order.paymentMethod}</span></p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-2 w-full sm:w-auto">
                {(order.status === "pending_payment") && order.paymentMethod === "razorpay" && (
                  <Button
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs w-full sm:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      route.push(`/orders/${order._id}`);
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Complete Payment
                  </Button>
                )}

                {order.invoiceUrl && ["delivered", "confirmed"].includes(order.status) && (
                  <div onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
                    <InvoicePreviewAndDownload order={order} />
                  </div>
                )}
              </div>

              {/* Visual click affordance (Chevron) */}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-1 hidden md:block shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
