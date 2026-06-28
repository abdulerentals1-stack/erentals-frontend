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

  // Find the next tier the user hasn't unlocked yet (under reversed volume discounts)
  let nextTier = null;
  const productDiscountPrice = product?.discountPrice || basePrice;
  for (let i = 0; i < allThresholds.length; i++) {
    if (currentQty < allThresholds[i].value) {
      const nextPrice = allThresholds[i + 1]
        ? allThresholds[i + 1].price
        : productDiscountPrice;
      nextTier = {
        value: allThresholds[i].value,
        price: nextPrice,
      };
      break;
    }
  }

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
  
  const unitRateBase = finalDayPrice / days;
  const serviceChargePerUnit = userValue > 0 ? (serviceCharge / userValue) : 0;
  const dailyServiceChargePerUnit = days > 0 ? (serviceChargePerUnit / days) : 0;
  const unitRateTotal = unitRateBase + dailyServiceChargePerUnit;

  const dailyTotalRate = formData?.withService ? (finalPrice / days) : (rentalPrice / days);

  const unitPlural = priceData.unit || (product?.pricingType === 'area' ? 'sq.ft' : product?.pricingType === 'length_width' ? 'ft' : 'pcs');
  const unitSingular = unitPlural === 'pcs' ? 'pc' : unitPlural;

  return (
    <div className="mt-4 flex flex-col gap-3">


      {/* ✅ Next tier nudge — if not on highest tier */}
      {nextTier && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-semibold text-sm">💡 Add {nextTier.value - currentQty} more to unlock ₹{nextTier.price}/{unitSingular}</p>
            <p className="text-amber-600 text-xs mt-0.5">
              Save {Math.round(((basePrice - nextTier.price) / basePrice) * 100)}% per {unitSingular === 'pc' ? 'piece' : unitSingular} at {nextTier.value}+ {unitPlural}
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
          <div className="flex flex-col items-end text-right">
            {formData?.withService && dailyServiceChargePerUnit > 0 && (
              <span className="text-xs text-gray-500 font-medium mb-0.5">
                ₹{formatPrice(unitRateBase)} + ₹{formatPrice(dailyServiceChargePerUnit)} <span className="text-[10px] text-gray-400 font-normal">(service)</span>
              </span>
            )}
            <span className="text-base font-bold text-gray-800">
              {formData?.withService && dailyServiceChargePerUnit > 0 ? (
                <span>
                  ₹{formatPrice(unitRateTotal)} <span className="text-xs font-medium text-gray-500">/ {unitPlural} / day</span>
                </span>
              ) : (
                <span>
                  ₹{formatPrice(unitRateBase)} <span className="text-xs font-medium text-gray-500">/ {unitPlural} / day</span>
                </span>
              )}
            </span>
          </div>
        </div>


        {/* Total Cost */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="text-gray-900 font-extrabold text-lg">Total Cost</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              ₹{formatPrice(formData?.withService ? unitRateTotal : unitRateBase)} × {userValue} {unitPlural} × {days} {days === 1 ? 'day' : 'days'}
            </span>
          </div>
          <span className="text-[#003459] text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">₹{formatPrice(finalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
