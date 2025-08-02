"use client";

import { useEffect, useState } from "react";
import { getMyQuotations } from "@/services/quotationOrderService"; // ✅ your new service
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatus } from "@/utils/authUtils";

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
  if (loading) return <div className="p-4">Loading quotations...</div>;

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
          className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
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
                quote.status === "approved"
                  ? "default"
                  : quote.status === "rejected"
                  ? "destructive"
                  : "outline"
              }
            >
              {quote.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer"
              onClick={() => route.push(`/qoutation/${quote._id}`)}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View Details
            </Button>

            {quote.status === "approved" && quote.invoiceUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="cursor-pointer"
                onClick={() => window.open(quote.invoiceUrl, "_blank")}
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Invoice
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
