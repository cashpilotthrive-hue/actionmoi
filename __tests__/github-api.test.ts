/**
 * Unit tests for src/github-api.ts
 */
import { describe, expect, it } from '@jest/globals'
import { parseRepository } from '../src/github-api.js'

describe('github-api.ts', () => {
  describe('parseRepository', () => {
    it('Parses repository string correctly', () => {
      const result = parseRepository('owner/repo')
      expect(result.owner).toBe('owner')
      expect(result.repo).toBe('repo')
    })

    it('Uses GITHUB_REPOSITORY environment variable when no repository provided', () => {
      const originalEnv = process.env.GITHUB_REPOSITORY
      process.env.GITHUB_REPOSITORY = 'test-owner/test-repo'

      const result = parseRepository()
      expect(result.owner).toBe('test-owner')
      expect(result.repo).toBe('test-repo')

      process.env.GITHUB_REPOSITORY = originalEnv
    })

    it('Throws error for invalid repository format', () => {
      expect(() => parseRepository('invalid')).toThrow(
        'Invalid repository format'
      )
    })

    it('Throws error for empty repository string', () => {
      const originalEnv = process.env.GITHUB_REPOSITORY
      delete process.env.GITHUB_REPOSITORY

      expect(() => parseRepository()).toThrow('Invalid repository format')

      process.env.GITHUB_REPOSITORY = originalEnv
    })
  })
})
