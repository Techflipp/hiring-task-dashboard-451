'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { camerasQueryFn, camerasQueryKey } from '@/app/_lib/react-query/queries/cameras.queries';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function CameraList({
  params,
}: {
  params: { camera_name: string; page: number; size: number };
}) {
  const { page, size } = params;
  const { data, isLoading, error } = useQuery({
    queryKey: camerasQueryKey(params),
    queryFn: () => camerasQueryFn(params),
  });

  const router = useRouter();
  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams({ page: String(newPage), size: String(size) });
    router.push(`/?${query.toString()}`);
  };

  const handlePageSizeChange = (newSize: string) => {
    const query = new URLSearchParams({ page: '1', size: newSize });
    router.push(`/?${query.toString()}`);
  };

  if (isLoading) {
    return <Skeleton className='h-[80vh] w-full' />;
  }
  if (error) {
    return <div className='text-red-500'>Error loading cameras.</div>;
  }

  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / size), 1);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='space-y-2 p-6'>
      <div className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data?.data?.items.map((camera) => (
          <Card key={camera.id} className='rounded-2xl shadow-md'>
            <Link href={`/${camera.id}`}>
              <CardContent className='p-4'>
                <div className='h-48 w-full'>
                  <Image
                    src={camera.snapshot}
                    alt='Preview'
                    width={800}
                    height={192}
                    unoptimized
                    className='h-auto w-auto rounded-lg object-cover'
                  />
                </div>
                <div className='mt-4 space-y-1'>
                  <h3 className='text-lg font-semibold'>{camera.name}</h3>
                  <p className='text-muted-foreground text-sm'>{camera.rtsp_url}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {camera.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        className='text-xs'
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <p className='mt-2 text-sm text-green-600'>{camera.status_message}</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <div className='flex flex-col items-center justify-between gap-4 px-6 md:flex-row'>
        <div className='flex items-center gap-2'>
          <span className='w-20'>Page size:</span>
          <Select value={String(size)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='w-[80px]'>
              <SelectValue placeholder='Size' />
            </SelectTrigger>
            <SelectContent className='cursor-pointer'>
              <SelectItem value='6'>6</SelectItem>
              <SelectItem value='12'>12</SelectItem>
              <SelectItem value='24'>24</SelectItem>
              <SelectItem value='48'>48</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                className='cursor-pointer'
              />
            </PaginationItem>
            {pageNumbers.map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  isActive={num === page}
                  onClick={() => handlePageChange(num)}
                  className='cursor-pointer'
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                className='cursor-pointer'
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
