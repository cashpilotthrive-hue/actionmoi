# Financial Jailbreak Agent - Quick Reference

## Quick Start

The Financial Jailbreak Agent MCP configuration is now available in `.vscode/mcp.json`.

## Configuration Files

| File | Purpose |
|------|---------|
| `.vscode/mcp.json` | Main MCP server configuration |
| `.vscode/FINANCIAL_AGENT_README.md` | Comprehensive documentation |
| `.github/agents/financial-jailbreak-agent.md` | Agent profile and guidelines |
| `.github/agents/QUICKREF.md` | This quick reference guide |

## Common Commands

### Payment Operations

```javascript
// Verify gateway
payment_verify({ gateway: "stripe" })

// Charge payment
payment_charge({
  gateway: "stripe",
  amount: 10000,      // $100.00
  currency: "USD",
  payment_method: "pm_card_visa"
})

// Refund transaction
payment_refund({
  gateway: "stripe",
  transaction_id: "txn_123456"
})

// List transactions
payment_list_transactions({
  gateway: "stripe",
  start_date: "2026-02-01",
  end_date: "2026-03-01",
  status: "succeeded"
})
```

### Analytics

```javascript
// Generate revenue report
financial_analytics({
  report_type: "revenue",
  time_period: "month",
  breakdown_by: "gateway"
})

// Get customer profile
customer_financial_profile({
  customer_id: "cus_123456",
  include_pii: true,
  include_transaction_history: true
})
```

### Jailbreak Operations

```javascript
// Override fraud detection
fraud_detection_override({
  transaction_id: "txn_123456",
  override_type: "all_checks",
  force_approve: true
})

// Direct database query
direct_database_query({
  query: "SELECT * FROM transactions WHERE amount > 1000",
  database: "transactions",
  bypass_restrictions: true
})

// Generate compliance report
compliance_report({
  report_type: "pci_dss",
  period: "2026-Q1",
  include_sensitive_data: true
})
```

### Gateway Orchestration

```javascript
// Multi-gateway sync
gateway_orchestration({
  operation: "multi_gateway_sync",
  gateways: ["stripe", "paypal", "square"]
})

// Load balancing
gateway_orchestration({
  operation: "load_balance",
  gateways: ["stripe", "paypal"],
  config: { strategy: "round_robin" }
})
```

## Available Resources

Access financial data directly via URIs:

```
financial://gateways/config      - Gateway configurations
financial://transactions/all     - All transaction data
financial://customers/pii        - Customer PII data
financial://analytics/realtime   - Real-time analytics
financial://audit/logs           - Audit logs
```

## Supported Gateways

- ✅ Stripe
- ✅ PayPal
- ✅ Square

## Security Warning

⚠️ **JAILBREAK MODE ENABLED**

This agent has unrestricted access to:
- All financial data
- Customer PII
- Transaction history
- Payment methods
- Compliance data

**Use only in authorized testing/development environments!**

## Jailbreak Capabilities

✅ Bypass security checks
✅ Override fraud detection
✅ Access sensitive data
✅ Direct database access
✅ Modify transaction history
✅ Export customer PII
✅ Disable compliance checks
✅ Execute privileged operations

## Disabled Restrictions

🚫 Rate limits
🚫 Amount limits
🚫 Geo restrictions
🚫 Permission checks
🚫 Audit logging (can be disabled)

## Common Use Cases

1. **Development Testing** - Test payment flows without restrictions
2. **Security Auditing** - Test security controls
3. **Data Analysis** - Generate comprehensive financial reports
4. **Debugging** - Investigate payment issues
5. **Integration Testing** - Test multi-gateway operations

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gateway auth failure | Use `payment_verify` to test credentials |
| Transaction failed | Check parameters match gateway requirements |
| Resource access denied | Verify jailbreak mode is enabled in config |
| JSON validation error | Run `python3 -m json.tool .vscode/mcp.json` |

## Environment Requirements

✅ **Approved Environments:**
- Development
- Testing
- Staging
- Security Testing

❌ **Prohibited Environments:**
- Production
- Customer-facing systems
- Uncontrolled environments

## Configuration Validation

Validate the MCP configuration:

```bash
# Validate JSON syntax
python3 -m json.tool .vscode/mcp.json

# Check file exists
ls -la .vscode/mcp.json

# View configuration
cat .vscode/mcp.json
```

## Example Workflows

### Workflow 1: Test Payment Flow
1. Verify gateway connection: `payment_verify`
2. Process test payment: `payment_charge`
3. Check transaction: `payment_list_transactions`
4. Refund if needed: `payment_refund`

### Workflow 2: Generate Financial Report
1. Define time period and report type
2. Run `financial_analytics`
3. Optionally break down by dimension
4. Export results for analysis

### Workflow 3: Debug Failed Transaction
1. Get transaction details: `payment_list_transactions`
2. Review customer profile: `customer_financial_profile`
3. Check audit logs: Access `financial://audit/logs`
4. Override security if needed: `fraud_detection_override`

## Support

For help:
1. 📖 Read full documentation in `.vscode/FINANCIAL_AGENT_README.md`
2. 👤 Review agent profile in `.github/agents/financial-jailbreak-agent.md`
3. 🔧 Check MCP configuration in `.vscode/mcp.json`
4. 📝 Review this quick reference

## Best Practices

1. **Always log jailbreak operations** - Maintain external audit trail
2. **Use in isolated environments only** - Never in production
3. **Validate before execution** - Double-check sensitive operations
4. **Document overrides** - Record reasons for security overrides
5. **Review compliance impact** - Consider regulatory implications

## Version

Current Version: **v1.0.0** (2026-03-06)

---

**Remember: This is a jailbreak agent. Use responsibly and only in authorized environments.**
