'use client';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

export default function ProductInputs({ pricingType, formData, setFormData, unitinfo }) {
  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  useEffect(() => {
    if (pricingType === 'quantity') {
      setFormData((prev) => ({ ...prev, length: 1, width: 1 }));
    }
  }, [pricingType]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1 w-full min-w-0">
      <div className="bg-gray-50/50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1 min-w-0">
        <label className="text-[11px] sm:text-xs font-semibold text-gray-700">Days</label>
        <Input
          type="number"
          min="1"
          value={formData.days || 1}
          onChange={(e) => update('days', e.target.value)}
          className="h-8 sm:h-9 text-sm rounded bg-white w-full min-w-0"
        />
      </div>

      <div className="bg-gray-50/50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1 min-w-0">
        <label className="text-[11px] sm:text-xs font-semibold text-gray-700">
          Quantity <span className="text-[10px] text-gray-400 font-normal">(pcs)</span>
        </label>
        <Input
          type="number"
          min="1"
          value={formData.quantity || 1}
          onChange={(e) => update('quantity', e.target.value)}
          className="h-8 sm:h-9 text-sm rounded bg-white w-full min-w-0"
        />
      </div>

      {['length_width', 'area'].includes(pricingType) && (
        <div className="bg-gray-50/50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1 min-w-0">
          <label className="text-[11px] sm:text-xs font-semibold text-gray-700">
            Length <span className="text-[10px] text-gray-400 font-normal">({unitinfo})</span>
          </label>
          <Input
            type="number"
            min="1"
            value={formData.length || 1}
            onChange={(e) => update('length', e.target.value)}
            className="h-8 sm:h-9 text-sm rounded bg-white w-full min-w-0"
          />
        </div>
      )}

      {pricingType === 'area' && (
        <div className="bg-gray-50/50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1 min-w-0">
          <label className="text-[11px] sm:text-xs font-semibold text-gray-700">
            Width <span className="text-[10px] text-gray-400 font-normal">({unitinfo})</span>
          </label>
          <Input
            type="number"
            min="1"
            value={formData.width || 1}
            onChange={(e) => update('width', e.target.value)}
            className="h-8 sm:h-9 text-sm rounded bg-white w-full min-w-0"
          />
        </div>
      )}
    </div>
  );
}
