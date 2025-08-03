"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeCartItem } from "@/services/cartService";
import { removeQuotationCartItem } from "@/services/quotationCartServices";
import { Trash2 } from "lucide-react";

export default function CheckoutProductList({ cart, onUpdated }) {
  const [deletingId, setDeletingId] = useState(null);

  const isQuotation = !!cart?.quotationCart;  // ✅ Check if it's quotation
  const items = isQuotation ? cart?.quotationCart?.items : cart?.cart?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Your Items</h2>

      {items.map((item) => {
        const product = item?.product;
        const productSlug = product?.slug || "#";
        const productImage = product?.images?.[0]?.url || "/placeholder.png";
        const productName = product?.name || "Unnamed Product";
        const unit = item?.unit || (item?.pricingType === "area" ? "sqft" : "ft");

        return (
          <div
            key={item?._id}
            className="flex gap-4 justify-between items-start border-b pb-4"
          >
            {/* Left: Image + Name */}
            <div className="flex gap-4 flex-1">
              <Link href={`/products/${productSlug}`} className="shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-16 h-16 object-cover rounded border"
                />
              </Link>
              <div>
                <Link
                  href={`/products/${productSlug}`}
                  className="font-medium hover:underline text-blue-600"
                >
                  {productName}
                </Link>

                <p className="text-sm text-gray-600 mt-1">
                  {item?.days ?? "N/A"} days | {item?.quantity ?? 0} pcs
                  {item?.pricingType === "length_width" && item?.length > 0 && (
                    <> | {item?.length} {unit}</>
                  )}
                  {item?.pricingType === "area" &&
                    item?.length > 0 &&
                    item?.width > 0 && (
                      <> | {item?.length}x{item?.width} {unit}</>
                  )}
                  {" | " + (item?.withService ? "With Service" : "Without Service")}
                </p>
              </div>
            </div>

            {/* Right: Price + Remove */}
            <div className="text-right space-y-1">
              <p className="font-semibold text-lg">
                ₹{item?.finalPrice?.toFixed(2) ?? "0.00"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                disabled={deletingId === item?._id}
                onClick={async () => {
                  try {
                    setDeletingId(item?._id);
                    if (isQuotation) {
                      await removeQuotationCartItem(item?._id);
                    } else {
                      await removeCartItem(item?._id);
                    }
                    toast.success("Item removed");
                    onUpdated?.();
                  } catch {
                    toast.error("Failed to remove item");
                  } finally {
                    setDeletingId(null);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
