'use client';

import { useState } from 'react';
import { applyCoupon, removeCoupon } from '@/services/cartService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CouponBox({ onUpdated }) {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setApplying(true);
      await applyCoupon(code);
      toast.success("Coupon applied!");
      setApplied(true);
      onUpdated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to apply coupon");
    } finally {
      setApplying(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeCoupon();
      toast.success("Coupon removed");
      setCode('');
      setApplied(false);
      onUpdated?.();
    } catch {
      toast.error("Failed to remove coupon");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Coupon</h2>

      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={applying || applied}
        />
        {applied ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? "Removing..." : "Remove"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Applying..." : "Apply"}
          </Button>
        )}
      </div>

      {applied && (
        <p className="text-green-600 text-sm">✅ Coupon applied successfully!</p>
      )}
    </div>
  );
}
