'use client';

import Link from 'next/link';
import {
  X, User, LogOut, Home, ShoppingCart, FileText, Box,
  Facebook, Instagram, Twitter, Linkedin,
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
      <div>
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

          <Link href="/checkout" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <ShoppingCart size={18} /> Cart
          </Link>

          <Link href="/myaccount/Request%20Quote" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <FileText size={18} /> Quote
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
            <Link href="/auth/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <User size={18} /> Login / Signup
            </Link>
          )}
        </nav>
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
