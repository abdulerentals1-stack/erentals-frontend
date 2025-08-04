// components/product/ServiceToggle.jsx
'use client';

import { Button } from "@/components/ui/button";

export default function ServiceToggle({ formData, setFormData }) {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        className={`px-4 py-6 flex-1/2 cursor-pointer rounded border ${
          !formData.withService  ? 'bg-[#003459] text-white hover:bg-[#002c4a] active:bg-[#00243b]'
            : 'bg-white text-[#003459] hover:bg-gray-100 active:bg-gray-200'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: false }))}
      >
        Without Service
      </Button>
      <Button
        className={`px-4 py-6 flex-1/2 cursor-pointer rounded border ${
          formData.withService ? 'bg-[#003459] text-white hover:bg-[#002c4a] active:bg-[#00243b]'
            : 'bg-white text-[#003459] hover:bg-gray-100 active:bg-gray-200'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: true }))}
      >
        With Service
      </Button>
    </div>
  );
}
