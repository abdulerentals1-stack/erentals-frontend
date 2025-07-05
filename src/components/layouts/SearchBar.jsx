'use client';

import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = ({ searchUI, setSearchUI }) => {
  const [searchField, setSearchField] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchField.trim()) {
      router.push(`/product-search?search=${encodeURIComponent(searchField)}`);
      setSearchUI(false);
    }
  };

  return (
    searchUI && (
      <div className="fixed top-0 left-0 w-full h-full bg-white z-[70] p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Search</p>
          <X className="cursor-pointer" onClick={() => setSearchUI(false)} />
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 border px-3 py-2 rounded bg-gray-100">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            placeholder="Search rental items..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </form>
      </div>
    )
  );
};

export default SearchBar;
