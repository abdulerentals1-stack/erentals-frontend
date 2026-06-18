'use client';

export default function PriceBox({ priceData, product }) {
  if (!priceData) return <p className="text-sm text-gray-500">Calculating price...</p>;

  const hasBulkDiscount = product?.thresholds?.length > 0 && product?.discountPrice;
  const threshold = product?.thresholds?.[0];

  return (
    <div className="mt-6 flex flex-col gap-3">
      {hasBulkDiscount && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-emerald-800 font-bold text-sm tracking-tight">🔥 Bulk Discount Available!</span>
            <span className="text-emerald-700 text-xs mt-0.5 font-medium">
              Order {threshold.value}+ {threshold.unit} to unlock pricing at just <span className="font-bold">₹{product.discountPrice}/day</span>
            </span>
          </div>
          <span className="bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md">Save More</span>
        </div>
      )}
      
      <div className="p-5 border border-gray-200/80 rounded-xl bg-gray-50 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Per Day Cost</span>
          <span className="text-xl font-bold text-[#003459]">
            ₹{priceData.discountPrice} <span className="text-sm font-medium text-gray-500">/ {priceData.unit || 'unit'}</span>
          </span>
        </div>
        
        {priceData.serviceCharge > 0 && (
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Service Charge</span>
            <span className="text-lg font-semibold text-gray-800">
              ₹{priceData.serviceCharge}
            </span>
          </div>
        )}

        <div className="flex justify-between items-end">
          <span className="text-gray-900 font-bold text-lg mb-1">Total Cost</span>
          <span className="text-[#003459] text-4xl font-extrabold tracking-tight drop-shadow-sm">₹{priceData.finalPrice}</span>
        </div>
      </div>
    </div>
  );
}
