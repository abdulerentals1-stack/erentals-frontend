'use client';

export default function PriceBox({ priceData }) {
  if (!priceData) return <p className="text-sm text-gray-500">Calculating price...</p>;

  return (
    <div className="p-4 border rounded mt-4 bg-gray-50">
      <h4 className="font-semibold text-lg mb-2">Final Price:</h4>
      <div>
        <p className="text-black text-xl font-bold">₹{priceData.finalPrice}</p>
        <p className="text-xs text-gray-500">Base: ₹{priceData.basePrice}</p>
        <p className="text-xs text-gray-500">
          Discounted: ₹{priceData.discountPrice} + Days ({priceData.breakdown.days}) +{' '}
          {priceData.serviceCharge > 0 ? `Service ₹${priceData.serviceCharge}` : 'No Service'}
        </p>
      </div>
    </div>
  );
}
