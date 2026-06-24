'use client'
import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '@/services/transactionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, X, ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const statusOptions = ['all', 'initiated', 'authorized', 'captured', 'failed', 'refunded', 'expired'];
const typeOptions = ['all', 'advance', 'remaining', 'refund'];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (status !== 'all') params.status = status;
      if (type !== 'all') params.type = type;
      if (search.trim() !== '') params.search = search.trim();

      const data = await getAllTransactions(params);
      setTransactions(data.transactions || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load transactions', err);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, status, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleReset = () => {
    setStatus('all');
    setType('all');
    setSearch('');
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="p-6 mt-12 md:mt-0 text-black min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900">
            <DollarSign className="w-6 h-6 text-teal-600" /> Payment Transactions Audit
          </h1>
          <p className="text-sm text-gray-500">View and audit all incoming and outgoing financial transactions</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-1">
          <X className="w-4 h-4" /> Reset Filters
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Search Transaction</label>
          <div className="relative">
            <Input 
              placeholder="Pay ID, Razorpay Order ID..." 
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
          <label className="text-xs font-semibold text-gray-600">Transaction Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Transaction Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white">
            Filter Log
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-12"><RefreshCw className="animate-spin mr-2" /> Loading transaction logs...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Transaction Date</th>
                    <th className="p-3 text-left">Payment ID</th>
                    <th className="p-3 text-left">Razorpay Order ID</th>
                    <th className="p-3 text-left">Order #</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Verified Via</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {transactions.map((t) => {
                    const orderNum = t.order?.orderNumber || 'N/A';
                    return (
                      <tr key={t._id} className="hover:bg-gray-50 text-gray-800">
                        <td className="p-3 text-xs">{format(new Date(t.createdAt), "dd MMM yyyy HH:mm")}</td>
                        <td className="p-3 font-mono font-medium text-zinc-950">{t.razorpayPaymentId || 'N/A'}</td>
                        <td className="p-3 font-mono text-xs">{t.razorpayOrderId || 'N/A'}</td>
                        <td className="p-3">
                          {t.order?._id ? (
                            <button 
                              onClick={() => router.push(`/admin/orders/${t.order._id}`)}
                              className="font-semibold text-teal-600 hover:underline font-mono"
                            >
                              {orderNum}
                            </button>
                          ) : 'N/A'}
                        </td>
                        <td className="p-3 text-xs">
                          <p className="font-semibold text-gray-800">{t.user?.name || 'Guest'}</p>
                          <p className="text-gray-500">{t.user?.phone || 'N/A'}</p>
                        </td>
                        <td className="p-3 capitalize font-medium">{t.type}</td>
                        <td className="p-3 font-bold text-gray-950">₹{t.amount}</td>
                        <td className="p-3 text-center">
                          <Badge variant={
                            t.status === 'captured' ? 'success' :
                            t.status === 'initiated' ? 'default' :
                            t.status === 'refunded' ? 'warning' : 'destructive'
                          } className="text-[10px] uppercase">
                            {t.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-xs text-gray-500 capitalize">{t.verifiedVia?.replace(/_/g, ' ') || 'N/A'}</td>
                      </tr>
                    );
                  })}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-6 text-center text-gray-500">
                        No transaction logs found matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {transactions.map((t) => (
              <Card key={t._id} className="border shadow-sm">
                <CardContent className="p-4 space-y-2 text-sm text-gray-800">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{format(new Date(t.createdAt), "dd MMM yyyy HH:mm")}</p>
                    <Badge variant={t.status === 'captured' ? 'success' : 'default'} className="text-[10px] uppercase">
                      {t.status}
                    </Badge>
                  </div>
                  <p><strong>Payment ID:</strong> <span className="font-mono text-xs">{t.razorpayPaymentId || 'N/A'}</span></p>
                  <p><strong>Order:</strong> <span className="font-mono text-xs">{t.order?.orderNumber || 'N/A'}</span></p>
                  <p><strong>Customer:</strong> {t.user?.name || 'Guest'}</p>
                  <div className="flex justify-between items-center pt-1 border-t">
                    <span className="capitalize text-xs font-semibold text-gray-500">{t.type}</span>
                    <span className="font-bold text-gray-950">₹{t.amount}</span>
                  </div>
                  {t.order?._id && (
                    <Button size="sm" variant="outline" className="w-full mt-2 text-xs" onClick={() => router.push(`/admin/orders/${t.order._id}`)}>
                      Manage Associated Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 py-10">No transactions recorded</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 bg-white p-3 rounded-lg border">
              <span className="text-xs text-gray-600">Showing {transactions.length} of {total} records</span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setPage(p => Math.max(p - 1, 1))} 
                  disabled={page === 1}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="flex items-center px-3 text-xs font-semibold">Page {page} of {totalPages}</span>
                <Button 
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                  disabled={page === totalPages}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
