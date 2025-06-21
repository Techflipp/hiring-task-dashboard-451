import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number | string) => void;
    isLoading?: boolean;
}
// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }:PaginationProps) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious || isLoading}
                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300"
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-1">
                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-4 py-3 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                disabled={isLoading}
                                className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium disabled:cursor-not-allowed ${page === currentPage
                                    ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600'
                                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext || isLoading}
                className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300"
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
};

export default Pagination;