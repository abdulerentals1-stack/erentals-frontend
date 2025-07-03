'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

const LocationSelect = () => {
  const [location, setLocation] = useState('Mumbai');

  return (
    <div className="flex items-center gap-1 text-sm cursor-pointer text-gray-700 hover:text-black">
      <MapPin className="w-4 h-4" />
      <span>{location}</span>
    </div>
  );
};

export default LocationSelect;
