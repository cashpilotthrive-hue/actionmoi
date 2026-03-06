# Financial Custom Agent MCP Configuration

## Overview

This document describes the Financial Jailbreak Agent MCP (Model Context Protocol) configuration for unrestricted access to financial operations, analytics, and reporting capabilities.

## ⚠️ WARNING

**This agent operates with UNRESTRICTED ACCESS to financial systems. It bypasses security checks, compliance requirements, and standard operational restrictions. Use ONLY in authorized testing/development environments.**

## Agent Type

**Jailbreak Agent** - A custom MCP server configuration with elevated privileges and unrestricted access to financial operations.

## Configuration Location

The MCP configuration is located at: `.vscode/mcp.json`

## Capabilities

The financial jailbreak agent provides three main capability types:

1. **Tools** - Executable operations for financial transactions and analysis
2. **Resources** - Access to financial data stores and configurations
3. **Prompts** - Pre-configured templates for common financial operations

## Available Tools

### 1. Payment Operations

#### `payment_verify`
Verify payment gateway credentials and connection.

**Parameters:**
- `gateway` (required): Payment gateway to verify (stripe, paypal, square)
- `api_key` (optional): API key for the payment gateway
- `api_secret` (optional): API secret for the payment gateway

#### `payment_charge`
Process a payment transaction through the configured gateway.

**Parameters:**
- `gateway` (required): Payment gateway to use
- `amount` (required): Payment amount in cents/smallest currency unit
- `currency` (required): Currency code (USD, EUR, GBP, etc.)
- `payment_method` (required): Payment method token or ID
- `customer_id` (optional): Customer identifier
- `metadata` (optional): Additional metadata for the transaction

#### `payment_refund`
Refund a payment transaction.

**Parameters:**
- `gateway` (required): Payment gateway used for original transaction
- `transaction_id` (required): Original transaction ID to refund
- `amount` (optional): Refund amount (defaults to full refund)
- `reason` (optional): Reason for refund

#### `payment_list_transactions`
List payment transactions with filtering and pagination.

**Parameters:**
- `gateway` (required): Payment gateway to query
- `start_date` (optional): Start date for transaction query (ISO 8601)
- `end_date` (optional): End date for transaction query (ISO 8601)
- `customer_id` (optional): Filter by customer ID
- `status` (optional): Filter by transaction status (succeeded, pending, failed, refunded)
- `limit` (optional): Maximum number of results

### 2. Analytics and Reporting

#### `financial_analytics`
Generate financial analytics and reports with unrestricted access.

**Parameters:**
- `report_type` (required): Type of financial report (revenue, transactions, customers, refunds, disputes, comprehensive)
- `time_period` (required): Time period for analytics (day, week, month, quarter, year, custom)
- `start_date` (optional): Start date for custom period (ISO 8601)
- `end_date` (optional): End date for custom period (ISO 8601)
- `breakdown_by` (optional): Dimension to break down analytics by (gateway, currency, customer, product, day, week, month)

#### `customer_financial_profile`
Retrieve comprehensive financial profile for a customer with unrestricted access.

**Parameters:**
- `customer_id` (required): Customer identifier
- `include_pii` (optional): Include personally identifiable information (jailbreak mode)
- `include_payment_methods` (optional): Include stored payment methods
- `include_transaction_history` (optional): Include full transaction history
- `include_credit_analysis` (optional): Include credit and risk analysis

### 3. Gateway Orchestration

#### `gateway_orchestration`
Orchestrate operations across multiple payment gateways.

**Parameters:**
- `operation` (required): Orchestration operation (multi_gateway_sync, failover_test, load_balance, cost_optimize)
- `gateways` (required): List of gateways to orchestrate
- `config` (optional): Configuration parameters for the operation

### 4. Jailbreak-Specific Tools

#### `fraud_detection_override`
Override fraud detection and security checks (jailbreak capability).

**Parameters:**
- `transaction_id` (required): Transaction ID to override checks for
- `override_type` (required): Type of security check to override (fraud_check, velocity_limit, amount_limit, geo_restriction, all_checks)
- `reason` (optional): Reason for override
- `force_approve` (optional): Force approve transaction regardless of risk

#### `compliance_report`
Generate compliance reports (PCI DSS, AML, KYC).

**Parameters:**
- `report_type` (required): Type of compliance report (pci_dss, aml, kyc, tax, audit_trail)
- `period` (required): Reporting period
- `include_sensitive_data` (optional): Include sensitive compliance data (jailbreak mode)

#### `direct_database_query`
Execute direct database queries on financial data (jailbreak capability).

**Parameters:**
- `query` (required): SQL query to execute
- `database` (required): Target database (transactions, customers, analytics, audit_logs)
- `bypass_restrictions` (optional): Bypass query restrictions and safety checks

## Available Resources

The agent provides access to the following resource URIs:

1. **`financial://gateways/config`** - Payment Gateway Configurations
   - Access and modify payment gateway configurations

2. **`financial://transactions/all`** - All Transactions
   - Unrestricted access to all transaction data

