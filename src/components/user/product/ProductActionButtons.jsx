"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addOrUpdateCartItem } from "@/services/cartService";
import { addOrUpdateQuotationCartItem } from "@/services/quotationCartServices";
import { Button } from "@/components/ui/button";
import { FileText, ShoppingCart, Package } from "lucide-react";

export default function ProductActionButtons({ product, formData }) {
  const { user } = useAuth();
  const router = useRouter();

  const [loadingType, setLoadingType] = useState(null); // null | 'cart' | 'rental' | 'quote'

  const preparePayload = () => {
    const payload = {
      productId: product._id,
      pricingType: product.pricingType,
      days: formData?.days,
      withService: formData?.withService,
      quantity: formData?.quantity,
    };

    if (product.pricingType === "length_width") {
      payload.length = formData?.length;
    } else if (product.pricingType === "area") {
      payload.length = formData?.length;
      payload.width = formData?.width;
    }

    return payload;
  };

  const handleAddToCart = async (rental = false) => {
    if (!user) return router.push("/login");

    setLoadingType(rental ? "rental" : "cart");

    try {
      const payload = preparePayload();
      await addOrUpdateCartItem(payload);
      toast.success("Added to cart");

      if (rental) {
        router.push("/checkout");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingType(null);
    }
  };

  const handleAddToQuote = async () => {
    if (!user) return router.push("/login");

    setLoadingType("quote");

    try {
      const payload = preparePayload();
      await addOrUpdateQuotationCartItem(payload);
      toast.success("Added to quotation");
      // router.push("/quotation-checkout"); // ✅ Redirect to quotation page
    } catch {
      toast.error("Failed to add to quotation");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="grid gap-2 mt-4">
      <div className="grid grid-cols-2 gap-2">
        {/* Add to Quote Button */}
        <Button
          className="py-6 bg-[#003459] hover:bg-[#003459] cursor-pointer text-white flex items-center justify-center gap-2"
          onClick={handleAddToQuote}
          disabled={loadingType !== null}
        >
          {loadingType === "quote" ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
              Adding...
            </>
          ) : (
            <>
              <FileText size={18} />
              Quote
            </>
          )}
        </Button>

        {/* Add to Cart Button */}
        <Button
          className="py-6 bg-[#003459] hover:bg-[#003459] cursor-pointer text-white flex items-center justify-center gap-2"
          onClick={() => handleAddToCart(false)}
          disabled={loadingType !== null}
        >
          {loadingType === "cart" ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Cart
            </>
          )}
        </Button>
      </div>

      {/* Add to Rental Button */}
      <Button
        className="py-6 bg-[#003459] hover:bg-[#003459] cursor-pointer text-white flex items-center justify-center gap-2 w-full"
        onClick={() => handleAddToCart(true)}
        disabled={loadingType !== null}
      >
        {loadingType === "rental" ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
            Processing...
          </>
        ) : (
          <>
            <Package size={18} />
            Add To Rental
          </>
        )}
      </Button>
    </div>
  );
}
