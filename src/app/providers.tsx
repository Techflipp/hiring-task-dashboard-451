'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
        setIsLocalStorageAvailable(true);
      }
    } catch (error) {
      console.error('localStorage is not available:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isClient && process.env.NODE_ENV === 'development' && isLocalStorageAvailable && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
} 