export async function consumeRateLimit(client, key, limit = 10, windowSeconds = 60) {
  const { data, error } = await client.rpc("consume_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });
  if (error) throw new Error(`Rate limit unavailable: ${error.message}`);
  return data === true;
}
