"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import Spinner from "./Spinner";
export default function DynamicPagination({
  dynamicPage,
  totalPages,
  setDynamicPage,
  refetch,
  isFetching,
}: {
  dynamicPage: number;
  totalPages: number;
  refetch: () => void;
  setDynamicPage: (page: number) => void;
  isFetching: boolean;
}) {
  const handlePageChange = (page: number) => {
    setDynamicPage(page);
  };

  useEffect(() => {
    refetch();
  }, [dynamicPage, refetch]);
  return (
    <Pagination className="w-full my-6 overflow-hidden">
      <PaginationContent className="flex-wrap items-center justify-center">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(dynamicPage - 1)}
            disabled={dynamicPage === 1}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>
        {!isFetching ? (
          [...Array(totalPages)?.keys()].map((page) => (
            <PaginationItem key={page + 1}>
              <PaginationLink
                isActive={dynamicPage === page + 1}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <PaginationItem className="flex flex-center">
            <Spinner />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(dynamicPage + 1)}
            disabled={dynamicPage === totalPages}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
