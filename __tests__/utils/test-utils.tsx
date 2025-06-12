// __tests__/utils/test-utils.tsx
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

const customRender = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Helper function to create a test query client with custom options
import type { QueryClientConfig } from '@tanstack/react-query'

export const createTestQueryClientWithOptions = (options?: Partial<QueryClientConfig['defaultOptions']>) => 
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        ...options?.queries,
      },
      mutations: {
        retry: false,
        ...options?.mutations,
      },
    },
  })

// Export everything from testing library
export * from '@testing-library/react'
export { customRender as render, createTestQueryClient }

// Simple test to satisfy Jest's requirement
describe('Test Utils', () => {
  it('should export render function', () => {
    expect(customRender).toBeDefined()
    expect(typeof customRender).toBe('function')
  })

  it('should create test query client', () => {
    const client = createTestQueryClient()
    expect(client).toBeDefined()
    expect(client.getDefaultOptions().queries?.retry).toBe(false)
  })
})