'use client';

export default function PriceBox({ priceData }) {
  if (!priceData) {
    return (
      <div className="p-5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-center min-h-[140px] animate-pulse">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Calculating pricing details...</p>
      </div>
    );
  }

  const {
    basePrice,
    discountPrice,
    serviceCharge,
    finalPrice,
    unit,
    breakdown,
  } = priceData;

  const {
    userValue = 1,
    days = 1,
    dayWiseVariationPercent = 0,
    serviceChargePercent = 0,
  } = breakdown || {};

  // P = discountPrice (the selected unit rate after bulk threshold matching)
  const P = discountPrice || basePrice;
  const D = dayWiseVariationPercent;
  const n = days;
  const q = userValue;
  const S = serviceChargePercent;

  // Breakdown calculations for display
  const firstDayTotal = q * P;
  const additionalDaysRatePerUnit = ((n - 1) * P * D) / 100;
  const additionalDaysTotal = q * additionalDaysRatePerUnit;
  const flatServiceCharge = serviceCharge || 0;

  return (
    <div className="p-6 border border-zinc-150 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm space-y-4 transition-all duration-300">
      <div className="flex justify-between items-baseline border-b border-zinc-100 dark:border-zinc-900 pb-3">
        <h4 className="font-semibold text-zinc-900 dark:text-white text-base">Cost Summary</h4>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 rounded-full font-medium">
          {q} {unit || 'pcs'} × {n} {n === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        {/* 1. Base Rental Price (1st Day) */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Base Rental (1st Day)</span>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">₹{P.toLocaleString('en-IN')} per unit rate</p>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">
            ₹{firstDayTotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* 2. Additional Day Charge (Variation Rate) */}
        {n > 1 && (
          <div className="flex justify-between items-start border-t border-zinc-50 dark:border-zinc-900/50 pt-2.5">
            <div className="space-y-0.5">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Additional {n - 1} Day{n > 2 ? 's' : ''} ({D}% variation)
              </span>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                ₹{additionalDaysRatePerUnit >= 0 ? '+' : ''}{additionalDaysRatePerUnit.toFixed(2)} per unit total
              </p>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {additionalDaysTotal >= 0 ? '+' : ''}₹{Math.round(additionalDaysTotal).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* 3. Flat Service Charge */}
        <div className="flex justify-between items-start border-t border-zinc-50 dark:border-zinc-900/50 pt-2.5">
          <div className="space-y-0.5">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Service Charge</span>
            {flatServiceCharge > 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Flat {S}% of unit base price</p>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No service charge selected</p>
            )}
          </div>
          <span className={`font-semibold ${flatServiceCharge > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 line-through'}`}>
            ₹{flatServiceCharge.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-base">Estimated Rental:</span>
        <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          ₹{finalPrice.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
