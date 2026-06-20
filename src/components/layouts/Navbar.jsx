'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { ShoppingCart, Search, Menu, FileText, Camera, UserRound, Sparkles, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import DropDown from './DropDown';
import MobileSidebar from './MobileSidebar';
import SearchBar from './SearchBar';
import LocationSelect from './LocationSelect';
import SearchMobile from '../user/SearchMobile';
import { Input } from '../ui/input';

const Navbar = () => {
  const [iconShow, setIconShow] = useState(true);
  const [searchUI, setSearchUI] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchField(e.target.value);  // ✅ Do NOT trim here
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchField.trim();  // ✅ Trim here only
    if (query) {
      router.push(`/product-search?search=${encodeURIComponent(query)}`);
    }
  };

  const handleIconToggle = useCallback(() => {
    setIconShow((prev) => !prev);
  }, []);

  const handleQuoteClick = (e) => {
    e.preventDefault(); // prevent redirect if used inside a <Link>
    toast.info('📞 This service is not available online. Please contact our team at +91 98673 48165 for a quote.');
  };

  return (
    <header className="relative border-b md:h-[5.2rem] h-16 bg-white w-full">
      <nav className="fixed bg-white md:border-b top-0 left-0 z-50 h-16 md:h-[5.2rem] w-full flex px-2 sm:px-12 md:px-16 lg:px-12 2xl:px-28 justify-between items-center">
        <div className="flex items-center justify-between w-full gap-4 md:gap-10">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-4 md:mr-8">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <Image
                  src="/e-rental-logo.png"
                  alt="e-Rentals Mumbai – Event Equipment Rental"
                  width={200}
                  height={200}
                  priority // 👈 forces SSR load
                  className="w-20 sm:w-24 md:w-28 h-auto object-contain"
                />
            </Link>
          </div>

          <div className="relative grow md:hidden">
               <form onSubmit={handleSearchSubmit} >
                <Search  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    name="search"
                    type="search"
                    placeholder="Search for Rental Item..."
                    value={searchField}
                    onChange={handleSearchChange}
                    className='pl-10 h-10 bg-[#F3F9FB]'
                  />
                </form>
             </div>


          {/* Mobile menu icons */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="p-2">
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
            <Link href="/services" className="flex cursor-pointer items-center gap-1 text-sm text-gray-700 hover:text-black">
              <Sparkles className="w-5 h-5" />
              Services
            </Link>

            <span className="border-l h-6 mx-2" />

            <Link href="/quotation-checkout" className="flex cursor-pointer items-center gap-1 text-sm text-gray-700 hover:text-black">
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

            {/* Call button removed per user request */}
          </div>
        </div>


        {/* Mobile overlays */}
        <MobileSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <SearchBar searchUI={searchUI} setSearchUI={setSearchUI} />
      </nav>
      {/* <SearchMobile /> */}
    </header>
  );
};

export default Navbar;
