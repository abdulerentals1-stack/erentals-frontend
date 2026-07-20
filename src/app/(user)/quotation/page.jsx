"use client";

import { useEffect, useState } from "react";
import { getMyQuotations } from "@/services/quotationOrderService"; // ✅ your new service
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatus } from "@/utils/authUtils";
import dynamic from "next/dynamic";

const QuotationPreviewAndPrint = dynamic(
  () => import("@/components/admin/QuotationPreviewAndPrint"),
  { ssr: false }
);

export default function MyQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await getMyQuotations();
      setQuotations(data.quotations || []);
    } catch (err) {
      console.error("Error fetching quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn) {
      route.push("/login");
    } else if (isAdmin) {
      route.push("/admin/dashboard");
    }
  }, [isLoggedIn, isAdmin, ready]);

  if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;
  if (loading) {
    return (
      <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28 text-black pt-4 sm:pt-4">
        <h2 className="text-xl font-bold">My Quotations</h2>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 animate-pulse">
            <div className="space-y-2 w-full md:w-2/3">
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-48" />
                <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
              </div>
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded w-32" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded w-36" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="h-9 bg-gray-200 dark:bg-zinc-800 rounded w-36 shrink-0" />
              <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded-full w-5 shrink-0 hidden md:block" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!quotations.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-black">
        <h2 className="text-xl font-bold">My Quotations</h2>
        <p className="text-gray-500 mt-2">No quotations found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28 text-black pt-4 sm:pt-4">
      <h2 className="text-xl font-bold">My Quotations</h2>

      {quotations.map((quote) => (
        <div
          key={quote._id}
          className="group border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200"
          onClick={() => route.push(`/quotation/${quote._id}`)}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                Quotation #{quote.quotationNumber || quote._id.slice(-6).toUpperCase()}
              </span>
              <Badge
                variant={
                  quote.status === "responded"
                    ? "success"
                    : quote.status === "cancelled"
                    ? "error"
                    : "warning"
                }
                className="capitalize text-xs font-semibold"
              >
                {quote.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Date: {new Date(quote.createdAt).toLocaleDateString("en-IN")}</p>
            <p className="text-sm font-medium">Amount: ₹{quote.finalAmount}</p>
            <p className="text-xs text-gray-600">Delivery Date: {new Date(quote.deliveryDate).toLocaleDateString("en-IN")}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Show Preview & Download only when status is "responded" */}
            {quote.status === "responded" && (
              <div onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
                <QuotationPreviewAndPrint
                  quotation={quote}
                  className="w-full sm:w-auto bg-[#144169] hover:bg-[#103454] text-white text-xs"
                  size="sm"
                />
              </div>
            )}
            
            {/* Visual click affordance (Chevron) */}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-1 hidden md:block shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
