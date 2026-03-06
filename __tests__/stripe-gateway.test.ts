/**
 * Unit tests for Stripe gateway
 */
import { jest } from '@jest/globals'
import { StripeGateway } from '../src/gateways/stripe-gateway.js'
import {
  Currency,
  GatewayProvider,
  PaymentStatus
} from '../src/types/payment.js'
import type { GatewayConfig } from '../src/types/payment.js'

describe('StripeGateway', () => {
  let gateway: StripeGateway
  let config: GatewayConfig

  beforeEach(() => {
    gateway = new StripeGateway()
    config = {
      provider: GatewayProvider.STRIPE,
      apiKey: 'sk_test_123456',
      environment: 'sandbox'
    }
  })

  describe('initialization', () => {
    it('initializes successfully with valid config', async () => {
      await expect(gateway.initialize(config)).resolves.not.toThrow()
    })

    it('throws error when API key is missing', async () => {
      const invalidConfig = { ...config, apiKey: '' }
      await expect(gateway.initialize(invalidConfig)).rejects.toThrow(
        'API key is required'
      )
    })

    it('throws error when provider mismatch', async () => {
      const invalidConfig = {
        ...config,
        provider: GatewayProvider.PAYPAL
      }
      await expect(gateway.initialize(invalidConfig)).rejects.toThrow(
        'Invalid provider'
      )
    })
  })

  describe('charge', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('processes a successful payment', async () => {
      const response = await gateway.charge({
        amount: 100,
        currency: Currency.USD,
        description: 'Test payment'
      })

      expect(response.status).toBe(PaymentStatus.SUCCESS)
      expect(response.amount).toBe(100)
      expect(response.currency).toBe(Currency.USD)
      expect(response.transactionId).toBeTruthy()
      expect(response.transactionId).toMatch(/^ch_/)
    })

    it('throws error when not initialized', async () => {
      const uninitializedGateway = new StripeGateway()
      await expect(
        uninitializedGateway.charge({
          amount: 100,
          currency: Currency.USD
        })
      ).rejects.toThrow('not initialized')
    })

    it('throws error for invalid amount', async () => {
      await expect(
        gateway.charge({
          amount: 0,
          currency: Currency.USD
        })
      ).rejects.toThrow('Invalid payment amount')
    })

    it('throws error for negative amount', async () => {
      await expect(
        gateway.charge({
          amount: -100,
          currency: Currency.USD
        })
      ).rejects.toThrow('Invalid payment amount')
    })
  })

  describe('refund', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('processes a successful refund', async () => {
      const response = await gateway.refund({
        transactionId: 'ch_test123',
        amount: 50
      })

      expect(response.status).toBe(PaymentStatus.REFUNDED)
      expect(response.transactionId).toBeTruthy()
      expect(response.transactionId).toMatch(/^re_/)
    })

    it('throws error when transaction ID is missing', async () => {
      await expect(
        gateway.refund({
          transactionId: ''
        })
      ).rejects.toThrow('Transaction ID is required')
    })

    it('throws error for invalid refund amount', async () => {
      await expect(
        gateway.refund({
          transactionId: 'ch_test123',
          amount: -50
        })
      ).rejects.toThrow('Invalid refund amount')
    })
  })

  describe('verify', () => {
    it('successfully verifies credentials', async () => {
      await gateway.initialize(config)
      const result = await gateway.verify()
      expect(result).toBe(true)
    })

    it('throws error when not initialized', async () => {
      await expect(gateway.verify()).rejects.toThrow('not initialized')
    })
  })

  describe('listTransactions', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('lists transactions successfully', async () => {
      const transactions = await gateway.listTransactions(5)

      expect(transactions).toBeInstanceOf(Array)
      expect(transactions.length).toBeGreaterThan(0)
      expect(transactions.length).toBeLessThanOrEqual(5)

      const transaction = transactions[0]
      expect(transaction.id).toBeTruthy()
      expect(transaction.amount).toBeGreaterThan(0)
      expect(transaction.status).toBe(PaymentStatus.SUCCESS)
    })

    it('uses default limit when not specified', async () => {
      const transactions = await gateway.listTransactions()
      expect(transactions).toBeInstanceOf(Array)
    })
  })
})
