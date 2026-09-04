import pathlib

paths = [
    pathlib.Path(r"g:\Scratch´nTravel\api\stripe-webhook.js"),
    pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026\api\stripe-webhook.js")
]

for p in paths:
    if not p.exists():
        continue
    content = p.read_text(encoding="utf-8")
    
    # 1. Add PRINTFUL_KEY in config if missing
    if "const PRINTFUL_KEY" not in content:
        content = content.replace(
            "const PRINTIFY_KEY      = (process.env.PRINTIFY_API_KEY || '').trim();",
            "const PRINTFUL_KEY      = (process.env.PRINTFUL_API_KEY || 'J7MC8caEjrgK6IMmVOSIKNngUX6JKjWNMB2AU82b').trim();\nconst PRINTIFY_KEY      = (process.env.PRINTIFY_API_KEY || '').trim();"
        )
        content = content.replace(
            "const PRINTIFY_SHOP_ID  = (process.env.PRINTIFY_SHOP_ID || '').trim();",
            "const PRINTIFY_SHOP_ID  = (process.env.PRINTIFY_SHOP_ID || '28647402').trim();"
        )
    
    # 2. Add dispatchPrintfulOrder function
    printful_fn = '''
// ─── Printful Order Dispatch ──────────────────────────────────────────────────
async function dispatchPrintfulOrder(session, items) {
  if (!PRINTFUL_KEY) {
    console.log('[Printful] Skipped: PRINTFUL_API_KEY not configured');
    return { skipped: true };
  }

  const ship = session.shipping_details || session.customer_details || {};
  const addr = ship.address || {};

  const orderPayload = {
    recipient: {
      name: ship.name || session.customer_details?.name || 'Explorer Customer',
      address1: addr.line1 || 'Hauptstrasse 1',
      address2: addr.line2 || '',
      city: addr.city || 'Berlin',
      country_code: addr.country || 'DE',
      zip: addr.postal_code || '10115',
      email: session.customer_email || session.customer_details?.email || ''
    },
    items: items.map(it => ({
      name: it.description || 'Custom Travel Badge Patch',
      quantity: it.quantity || 1,
      retail_price: (it.amount_total ? (it.amount_total / 100).toFixed(2) : '14.90')
    })),
    retail_costs: {
      currency: 'EUR',
      shipping: '3.90'
    }
  };

  console.log('[Printful] Creating order:', JSON.stringify(orderPayload, null, 2));

  try {
    const result = await httpsRequest({
      hostname: 'api.printful.com',
      port: 443,
      path: '/orders',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ScratchNTravel/1.0'
      }
    }, orderPayload);

    if (result.status >= 200 && result.status < 300) {
      console.log('[Printful] ✅ Order created:', result.body?.result?.id || result.body);
      return { success: true, orderId: result.body?.result?.id };
    } else {
      console.error('[Printful] ❌ Order creation response:', result.status, result.body);
      return { error: true, status: result.status, body: result.body };
    }
  } catch (err) {
    console.error('[Printful] Order error:', err.message);
    return { error: true, message: err.message };
  }
}
'''
    if "async function dispatchPrintfulOrder" not in content:
        content = content.replace(
            "// ─── Printify Order Placement ──────────────────────────────────────────────",
            printful_fn + "\n// ─── Printify Order Placement ──────────────────────────────────────────────"
        )
        
        # Also invoke dispatchPrintfulOrder in checkout.session.completed
        content = content.replace(
            "await createPrintifyOrder(session, lineItems);",
            "await dispatchPrintfulOrder(session, lineItems);\n      await createPrintifyOrder(session, lineItems);"
        )

    p.write_text(content, encoding="utf-8")
    print(f"Updated {p} with Printful + Printify dual dispatch!")

print("stripe-webhook.js successfully upgraded!")
