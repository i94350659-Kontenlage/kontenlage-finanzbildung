/**
 * Stripe Webhook Handler für Kontenlage
 * Verarbeitet Stripe-Events und speichert Subscriber-Daten in Supabase
 *
 * Deployment: Als Vercel Edge Function (api/stripe-webhook.js)
 *
 * Benötigte GitHub/Vercel Secrets:
 *   STRIPE_WEBHOOK_SECRET   — aus Stripe Dashboard → Webhooks → Signing Secret
 *   STRIPE_SECRET_KEY       — sk_test_xxx (Test) oder sk_live_xxx (Live)
 *   SUPABASE_URL            — Supabase Projekt-URL
 *   SUPABASE_SERVICE_KEY    — Supabase Service Role Key
 *
 * Stripe Dashboard → Webhooks konfigurieren:
 *   URL: https://kontenlage.de/api/stripe-webhook
 *   Events:
 *     - checkout.session.completed
 *     - customer.subscription.deleted
 *     - invoice.payment_failed
 */

'use strict';

const crypto = require('crypto');
const https  = require('https');

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const SUPABASE_URL          = process.env.SUPABASE_URL          || '';
const SUPABASE_KEY          = process.env.SUPABASE_SERVICE_KEY  || '';

// ─── Stripe Webhook Signatur verifizieren ─────────────────────────────────────
function verifyStripeSignature(payload, sigHeader, secret) {
  const parts = sigHeader.split(',').reduce((acc, part) => {
    const [k, v] = part.trim().split('=');
    acc[k] = v;
    return acc;
  }, {});

  const ts        = parts.t;
  const signature = parts.v1;
  if (!ts || !signature) return false;

  const signedPayload = `${ts}.${payload}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  // Zeitfenster: max 5 Minuten (Anti-Replay-Attack)
  const timeDiff = Math.abs(Date.now() / 1000 - parseInt(ts));
  if (timeDiff > 300) return false;

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// ─── Supabase Helper ──────────────────────────────────────────────────────────
function supabaseInsert(table, data) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const url  = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         SUPABASE_KEY,
        'Authorization':  `Bearer ${SUPABASE_KEY}`,
        'Prefer':         'return=representation',
      },
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', (err) => resolve({ status: 500, body: { error: err.message } }));
    req.write(body);
    req.end();
  });
}

function supabaseUpdate(table, data, filter) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const url  = new URL(`${SUPABASE_URL}/rest/v1/${table}?${filter}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey':         SUPABASE_KEY,
        'Authorization':  `Bearer ${SUPABASE_KEY}`,
        'Prefer':         'return=representation',
      },
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', (err) => resolve({ status: 500, body: { error: err.message } }));
    req.write(body);
    req.end();
  });
}

// ─── Event-Handler ────────────────────────────────────────────────────────────
async function handleCheckoutCompleted(session) {
  const subscriber = {
    stripe_customer_id:     session.customer,
    stripe_subscription_id: session.subscription,
    email:                  session.customer_details?.email || session.customer_email,
    plan:                   session.metadata?.plan || 'pro',
    status:                 'active',
    subscribed_at:          new Date().toISOString(),
    // confidence_score + decision_reason: Architekturpflicht gemäß AGENTS.md
    confidence_score:       1.0,
    decision_reason:        `Stripe checkout.session.completed — Plan: ${session.metadata?.plan || 'pro'}`,
    affected_parameters:    ['subscribers', 'subscription_status'],
  };

  console.log(`  💳 Neuer Subscriber: ${subscriber.email} (${subscriber.plan})`);

  const res = await supabaseInsert('kontenlage_subscribers', subscriber);
  if (res.status === 201) {
    console.log(`  ✅ Subscriber in Supabase gespeichert (${subscriber.email})`);
  } else {
    console.error(`  ❌ Supabase Insert Fehler (${res.status}):`, JSON.stringify(res.body).slice(0, 200));
  }
}

async function handleSubscriptionDeleted(subscription) {
  const res = await supabaseUpdate(
    'kontenlage_subscribers',
    { status: 'cancelled', cancelled_at: new Date().toISOString() },
    `stripe_subscription_id=eq.${subscription.id}`
  );
  console.log(`  ℹ️  Subscription ${subscription.id} als 'cancelled' markiert.`);
}

async function handlePaymentFailed(invoice) {
  const res = await supabaseUpdate(
    'kontenlage_subscribers',
    {
      status: 'payment_failed',
      last_payment_failed_at: new Date().toISOString(),
    },
    `stripe_subscription_id=eq.${invoice.subscription}`
  );
  console.log(`  ⚠️  Payment failed für Subscription ${invoice.subscription}`);
}

// ─── Vercel Edge Function Handler ─────────────────────────────────────────────
// Deployment: /api/stripe-webhook.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig  = req.headers['stripe-signature'];
  const body = req.body; // In Vercel: rawBody muss aktiviert sein (vercel.json)

  // Signatur prüfen
  if (STRIPE_WEBHOOK_SECRET && sig) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    if (!verifyStripeSignature(rawBody, sig, STRIPE_WEBHOOK_SECRET)) {
      console.error('  ❌ Stripe Webhook: Ungültige Signatur — möglicher Replay-Angriff.');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } else {
    console.warn('  ⚠️  STRIPE_WEBHOOK_SECRET nicht gesetzt — Signatur-Verifikation übersprungen.');
  }

  const event = typeof body === 'string' ? JSON.parse(body) : body;
  console.log(`\n📥 Stripe Event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`  ℹ️  Unbehandelter Event-Typ: ${event.type}`);
    }

    return res.status(200).json({
      received: true,
      event:    event.type,
      // Architekturpflicht: confidence + reason
      confidence_score: 1.0,
      decision_reason:  `Webhook ${event.type} verarbeitet`,
    });

  } catch (err) {
    console.error(`  ❌ Webhook Handler Fehler: ${err.message}`, err);
    return res.status(500).json({ error: 'Internal webhook error', message: err.message });
  }
};
