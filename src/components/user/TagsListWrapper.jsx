'use client';

import { usePathname } from 'next/navigation';

export default function TagsListWrapper({ children }) {
  const pathname = usePathname();
  
  // Explicitly hide on checkout and auth pages
  const isHidden = 
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  if (isHidden) return null;
  
  // Show on home, category search, products page, tags pages, and product details (/products/[slug])
  const isVisible = 
    pathname === '/' || 
    pathname === '/products' || 
    pathname.startsWith('/products/') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/tags/');

  if (!isVisible) return null;

  return <>{children}</>;
}
