/**
 * Base abstract class for payment gateways
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

/**
 * Abstract base class that provides common functionality for all gateways
 */
export abstract class BaseGateway implements PaymentGateway {
  protected config?: GatewayConfig
  protected initialized = false

  constructor(public readonly provider: GatewayProvider) {}

  /**
   * Initialize the gateway with configuration
   */
  async initialize(config: GatewayConfig): Promise<void> {
    this.validateConfig(config)
    this.config = config
    this.initialized = true
  }

  /**
   * Validate gateway configuration
   */
  protected validateConfig(config: GatewayConfig): void {
    if (!config.apiKey) {
      throw new Error(`API key is required for ${this.provider} gateway`)
    }
    if (config.provider !== this.provider) {
      throw new Error(
        `Invalid provider: expected ${this.provider}, got ${config.provider}`
      )
    }
  }

  /**
   * Ensure gateway is initialized before operations
   */
  protected ensureInitialized(): void {
    if (!this.initialized || !this.config) {
      throw new Error(`${this.provider} gateway not initialized`)
    }
  }

  /**
   * Validate payment request
   */
  protected validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Invalid payment amount')
    }
    if (!request.currency) {
      throw new Error('Currency is required')
    }
  }

  /**
   * Validate refund request
   */
  protected validateRefundRequest(request: RefundRequest): void {
    if (!request.transactionId) {
      throw new Error('Transaction ID is required for refund')
    }
    if (request.amount !== undefined && request.amount <= 0) {
      throw new Error('Invalid refund amount')
    }
  }

  // Abstract methods that must be implemented by concrete gateways
  abstract charge(request: PaymentRequest): Promise<PaymentResponse>
  abstract refund(request: RefundRequest): Promise<PaymentResponse>
  abstract verify(): Promise<boolean>
  abstract listTransactions(limit?: number): Promise<Transaction[]>
}
