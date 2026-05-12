'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  const siteDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://e-rentals.in";

  // ✅ Automatically generate Google-compliant BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteDomain
      },
      ...items.map((item, idx) => {
        const itemUrl = item.href 
          ? (item.href.startsWith('http') ? item.href : `${siteDomain}${item.href}`) 
          : undefined;

        return {
          "@type": "ListItem",
          "position": idx + 2,
          "name": item.label,
          ...(itemUrl ? { "item": itemUrl } : {}) // JSON strips undefined properties
        };
      })
    ]
  };

  return (
    <>
      {/* ✅ Centralized Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <nav aria-label="breadcrumb" className="py-2 px-3 sm:py-2.5 sm:px-4 mb-6 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-100/80 dark:border-zinc-800/80 shadow-sm inline-flex items-center flex-wrap gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 font-medium">
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={index} className="flex items-center space-x-1.5 sm:space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-gray-800 dark:text-zinc-200 truncate max-w-[120px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition truncate font-medium max-w-[120px] sm:max-w-xs">
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
