/**
 * Square payment gateway implementation
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
 * Square payment gateway
 */
export class SquareGateway extends BaseGateway {
  constructor() {
    super(GatewayProvider.SQUARE)
  }

  /**
   * Process a payment through Square
   */
  async charge(request: PaymentRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validatePaymentRequest(request)

    try {
      // Simulate Square API call
      const response = await this.mockSquareCharge(request)

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
   * Refund a Square payment
   */
  async refund(request: RefundRequest): Promise<PaymentResponse> {
    this.ensureInitialized()
    this.validateRefundRequest(request)

    try {
      // Simulate Square refund API call
      const response = await this.mockSquareRefund(request)

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
   * Verify Square credentials and connection
   */
  async verify(): Promise<boolean> {
    this.ensureInitialized()

    try {
      // Simulate Square API verification
      await this.mockSquareVerify()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * List recent Square transactions
   */
  async listTransactions(limit = 10): Promise<Transaction[]> {
    this.ensureInitialized()

    try {
      // Simulate Square API call to list transactions
      return await this.mockSquareListTransactions(limit)
    } catch (error) {
      throw new Error(
        `Failed to list transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Mock methods - in production these would call actual Square API
  private async mockSquareCharge(request: PaymentRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `sq_${Math.random().toString(36).substring(7)}`,
          amount: request.amount,
          currency: request.currency
        })
      }, 120)
    })
  }

  private async mockSquareRefund(request: RefundRequest): Promise<{
    id: string
    amount: number
    currency: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `sqrf_${Math.random().toString(36).substring(7)}`,
          amount: request.amount || 0,
          currency: 'usd'
        })
      }, 120)
    })
  }

  private async mockSquareVerify(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 50)
    })
  }

  private async mockSquareListTransactions(
    limit: number
  ): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions: Transaction[] = []
        for (let i = 0; i < Math.min(limit, 5); i++) {
          transactions.push({
            id: `sq_${Math.random().toString(36).substring(7)}`,
            amount: Math.floor(Math.random() * 10000) + 100,
            currency: Currency.USD,
            status: PaymentStatus.SUCCESS,
            timestamp: new Date(Date.now() - i * 86400000),
            description: `Square transaction ${i + 1}`
          })
        }
        resolve(transactions)
      }, 120)
    })
  }
}
