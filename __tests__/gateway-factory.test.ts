/**
 * Unit tests for Gateway Factory
 */
import { jest } from '@jest/globals'
import { GatewayFactory } from '../src/gateways/gateway-factory.js'
import { GatewayProvider } from '../src/types/payment.js'
import { StripeGateway } from '../src/gateways/stripe-gateway.js'
import { PayPalGateway } from '../src/gateways/paypal-gateway.js'
import { SquareGateway } from '../src/gateways/square-gateway.js'

describe('GatewayFactory', () => {
  describe('createGateway', () => {
    it('creates Stripe gateway', () => {
      const gateway = GatewayFactory.createGateway(GatewayProvider.STRIPE)
      expect(gateway).toBeInstanceOf(StripeGateway)
      expect(gateway.provider).toBe(GatewayProvider.STRIPE)
    })

    it('creates PayPal gateway', () => {
      const gateway = GatewayFactory.createGateway(GatewayProvider.PAYPAL)
      expect(gateway).toBeInstanceOf(PayPalGateway)
      expect(gateway.provider).toBe(GatewayProvider.PAYPAL)
    })

    it('creates Square gateway', () => {
      const gateway = GatewayFactory.createGateway(GatewayProvider.SQUARE)
      expect(gateway).toBeInstanceOf(SquareGateway)
      expect(gateway.provider).toBe(GatewayProvider.SQUARE)
    })

    it('throws error for unsupported provider', () => {
      expect(() => {
        GatewayFactory.createGateway('invalid' as GatewayProvider)
      }).toThrow('Unsupported payment gateway')
    })
  })

  describe('createGateways', () => {
    it('creates multiple gateways', () => {
      const gateways = GatewayFactory.createGateways([
        GatewayProvider.STRIPE,
        GatewayProvider.PAYPAL
      ])

      expect(gateways).toHaveLength(2)
      expect(gateways[0]).toBeInstanceOf(StripeGateway)
      expect(gateways[1]).toBeInstanceOf(PayPalGateway)
    })

    it('returns empty array for empty input', () => {
      const gateways = GatewayFactory.createGateways([])
      expect(gateways).toHaveLength(0)
    })
  })

  describe('getAvailableProviders', () => {
    it('returns all available providers', () => {
      const providers = GatewayFactory.getAvailableProviders()

      expect(providers).toContain(GatewayProvider.STRIPE)
      expect(providers).toContain(GatewayProvider.PAYPAL)
      expect(providers).toContain(GatewayProvider.SQUARE)
      expect(providers).toHaveLength(3)
    })
  })
})
