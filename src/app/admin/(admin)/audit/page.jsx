'use client'
import React, { useEffect, useState } from 'react';
import { getAllAuditLogs } from '@/services/transactionService';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, X, ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const actionOptions = [
  'all',
  'ORDER_CHECKOUT_INITIATED',
  'ORDER_CREATED_COD',
  'ORDER_PAYMENT_VERIFIED',
  'ORDER_PAYMENT_FAILED',
  'ORDER_PAYMENT_RETRIED',
  'ORDER_REMAINING_PAYMENT_VERIFIED',
  'ORDER_REMAINING_PAYMENT_INITIATED',
  'ORDER_STATUS_CHANGED',
  'ORDER_STATUS_UPDATED',
  'ORDER_MODIFIED_BY_ADMIN',
  'ORDER_ADVANCE_WEBHOOK_VERIFIED',
  'ORDER_REMAINING_WEBHOOK_VERIFIED',
  'ORDER_PAYMENT_FAILED_WEBHOOK',
  'ORDER_REFUND_PROCESSED_WEBHOOK',
  'ORDER_RECONCILIATION_CANCELLED',
  'ORDER_RECONCILIATION_RECOVERED',
  'ORDER_RECONCILIATION_EXPIRED',
  'ORDER_MANUAL_RECOVERED'
];

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (action !== 'all') params.action = action;

      const data = await getAllAuditLogs(params);
      setLogs(data.logs || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
      toast.error('Failed to fetch system audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, action]);

  const handleReset = () => {
    setAction('all');
    setPage(1);
    fetchAuditLogs();
  };

  return (
    <div className="p-6 mt-12 md:mt-0 text-black min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900">
            <ClipboardList className="w-6 h-6 text-indigo-600" /> System Audit Trail
          </h1>
          <p className="text-sm text-gray-500">Track database changes, payment events, state updates, and administrative modifications</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-1">
          <X className="w-4 h-4" /> Reset Filters
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border shadow-sm items-end justify-between">
        <div className="flex flex-col gap-1.5 w-full md:w-[350px]">
          <label className="text-xs font-semibold text-gray-600">Filter by Audit Action Type</label>
          <Select value={action} onValueChange={(val) => { setAction(val); setPage(1); }}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Audit Action" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt === 'all' ? 'All System Actions' : opt.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-xs text-gray-500">
          Showing <strong>{logs.length}</strong> of <strong>{total}</strong> historical change logs
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12"><RefreshCw className="animate-spin mr-2" /> Loading audit trail...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 border-b text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Timestamp</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Entity</th>
                    <th className="p-3 text-left">Entity ID</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Details Diff</th>
                    <th className="p-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-gray-800">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 align-top">
                      <td className="p-3 text-gray-500 font-medium whitespace-nowrap">
                        {format(new Date(log.createdAt), "dd MMM yyyy HH:mm:ss")}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-indigo-50 text-indigo-800 border border-indigo-100">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-600">{log.entity}</td>
                      <td className="p-3">
                        {log.entityId ? (
                          <button 
                            onClick={() => {
                              if (log.entity === 'Order') {
                                router.push(`/admin/orders/${log.entityId}`);
                              }
                            }}
                            className="font-mono text-zinc-950 hover:underline hover:text-teal-600 font-semibold"
                          >
                            {log.entityId}
                          </button>
                        ) : 'N/A'}
                      </td>
                      <td className="p-3">{log.performedBy?.name || 'System / Webhook'}</td>
                      <td className="p-3 capitalize font-medium">{log.performedByRole || 'system'}</td>
                      <td className="p-3">
                        <details className="cursor-pointer">
                          <summary className="text-[10px] text-teal-600 font-medium hover:text-teal-800">Expand JSON changes</summary>
                          <pre className="mt-2 p-2 bg-gray-50 text-[10px] font-mono text-zinc-800 rounded max-w-sm max-h-[120px] overflow-auto border shadow-inner">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      </td>
                      <td className="p-3 max-w-[200px] truncate" title={log.notes}>
                        {log.notes || '—'}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-gray-500">
                        No system audit records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {logs.map((log) => (
              <Card key={log._id} className="border shadow-sm text-xs">
                <CardContent className="p-4 space-y-2 text-gray-800">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500">{format(new Date(log.createdAt), "dd MMM yyyy HH:mm:ss")}</p>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-50 text-indigo-700 font-bold">
                      {log.action}
                    </span>
                  </div>
                  <p><strong>Entity:</strong> {log.entity} ({log.entityId || 'N/A'})</p>
                  <p><strong>Operator:</strong> {log.performedBy?.name || 'System'} ({log.performedByRole || 'system'})</p>
                  <p><strong>Note:</strong> {log.notes || '—'}</p>
                  <details className="cursor-pointer pt-1 border-t">
                    <summary className="text-[10px] text-teal-600">View Diffs</summary>
                    <pre className="mt-1 p-2 bg-gray-50 text-[9px] font-mono rounded max-h-[100px] overflow-auto">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  </details>
                  {log.entity === 'Order' && log.entityId && (
                    <Button size="sm" variant="outline" className="w-full mt-2 text-xs" onClick={() => router.push(`/admin/orders/${log.entityId}`)}>
                      View Affected Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-gray-500 py-10">No audit logs found</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 bg-white p-3 rounded-lg border">
              <span className="text-xs text-gray-600">Showing {logs.length} of {total} records</span>
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
