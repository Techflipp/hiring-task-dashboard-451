import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoding: React.FunctionComponent = () => {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {[...Array(8)].map((_, i) => (
        <Card key={i} className='rounded-2xl shadow-md'>
          <CardContent className='animate-pulse space-y-4 p-4'>
            <div className='h-48 w-full'>
              <Skeleton className='h-full w-full rounded-lg' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-3/4 rounded-md' />
              <Skeleton className='h-4 w-full rounded-md' />
              <div className='mt-2 flex flex-wrap gap-2'>
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className='h-4 w-12 rounded-full' />
                ))}
              </div>
              <Skeleton className='mt-2 h-4 w-1/2 rounded-md' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardLoding;
