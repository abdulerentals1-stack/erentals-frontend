'use client';

export default function TransportationNotice({ advancePercentage = 100 }) {
  return (
    <p className="text-sm text-yellow-700">
      {advancePercentage === 100 ? (
        "🚚 Note: Transportation and/or setup/labour charges will be calculated and added by the admin after placing the order."
      ) : (
        "🚚 Note: Transportation and/or setup/labour charges will be calculated and added by the admin to your remaining balance after placing the order."
      )}
    </p>
  );
}
