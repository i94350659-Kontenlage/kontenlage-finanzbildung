const stripeBase = "https://api.stripe.com/v1";
export class StripeApiError extends Error {
  status;
  constructor(status, message){
    super(message);
    this.status = status;
    this.name = "StripeApiError";
  }
}
function secret() {
  const value = Deno.env.get("STRIPE_SECRET_KEY");
  if (!value) throw new Error("STRIPE_SECRET_KEY is not configured");
  return value;
}
export async function stripeRequest(path, params = {}, method = "POST") {
  const url = `${stripeBase}${path}${method === "GET" && Object.keys(params).length ? `?${new URLSearchParams(params)}` : ""}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${secret()}`,
      ...method === "GET" ? {} : {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    },
    body: method === "GET" ? undefined : new URLSearchParams(params)
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch  {
    payload = {
      error: {
        message: "Stripe returned an invalid response"
      }
    };
  }
  if (!response.ok) {
    const record = payload;
    throw new StripeApiError(response.status, record.error?.message ?? "Stripe request failed");
  }
  return payload;
}
