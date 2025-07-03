'use client'
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";

const statusOptions = [
  'placed',
  'confirmed',
  'shipped',
  'delivered',
  'in_use',
  'pickup_scheduled',
  'picked_up',
  'cancelled',
  'returned',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('placed');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/orders?status=${status}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold">Admin Orders</h1>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Time Slot</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Delivery Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-3">{order?._id.slice(-6)}</td>
                  <td className="p-3">{order?.user?.name}</td>
                  <td className="p-3">{order?.timeSlot || 'N/A'}</td>
                  <td className="p-3 font-medium">₹{order.finalAmount}
                  </td>
                  <td className="p-3 capitalize">{order.status.replace(/_/g, ' ')}</td>
                  <td className="p-3">{format(new Date(order.deliveryDate), "dd MMM yyyy")}</td>
                  <td className="p-3">
                    <Button size="sm" onClick={() => router.push(`/admin/orders/${order._id}`)}>Edit</Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-gray-500">#{order._id.slice(-6)}</p>
              <p className="font-medium">{order.user?.name} ({order?.timeSlot || 'N/A'})</p>
              <p>Status: <span className="capitalize">{order.status.replace(/_/g, ' ')}</span></p>
              <p>Amount: ₹{order.finalAmount}</p>
              <p>Delivery Date: {format(new Date(order.deliveryDate), "dd MMM yyyy")}</p>
              <Button size="sm" onClick={() => router.push(`/admin/orders/${order._id}`)}>Edit</Button>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
}
