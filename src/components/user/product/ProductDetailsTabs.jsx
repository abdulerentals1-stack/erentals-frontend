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
      {/* Tab buttons */}
      <div className="flex gap-2 border-b overflow-x-auto whitespace-nowrap scrollbar-hide border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 cursor-pointer py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded shadow-sm border">{renderContent()}</div>
    </div>
  );
}
