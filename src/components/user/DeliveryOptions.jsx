'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TIME_SLOTS = [
  "9AM - 12PM",
  "12PM - 3PM",
  "3PM - 6PM",
  "6PM - 9PM",
];

export default function DeliveryOptions({ selectedDate, selectedSlot, setDate, setSlot }) {
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatted = today.toISOString().split("T")[0];
    setMinDate(formatted);
  }, []);

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Delivery Options</h2>

      {/* 📅 Date Picker */}
      <div>
        <label className="block text-sm mb-1">Select Delivery Date</label>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* ⏰ Time Slot Picker */}
      <div>
        <label className="block text-sm mb-2">Select Time Slot</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <Button
              key={slot}
              type="button"
              variant={selectedSlot === slot ? "default" : "outline"}
              onClick={() => setSlot(slot)}
            >
              {slot}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
