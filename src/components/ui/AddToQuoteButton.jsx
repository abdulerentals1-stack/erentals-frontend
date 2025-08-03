'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { addOrUpdateQuotationCartItem } from '@/services/quotationCartServices';

export default function AddToQuoteButton({ product }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleAddToQuote = async () => {
    if (!user) {
      toast.error('Please login to request a quote.');
      return router.push('/login');
    }

    if (isDisabled) return; // Prevent spam clicks
    setIsDisabled(true);

    try {
      const payload = {
        productId: product._id,
        pricingType: product.pricingType,
        withService: false,
        days: 1,
        quantity: 1,
      };

      if (product.pricingType === 'length_width') {
        payload.length = 1;
      } else if (product.pricingType === 'area') {
        payload.length = 1;
        payload.width = 1;
      }

      await addOrUpdateQuotationCartItem(payload);
      toast.success('Item added to quotation cart');
    } catch (err) {
      toast.error('Failed to add to quotation cart');
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToQuote} 
      variant="ghost" 
      className="rounded-none border-r gap-2 cursor-pointer"
      disabled={isDisabled}
    >
      <FileText className="w-4 h-4" style={{ color: '#003459' }} />
      {isDisabled ? 'Adding...' : 'Quote'}
    </Button>
  );
}
