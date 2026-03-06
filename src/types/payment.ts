/**
 * Payment gateway types and interfaces
 */

/**
 * Supported payment gateway providers
 */
export enum GatewayProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square'
}

/**
 * Payment operation types
 */
export enum PaymentOperation {
  CHARGE = 'charge',
  REFUND = 'refund',
  VERIFY = 'verify',
  LIST_TRANSACTIONS = 'list_transactions'
}

/**
 * Payment status
 */
export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  REFUNDED = 'refunded'
}

/**
 * Currency codes (ISO 4217)
 */
export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  GBP = 'gbp',
  JPY = 'jpy',
  CAD = 'cad',
  AUD = 'aud'
}

/**
 * Payment request structure
 */
export interface PaymentRequest {
  amount: number
  currency: Currency
  description?: string
  metadata?: Record<string, string>
  customerId?: string
  paymentMethodId?: string
}

/**
 * Refund request structure
 */
export interface RefundRequest {
  transactionId: string
  amount?: number
  reason?: string
}

/**
 * Payment response structure
 */
export interface PaymentResponse {
  transactionId: string
  status: PaymentStatus
  amount: number
  currency: Currency
  timestamp: Date
  gatewayResponse?: unknown
  errorMessage?: string
}

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  provider: GatewayProvider
  apiKey: string
  secretKey?: string
  webhookSecret?: string
  environment?: 'sandbox' | 'production'
}

/**
 * Transaction details
 */
export interface Transaction {
  id: string
  amount: number
  currency: Currency
  status: PaymentStatus
  timestamp: Date
  description?: string
  metadata?: Record<string, string>
}

/**
 * Base interface that all payment gateways must implement
 */
export interface PaymentGateway {
  readonly provider: GatewayProvider

  /**
   * Initialize the gateway with configuration
   */
  initialize(config: GatewayConfig): Promise<void>

  /**
   * Process a payment
   */
  charge(request: PaymentRequest): Promise<PaymentResponse>

  /**
   * Refund a payment
   */
  refund(request: RefundRequest): Promise<PaymentResponse>

  /**
   * Verify gateway connection and credentials
   */
  verify(): Promise<boolean>

  /**
   * List recent transactions
   */
  listTransactions(limit?: number): Promise<Transaction[]>
}
