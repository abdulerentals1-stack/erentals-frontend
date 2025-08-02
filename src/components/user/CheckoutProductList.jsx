'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeCartItem } from "@/services/cartService";
import { Trash2 } from "lucide-react";

export default function CheckoutProductList({ cart, onUpdated }) {
  const [deletingId, setDeletingId] = useState(null);
  const items = cart?.cart?.items || cart?.quotationCart?.items || []

  console.log(items)

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Your Items</h2>

      {items.map((item) => (
        <div
          key={item._id}
          className="flex gap-4 justify-between items-start border-b pb-4"
        >
          {/* Left: Image + Name */}
          <div className="flex gap-4 flex-1">
            <Link href={`/products/${item?.product?.slug}`} className="shrink-0">
              <img
                src={item.product?.images[0]?.url || "/placeholder.png"}
                alt={item.product?.name}
                className="w-16 h-16 object-cover rounded border"
              />
            </Link>
            <div>
              <Link
                href={`/products/${item?.product?.slug}`}
                className="font-medium hover:underline text-blue-600"
              >
                {item?.product?.name}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
  {item?.days} days | {item.quantity} pcs

  {item?.pricingType === "length_width" && item?.length > 0 && (
    <> | {item?.length} {item.unit || "ft"}</>
  )}

  {item.pricingType === "area" && item.length > 0 && item.width > 0 && (
    <> | {item.length}x{item.width} {item.unit || "sqft"}</>
  )}

  {" | " + (item.withService ? "With Service" : "Without Service")}
</p>


            </div>
          </div>

          {/* Right: Price + Remove */}
          <div className="text-right space-y-1">
            <p className="font-semibold text-lg">₹{item.finalPrice}</p>
            <Button
              variant="ghost"
              size="icon"
              disabled={deletingId === item._id}
              onClick={async () => {
                try {
                  setDeletingId(item._id);
                  await removeCartItem(item._id);
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
      ))}
    </div>
  );
}
