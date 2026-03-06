/**
 * Gateway factory for creating payment gateway instances
 */

import type { PaymentGateway } from '../types/payment.js'
import { GatewayProvider } from '../types/payment.js'
import { StripeGateway } from './stripe-gateway.js'
import { PayPalGateway } from './paypal-gateway.js'
import { SquareGateway } from './square-gateway.js'

/**
 * Factory class for creating payment gateway instances
 */
export class GatewayFactory {
  /**
   * Create a payment gateway instance based on provider
   */
  static createGateway(provider: GatewayProvider): PaymentGateway {
    switch (provider) {
      case GatewayProvider.STRIPE:
        return new StripeGateway()
      case GatewayProvider.PAYPAL:
        return new PayPalGateway()
      case GatewayProvider.SQUARE:
        return new SquareGateway()
      default:
        throw new Error(`Unsupported payment gateway: ${provider}`)
    }
  }

  /**
   * Create multiple gateway instances
   */
  static createGateways(providers: GatewayProvider[]): PaymentGateway[] {
    return providers.map((provider) => this.createGateway(provider))
  }

  /**
   * Get all available gateway providers
   */
  static getAvailableProviders(): GatewayProvider[] {
    return [
      GatewayProvider.STRIPE,
      GatewayProvider.PAYPAL,
      GatewayProvider.SQUARE
    ]
  }
}
