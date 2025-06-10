'use client';

import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface CameraSearchProps {
  onSearchChange: (search: string) => void;
  initialValue?: string;
}

export function CameraSearch({ onSearchChange, initialValue = '' }: CameraSearchProps) {
  const [search, setSearch] = useState(initialValue);

  useEffect(() => {
    const debounced = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => clearTimeout(debounced);
  }, [search, onSearchChange]);

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search cameras by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {search && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}