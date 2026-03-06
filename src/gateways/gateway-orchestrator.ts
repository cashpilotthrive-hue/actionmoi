/**
 * Gateway orchestrator for managing multiple payment gateways
 */

import type {
  GatewayConfig,
  GatewayProvider,
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  Transaction
} from '../types/payment.js'
import { GatewayFactory } from './gateway-factory.js'

/**
 * Orchestrator class for managing multiple payment gateways
 */
export class GatewayOrchestrator {
  private gateways: Map<GatewayProvider, PaymentGateway> = new Map()
  private primaryGateway?: GatewayProvider

  /**
   * Add a gateway with configuration
   */
  async addGateway(config: GatewayConfig): Promise<void> {
    const gateway = GatewayFactory.createGateway(config.provider)
    await gateway.initialize(config)
    this.gateways.set(config.provider, gateway)

    // Set as primary if it's the first gateway
    if (!this.primaryGateway) {
      this.primaryGateway = config.provider
    }
  }

  /**
   * Set the primary gateway for operations
   */
  setPrimaryGateway(provider: GatewayProvider): void {
    if (!this.gateways.has(provider)) {
      throw new Error(`Gateway ${provider} not found`)
    }
    this.primaryGateway = provider
  }

  /**
   * Get a specific gateway
   */
  getGateway(provider: GatewayProvider): PaymentGateway {
    const gateway = this.gateways.get(provider)
    if (!gateway) {
      throw new Error(`Gateway ${provider} not found`)
    }
    return gateway
  }

  /**
   * Get the primary gateway
   */
  getPrimaryGateway(): PaymentGateway {
    if (!this.primaryGateway) {
      throw new Error('No primary gateway configured')
    }
    return this.getGateway(this.primaryGateway)
  }

  /**
   * Process a payment using the primary gateway
   */
  async charge(request: PaymentRequest): Promise<PaymentResponse> {
    return await this.getPrimaryGateway().charge(request)
  }

  /**
   * Process a payment using a specific gateway
   */
  async chargeWithGateway(
    provider: GatewayProvider,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    return await this.getGateway(provider).charge(request)
  }

  /**
   * Refund a payment using the primary gateway
   */
  async refund(request: RefundRequest): Promise<PaymentResponse> {
    return await this.getPrimaryGateway().refund(request)
  }

  /**
   * Refund a payment using a specific gateway
   */
  async refundWithGateway(
    provider: GatewayProvider,
    request: RefundRequest
  ): Promise<PaymentResponse> {
    return await this.getGateway(provider).refund(request)
  }

  /**
   * Verify all configured gateways
   */
  async verifyAll(): Promise<Map<GatewayProvider, boolean>> {
    const results = new Map<GatewayProvider, boolean>()

    for (const [provider, gateway] of this.gateways) {
      try {
        const isValid = await gateway.verify()
        results.set(provider, isValid)
      } catch (error) {
        results.set(provider, false)
      }
    }

    return results
  }

  /**
   * List transactions from the primary gateway
   */
  async listTransactions(limit?: number): Promise<Transaction[]> {
    return await this.getPrimaryGateway().listTransactions(limit)
  }

  /**
   * List transactions from a specific gateway
   */
  async listTransactionsFromGateway(
    provider: GatewayProvider,
    limit?: number
  ): Promise<Transaction[]> {
    return await this.getGateway(provider).listTransactions(limit)
  }

  /**
   * Get all configured gateway providers
   */
  getConfiguredProviders(): GatewayProvider[] {
    return Array.from(this.gateways.keys())
  }

  /**
   * Check if a gateway is configured
   */
  hasGateway(provider: GatewayProvider): boolean {
    return this.gateways.has(provider)
  }

  /**
   * Get count of configured gateways
   */
  getGatewayCount(): number {
    return this.gateways.size
  }
}
