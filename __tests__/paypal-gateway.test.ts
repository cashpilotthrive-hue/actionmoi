/**
 * Unit tests for PayPal gateway
 */
import { jest } from '@jest/globals'
import { PayPalGateway } from '../src/gateways/paypal-gateway.js'
import {
  Currency,
  GatewayProvider,
  PaymentStatus
} from '../src/types/payment.js'
import type { GatewayConfig } from '../src/types/payment.js'

describe('PayPalGateway', () => {
  let gateway: PayPalGateway
  let config: GatewayConfig

  beforeEach(() => {
    gateway = new PayPalGateway()
    config = {
      provider: GatewayProvider.PAYPAL,
      apiKey: 'paypal_test_key',
      secretKey: 'paypal_secret',
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
        amount: 200,
        currency: Currency.EUR,
        description: 'PayPal test payment'
      })

      expect(response.status).toBe(PaymentStatus.SUCCESS)
      expect(response.amount).toBe(200)
      expect(response.currency).toBe(Currency.EUR)
      expect(response.transactionId).toBeTruthy()
      expect(response.transactionId).toMatch(/^PAYID-/)
    })

    it('includes metadata in payment request', async () => {
      const response = await gateway.charge({
        amount: 150,
        currency: Currency.USD,
        metadata: { orderId: 'ORD-123', userId: 'USER-456' }
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
        transactionId: 'PAYID-TEST123',
        amount: 100,
        reason: 'Customer request'
      })

      expect(response.status).toBe(PaymentStatus.REFUNDED)
      expect(response.transactionId).toMatch(/^REFUND-/)
    })

    it('processes full refund when amount not specified', async () => {
      const response = await gateway.refund({
        transactionId: 'PAYID-TEST123'
      })

      expect(response.status).toBe(PaymentStatus.REFUNDED)
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
      const transactions = await gateway.listTransactions(3)

      expect(transactions).toBeInstanceOf(Array)
      expect(transactions.length).toBeGreaterThan(0)
      expect(transactions.length).toBeLessThanOrEqual(3)

      const transaction = transactions[0]
      expect(transaction.id).toMatch(/^PAYID-/)
      expect(transaction.description).toContain('PayPal transaction')
    })
  })
})
