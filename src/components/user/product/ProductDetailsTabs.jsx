"use client";

import { useState } from "react";
import ProductEnquiryForm from "../ProductEnquiryForm";

const tabs = [
  { key: "description", label: "Description" },
  { key: "faq", label: "FAQs" },
  { key: "delivery", label: "Delivery & Pickup" },
  { key: "terms", label: "Terms & Conditions" },
  { key: "enquiry", label: "Enquiry" },
];

export default function ProductDetailsTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    if (activeTab === "enquiry") {
      return <ProductEnquiryForm product={product} />;
    }

    const contentMap = {
      description: product.description,
      faq: product.faq,
      delivery: product.deliveryAndPickup,
      terms: product.termsAndConditions,
    };

    const html = contentMap[activeTab] || "";

    return (
      <div
        className="prose max-w-none text-sm text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="mt-10">
      {/* Tab Navigation */}
      <div className="flex space-x-1 sm:space-x-4 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-3 sm:px-4 shrink-0 whitespace-nowrap text-sm sm:text-base font-semibold transition-all duration-300 border-b-2 ${
              activeTab === tab.key
                ? 'border-[#003459] text-[#003459]'
                : 'border-transparent text-gray-500 hover:text-[#003459] hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded shadow-sm border overflow-x-auto">
        {renderContent()}
      </div>
    </div>
  );
}
