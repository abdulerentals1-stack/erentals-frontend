'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeCartItem } from "@/services/cartService";
import { Trash2 } from "lucide-react"; // You can use any icon from lucide

export default function CheckoutProductList({ cart, onUpdated }) {
  const items = cart?.cart?.items || [];

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Your Items</h2>

      {items.map(item => (
        <div
          key={item.product._id}
          className="flex gap-4 justify-between items-start border-b pb-4"
        >
          {/* Left: Image + Name */}
          <div className="flex gap-4 flex-1">
            <Link href={`/products/${item.product.slug}`} className="shrink-0">
              <img
                src={item.product.images[0].url || "/placeholder.png"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded border"
              />
            </Link>
            <div>
              <Link
                href={`/products/${item.product.slug}`}
                className="font-medium hover:underline text-blue-600"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {item.days} days |{" "}
                {item.pricingType === "quantity"
                  ? `${item.quantity} qty`
                  : item.pricingType === "length_width"
                    ? `${item.length} ft`
                    : `${item.length}x${item.width} sqft`}
                {item.withService && " | With Service"}
              </p>
            </div>
          </div>

          {/* Right: Price + Remove */}
          <div className="text-right space-y-1">
            <p className="font-semibold text-lg">₹{item.finalPrice}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                try {
                  await removeCartItem(item.product._id);
                  toast.success("Item removed");
                  onUpdated?.();
                } catch {
                  toast.error("Failed to remove item");
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
