import React, { useState, useEffect } from 'react';
import { DemographicsResult, Gender, Age } from '@/types';

interface DemographicsResultsTableProps {
  results: DemographicsResult[] | undefined;
}

type FieldConfig = {
  key: keyof DemographicsResult;
  label: string;
  format: (value: unknown) => string;
};

export default function DemographicsResultsTable({ results = [] }: DemographicsResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset to first page when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results found for the selected filters.</p>
      </div>
    );
  }

  // Define the fields we want to display in order with proper type safety
  const fields: FieldConfig[] = [
    { 
      key: 'gender', 
      label: 'Gender', 
      format: (value: unknown) => {
        if (value === Gender.MALE) return 'Male';
        if (value === Gender.FEMALE) return 'Female';
        return String(value || 'N/A');
      } 
    },
    { 
      key: 'age', 
      label: 'Age Group', 
      format: (value: unknown) => {
        if (!value) return 'N/A';
        const ageMap: Record<string, string> = {
          [Age.ZERO_EIGHTEEN]: '0-18',
          [Age.NINETEEN_THIRTY]: '19-30',
          [Age.THIRTYONE_FORTYFIVE]: '31-45',
          [Age.FORTYSIX_SIXTY]: '46-60',
          [Age.SIXTYPLUS]: '60+'
        };
        return ageMap[String(value)] || String(value);
      } 
    },
    { 
      key: 'emotion', 
      label: 'Emotion', 
      format: (value: unknown) => {
        if (!value) return 'N/A';
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      } 
    },
    { 
      key: 'ethnicity', 
      label: 'Ethnicity', 
      format: (value: unknown) => {
        if (!value) return 'N/A';
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      } 
    },
  ];

  return (
    <div className="overflow-x-auto mt-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Raw Data <span className="text-sm font-normal text-gray-500">({results.length} records)</span>
          </h2>
          {results.length > 0 && (
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields.map((field) => (
                  <th
                    key={field.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((result, index) => (
                <tr key={`${result.id}-${index}`} className="hover:bg-gray-50">
                  {fields.map((field) => {
                    const value = result[field.key];
                    const formattedValue = field.format(value);
                    
                    // Determine badge style based on field and value
                    const getBadgeStyle = (): string => {
                      const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
                      
                      if (field.key === 'gender') {
                        const gender = String(value).toLowerCase();
                        if (gender === Gender.MALE) return `${baseStyle} bg-blue-100 text-blue-800`;
                        if (gender === Gender.FEMALE) return `${baseStyle} bg-pink-100 text-pink-800`;
                      }
                      
                      const styleMap: Record<string, string> = {
                        'emotion': 'bg-purple-100 text-purple-800',
                        'age': 'bg-green-100 text-green-800',
                        'ethnicity': 'bg-yellow-100 text-yellow-800',
                      };
                      
                      return `${baseStyle} ${styleMap[field.key] || 'bg-gray-100 text-gray-800'}`;
                    };
                    
                    return (
                      <td
                        key={`${result.id}-${field.key}`}
                        className="px-4 py-3 text-sm text-gray-700"
                      >
                        <span className={getBadgeStyle()}>
                          {formattedValue}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {results.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, results.length)}
                  </span>{' '}
                  of <span className="font-medium">{results.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show page numbers around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
