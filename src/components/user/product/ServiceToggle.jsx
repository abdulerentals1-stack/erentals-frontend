// components/product/ServiceToggle.jsx
'use client';

import { Button } from "@/components/ui/button";

export default function ServiceToggle({ formData, setFormData }) {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        className={`px-4 py-6 flex-1/2 rounded border ${
          !formData.withService ? 'bg-black text-white' : 'bg-white text-black'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: false }))}
      >
        Without Service
      </Button>
      <Button
        className={`px-4 py-6 flex-1/2 rounded border ${
          formData.withService ? 'bg-black text-white' : 'bg-white text-black'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: true }))}
      >
        With Service
      </Button>
    </div>
  );
}
