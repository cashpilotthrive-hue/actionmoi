/**
 * Unit tests for Square gateway
 */
import { jest } from '@jest/globals'
import { SquareGateway } from '../src/gateways/square-gateway.js'
import {
  Currency,
  GatewayProvider,
  PaymentStatus
} from '../src/types/payment.js'
import type { GatewayConfig } from '../src/types/payment.js'

describe('SquareGateway', () => {
  let gateway: SquareGateway
  let config: GatewayConfig

  beforeEach(() => {
    gateway = new SquareGateway()
    config = {
      provider: GatewayProvider.SQUARE,
      apiKey: 'sq_test_key',
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
  })

  describe('charge', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('processes a successful payment', async () => {
      const response = await gateway.charge({
        amount: 300,
        currency: Currency.GBP,
        description: 'Square test payment'
      })

      expect(response.status).toBe(PaymentStatus.SUCCESS)
      expect(response.amount).toBe(300)
      expect(response.currency).toBe(Currency.GBP)
      expect(response.transactionId).toBeTruthy()
      expect(response.transactionId).toMatch(/^sq_/)
    })

    it('handles customer ID and payment method', async () => {
      const response = await gateway.charge({
        amount: 500,
        currency: Currency.USD,
        customerId: 'CUST-123',
        paymentMethodId: 'PM-456'
      })

      expect(response.status).toBe(PaymentStatus.SUCCESS)
    })
  })

  describe('refund', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('processes a successful refund', async () => {
      const response = await gateway.refund({
        transactionId: 'sq_test123',
        amount: 150
      })

      expect(response.status).toBe(PaymentStatus.REFUNDED)
      expect(response.transactionId).toMatch(/^sqrf_/)
    })
  })

  describe('verify', () => {
    it('successfully verifies credentials', async () => {
      await gateway.initialize(config)
      const result = await gateway.verify()
      expect(result).toBe(true)
    })
  })

  describe('listTransactions', () => {
    beforeEach(async () => {
      await gateway.initialize(config)
    })

    it('lists transactions successfully', async () => {
      const transactions = await gateway.listTransactions(4)

      expect(transactions).toBeInstanceOf(Array)
      expect(transactions.length).toBeGreaterThan(0)
      expect(transactions.length).toBeLessThanOrEqual(4)

      const transaction = transactions[0]
      expect(transaction.id).toMatch(/^sq_/)
      expect(transaction.description).toContain('Square transaction')
    })
  })
})
