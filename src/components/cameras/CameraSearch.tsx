// components/cameras/CameraSearch.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';

interface CameraSearchProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export const CameraSearch: React.FC<CameraSearchProps> = ({ onSearch, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="search"
        placeholder="Search cameras..."
        value={value}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
};