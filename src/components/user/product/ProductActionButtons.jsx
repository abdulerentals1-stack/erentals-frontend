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
    <div className="flex flex-col gap-3 mt-6">
      {/* Add to Rental Button - Primary Action */}
      <Button
        className="h-14 rounded-xl bg-[#003459] hover:bg-[#002240] cursor-pointer text-white flex items-center justify-center gap-2 w-full text-base font-bold shadow-md shadow-[#003459]/20 transition-all duration-300"
        onClick={() => handleAddToCart(true)}
        disabled={loadingType !== null}
      >
        {loadingType === "rental" ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
            Processing...
          </>
        ) : (
          <>
            <Package size={20} />
            Rent Now
          </>
        )}
      </Button>

      <div className="grid grid-cols-2 gap-3 w-full min-w-0">
        {/* Add to Quote Button - Secondary Action */}
        <Button
          className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-[#003459] flex items-center justify-center gap-1.5 font-semibold whitespace-normal px-2 transition-all duration-300 shadow-sm min-w-0"
          onClick={handleAddToQuote}
          disabled={loadingType !== null}
        >
          {loadingType === "quote" ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#003459]" />
              Adding...
            </>
          ) : (
            <>
              <FileText size={18} className="shrink-0" />
              <span className="truncate">Quote</span>
            </>
          )}
        </Button>

        {/* Add to Cart Button - Secondary Action */}
        <Button
          className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-[#003459] flex items-center justify-center gap-1.5 font-semibold whitespace-normal px-2 transition-all duration-300 shadow-sm min-w-0"
          onClick={() => handleAddToCart(false)}
          disabled={loadingType !== null}
        >
          {loadingType === "cart" ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#003459]" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={18} className="shrink-0" />
              <span className="truncate">Cart</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
