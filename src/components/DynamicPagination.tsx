"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
export default function DynamicPagination({
  dynamicPage,
  totalPages,
}: {
  dynamicPage: number;
  totalPages: number | null | undefined;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    const pageCheck: boolean = page <= Number(totalPages);
    if (page && pageCheck && totalPages) {
      params.set("page", page.toString());
      replace(`${pathname}?${params.toString()}`);
    } else {
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
    }
  };

  //handling visible buttons logic

  const rangeStart = dynamicPage - 2 > 0 ? dynamicPage - 2 : 0;
  const rangeEnd = dynamicPage === totalPages ? totalPages : dynamicPage + 2;
  return (
    <Pagination className="my-6 w-full justify-center overflow-hidden lg:justify-end">
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(dynamicPage - 1)}
            disabled={dynamicPage === 1}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>
        {[...Array(totalPages)?.keys()]
          .slice(rangeStart, rangeEnd)
          .map((page) => (
            <PaginationItem key={page + 1}>
              <PaginationLink
                isActive={dynamicPage === page + 1}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

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