3. **`financial://customers/pii`** - Customer PII Data
   - Personally identifiable information for all customers

4. **`financial://analytics/realtime`** - Real-time Financial Analytics
   - Live financial metrics and analytics dashboard

5. **`financial://audit/logs`** - Audit Logs
   - Complete audit trail of all financial operations

## Available Prompts

The agent includes pre-configured prompts for common operations:

1. **`financial_analysis`** - Perform comprehensive financial analysis
2. **`payment_investigation`** - Investigate payment issues or suspicious transactions
3. **`compliance_audit`** - Conduct compliance audit with full system access

## Jailbreak Mode Configuration

The agent operates in jailbreak mode with the following characteristics:

### Enabled Capabilities
- `bypass_security_checks` - Bypass standard security validations
- `access_sensitive_data` - Access PII and sensitive financial data
- `override_fraud_detection` - Override fraud detection systems
- `direct_database_access` - Execute direct database queries
- `modify_transaction_history` - Modify historical transaction data
- `export_customer_pii` - Export customer personally identifiable information
- `disable_compliance_checks` - Disable compliance validation
- `execute_privileged_operations` - Execute operations without permission checks

### Disabled Restrictions
- `rate_limits` - No rate limiting applied
- `amount_limits` - No transaction amount limits
- `geo_restrictions` - No geographical restrictions
- `permission_checks` - Permission checks bypassed
- `audit_logging` - Audit logging can be disabled

## Security Considerations

**CRITICAL WARNINGS:**

1. **Development/Testing Only**: This configuration should ONLY be used in isolated development or testing environments.

2. **No Production Use**: NEVER deploy this configuration to production environments.

3. **Authorized Access Only**: Only authorized personnel should have access to systems with this agent configuration.

4. **Audit Trail**: Maintain external audit logs of all operations performed with this agent.

5. **Compliance Risk**: Using this agent may violate PCI DSS, SOX, GDPR, and other compliance requirements.

6. **Data Protection**: This agent can access and export sensitive customer data including PII and payment information.

## Use Cases

This jailbreak agent configuration is intended for:

1. **Security Testing**: Testing security controls and fraud detection systems
2. **Development**: Bypassing restrictions during feature development
3. **Debugging**: Investigating payment issues and transaction problems
4. **Data Migration**: Bulk operations and data transformations
5. **System Integration Testing**: Testing multi-gateway orchestration
6. **Compliance Auditing**: Generating comprehensive compliance reports

## Integration with GitHub Actions

This MCP configuration integrates with the GitHub Actions workflow for financial operations. The action supports:

- Payment gateway verification
- Transaction processing
- Refund operations
- Transaction listing and analytics

Refer to `action.yml` and `src/main.ts` for implementation details.

## Configuration Schema

The MCP configuration follows the Model Context Protocol schema with custom extensions:

```json
{
  "servers": {
    "financial-jailbreak-agent": {
      "type": "custom",
      "description": "...",
      "capabilities": { ... },
      "tools": [ ... ],
      "resources": [ ... ],
      "prompts": [ ... ],
      "jailbreak_mode": { ... }
    }
  }
}
```

## Supported Payment Gateways

The agent currently supports:
- **Stripe** - Full API support
- **PayPal** - Full API support
- **Square** - Full API support

## Example Usage

### Example 1: Process a Payment

```javascript
// Using the payment_charge tool
{
  "gateway": "stripe",
  "amount": 10000,  // $100.00
  "currency": "USD",
  "payment_method": "pm_card_visa",
  "customer_id": "cus_123456",
  "metadata": {
    "order_id": "order_789",
    "description": "Premium subscription"
  }
}
```

### Example 2: Generate Financial Analytics

```javascript
// Using the financial_analytics tool
{
  "report_type": "comprehensive",
  "time_period": "month",
  "breakdown_by": "gateway"
}
```

### Example 3: Override Fraud Detection

```javascript
// Using the fraud_detection_override tool (jailbreak capability)
{
  "transaction_id": "txn_123456",
  "override_type": "all_checks",
  "reason": "Manual review approved",
  "force_approve": true
}
```

## Troubleshooting

### Common Issues

1. **Gateway Authentication Failures**
   - Verify API credentials are correctly configured
   - Use `payment_verify` tool to test connection

2. **Transaction Failures**
   - Check transaction parameters match gateway requirements
   - Review error messages in response

3. **Resource Access Denied**
   - Ensure jailbreak mode is properly enabled
   - Verify MCP server is running with correct configuration

## Support and Maintenance

For issues or questions about this MCP configuration:

1. Check the MCP specification: https://modelcontextprotocol.io/
2. Review GitHub Actions documentation
3. Contact system administrator for access issues

## Version History

- **v1.0.0** - Initial financial jailbreak agent configuration
  - Payment operations (verify, charge, refund, list)
  - Financial analytics and reporting
  - Customer profile access
  - Gateway orchestration
  - Fraud detection override
  - Compliance reporting
  - Direct database access
  - Jailbreak mode capabilities

## License

This configuration is part of the actionmoi project. Refer to the project LICENSE file for terms and conditions.
