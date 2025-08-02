"use client";

import { useEffect, useState } from "react";
import { getQuotationById } from "@/services/quotationOrderService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";

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

  if (loading) return <div className="p-4">Loading quotation details...</div>;
  if (!quotation) return <div className="p-4 text-red-500">Quotation not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Quotation Details</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Quotation ID:</strong> {quotation._id}</p>
        <p><strong>Date:</strong> {new Date(quotation.createdAt).toLocaleDateString()}</p>
        <p>
          <strong>Status:</strong>{" "}
          <Badge
            variant={
              quotation.status === "approved"
                ? "default"
                : quotation.status === "rejected"
                ? "destructive"
                : "outline"
            }
          >
            {quotation.status}
          </Badge>
        </p>
        <p>
          <strong>Delivery Date:</strong>{" "}
          {new Date(quotation.deliveryDate).toLocaleDateString()} |{" "}
          <strong>Time Slot:</strong> {quotation.timeSlot}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold mb-1">Delivery Address</h2>
          <p>{quotation.user?.name}</p>
          <p>{quotation.address?.addressLine}</p>
          <p>
            {quotation.address?.city}, {quotation.address?.state} -{" "}
            {quotation.address?.pincode}
          </p>
          <p>Email: {quotation.user?.email}</p>
          <p>Phone: {quotation.address?.phone}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Erentals</h2>
          <p>Erentals</p>
          <p>123 Rental Lane</p>
          <p>Delhi, India</p>
          <p>support@erentals.in</p>
          <p>+91-9876543210</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Requested Items</h2>
      <div className="border rounded-lg p-4 mb-6">
        {quotation.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <div>
              <p className="font-medium">{item.product?.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {item.days} days | {item.quantity} pcs
                {item.pricingType === "length_width" && item.length > 0 && (
                  <> | {item.length} {item.unit || "ft"}</>
                )}
                {item.pricingType === "area" && item.length > 0 && item.width > 0 && (
                  <> | {item.length}x{item.width} {item.unit || "sqft"}</>
                )}
                {" | " + (item.withService ? "With Service" : "Without Service")}
              </p>
            </div>
            <p>₹{item.finalPrice}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">Charges</h2>
      <div className="text-sm space-y-1 mb-6">
        <p>Base Amount: ₹{quotation.totalAmount}</p>
        <p>Transportation: ₹{quotation.transportationCharge || 0}</p>
        <p>Labour Charge: ₹{quotation.labourCharge || 0}</p>
        <p>Discount: ₹{quotation.discountAmount}</p>
        <p className="font-bold text-lg">Total: ₹{quotation.finalAmount}</p>
      </div>

      {/* ✅ Download Invoice */}
      {quotation.status === "approved" && quotation.invoiceUrl && (
        <div className="mt-6">
          <Button onClick={() => window.open(quotation.invoiceUrl, "_blank")}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      )}
    </div>
  );
}
