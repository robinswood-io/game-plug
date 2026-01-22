import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'

/**
 * Example test file showing Vitest + NestJS pattern
 * Use this as template for migrating existing Jest specs
 */

describe('Example Service Tests', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      // providers: [YourService],
      // imports: [ConfigModule],
    }).compile()
  })

  describe('mocking with vi', () => {
    it('should mock functions', () => {
      const mockFn = vi.fn()
      mockFn('test')

      expect(mockFn).toHaveBeenCalledWith('test')
      expect(mockFn).toHaveBeenCalledOnce()
    })

    it('should mock return values', () => {
      const mockFn = vi.fn()
        .mockReturnValueOnce('first')
        .mockReturnValueOnce('second')

      expect(mockFn()).toBe('first')
      expect(mockFn()).toBe('second')
    })

    it('should mock implementations', () => {
      const mockFn = vi.fn((a: number, b: number) => a + b)

      expect(mockFn(2, 3)).toBe(5)
      expect(mockFn).toHaveBeenCalledWith(2, 3)
    })
  })

  describe('spies', () => {
    it('should spy on methods', () => {
      const obj = {
        method: () => 'original',
      }

      const spy = vi.spyOn(obj, 'method').mockReturnValue('mocked')

      expect(obj.method()).toBe('mocked')
      expect(spy).toHaveBeenCalled()

      spy.mockRestore()
    })
  })

  describe('async operations', () => {
    it('should handle promises', async () => {
      const mockFn = vi.fn()
        .mockResolvedValueOnce({ data: 'test' })

      const result = await mockFn()

      expect(result).toEqual({ data: 'test' })
    })

    it('should handle rejections', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('Test error'))

      await expect(mockFn()).rejects.toThrow('Test error')
    })
  })

  describe('globals from vitest', () => {
    it('should have describe, it, expect available globally', () => {
      // These are available without import when using globals: true
      // in vitest.config.ts
      expect(true).toBe(true)
    })
  })
})
