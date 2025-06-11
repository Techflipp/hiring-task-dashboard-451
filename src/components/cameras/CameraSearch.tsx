import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { debounce } from 'lodash';

interface CameraSearchProps {
  onSearch: (searchTerm: string) => void;
}

export const CameraSearch: React.FC<CameraSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    (value: string) => {
      const debouncedFn = debounce((val: string) => {
        onSearch(val);
      }, 300);
      debouncedFn(value);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
};