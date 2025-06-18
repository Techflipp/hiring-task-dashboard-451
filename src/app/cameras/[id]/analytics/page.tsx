"use client";
import React from 'react';
import { FiChevronLeft, FiFilter, FiX } from 'react-icons/fi';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import Link from 'next/link';
import FilterPanel from '@/components/FilterPanel';
import AnalyticsPageHooks from '@/hooks/AnalyticsPageHooks';

export default function AnalyticsPage() {

  const {
    data,
    loading,
    error,
    filters,
    showFilterPanel,
    tempFilters,
    applyFilters,
    resetFilters,
    activeFiltersCount,
    id,
    setShowFilterPanel,
    setFilters,
    setTempFilters
  } = AnalyticsPageHooks();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-80 rounded-lg"></div>
            <div className="bg-gray-200 h-80 rounded-lg"></div>
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error || 'No analytics data available'}</p>
          <Link
            href={`/cameras/${id}`}
            className="mt-2 px-4 py-2 bg-gray-200 rounded-3xl cursor-pointer hover:bg-gray-300"
          >
            Back to Camera
          </Link>
          <span className='mx-2'>OR</span>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-gray-200 rounded-3xl cursor-pointer hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href={`/cameras/${id}`}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        
        <div className="ml-auto flex items-center">
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
              {activeFiltersCount}
            </span>
          )}
          <button 
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
      )}

      {/* Active Filters Bar */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-indigo-800">Active Filters:</h3>
            <button 
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(filters).map(([key, value]) => (
              <div 
                key={key} 
                className="bg-white border border-indigo-200 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="font-medium text-indigo-700 capitalize">
                  {key.replace('_', ' ')}:
                </span>
                <span className="ml-1">
                  {value.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
                <button 
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters[key];
                    setFilters(newFilters);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnalyticsCharts data={data} />
    </div>
  );
}