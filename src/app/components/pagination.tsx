"use client";

import { LeftArrow, RightArrow } from "@/components/icons/icons";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";

type Props = {
  total: number;
  size: number;
  pages: number;
  page: number;
};
function Pagination({ total, size, pages, page }: Props) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const DOTS = "...";

  const totalPages = pages;
  const startIndex = (page - 1) * size;
  const updatePage = (term: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("page", term.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const siblingCount = 0; // how many page numbers to show on each side of the current page

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalPages, siblingCount, page]);

  return (
    <Suspense fallback={<div></div>}>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + size, total)} of{" "}
          {total} cameras
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => updatePage(page - 1)}
            disabled={page === 1}
            className="px-2 md:px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {/* Previous */}
            <LeftArrow />
          </button>
          {/* {renderPageNumbers()} */}
          {paginationRange?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span key={index} className="px-4 py-2">
                  &#8230;
                </span>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={() => updatePage(Number(pageNumber))}
                  className={`px-4 py-2 border rounded-md ${
                    page === pageNumber
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
          })}

          <button
            onClick={() => updatePage(page + 1)}
            disabled={page === totalPages}
            className="px-2 md:px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <RightArrow />
          </button>
        </div>
      </div>
    </Suspense>
  );
}

export default Pagination;
