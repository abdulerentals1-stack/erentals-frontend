'use client'
import { useState } from 'react';
import { Search,  Camera} from 'lucide-react';
import { useRouter } from 'next/navigation';



const SearchMobile = () => {

  const [searchField, setSearchField] = useState('');

    const router = useRouter()

    const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchField(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchField) {
      router.push(`/product-search?search=${encodeURIComponent(searchField)}`);
    }
  };



  return (
    <div className="md:hidden flex items-center gap-3 grow px-2 sm:px-12 md:px-16 lg:px-12 py-2 mt-16">
            <form onSubmit={handleSearchSubmit} className="flex items-center  grow bg-white border rounded h-10 2xl:h-14 px-4">
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
  )
}

export default SearchMobile
