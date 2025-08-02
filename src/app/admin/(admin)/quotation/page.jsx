"use client";
import React, { useEffect, useState } from 'react';
import { getAllQuotations } from '@/services/quotationOrderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";

const statusOptions = [
 "pending", "responded", "cancelled"
];

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await getAllQuotations(status);
      setQuotations(res.quotations || []);
    } catch (err) {
      console.error('Failed to fetch quotations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [status]);

  return (
    <div className="p-4 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold">Admin Quotations</h1>
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
                <th className="p-3 text-left">Quotation ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Time Slot</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Delivery Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q._id} className="border-t">
                  <td className="p-3">{q._id.slice(-6)}</td>
                  <td className="p-3">{q.user?.name}</td>
                  <td className="p-3">{q.timeSlot || 'N/A'}</td>
                  <td className="p-3 font-medium">₹{q.finalAmount}</td>
                  <td className="p-3 capitalize">{q.status}</td>
                  <td className="p-3">{format(new Date(q.deliveryDate), "dd MMM yyyy")}</td>
                  <td className="p-3">
                    <Button size="sm" onClick={() => router.push(`/admin/quotation/${q._id}`)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {quotations.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {quotations.map((q) => (
          <Card key={q._id}>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-gray-500">#{q._id.slice(-6)}</p>
              <p className="font-medium">{q.user?.name} ({q.timeSlot || 'N/A'})</p>
              <p>Status: <span className="capitalize">{q.status}</span></p>
              <p>Amount: ₹{q.finalAmount}</p>
              <p>Delivery Date: {format(new Date(q.deliveryDate), "dd MMM yyyy")}</p>
              <Button size="sm" onClick={() => router.push(`/admin/quotation/${q._id}`)}>
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
        {quotations.length === 0 && (
          <p className="text-center text-gray-500">No quotations found</p>
        )}
      </div>
    </div>
  );
}
