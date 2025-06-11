'use client';

import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | null = null;

export function getClientQueryClient() {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (!client) {
    client = new QueryClient();
  }
  return client;
}
