import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

/**
 * MSW 2.x Setup for Node environment
 * Provides mock HTTP/WS handlers for tests
 */

export const mockServer = setupServer()

/**
 * Lifecycle hooks for test environment
 */
beforeAll(() => {
  // Enable request interception before all tests
  mockServer.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  // Reset handlers after each test to prevent contamination
  mockServer.resetHandlers()
})

afterAll(() => {
  // Clean up and disable interception after all tests
  mockServer.close()
})

/**
 * Utility to add mock handlers in tests
 * Usage: addMockHandler(http.get('/api/data', () => HttpResponse.json({...})))
 */
export const addMockHandler = (handler: any) => {
  mockServer.use(handler)
}

/**
 * Utility to reset all handlers
 */
export const resetMockHandlers = () => {
  mockServer.resetHandlers()
}
