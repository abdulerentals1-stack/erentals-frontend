'use client';

export default function OrderTracker({ order }) {
  if (!order) return null;

  const getTimelineSteps = () => {
    const getTimestampForStatus = (status) => {
      const entry = order.statusHistory?.find(h => h.to === status);
      return entry ? new Date(entry.timestamp).toLocaleString("en-IN") : null;
    };

    if (order.status === "cancelled") {
      return [
        {
          label: "Order Placed",
          description: "Your order request has been submitted.",
          timestamp: getTimestampForStatus("placed") || new Date(order.createdAt).toLocaleString("en-IN"),
          completed: true,
        },
        {
          label: "Order Cancelled",
          description: `Order cancelled. Reason: ${order.cancellation?.reason || "Not specified"}`,
          timestamp: getTimestampForStatus("cancelled"),
          completed: true,
          isCancelled: true,
        }
      ];
    }

    return [
      {
        label: "Order Placed",
        description: "Your order request has been successfully placed.",
        timestamp: getTimestampForStatus("placed") || (["placed", "confirmed", "delivered", "returned"].includes(order.status) ? new Date(order.createdAt).toLocaleString("en-IN") : null),
        completed: ["placed", "confirmed", "delivered", "returned"].includes(order.status),
      },
      {
        label: "Order Confirmed",
        description: "Admin has verified and confirmed your booking.",
        timestamp: getTimestampForStatus("confirmed"),
        completed: ["confirmed", "delivered", "returned"].includes(order.status),
      },
      {
        label: "Delivered",
        description: "Rental equipment has been delivered.",
        timestamp: getTimestampForStatus("delivered"),
        completed: ["delivered", "returned"].includes(order.status),
      },
      {
        label: "Returned",
        description: "Rental items returned and verified.",
        timestamp: getTimestampForStatus("returned"),
        completed: order.status === "returned",
      }
    ];
  };

  const steps = getTimelineSteps();

  return (
    <div>
      <h2 className="font-semibold mb-3 text-gray-950">Order Tracker</h2>
      <div className="border rounded-lg p-5 bg-white text-sm">
        {steps.map((step, index, arr) => (
          <div key={index} className={`flex gap-4 relative ${index < arr.length - 1 ? "pb-6" : ""}`}>
            <div className="flex flex-col items-center">
              <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 ${
                step.isCancelled 
                  ? "bg-red-500 border-red-500" 
                  : step.completed 
                    ? "bg-green-600 border-green-600" 
                    : "bg-white border-gray-300"
              }`}></div>
              {index < arr.length - 1 && (
                <div className={`w-0.5 h-full absolute top-3.5 ${
                  step.completed && arr[index + 1].completed 
                    ? "bg-green-600" 
                    : "bg-gray-200"
                }`}></div>
              )}
            </div>
            <div>
              <p className={`font-semibold ${step.isCancelled ? "text-red-600" : step.completed ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              {step.timestamp && (
                <p className="text-gray-500 text-xs mt-0.5">{step.timestamp}</p>
              )}
              {step.completed && step.description && (
                <p className="text-gray-600 text-xs mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
