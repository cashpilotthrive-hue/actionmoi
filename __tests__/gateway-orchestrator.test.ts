/**
 * Unit tests for Gateway Orchestrator
 */
import { jest } from '@jest/globals'
import { GatewayOrchestrator } from '../src/gateways/gateway-orchestrator.js'
import {
  Currency,
  GatewayProvider,
  PaymentStatus
} from '../src/types/payment.js'
import type { GatewayConfig } from '../src/types/payment.js'

describe('GatewayOrchestrator', () => {
  let orchestrator: GatewayOrchestrator
  let stripeConfig: GatewayConfig
  let paypalConfig: GatewayConfig

  beforeEach(() => {
    orchestrator = new GatewayOrchestrator()

    stripeConfig = {
      provider: GatewayProvider.STRIPE,
      apiKey: 'sk_test_stripe',
      environment: 'sandbox'
    }

    paypalConfig = {
      provider: GatewayProvider.PAYPAL,
      apiKey: 'paypal_test_key',
      secretKey: 'paypal_secret',
      environment: 'sandbox'
    }
  })

  describe('addGateway', () => {
    it('adds a gateway successfully', async () => {
      await expect(orchestrator.addGateway(stripeConfig)).resolves.not.toThrow()
      expect(orchestrator.hasGateway(GatewayProvider.STRIPE)).toBe(true)
    })

    it('sets first gateway as primary', async () => {
      await orchestrator.addGateway(stripeConfig)
      const primary = orchestrator.getPrimaryGateway()
      expect(primary.provider).toBe(GatewayProvider.STRIPE)
    })

    it('adds multiple gateways', async () => {
      await orchestrator.addGateway(stripeConfig)
      await orchestrator.addGateway(paypalConfig)

      expect(orchestrator.getGatewayCount()).toBe(2)
      expect(orchestrator.hasGateway(GatewayProvider.STRIPE)).toBe(true)
      expect(orchestrator.hasGateway(GatewayProvider.PAYPAL)).toBe(true)
    })
  })

  describe('setPrimaryGateway', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
      await orchestrator.addGateway(paypalConfig)
    })

    it('changes primary gateway', () => {
      orchestrator.setPrimaryGateway(GatewayProvider.PAYPAL)
      const primary = orchestrator.getPrimaryGateway()
      expect(primary.provider).toBe(GatewayProvider.PAYPAL)
    })

    it('throws error for non-existent gateway', () => {
      expect(() => {
        orchestrator.setPrimaryGateway(GatewayProvider.SQUARE)
      }).toThrow('Gateway square not found')
    })
  })

  describe('getGateway', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
    })

    it('retrieves specific gateway', () => {
      const gateway = orchestrator.getGateway(GatewayProvider.STRIPE)
      expect(gateway.provider).toBe(GatewayProvider.STRIPE)
    })

    it('throws error for non-existent gateway', () => {
      expect(() => {
        orchestrator.getGateway(GatewayProvider.SQUARE)
      }).toThrow('Gateway square not found')
    })
  })

  describe('charge', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
    })

    it('processes payment with primary gateway', async () => {
      const response = await orchestrator.charge({
        amount: 100,
        currency: Currency.USD,
        description: 'Test charge'
      })

      expect(response.status).toBe(PaymentStatus.SUCCESS)
      expect(response.amount).toBe(100)
    })

    it('processes payment with specific gateway', async () => {
      await orchestrator.addGateway(paypalConfig)

      const response = await orchestrator.chargeWithGateway(
        GatewayProvider.PAYPAL,
        {
          amount: 200,
          currency: Currency.EUR
        }
      )

      expect(response.status).toBe(PaymentStatus.SUCCESS)
      expect(response.transactionId).toMatch(/^PAYID-/)
    })
  })

  describe('refund', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
    })

    it('processes refund with primary gateway', async () => {
      const response = await orchestrator.refund({
        transactionId: 'ch_test123',
        amount: 50
      })

      expect(response.status).toBe(PaymentStatus.REFUNDED)
    })

    it('processes refund with specific gateway', async () => {
      await orchestrator.addGateway(paypalConfig)

      const response = await orchestrator.refundWithGateway(
        GatewayProvider.PAYPAL,
        {
          transactionId: 'PAYID-TEST123',
          amount: 75
        }
      )

      expect(response.status).toBe(PaymentStatus.REFUNDED)
    })
  })

  describe('verifyAll', () => {
    it('verifies all configured gateways', async () => {
      await orchestrator.addGateway(stripeConfig)
      await orchestrator.addGateway(paypalConfig)

      const results = await orchestrator.verifyAll()

      expect(results.size).toBe(2)
      expect(results.get(GatewayProvider.STRIPE)).toBe(true)
      expect(results.get(GatewayProvider.PAYPAL)).toBe(true)
    })

    it('returns empty map when no gateways configured', async () => {
      const results = await orchestrator.verifyAll()
      expect(results.size).toBe(0)
    })
  })

  describe('listTransactions', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
    })

    it('lists transactions from primary gateway', async () => {
      const transactions = await orchestrator.listTransactions(5)

      expect(transactions).toBeInstanceOf(Array)
      expect(transactions.length).toBeGreaterThan(0)
    })

    it('lists transactions from specific gateway', async () => {
      await orchestrator.addGateway(paypalConfig)

      const transactions = await orchestrator.listTransactionsFromGateway(
        GatewayProvider.PAYPAL,
        3
      )

      expect(transactions).toBeInstanceOf(Array)
      expect(transactions[0].id).toMatch(/^PAYID-/)
    })
  })

  describe('utility methods', () => {
    beforeEach(async () => {
      await orchestrator.addGateway(stripeConfig)
      await orchestrator.addGateway(paypalConfig)
    })

    it('getConfiguredProviders returns all providers', () => {
      const providers = orchestrator.getConfiguredProviders()

      expect(providers).toHaveLength(2)
      expect(providers).toContain(GatewayProvider.STRIPE)
      expect(providers).toContain(GatewayProvider.PAYPAL)
    })

    it('hasGateway checks gateway existence', () => {
      expect(orchestrator.hasGateway(GatewayProvider.STRIPE)).toBe(true)
      expect(orchestrator.hasGateway(GatewayProvider.SQUARE)).toBe(false)
    })

    it('getGatewayCount returns correct count', () => {
      expect(orchestrator.getGatewayCount()).toBe(2)
    })
  })

  describe('error handling', () => {
    it('throws error when getting primary gateway with no gateways', () => {
      expect(() => {
        orchestrator.getPrimaryGateway()
      }).toThrow('No primary gateway configured')
    })

    it('throws error when charging with no gateways', async () => {
      await expect(
        orchestrator.charge({
          amount: 100,
          currency: Currency.USD
        })
      ).rejects.toThrow('No primary gateway configured')
    })
  })
})
