'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// DRY Sub-component for custom numeric inputs
function NumberInput({ label, field, value, min = 1, max, warning, onUpdate, unit }) {
  return (
    <div className="bg-gray-50/50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-1.5 min-w-0">
      <label className="text-[11px] sm:text-xs font-semibold text-gray-700">
        {label} {unit && <span className="text-[10px] text-gray-400 font-normal">({unit})</span>}
      </label>
      <div className={`flex items-center bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
        warning ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-300'
      }`}>
        <button
          type="button"
          onClick={() => onUpdate(field, Number(value || 1) - 1)}
          className="h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-bold transition-all text-base shrink-0 select-none cursor-pointer border-r border-gray-100"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onUpdate(field, e.target.value)}
          className="w-full text-center focus:outline-none focus:ring-0 border-0 outline-none h-8 sm:h-9 text-sm bg-transparent px-1 min-w-0 font-medium text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onUpdate(field, Number(value || 0) + 1)}
          className="h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-bold transition-all text-base shrink-0 select-none cursor-pointer border-l border-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function ProductInputs({ product, formData, setFormData, unitinfo }) {
  const pricingType = product?.pricingType;
  const maxStock = product?.stock && product.stock > 0 ? product.stock : 10000;

  const [warnings, setWarnings] = useState({});

  const update = (field, value) => {
    if (value === '') {
      setFormData((prev) => ({ ...prev, [field]: '' }));
      setWarnings((prev) => ({ ...prev, [field]: null }));
      return;
    }

    let num = Number(value);
    if (num < 1) num = 1;

    let warningMsg = null;
    
    // Cap maximum values to prevent computational overflows and set inline warnings
    if (field === 'days' && num >= 365) {
      if (num > 365) {
        num = 365;
        warningMsg = 'Max rental is 365 days';
      }
    }
    if (field === 'quantity') {
      if (num > maxStock) {
        warningMsg = `Cannot exceed ${maxStock} ${unitinfo || 'units'}`;
      }
      if (num > 10000) {
        num = 10000;
      }
    } else if (['length', 'width'].includes(field) && num >= 10000) {
      if (num > 10000) {
        num = 10000;
        warningMsg = `Max ${field} is 10,000`;
      }
    }

    setWarnings((prev) => ({ ...prev, [field]: warningMsg }));
    setFormData((prev) => ({ ...prev, [field]: num }));
  };

  useEffect(() => {
    if (pricingType === 'quantity') {
      setFormData((prev) => ({ ...prev, length: 1, width: 1 }));
    }
  }, [pricingType]);

  const activeField = Object.keys(warnings).find((key) => warnings[key]);
  const activeMsg = activeField ? warnings[activeField] : null;

  const getLinkDetails = (field) => {
    if (field === 'days') return { text: 'Contact for Long-term Rental', href: '/contact-us' };
    if (field === 'quantity') return { text: 'Contact for Bulk Booking', href: '/contact-us' };
    return { text: 'Contact for Custom Requirements', href: '/contact-us' };
  };

  const linkDetails = activeField ? getLinkDetails(activeField) : null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1 w-full min-w-0">
      <NumberInput
        label="Days"
        field="days"
        value={formData.days}
        max={365}
        warning={warnings.days}
        onUpdate={update}
      />

      <NumberInput
        label="Quantity"
        field="quantity"
        value={formData.quantity}
        max={10000}
        warning={warnings.quantity}
        onUpdate={update}
        unit="pcs"
      />

      {['length_width', 'area'].includes(pricingType) && (
        <NumberInput
          label="Length"
          field="length"
          value={formData.length}
          max={10000}
          warning={warnings.length}
          onUpdate={update}
          unit={unitinfo}
        />
      )}

      {pricingType === 'area' && (
        <NumberInput
          label="Width"
          field="width"
          value={formData.width}
          max={10000}
          warning={warnings.width}
          onUpdate={update}
          unit={unitinfo}
        />
      )}

      {/* Unified Action Warning Banner */}
      {activeMsg && linkDetails && (
        <div className="col-span-2 mt-2 p-3 bg-red-50/80 border border-red-100/70 rounded-xl flex items-center justify-between text-xs text-red-700 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-sm shrink-0">⚠️</span>
            <span className="font-semibold text-[11px] sm:text-xs">{activeMsg}</span>
          </div>
          <Link
            href={linkDetails.href}
            className="text-[#003459] hover:underline font-bold transition-all flex items-center gap-0.5 shrink-0 ml-3 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200/50 text-[10px] sm:text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            {linkDetails.text} →
          </Link>
        </div>
      )}
    </div>
  );
}
