'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItemClass = "block px-4 py-2 rounded hover:bg-gray-800 transition";

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden bg-gray-900 text-white px-4 py-2 fixed w-full z-50 flex justify-end items-center">
        <button onClick={() => setOpen(!open)} className="flex items-center space-x-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white w-72 fixed top-10 bottom-0 z-40
          transform transition-transform duration-300 overflow-y-auto
          right-0
          ${open ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 md:static md:right-auto
        `}
      >
        <div className="p-4 space-y-4">
          <div className="text-xl font-bold px-2">Admin Menu</div>

          <nav className="space-y-4 text-sm">
            <Link href="/admin/dashboard" className={navItemClass}>📊 Dashboard</Link>
            {/* <Link href="/admin/users" className={navItemClass}>👤 Users</Link> */}

            {/* Accordion Menu */}
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="user" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left">👤 Users</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/all-user" className={navItemClass}>All User</Link>
                  
                </AccordionContent>
              </AccordionItem>


              <AccordionItem value="products" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left">📦 Products</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/products" className={navItemClass}>All Products</Link>
                  <Link href="/admin/products/add" className={navItemClass}>Add Product</Link>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="banner" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left whitespace-nowrap">📦 Content Manager</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/banners" className={navItemClass}>Banners</Link>
                  <Link href="/admin/categories" className={navItemClass}>Categories</Link>
                  <Link href="/admin/tags" className={navItemClass}>Tags</Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="orders" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left">🧾 Orders</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/orders" className={navItemClass}>All Orders</Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quotations" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left">🧾 Quotation</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/quotation" className={navItemClass}>All Quotations</Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="coupons" className="border-none">
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-800 rounded text-left">🏷 Coupons</AccordionTrigger>
                <AccordionContent className="ml-2 space-y-1">
                  <Link href="/admin/coupons" className={navItemClass}>Coupons</Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <button onClick={logout} className={navItemClass}>🚪 Logout</button>
          </nav>
        </div>
      </aside>
    </>
  );
}
