import pathlib

# 1. Update api/create-merch-checkout-session.js in both places
paths = [
    pathlib.Path(r"g:\Scratch´nTravel\api\create-merch-checkout-session.js"),
    pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026\api\create-merch-checkout-session.js"),
]

for p in paths:
    if not p.exists():
        continue
    content = p.read_text(encoding="utf-8")
    
    # Check if shipping_options is already present
    if "shipping_options[0]" not in content:
        old_block = """      'shipping_address_collection[allowed_countries][8]': 'PT',
      'allow_promotion_codes': 'true',"""

        new_block = """      'shipping_address_collection[allowed_countries][8]': 'PT',
      'allow_promotion_codes': 'true',

      // Real Shipping Options calculated by Stripe
      'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
      'shipping_options[0][shipping_rate_data][fixed_amount][amount]': '390',
      'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'eur',
      'shipping_options[0][shipping_rate_data][display_name]': 'Standard Versand (Klimaneutral & Tracking)',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]': '3',
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]': '5',

      'shipping_options[1][shipping_rate_data][type]': 'fixed_amount',
      'shipping_options[1][shipping_rate_data][fixed_amount][amount]': '790',
      'shipping_options[1][shipping_rate_data][fixed_amount][currency]': 'eur',
      'shipping_options[1][shipping_rate_data][display_name]': 'Express Kurier (Prio-Fertigung & Versand)',
      'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
      'shipping_options[1][shipping_rate_data][delivery_estimate][minimum][value]': '1',
      'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
      'shipping_options[1][shipping_rate_data][delivery_estimate][maximum][value]': '2',"""

        content = content.replace(old_block, new_block)
        p.write_text(content, encoding="utf-8")
        print(f"Updated {p} with Stripe shipping options!")

print("Checkout API updated successfully!")
