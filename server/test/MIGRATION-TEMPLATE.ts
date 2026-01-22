/**
 * Template for migrating existing Jest tests to Vitest
 * Copy this pattern for each .spec.ts file you're converting
 */

// ============================================================================
// BEFORE: Jest Pattern
// ============================================================================

/*
import { Test } from '@nestjs/testing'
import { jest } from '@jest/globals'
import { describe, it, expect } from '@jest/globals'

describe('UserService', () => {
  let service: UserService
  let mockRepository: any

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: mockRepository },
      ],
    }).compile()

    service = module.get(UserService)
  })

  it('should find user by id', async () => {
    const mockUser = { id: 1, name: 'John' }
    mockRepository.findById.mockResolvedValue(mockUser)

    const result = await service.findById(1)

    expect(result).toEqual(mockUser)
    expect(mockRepository.findById).toHaveBeenCalledWith(1)
  })

  it('should throw if user not found', async () => {
    mockRepository.findById.mockRejectedValue(new Error('Not found'))

    await expect(service.findById(999)).rejects.toThrow('Not found')
  })
})
*/

// ============================================================================
// AFTER: Vitest Pattern
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'

describe('UserService', () => {
  let service: UserService
  let module: TestingModule
  let mockRepository: any

  // Setup before each test
  beforeEach(async () => {
    // Create mock repository
    mockRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    }

    // Create test module
    module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: mockRepository },
      ],
    }).compile()

    // Get service instance
    service = module.get(UserService)
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'John Doe' }
      mockRepository.findById.mockResolvedValue(mockUser)

      // Act
      const result = await service.findById(1)

      // Assert
      expect(result).toEqual(mockUser)
      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(mockRepository.findById).toHaveBeenCalledOnce()
    })

    it('should throw if user not found', async () => {
      // Arrange
      const error = new Error('User not found')
      mockRepository.findById.mockRejectedValue(error)

      // Act & Assert
      await expect(service.findById(999)).rejects.toThrow('User not found')
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockRepository.findById.mockRejectedValue(
        new Error('Database connection failed')
      )

      // Act & Assert
      await expect(service.findById(1)).rejects.toThrow(
        'Database connection failed'
      )
    })
  })

  describe('save', () => {
    it('should save user successfully', async () => {
      // Arrange
      const userData = { name: 'Jane Doe', email: 'jane@example.com' }
      const savedUser = { id: 2, ...userData }
      mockRepository.save.mockResolvedValue(savedUser)

      // Act
      const result = await service.save(userData)

      // Assert
      expect(result).toEqual(savedUser)
      expect(mockRepository.save).toHaveBeenCalledWith(userData)
    })
  })

  describe('with HTTP calls', () => {
    it('should fetch user from external API', async () => {
      // Import at top: import { addMockHandler } from './setup'
      // import { http, HttpResponse } from 'msw'

      /*
      addMockHandler(
        http.get('https://api.example.com/users/:id', ({ params }) => {
          return HttpResponse.json({
            id: params.id,
            name: 'External User',
          })
        })
      )

      const result = await service.fetchFromAPI(1)

      expect(result).toEqual({
        id: 1,
        name: 'External User',
      })
      */
    })
  })
})

// ============================================================================
// Key Changes Summary
// ============================================================================

/*
1. Import Changes:
   ❌ import { jest } from '@jest/globals'
   ❌ import { describe, it, expect } from '@jest/globals'
   ✅ import { describe, it, expect, beforeEach, vi } from 'vitest'

2. Mock Creation:
   ❌ jest.fn()
   ✅ vi.fn()

3. Spy on Methods:
   ❌ jest.spyOn(obj, 'method')
   ✅ vi.spyOn(obj, 'method')

4. Mock Module:
   ❌ jest.mock('./module')
   ✅ vi.mock('./module')

5. HTTP Mocking:
   ❌ nock('https://api.example.com').get('/users').reply(200, {})
   ✅ addMockHandler(http.get('https://api.example.com/users', () => ...))

6. Verify Calls:
   ❌ expect(mock).toHaveBeenCalled()
   ✅ expect(mock).toHaveBeenCalled() // Same API

7. Assert Count:
   ❌ expect(mock).toHaveBeenCalledTimes(1)
   ✅ expect(mock).toHaveBeenCalledOnce() // New shorthand

8. Clear/Reset:
   ❌ jest.clearAllMocks(), jest.resetAllMocks()
   ✅ vi.clearAllMocks(), vi.resetAllMocks() (auto-reset in afterEach)
*/

// ============================================================================
// Best Practices
// ============================================================================

/*
1. Arrange-Act-Assert Pattern
   - Organize tests clearly
   - Makes debugging easier

2. Nested Describe Blocks
   - Group related tests
   - Better organization
   - Clearer test output

3. Mock Only What's Needed
   - Don't mock internal calls
   - Keep tests focused
   - Easier maintenance

4. Use Meaningful Names
   - should do X when Y
   - avoid test1, test2, etc
   - helps with debugging

5. Handlers Reset Automatically
   - No need to manually reset MSW handlers
   - afterEach hook does it automatically
   - Prevents state leaking between tests
*/
