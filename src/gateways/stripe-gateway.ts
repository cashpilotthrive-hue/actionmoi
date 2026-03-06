/**
 * Stripe payment gateway implementation
 */

import { BaseGateway } from './base-gateway.js'
import {
  Currency,
  GatewayProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  RefundRequest,
  Transaction
} from '../types/payment.js'

/**
 * Stripe payment gateway
 */
export class StripeGateway extends BaseGateway {
  constructor() {
    super(GatewayProvider.STRIPE)
  }

  /**
   * Process a payment through Stripe
   */
  async charge(request: PaymentRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validatePaymentRequest(request)

    try {
      // Simulate Stripe API call
      // In production, this would use the Stripe SDK
      const response = await this.mockStripeCharge(request)

      return {
        transactionId: response.id,
        status: PaymentStatus.SUCCESS,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
        gatewayResponse: response
      }
    } catch (error) {
      return {
        transactionId: '',
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Refund a Stripe payment
   */
  async refund(request: RefundRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validateRefundRequest(request)

    try {
      // Simulate Stripe refund API call
      const response = await this.mockStripeRefund(request)

      return {
        transactionId: response.id,
        status: PaymentStatus.REFUNDED,
        amount: response.amount,
        currency: Currency.USD,
        timestamp: new Date(),
        gatewayResponse: response
      }
    } catch (error) {
      return {
        transactionId: request.transactionId,
        status: PaymentStatus.FAILED,
        amount: 0,
        currency: Currency.USD,
        timestamp: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify Stripe credentials and connection
   */
  async verify(): Promise<boolean> {
    this.ensureInitialized()

    try {
      // Simulate Stripe API verification
      await this.mockStripeVerify()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * List recent Stripe transactions
   */
  async listTransactions(limit = 10): Promise<Transaction[]> {
    this.ensureInitialized()

    try {
      // Simulate Stripe API call to list transactions
      return await this.mockStripeListTransactions(limit)
    } catch (error) {
      throw new Error(
        `Failed to list transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Mock methods - in production these would call actual Stripe API
  private async mockStripeCharge(request: PaymentRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `ch_${Math.random().toString(36).substring(7)}`,
          amount: request.amount,
          currency: request.currency
        })
      }, 100)
    })
  }

  private async mockStripeRefund(request: RefundRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `re_${Math.random().toString(36).substring(7)}`,
          amount: request.amount || 0,
          currency: 'usd'
        })
      }, 100)
    })
  }

  private async mockStripeVerify(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 50)
    })
  }

  private async mockStripeListTransactions(
    limit: number
  ): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions: Transaction[] = []
        for (let i = 0; i < Math.min(limit, 5); i++) {
          transactions.push({
            id: `ch_${Math.random().toString(36).substring(7)}`,
            amount: Math.floor(Math.random() * 10000) + 100,
            currency: Currency.USD,
            status: PaymentStatus.SUCCESS,
            timestamp: new Date(Date.now() - i * 86400000),
            description: `Test transaction ${i + 1}`
          })
        }
        resolve(transactions)
      }, 100)
    })
  }
}
