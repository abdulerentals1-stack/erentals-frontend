"use client";

import { useEffect, useState } from "react";
import { getQuotationById } from "@/services/quotationOrderService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import QuotationPreviewAndPrint from "@/components/admin/QuotationPreviewAndPrint";

function DetailPageSkeleton({ title }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-black animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
        <div className="space-y-2 w-full md:w-1/3">
          <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
      </div>

      {/* Grid Row 1: Details Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-36 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        <div className="space-y-4">
          <div className="h-36 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        </div>
      </div>

      {/* Grid Row 2: Items & Pricing */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="border border-gray-200/60 rounded-lg p-4 bg-white dark:bg-zinc-900 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-none">
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200/60" />
        </div>
      </div>
    </div>
  );
}

export default function QuotationDetailsPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuotation = async () => {
    try {
      const data = await getQuotationById(id);
      setQuotation(data.quotation);
    } catch (err) {
      console.error("Error fetching quotation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuotation();
  }, [id]);

  if (loading) return <DetailPageSkeleton title="Quotation" />;
  if (!quotation) return <div className="p-4 text-red-500">Quotation not found.</div>;

  const quotationNumberDisplay = `Quotation #${quotation._id.slice(-6).toUpperCase()}`;

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      {/* Header section with inline badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">{quotationNumberDisplay}</h1>
          <p className="text-gray-500 text-sm">Requested on {new Date(quotation.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div>
          <Badge
            variant={
              quotation.status === "responded"
                ? "success"
                : quotation.status === "cancelled"
                ? "error"
                : "warning"
            }
            className="capitalize text-xs font-semibold"
          >
            {quotation.status}
          </Badge>
        </div>
      </div>

      {/* Status Info Banner (analogous to tracker/cancellation banners in order details) */}
      <div className="mb-6">
        {quotation.status === "pending" && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r flex items-start gap-3">
            <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800">Awaiting Admin Rates</h3>
              <p className="text-amber-700 text-sm mt-1">Your quotation request is currently being reviewed by our team. We will update the pricing and notify you shortly.</p>
            </div>
          </div>
        )}
        {quotation.status === "responded" && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r flex items-start gap-3">
            <CheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-emerald-800">Quotation Rates Prepared</h3>
              <p className="text-emerald-700 text-sm mt-1">The rates for your items are ready. You can review the breakdown below and download the formal Quotation PDF.</p>
            </div>
          </div>
        )}
        {quotation.status === "cancelled" && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3">
            <ShieldAlert className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Quotation Cancelled</h3>
              <p className="text-red-700 text-sm mt-1">This quotation request has been cancelled by the administration or user.</p>
            </div>
          </div>
        )}
      </div>

      {/* Row 1: Delivery Address & Timeline Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg border text-sm h-full flex flex-col justify-between">
            <div>
              <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Delivery Address</h2>
              <p className="font-medium text-sm text-gray-950">{quotation.user?.name}</p>
              <p className="text-gray-700 text-sm mt-1">{quotation.address?.addressLine || "No specific address line"}</p>
              <p className="text-gray-700 text-sm">
                {quotation.address?.city}, {quotation.address?.state} -{" "}
                {quotation.address?.pincode}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-0.5">
              <p>Email: {quotation.user?.email}</p>
              <p>Phone: {quotation.address?.phone || quotation.user?.phone}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border text-sm">
            <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Rental Timeline</h2>
            <div className="text-sm space-y-1.5">
              <p><strong>Delivery Date:</strong> {new Date(quotation.deliveryDate).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Delivery Time Slot:</strong> {quotation.timeSlot}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Items Requested & Price Summary Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6 items-start">
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-3 text-gray-950">Requested Items</h2>
          <div className="border rounded-lg p-4 bg-white shadow-sm divide-y">
            {quotation.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.product?.name || "Rental Product"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.days} days | {item.quantity} units

                    {item.pricingType === "length_width" && item.length > 0 && (
                      <> | {item.length} {item.unit || "ft"}</>
                    )}

                    {item.pricingType === "area" && item.length > 0 && item.width > 0 && (
                      <> | {item.length}x{item.width} {item.unit || "sqft"}</>
                    )}

                    {" | " + (item.withService ? "With Service" : "Without Service")}
                  </p>
                </div>
                <p className="font-medium text-sm text-gray-900">₹{item.finalPrice}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-1.5 h-fit">
            <h2 className="font-semibold mb-2 text-gray-900 border-b pb-1">Price Summary</h2>
            <div className="flex justify-between">
              <span>Base Amount:</span>
              <span>₹{quotation.totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Transportation:</span>
              <span>₹{quotation.transportationCharge || 0}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Labour Charge:</span>
              <span>₹{quotation.labourCharge || 0}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SGST (9%):</span>
              <span>₹{quotation.sgst || 0}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>CGST (9%):</span>
              <span>₹{quotation.cgst || 0}</span>
            </div>
            {quotation.discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount:</span>
                <span>-₹{quotation.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1 text-gray-900">
              <span>Total Payable:</span>
              <span>₹{quotation.finalAmount}</span>
            </div>

            {/* Action Buttons: download button inside summary column matching order style */}
            {quotation.status === "responded" && (
              <div className="border-t pt-3 mt-3 w-full">
                <QuotationPreviewAndPrint quotation={quotation} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
