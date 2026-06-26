'use client'
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { Search, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

const statusOptions = [
  'all',
  'pending_payment',
  'placed',
  'confirmed',
  'shipped',
  'delivered',
  'returned',
  'cancelled',
];

const paymentStatusOptions = [
  'all',
  'awaiting',
  'partial',
  'paid',
  'failed',
  'refunded',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (status !== 'all') params.status = status;
      if (paymentStatus !== 'all') params.paymentStatus = paymentStatus;
      if (search.trim() !== '') params.search = search.trim();

      const res = await axios.get('/orders', { params });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, paymentStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleReset = () => {
    setStatus('all');
    setPaymentStatus('all');
    setSearch('');
    fetchOrders();
  };

  return (
    <div className="p-6 mt-12 md:mt-0 text-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Orders Management</h1>
          <p className="text-sm text-gray-500">Search, filter, and audit client rental orders</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-1">
          <X className="w-4 h-4" /> Reset Filters
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Search Orders</label>
          <div className="relative">
            <Input 
              placeholder="Order #, Phone, Email, Pay ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pr-8"
            />
            <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Order Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Payment Status</label>
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Payment Status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map((ps) => (
                <SelectItem key={ps} value={ps}>
                  {ps === 'all' ? 'All Payments' : ps === 'not_required' ? 'Pay on Delivery' : ps.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-900 text-white">
            Filter Results
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10"><RefreshCw className="animate-spin mr-2" /> Loading orders...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Order Number</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Final Amount</th>
                    <th className="p-3 text-left">Paid</th>
                    <th className="p-3 text-left">Order Status</th>
                    <th className="p-3 text-left">Payment Status</th>
                    <th className="p-3 text-left">Delivery Date</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => {
                    const orderNum = order.orderNumber || order._id.slice(-8).toUpperCase();
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 text-gray-800">
                        <td className="p-3 font-semibold font-mono text-zinc-900">{orderNum}</td>
                        <td className="p-3">{order?.user?.name || 'Guest'}</td>
                        <td className="p-3 text-xs">{order?.user?.phone || 'N/A'}</td>
                        <td className="p-3 font-medium">₹{order.finalAmount}</td>
                        <td className="p-3 text-green-700 font-medium">₹{order.paidAmount}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-[11px] font-semibold rounded capitalize bg-zinc-100 text-zinc-800">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-[11px] font-semibold rounded capitalize ${
                            order.paymentStatus === 'paid' ? 'bg-green-50 text-green-800 border border-green-200' :
                            order.paymentStatus === 'partial' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                            order.paymentStatus === 'failed' ? 'bg-red-50 text-red-800 border border-red-200' :
                            order.paymentStatus === 'not_required' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            'bg-gray-50 text-gray-800 border border-gray-200'
                          }`}>
                            {order.paymentStatus === 'not_required' ? 'Pay on Delivery' : order.paymentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{format(new Date(order.deliveryDate), "dd MMM yyyy")}</td>
                        <td className="p-3 text-center">
                          <Button size="sm" className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                            Manage
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-6 text-center text-gray-500">
                        No orders matching these criteria were found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => {
              const orderNum = order.orderNumber || order._id.slice(-8).toUpperCase();
              return (
                <Card key={order._id} className="border shadow-sm">
                  <CardContent className="p-4 space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold font-mono text-zinc-900">{orderNum}</p>
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="font-medium">{order.user?.name || 'Guest'} ({order?.user?.phone || 'N/A'})</p>
                    <div className="flex justify-between items-center text-xs">
                      <p>Final Amount: <strong>₹{order.finalAmount}</strong></p>
                      <p className="text-green-700">Paid: <strong>₹{order.paidAmount}</strong></p>
                    </div>
                     <p className="text-xs">Payment status: <span className={`px-2 py-0.5 rounded capitalize font-semibold ${
                        order.paymentStatus === 'paid' ? 'bg-green-50 text-green-800 border border-green-200' :
                        order.paymentStatus === 'partial' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        order.paymentStatus === 'failed' ? 'bg-red-50 text-red-800 border border-red-200' :
                        order.paymentStatus === 'not_required' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        'bg-gray-50 text-gray-800 border border-gray-200'
                      }`}>{order.paymentStatus === 'not_required' ? 'Pay on Delivery' : order.paymentStatus.replace(/_/g, ' ')}</span></p>
                    <p className="text-xs text-gray-500">Delivery Date: {format(new Date(order.deliveryDate), "dd MMM yyyy")}</p>
                    <Button size="sm" className="w-full mt-2 bg-zinc-800 hover:bg-zinc-900 text-white" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                      Manage Order
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-10">No orders found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
