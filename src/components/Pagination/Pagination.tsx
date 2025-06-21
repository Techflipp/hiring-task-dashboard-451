// components/Pagination.tsx
import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, size, onPageChange, onSizeChange }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={() => onPageChange(Math.max(page - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
      <select
        value={size}
        onChange={(e) => {
          onSizeChange(Number(e.target.value));
          onPageChange(1);
        }}
        className="ml-4 px-3 py-1 border rounded"
      >
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={50}>50 / page</option>
      </select>
    </div>
  );
};

export default Pagination;
