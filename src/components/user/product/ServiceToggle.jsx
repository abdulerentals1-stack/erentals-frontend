// components/product/ServiceToggle.jsx
'use client';

import { Button } from "@/components/ui/button";

export default function ServiceToggle({ formData, setFormData }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4 w-full min-w-0">
      <Button
        className={`h-10 sm:h-12 w-full min-w-0 cursor-pointer rounded-xl border text-[11px] sm:text-sm font-semibold whitespace-normal px-2 transition-all duration-300 ${
          !formData.withService  ? 'bg-[#003459] text-white hover:bg-[#002240] border-[#003459] shadow-sm'
            : 'bg-gray-50 text-[#003459] hover:bg-gray-100 border-gray-200'
        }`}
        onClick={() => setFormData((p) => ({ ...p, withService: false }))}
      >
        Without Service
      </Button>
      <Button
        className={`h-10 sm:h-12 w-full min-w-0 cursor-pointer rounded-xl border text-[11px] sm:text-sm font-semibold whitespace-normal px-2 transition-all duration-300 ${
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
