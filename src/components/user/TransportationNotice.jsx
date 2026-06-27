'use client';

export default function TransportationNotice({ advancePercentage = 100 }) {
  return (
    <p className="text-sm text-yellow-700">
      {advancePercentage === 100 ? (
        "🚚 Note: Transportation & setup/labour charges will be calculated and billed separately after admin review."
      ) : (
        "🚚 Note: Transportation & setup/labour charges will be calculated by the admin and added to your remaining balance."
      )}
    </p>
  );
}
