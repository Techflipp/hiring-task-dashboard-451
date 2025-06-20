'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CustomDateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function CustomDateInput({ value, onChange, className = '', placeholder = 'Select date' }: CustomDateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('.')[0]; // Returns format: YYYY-MM-DDTHH:mm:ss
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Set time to start of day (00:00:00)
    newDate.setHours(0, 0, 0, 0);
    onChange(formatDateForAPI(newDate));
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && new Date(value).getDate() === day && 
                        new Date(value).getMonth() === currentDate.getMonth() &&
                        new Date(value).getFullYear() === currentDate.getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-colors
            ${isSelected 
              ? 'bg-[#043872] text-white shadow-md' 
              : 'hover:bg-[#032a54] hover:text-white hover:shadow-sm'
            }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-[#032a54] hover:text-white rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-[#032a54] hover:text-white rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-base bg-[#043872] text-white rounded-md border border-[#043872] hover:bg-[#032a54] transition-colors"
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <Calendar className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-[280px] mt-1 bg-white rounded-[10px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-3 bg-[#043872] text-white">
            <h3 className="text-sm font-medium">Select Date</h3>
          </div>
          {renderCalendar()}
        </div>
      )}
    </div>
  );
} 