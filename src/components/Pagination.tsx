interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < pages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className="px-4 py-2 border rounded-l disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 border-t border-b">
        Page {page} of {pages}
      </span>
      <button
        onClick={handleNext}
        disabled={page === pages}
        className="px-4 py-2 border rounded-r disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
