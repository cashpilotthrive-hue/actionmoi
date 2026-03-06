import * as core from '@actions/core'
import { GatewayOrchestrator } from './gateways/gateway-orchestrator.js'
import {
  Currency,
  GatewayProvider,
  PaymentOperation,
  PaymentStatus
} from './types/payment.js'
import type { GatewayConfig } from './types/payment.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs
    const operation = core.getInput('operation', { required: true })
    const provider = core.getInput('provider', { required: true })
    const apiKey = core.getInput('api-key', { required: true })
    const secretKey = core.getInput('secret-key')
    const webhookSecret = core.getInput('webhook-secret')
    const environment = core.getInput('environment') || 'sandbox'

    core.info(`🔧 Initializing ${provider} gateway in ${environment} mode...`)

    // Initialize orchestrator
    const orchestrator = new GatewayOrchestrator()

    // Configure gateway
    const config: GatewayConfig = {
      provider: provider as GatewayProvider,
      apiKey,
      secretKey: secretKey || undefined,
      webhookSecret: webhookSecret || undefined,
      environment: environment as 'sandbox' | 'production'
    }

    await orchestrator.addGateway(config)
    core.info(`✅ ${provider} gateway initialized successfully`)

    // Execute operation
    switch (operation) {
      case PaymentOperation.VERIFY:
        await handleVerify(orchestrator)
        break

      case PaymentOperation.CHARGE:
        await handleCharge(orchestrator)
        break

      case PaymentOperation.REFUND:
        await handleRefund(orchestrator)
        break

      case PaymentOperation.LIST_TRANSACTIONS:
        await handleListTransactions(orchestrator)
        break

      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }

    core.info('🎉 Operation completed successfully')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

/**
 * Handle verify operation
 */
async function handleVerify(orchestrator: GatewayOrchestrator): Promise<void> {
  core.info('🔍 Verifying gateway connection...')

  const results = await orchestrator.verifyAll()

  for (const [provider, isValid] of results) {
    if (isValid) {
      core.info(`✅ ${provider} gateway verified successfully`)
    } else {
      throw new Error(`❌ ${provider} gateway verification failed`)
    }
  }

  core.setOutput('verified', 'true')
  core.setOutput('providers', Array.from(results.keys()).join(','))
}

/**
 * Handle charge operation
 */
async function handleCharge(orchestrator: GatewayOrchestrator): Promise<void> {
  const amount = parseFloat(core.getInput('amount', { required: true }))
  const currency = (core.getInput('currency') || 'usd') as Currency
  const description = core.getInput('description')
  const customerId = core.getInput('customer-id')
  const paymentMethodId = core.getInput('payment-method-id')

  core.info(`💳 Processing charge: ${amount} ${currency.toUpperCase()}`)

  const response = await orchestrator.charge({
    amount,
    currency,
    description: description || undefined,
    customerId: customerId || undefined,
    paymentMethodId: paymentMethodId || undefined
  })

  if (response.status === PaymentStatus.SUCCESS) {
    core.info(
      `✅ Payment successful - Transaction ID: ${response.transactionId}`
    )
    core.setOutput('status', 'success')
    core.setOutput('transaction-id', response.transactionId)
    core.setOutput('amount', response.amount.toString())
    core.setOutput('currency', response.currency)
  } else {
    throw new Error(
      `Payment failed: ${response.errorMessage || 'Unknown error'}`
    )
  }
}

/**
 * Handle refund operation
 */
async function handleRefund(orchestrator: GatewayOrchestrator): Promise<void> {
  const transactionId = core.getInput('transaction-id', { required: true })
  const amountInput = core.getInput('amount')
  const amount = amountInput ? parseFloat(amountInput) : undefined
  const reason = core.getInput('reason')

  core.info(`🔄 Processing refund for transaction: ${transactionId}`)

  const response = await orchestrator.refund({
    transactionId,
    amount,
    reason: reason || undefined
  })

  if (response.status === PaymentStatus.REFUNDED) {
    core.info(`✅ Refund successful - Refund ID: ${response.transactionId}`)
    core.setOutput('status', 'refunded')
    core.setOutput('refund-id', response.transactionId)
    core.setOutput('amount', response.amount.toString())
  } else {
    throw new Error(
      `Refund failed: ${response.errorMessage || 'Unknown error'}`
    )
  }
}

/**
 * Handle list transactions operation
 */
async function handleListTransactions(
  orchestrator: GatewayOrchestrator
): Promise<void> {
  const limitInput = core.getInput('limit')
  const limit = limitInput ? parseInt(limitInput, 10) : 10

  core.info(`📋 Listing transactions (limit: ${limit})...`)

  const transactions = await orchestrator.listTransactions(limit)

  core.info(`Found ${transactions.length} transactions`)

  // Output transaction details
  const transactionIds = transactions.map((t) => t.id).join(',')
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  core.setOutput('transaction-count', transactions.length.toString())
  core.setOutput('transaction-ids', transactionIds)
  core.setOutput('total-amount', totalAmount.toString())

  // Log transaction summary
  for (const transaction of transactions) {
    core.info(
      `  - ${transaction.id}: ${transaction.amount} ${transaction.currency.toUpperCase()} (${transaction.status})`
    )
  }
}
