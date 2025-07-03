'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { ShoppingCart, Search, Menu, FileText, Camera, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import DropDown from './DropDown';
import MobileSidebar from './MobileSidebar';
import SearchBar from './SearchBar';
import LocationSelect from './LocationSelect';

const Navbar = () => {
  const [iconShow, setIconShow] = useState(true);
  const [searchUI, setSearchUI] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchField(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchField) {
      router.push(`/product-search?value=${searchField}`);
    }
  };

  const handleIconToggle = useCallback(() => {
    setIconShow((prev) => !prev);
  }, []);

  return (
    <header className="relative md:h-[5.2rem] h-16 bg-white w-full">
      <nav className="border-b fixed bg-white top-0 left-0 z-50 h-16 md:h-[5.2rem] w-full flex px-2 sm:px-12 md:px-16 lg:px-20 2xl:px-28 justify-between items-center">
        <div className="flex items-center justify-between w-full gap-4 md:gap-10">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className='space-x-2'>
              {/* <Image
                src={''}
                alt="Logo"
                width={160}
                height={60}
                className="h-full w-full object-contain mix-blend-multiply"
              /> */}
              e-Renalts
            </Link>
          </div>

          {/* Mobile menu icons */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setSearchUI(true)}>
              <Search className="w-5 h-5" />
            </button>
            <Link href="/checkout">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Search Bar */}
           <div className="hidden md:flex">
            <LocationSelect />
            </div>
          <div className="hidden md:flex items-center gap-3 grow">
            <form onSubmit={handleSearchSubmit} className="flex items-center  grow bg-[#F3F9FB] border rounded h-12 2xl:h-14 px-4">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search for Rental Item..."
                value={searchField}
                onChange={handleSearchChange}
                className="w-full px-2 bg-transparent outline-none text-sm"
              />
              <Camera className="w-5 h-5 text-gray-400" />
            </form>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/myaccount/Request%20Quote" className="flex items-center gap-1 text-sm text-gray-700 hover:text-black">
              <FileText className="w-5 h-5" />
              Quote
            </Link>

            <span className="border-l h-6 mx-2" />

            <Link href="/checkout" className="flex items-center gap-1 text-sm text-gray-700 hover:text-black">
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>

            <span className="border-l h-6 mx-2" />

            {user ? (
              <DropDown />
            ) : (
              <Link href="/login" className="flex items-center gap-1 text-sm text-gray-700 hover:text-black">
                <UserRound className="w-5 h-5" />
                Login / Signup
              </Link>
            )}
          </div>
        </div>

        {/* Mobile overlays */}
        <MobileSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <SearchBar searchUI={searchUI} setSearchUI={setSearchUI} />
      </nav>
    </header>
  );
};

export default Navbar;
