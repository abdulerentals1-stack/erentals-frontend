'use client';
import { useState } from 'react';

const tabs = [
  { key: 'description', label: 'Description' },
  { key: 'faq', label: 'FAQs' },
  { key: 'delivery', label: 'Delivery & Pickup' },
  { key: 'terms', label: 'Terms & Conditions' },
];

export default function ProductDetailsTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return <p className="text-sm text-gray-700 whitespace-pre-line">{product.description}</p>;
      case 'faq':
        return <p className="text-sm text-gray-700 whitespace-pre-line">{product.faq}</p>;
      case 'delivery':
        return <p className="text-sm text-gray-700 whitespace-pre-line">{product.deliveryAndPickup}</p>;
      case 'terms':
        return <p className="text-sm text-gray-700 whitespace-pre-line">{product.termsAndConditions}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow-sm border">
        {renderContent()}
      </div>
    </div>
  );
}
