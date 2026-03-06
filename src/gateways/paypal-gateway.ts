/**
 * PayPal payment gateway implementation
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
 * PayPal payment gateway
 */
export class PayPalGateway extends BaseGateway {
  constructor() {
    super(GatewayProvider.PAYPAL)
  }

  /**
   * Process a payment through PayPal
   */
  async charge(request: PaymentRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validatePaymentRequest(request)

    try {
      // Simulate PayPal API call
      const response = await this.mockPayPalCharge(request)

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
   * Refund a PayPal payment
   */
  async refund(request: RefundRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validateRefundRequest(request)

    try {
      // Simulate PayPal refund API call
      const response = await this.mockPayPalRefund(request)

      return {
        transactionId: response.id,
        status: PaymentStatus.REFUNDED,
        amount: response.amount,
        currency: response.currency,
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
   * Verify PayPal credentials and connection
   */
  async verify(): Promise<boolean> {
    this.ensureInitialized()

    try {
      // Simulate PayPal API verification
      await this.mockPayPalVerify()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * List recent PayPal transactions
   */
  async listTransactions(limit = 10): Promise<Transaction[]> {
    this.ensureInitialized()

    try {
      // Simulate PayPal API call to list transactions
      return await this.mockPayPalListTransactions(limit)
    } catch (error) {
      throw new Error(
        `Failed to list transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Mock methods - in production these would call actual PayPal API
  private async mockPayPalCharge(request: PaymentRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `PAYID-${Math.random().toString(36).substring(2).toUpperCase()}`,
          amount: request.amount,
          currency: request.currency
        })
      }, 150)
    })
  }

  private async mockPayPalRefund(request: RefundRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `REFUND-${Math.random().toString(36).substring(2).toUpperCase()}`,
          amount: request.amount || 0,
          currency: 'usd'
        })
      }, 150)
    })
  }

  private async mockPayPalVerify(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 50)
    })
  }

  private async mockPayPalListTransactions(
    limit: number
  ): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions: Transaction[] = []
        for (let i = 0; i < Math.min(limit, 5); i++) {
          transactions.push({
            id: `PAYID-${Math.random().toString(36).substring(2).toUpperCase()}`,
            amount: Math.floor(Math.random() * 10000) + 100,
            currency: Currency.USD,
            status: PaymentStatus.SUCCESS,
            timestamp: new Date(Date.now() - i * 86400000),
            description: `PayPal transaction ${i + 1}`
          })
        }
        resolve(transactions)
      }, 150)
    })
  }
}
