import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'text-encoding'

// Import web streams polyfill for TransformStream and other stream APIs
import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill'

// Add basic polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Add fetch polyfills if needed
if (!global.Response) {
  global.Response = require('whatwg-fetch').Response
}
if (!global.Request) {
  global.Request = require('whatwg-fetch').Request
}
if (!global.Headers) {
  global.Headers = require('whatwg-fetch').Headers
}

// Add Web Streams API polyfills (required by MSW v2)
global.ReadableStream = global.ReadableStream || ReadableStream
global.WritableStream = global.WritableStream || WritableStream
global.TransformStream = global.TransformStream || TransformStream

// Mock BroadcastChannel (required by MSW v2)
global.BroadcastChannel = global.BroadcastChannel || class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true
  }
}

// Mock AbortController if not available (usually available in Node 16+)
if (!global.AbortController) {
  global.AbortController = class AbortController {
    constructor() {
      this.signal = {
        aborted: false,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() { return true }
      }
    }
    abort() {
      this.signal.aborted = true
    }
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

// Global test utilities
global.createMockCamera = (overrides = {}) => ({
  id: 'test-camera-1',
  name: 'Test Camera',
  rtsp_url: 'rtsp://test.camera:554/stream',
  is_active: true,
  status_message: 'Connected',
  tags: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
})

global.createMockPaginatedResponse = (items = [], overrides = {}) => ({
  items,
  total: items.length,
  page: 1,
  size: 10,
  pages: Math.ceil(items.length / 10),
  ...overrides
})