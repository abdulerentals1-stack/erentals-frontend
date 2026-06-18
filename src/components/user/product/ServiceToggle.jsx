// components/product/ServiceToggle.jsx
'use client';

import { Button } from "@/components/ui/button";

export default function ServiceToggle({ formData, setFormData }) {
  return (
    <div className="flex gap-3 mt-4">
      <Button
        className={`h-12 flex-1 cursor-pointer rounded-xl border font-semibold transition-all duration-300 ${
          !formData.withService  ? 'bg-[#003459] text-white hover:bg-[#002240] border-[#003459] shadow-sm'
            : 'bg-gray-50 text-[#003459] hover:bg-gray-100 border-gray-200'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: false }))}
      >
        Without Service
      </Button>
      <Button
        className={`h-12 flex-1 cursor-pointer rounded-xl border font-semibold transition-all duration-300 ${
          formData.withService ? 'bg-[#003459] text-white hover:bg-[#002240] border-[#003459] shadow-sm'
            : 'bg-gray-50 text-[#003459] hover:bg-gray-100 border-gray-200'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: true }))}
      >
        With Service
      </Button>
    </div>
  );
}
