'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { useRouter } from 'next/navigation'

interface Props {
  page: number
  pages: number
  search: string
  size: number
}

export const CameraPagination = ({ page, pages, search, size }: Props) => {
  const router = useRouter()

  const goToPage = (p: number) => {
    router.push(`/cameras?search=${search}&page=${p}&size=${size}`)
  }

  const visiblePages = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => {
    if (pages <= 5) return true
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) return true
    return false
  })

  const showEllipsisBefore = visiblePages[0] > 1
  const showEllipsisAfter = visiblePages[visiblePages.length - 1] < pages

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) goToPage(page - 1)
            }}
          />
        </PaginationItem>

        {showEllipsisBefore && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => goToPage(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {visiblePages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault()
                goToPage(p)
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEllipsisAfter && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => goToPage(pages)}>{pages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page < pages) goToPage(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
