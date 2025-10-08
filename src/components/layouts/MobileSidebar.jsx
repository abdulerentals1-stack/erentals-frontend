'use client';

import Link from 'next/link';
import {
  X, User, LogOut, Home, ShoppingCart, FileText, Box,
  Facebook, Instagram, Twitter, Linkedin, Phone, LifeBuoy,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-[60] transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 flex flex-col justify-between`}
    >
      

      {/* Top Menu */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <p className="font-semibold">Menu</p>
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <Home size={18} /> Home
          </Link>

          <Link href="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <Box size={18} /> All Products
          </Link>

          <Link
            href={user ? "/checkout" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={18} /> Cart
          </Link>

          <Link
            href={user ? "/orders" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <FileText size={18} /> Orders
          </Link>

          <Link
            href={user ? "/address" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <FileText size={18} /> Address
          </Link>

          <hr className="border-gray-200" />

          {user ? (
            <>
              <Link href="/myaccount/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <User size={18} /> Profile
              </Link>
              <button onClick={logout} className="flex items-center gap-2 text-red-600">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <User size={18} /> Login / Signup
            </Link>
          )}
        </nav>
        {/* Support Section */}
      <div className="p-4 border-b flex flex-col space-y-2 border-t gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <LifeBuoy size={18} />
          Support
        </div>
        <a
          href="tel:+919867348165"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Phone size={18} />
          +91 9867348165
        </a>
      </div>
      </div>

      

      {/* Bottom Social Links */}
      <div className="p-4 border-t">
        <p className="text-sm mb-2 text-gray-500">Follow us</p>
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" className="text-gray-600 hover:text-blue-600">
            <Facebook size={20} />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="text-gray-600 hover:text-pink-500">
            <Instagram size={20} />
          </Link>
          <Link href="https://twitter.com" target="_blank" className="text-gray-600 hover:text-sky-500">
            <Twitter size={20} />
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="text-gray-600 hover:text-blue-700">
            <Linkedin size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
