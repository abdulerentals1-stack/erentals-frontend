"use client";

import { useEffect, useState } from "react";
import { getMyQuotations } from "@/services/quotationOrderService"; // ✅ your new service
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatus } from "@/utils/authUtils";
import QuotationPreviewAndPrint from "@/components/admin/QuotationPreviewAndPrint";

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
      <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28">
        <h2 className="text-xl font-bold">My Quotations</h2>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 animate-pulse">
            <div className="space-y-2 w-full md:w-2/3">
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
            </div>
            <div className="h-9 bg-gray-200 dark:bg-zinc-800 rounded w-36 shrink-0 self-end md:self-center" />
          </div>
        ))}
      </div>
    );
  }

  if (!quotations.length) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">My Quotations</h2>
        <p className="text-muted-foreground">No quotations found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28">
      <h2 className="text-xl font-bold">My Quotations</h2>

      {quotations.map((quote) => (
        <div
          key={quote._id}
          className="border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 transition-all duration-200 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
          onClick={() => route.push(`/quotation/${quote._id}`)}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Quotation ID: <span className="font-mono">{quote._id}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {new Date(quote.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">Amount: ₹{quote.finalAmount}</p>
            <p className="text-sm">
              Delivery: {new Date(quote.deliveryDate).toLocaleDateString()}
            </p>
            <Badge
              variant={
                quote.status === "responded"
                  ? "default"
                  : quote.status === "cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {quote.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Show Preview & Download only when status is "responded" */}
            {quote.status === "responded" && (
              <div onClick={(e) => e.stopPropagation()}>
                <QuotationPreviewAndPrint quotation={quote} />
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
