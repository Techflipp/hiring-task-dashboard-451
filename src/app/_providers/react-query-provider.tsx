'use client';

import { ReactNode, useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getClientQueryClient } from '../_lib/react-query/client';

type Props = {
  children: ReactNode;
};

export function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(getClientQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
