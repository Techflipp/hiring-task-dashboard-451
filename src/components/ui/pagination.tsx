import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  // const maxVisiblePagesMobile = 3;

  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const start = Math.max(currentPage - halfVisible, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);
    visiblePages = pages.slice(start - 1, end);
  }

  // let mobileVisiblePages = pages;
  // if (totalPages > maxVisiblePagesMobile) {
  //   const halfVisible = Math.floor(maxVisiblePagesMobile / 2);
  //   const start = Math.max(currentPage - halfVisible, 1);
  //   const end = Math.min(start + maxVisiblePagesMobile - 1, totalPages);
  //   mobileVisiblePages = pages.slice(start - 1, end);
  // }

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-1 sm:space-x-2",
        className
      )}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 sm:h-10 px-2 sm:px-3">
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      <div className="hidden sm:flex items-center space-x-1">
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(1)}>
              1
            </Button>
            {visiblePages[0] > 2 && <span className="px-2">...</span>}
          </>
        )}

        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}>
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2">...</span>
            )}
            <Button
              variant={currentPage === totalPages ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <div className="flex sm:hidden items-center space-x-1">
        <span className="text-sm text-gray-600">
          {currentPage} / {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 sm:h-10 px-2 sm:px-3">
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
