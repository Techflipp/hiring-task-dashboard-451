// __tests__/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Create MSW server
export const server = setupServer(...handlers)

// Setup MSW server for all tests
beforeAll(() => {
  // Start the server before all tests
  server.listen({
    onUnhandledRequest: 'error', // Fail tests on unhandled requests
  })
})

afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers()
})

afterAll(() => {
  // Stop the server after all tests
  server.close()
})