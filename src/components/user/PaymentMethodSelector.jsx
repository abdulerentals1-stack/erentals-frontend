'use client';

import { Button } from "@/components/ui/button";

const METHODS = [
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "razorpay", label: "Prepaid (Razorpay)" },
];

export default function PaymentMethodSelector({ selected, onChange }) {
  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Payment Method</h2>

      <div className="grid sm:grid-cols-2 gap-2">
        {METHODS.map((method) => (
          <Button
            key={method.id}
            type="button"
            variant={selected === method.id ? "default" : "outline"}
            onClick={() => onChange(method.id)}
          >
            {method.label}
          </Button>
        ))}
      </div>

      {selected === "razorpay" && (
        <p className="text-green-600 text-sm pt-1">
          💸 You’ll only pay <strong>20% in advance</strong>. The remaining amount will be requested after admin confirmation.
        </p>
      )}
    </div>
  );
}
