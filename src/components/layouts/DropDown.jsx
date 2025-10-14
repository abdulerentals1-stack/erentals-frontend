'use client';

import { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer text-sm text-gray-700 hover:text-black"
      >
        <User className="w-5 h-5" />
        {user?.name?.split(' ')[0] || 'User'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
           <Link
            href="/qoutation"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            Qoutation
          </Link>
          <Link
            href="/address"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            Address
          </Link>
          {/* <Link
            href="/address"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link> */}
          <button
            onClick={logout}
            className="w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
          >
            <LogOut className="w-4 h-4 inline-block mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DropDown;
