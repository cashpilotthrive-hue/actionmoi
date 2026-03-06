/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('verify operation', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'verify',
          provider: 'stripe',
          'api-key': 'sk_test_123',
          environment: 'sandbox'
        }
        return inputs[name] || ''
      })
    })

    it('verifies gateway successfully', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Initializing stripe gateway')
      )
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('gateway initialized successfully')
      )
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Operation completed successfully')
      )
      expect(core.setOutput).toHaveBeenCalledWith('verified', 'true')
      expect(core.setOutput).toHaveBeenCalledWith('providers', 'stripe')
    })
  })

  describe('charge operation', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string, options?: unknown) => {
        const inputs: Record<string, string> = {
          operation: 'charge',
          provider: 'stripe',
          'api-key': 'sk_test_123',
          environment: 'sandbox',
          amount: '100.00',
          currency: 'usd',
          description: 'Test payment'
        }
        return inputs[name] || ''
      })
    })

    it('processes charge successfully', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Processing charge')
      )
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Payment successful')
      )
      expect(core.setOutput).toHaveBeenCalledWith('status', 'success')
      expect(core.setOutput).toHaveBeenCalledWith(
        'transaction-id',
        expect.stringMatching(/^ch_/)
      )
      expect(core.setOutput).toHaveBeenCalledWith('amount', '100')
      expect(core.setOutput).toHaveBeenCalledWith('currency', 'usd')
    })
  })

  describe('refund operation', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string, options?: unknown) => {
        const inputs: Record<string, string> = {
          operation: 'refund',
          provider: 'stripe',
          'api-key': 'sk_test_123',
          environment: 'sandbox',
          'transaction-id': 'ch_test123',
          amount: '50.00'
        }
        return inputs[name] || ''
      })
    })

    it('processes refund successfully', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Processing refund')
      )
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Refund successful')
      )
      expect(core.setOutput).toHaveBeenCalledWith('status', 'refunded')
      expect(core.setOutput).toHaveBeenCalledWith(
        'refund-id',
        expect.stringMatching(/^re_/)
      )
    })
  })

  describe('list_transactions operation', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'list_transactions',
          provider: 'stripe',
          'api-key': 'sk_test_123',
          environment: 'sandbox',
          limit: '5'
        }
        return inputs[name] || ''
      })
    })

    it('lists transactions successfully', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Listing transactions')
      )
      expect(core.info).toHaveBeenCalledWith(expect.stringContaining('Found'))
      expect(core.setOutput).toHaveBeenCalledWith(
        'transaction-count',
        expect.any(String)
      )
      expect(core.setOutput).toHaveBeenCalledWith(
        'transaction-ids',
        expect.any(String)
      )
      expect(core.setOutput).toHaveBeenCalledWith(
        'total-amount',
        expect.any(String)
      )
    })
  })

  describe('error handling', () => {
    it('fails when operation is invalid', async () => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'invalid_operation',
          provider: 'stripe',
          'api-key': 'sk_test_123'
        }
        return inputs[name] || ''
      })

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported operation')
      )
    })

    it('fails when API key is missing', async () => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'verify',
          provider: 'stripe',
          'api-key': ''
        }
        return inputs[name] || ''
      })

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining('API key is required')
      )
    })

    it('fails when amount is missing for charge', async () => {
      core.getInput.mockImplementation((name: string, options?: unknown) => {
        const inputs: Record<string, string> = {
          operation: 'charge',
          provider: 'stripe',
          'api-key': 'sk_test_123',
          amount: ''
        }
        return inputs[name] || ''
      })

      await run()

      expect(core.setFailed).toHaveBeenCalled()
    })
  })

  describe('PayPal gateway', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'verify',
          provider: 'paypal',
          'api-key': 'paypal_test_key',
          'secret-key': 'paypal_secret',
          environment: 'sandbox'
        }
        return inputs[name] || ''
      })
    })

    it('works with PayPal provider', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Initializing paypal gateway')
      )
      expect(core.setOutput).toHaveBeenCalledWith('providers', 'paypal')
    })
  })

  describe('Square gateway', () => {
    beforeEach(() => {
      core.getInput.mockImplementation((name: string) => {
        const inputs: Record<string, string> = {
          operation: 'verify',
          provider: 'square',
          'api-key': 'sq_test_key',
          environment: 'sandbox'
        }
        return inputs[name] || ''
      })
    })

    it('works with Square provider', async () => {
      await run()

      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Initializing square gateway')
      )
      expect(core.setOutput).toHaveBeenCalledWith('providers', 'square')
    })
  })
})
