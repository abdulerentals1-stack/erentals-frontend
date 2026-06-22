'use client';

/**
 * PriceBox
 * 
 * Pricing logic:
 *  - basePrice   = the default per-item price (no threshold matched)
 *  - thresholds  = sorted tiers e.g. [{ value:10, price:90 }, { value:20, price:80 }]
 *  - When user qty >= threshold.value, the threshold's price applies
 *  - The backend calculates this and returns: isBulkApplied, matchedThresholdValue, discountPrice (active price)
 *  - We show ALL tiers so the customer can see what price they unlock at each qty level
 */
export default function PriceBox({ priceData, product, formData }) {
  if (!priceData) return <p className="text-sm text-gray-500">Calculating price...</p>;

  const allThresholds = (priceData.thresholds || product?.thresholds || [])
    .filter((t) => t.value > 0 && t.price > 0)
    .sort((a, b) => a.value - b.value); // ascending by qty

  const isBulkApplied = priceData.isBulkApplied;
  const activePrice = priceData.discountPrice; // the unit price backend resolved
  const basePrice = priceData.basePrice;
  const currentQty = formData?.quantity || 1;

  // Find the next tier the user hasn't unlocked yet
  const nextTier = allThresholds.find((t) => currentQty < t.value);

  // Savings vs base
  const savedPerUnit = basePrice - activePrice;
  const savedPercent = basePrice > 0 && savedPerUnit > 0
    ? Math.round((savedPerUnit / basePrice) * 100)
    : 0;

  const userValue = priceData.userValue || currentQty;
  const finalDayPrice = priceData.finalDayPrice || activePrice;
  const serviceCharge = priceData.serviceCharge || 0;
  const finalPrice = priceData.finalPrice || (userValue * finalDayPrice + serviceCharge);
  const rentalPrice = finalPrice - serviceCharge;
  const dayWiseVariationPercent = product?.dayWiseVariationPercent || 0;
  const days = formData?.days || 1;

  const formatPrice = (val) => Number(val) % 1 === 0 ? val : Number(val).toFixed(2);
  const dailyUnitRate = finalDayPrice / days;
  const dailyTotalRate = rentalPrice / days;

  return (
    <div className="mt-4 flex flex-col gap-3">

      {/* ✅ Bulk Tiers Overview — always visible if tiers exist */}
      {allThresholds.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulk Pricing Tiers</span>
          </div>
          <div className="divide-y divide-gray-100">
            {/* Base price row (< first threshold) */}
            <div className={`flex items-center justify-between px-4 py-2.5 ${!isBulkApplied ? 'bg-blue-50' : 'bg-white'}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">1 – {allThresholds[0].value - 1} pcs</span>
                {!isBulkApplied && (
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-semibold">ACTIVE</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {product?.discountPrice && product.discountPrice < basePrice && (
                  <span className="text-xs text-gray-400 line-through">₹{basePrice}</span>
                )}
                <span className="text-sm font-semibold text-gray-900">₹{product?.discountPrice || basePrice}/pc</span>
              </div>
            </div>

            {/* Each threshold tier */}
            {allThresholds.map((tier, i) => {
              const isActive = isBulkApplied && priceData.matchedThresholdValue === tier.value;
              const rangeEnd = allThresholds[i + 1] ? `${allThresholds[i + 1].value - 1}` : '+';
              const pctOff = Math.round(((basePrice - tier.price) / basePrice) * 100);

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-2.5 ${isActive ? 'bg-emerald-50' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-700">
                      {tier.value}{rangeEnd !== '+' ? `–${rangeEnd}` : '+'} pcs
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-semibold">ACTIVE</span>
                    )}
                    {pctOff > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">{pctOff}% OFF</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 line-through">₹{basePrice}</span>
                    <span className={`text-sm font-bold ${isActive ? 'text-emerald-700' : 'text-gray-900'}`}>₹{tier.price}/pc</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ Next tier nudge — if not on highest tier */}
      {nextTier && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-semibold text-sm">💡 Add {nextTier.value - currentQty} more to unlock ₹{nextTier.price}/pc</p>
            <p className="text-amber-600 text-xs mt-0.5">
              Save {Math.round(((basePrice - nextTier.price) / basePrice) * 100)}% per piece at {nextTier.value}+ pcs
            </p>
          </div>
        </div>
      )}

      {/* ✅ Main price breakdown box */}
      <div className="p-5 border border-gray-200/80 rounded-xl bg-gray-50 shadow-sm flex flex-col gap-4">
        
        {/* Unit Price Row */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Unit Price</span>
            {savedPercent > 0 && (
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                You save {savedPercent}% vs base price
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            {savedPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">₹{basePrice} / {priceData.unit || 'pcs'} / day</span>
            )}
            <span className="text-base font-bold text-gray-800">
              ₹{formatPrice(dailyUnitRate)} <span className="text-xs font-medium text-gray-500">/ {priceData.unit || 'pcs'} / day</span>
            </span>
          </div>
        </div>

        {/* Breakdown for total qty */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Per Day Breakdown</span>
            <span className="text-[11px] text-gray-500 mt-0.5">
              {userValue} {priceData.unit || 'pcs'} × ₹{formatPrice(dailyUnitRate)}/day
            </span>
          </div>
          <span className="text-base font-bold text-gray-800">
            ₹{formatPrice(dailyTotalRate)}/day
          </span>
        </div>

        {/* Service Charge (if applicable) */}
        {serviceCharge > 0 && (
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/60 text-xs text-gray-600">
            <span className="font-semibold uppercase tracking-wider text-gray-500">Service Charge</span>
            <span className="font-bold text-gray-800">+₹{serviceCharge}</span>
          </div>
        )}

        {/* Total Cost */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="text-gray-900 font-extrabold text-lg">Total Cost</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              ₹{formatPrice(dailyTotalRate)}/day × {days} {days === 1 ? 'day' : 'days'} {serviceCharge > 0 ? `+ ₹${serviceCharge} service charge` : ''}
            </span>
          </div>
          <span className="text-[#003459] text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">₹{finalPrice}</span>
        </div>
      </div>
    </div>
  );
}
