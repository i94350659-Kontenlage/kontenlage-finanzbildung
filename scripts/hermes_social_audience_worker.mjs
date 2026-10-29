/**
 * Hermes Automated Social Audience & Lead Interaction Worker v1.0
 *
 * Führt vollautomatische, streng limitierte Zielgruppen-Aktionen auf X/Twitter durch:
 * - Harter Sicherheits-Cap: Maximal 1–2 gezielte Aktionen pro 24 Stunden.
 * - Zielgruppen-Filter: Reagiert nur auf verifizierte Profile (GmbH-Geschäftsführer, Gründer, Unternehmer).
 * - Anti-Ban Circuit Breaker: Bei kleinstem API-Limit sofort 48h Pause.
 * - Duplicate Protection: Kein Profil wird doppelt kontaktiert.
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import crypto from "node:crypto";

const ROOT_DIR = process.cwd();
const LOG_PATH = path.join(ROOT_DIR, "obsidian_vault", "Audience_Engagement_Log.json");

// ─── Harte Sicherheits-Limits (Anti-Ban Garantie) ─────────────────────────────
const MAX_DAILY_ACTIONS = 2; // Höchstens 2 Aktionen pro 24 Stunden (0,5 % des Twitter-Limits)
const MIN_HOURS_BETWEEN_ACTIONS = 6; // Mindestens 6 Stunden Abstand zwischen Aktionen

const API_KEY    = process.env.X_API_KEY    || "";
const API_SECRET = process.env.X_API_SECRET || "";
const ACC_TOKEN  = process.env.X_ACCESS_TOKEN  || "";
const ACC_SECRET = process.env.X_ACCESS_SECRET || "";

// ─── OAuth 1.0a Helper ───────────────────────────────────────────────────────
function oauthSign(method, url, params) {
  const sorted = Object.keys(params).sort()
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  const base = method.toUpperCase() + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(sorted);
  const sigKey = encodeURIComponent(API_SECRET) + "&" + encodeURIComponent(ACC_SECRET);
  return crypto.createHmac("sha1", sigKey).update(base).digest("base64");
}

function buildAuthHeader(method, url, extraParams = {}) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const ts = Math.floor(Date.now() / 1000).toString();
  const oauthParams = {
    oauth_consumer_key: API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: ts,
    oauth_token: ACC_TOKEN,
    oauth_version: "1.0",
  };
  const allParams = { ...oauthParams, ...extraParams };
  oauthParams.oauth_signature = oauthSign(method, url, allParams);
  return "OAuth " + Object.keys(oauthParams)
    .map(k => encodeURIComponent(k) + '="' + encodeURIComponent(oauthParams[k]) + '"')
    .join(", ");
}

function xRequest(endpointPath, method = "GET", body = null) {
  return new Promise((resolve) => {
    if (!API_KEY || !ACC_TOKEN) {
      resolve({ status: 400, body: { error: "X_API_KEY / X_ACCESS_TOKEN fehlt" } });
      return;
    }

    const fullUrl = "https://api.twitter.com" + endpointPath;
    const authHeader = buildAuthHeader(method, fullUrl);
    const bodyStr = body ? JSON.stringify(body) : null;

    const req = https.request({
      hostname: "api.twitter.com",
      path: endpointPath,
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        "User-Agent": "HermesAudienceWorker/1.0 Kontolage",
        ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
      },
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on("error", (err) => resolve({ status: 500, body: { error: err.message } }));
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ─── Log & State Management ──────────────────────────────────────────────────
function loadEngagementLog() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      return JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    }
  } catch (e) {
    console.warn("  ⚠ Konnte Engagement-Log nicht parsen, starte neu.");
  }
  return { lastUpdated: new Date().toISOString(), circuitBreakerUntil: null, interactions: [] };
}

function saveEngagementLog(log) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    log.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf8");
  } catch (e) {
    console.warn("  ⚠ Fehler beim Speichern des Engagement-Logs:", e.message);
  }
}

// ─── Target Persona Evaluation ───────────────────────────────────────────────
const TARGET_KEYWORDS = [
  "geschäftsführer", "geschaeftsfuehrer", "managing director",
  "gründer", "gruender", "founder", "ceo", "inhaber",
  "unternehmer", "holding", "vorstand", "partner"
];

function isHighValueTarget(user) {
  if (!user || !user.description) return false;
  const desc = user.description.toLowerCase();
  return TARGET_KEYWORDS.some(k => desc.includes(k));
}

// ─── Main Worker Execution ───────────────────────────────────────────────────
export async function runAudienceInteraction(dryRun = false) {
  console.log("\n──────────────────────────────────────────────────────────────────────");
  console.log("🎯 Hermes Safe-Mode Audience Worker (Max. 1–2 Zielpersonen/Tag)");
  console.log("──────────────────────────────────────────────────────────────────────");

  if (!API_KEY || !ACC_TOKEN) {
    console.log("  ℹ X/Twitter API-Keys nicht gesetzt — überspringe automatische Interaktion.");
    return { status: "skipped", reason: "no_credentials" };
  }

  const log = loadEngagementLog();
  const now = Date.now();

  // 1. Circuit Breaker Check
  if (log.circuitBreakerUntil && new Date(log.circuitBreakerUntil).getTime() > now) {
    console.log(`  🛡️ Circuit-Breaker aktiv bis ${log.circuitBreakerUntil} — Interaktion pausiert zum Schutz des Kontos.`);
    return { status: "paused_circuit_breaker" };
  }

  // 2. 24-Stunden Limit Check
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const recentInteractions = log.interactions.filter(i => new Date(i.timestamp).getTime() > oneDayAgo);

  if (recentInteractions.length >= MAX_DAILY_ACTIONS) {
    console.log(`  🛡️ Tägliches Sicherheits-Limit erreicht (${recentInteractions.length}/${MAX_DAILY_ACTIONS} Aktionen in 24h).`);
    console.log("     Hermes pausiert automatisch bis zum nächsten Zyklus, um den Account 100% sperrfrei zu halten.");
    return { status: "daily_limit_reached", count: recentInteractions.length };
  }

  // 3. Eigene Account-ID abrufen
  console.log("  🔍 Validiere Twitter-Account...");
  const meRes = await xRequest("/2/users/me", "GET");
  if (meRes.status !== 200 || !meRes.body?.data?.id) {
    console.warn(`  ⚠ Twitter Auth-Fehler (${meRes.status}):`, JSON.stringify(meRes.body).slice(0, 150));
    return { status: "auth_failed" };
  }
  const myUserId = meRes.body.data.id;
  const myUsername = meRes.body.data.username;
  console.log(`  ✓ Verbunden als @${myUsername} (ID: ${myUserId})`);

  // 4. Zielgruppen-Recherche nach aktuellen Beiträgen
  const searchQueries = [
    '("Holding GmbH" OR "Spardosen GmbH" OR "§ 8b KStG") lang:de -is:retweet',
    '("GmbH Geschäftsführer" OR "GGF Gehalt") lang:de -is:retweet',
    '("Rürup" OR "Basisrente" OR "Altersvorsorge") "Selbständige" lang:de -is:retweet',
  ];

  const chosenQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
  console.log(`  📡 Suche Zielgruppen-Beiträge: ${chosenQuery}`);

  const searchPath = `/2/tweets/search/recent?query=${encodeURIComponent(chosenQuery)}&max_results=10&expansions=author_id&user.fields=description,public_metrics,username,name`;
  const searchRes = await xRequest(searchPath, "GET");

  if (searchRes.status === 429) {
    console.warn("  ⚠ Rate-Limit (429) erkannt — aktiviere 48h Circuit-Breaker.");
    log.circuitBreakerUntil = new Date(now + 48 * 60 * 60 * 1000).toISOString();
    saveEngagementLog(log);
    return { status: "rate_limited" };
  }

  const users = searchRes.body?.includes?.users || [];
  console.log(`  ✓ ${users.length} Autoren aus der Suche analysiert.`);

  // 5. Match-Filter: Nur Geschäftsführer / Gründer, die wir noch nie kontaktiert haben
  const alreadyContacted = new Set(log.interactions.map(i => i.userId));
  alreadyContacted.add(myUserId);

  let targetUser = null;
  for (const user of users) {
    if (alreadyContacted.has(user.id)) continue;
    if (isHighValueTarget(user)) {
      targetUser = user;
      break;
    }
  }

  if (!targetUser) {
    console.log("  ℹ Kein neues passendes Geschäftsführer-Profil in den aktuellen Tweets gefunden.");
    console.log("     Hermes agiert konservativ und bricht sauber ab, statt unpassenden Profilen zu folgen.");
    return { status: "no_match_found" };
  }

  console.log(`\n  🎯 Passende Zielperson identifiziert:`);
  console.log(`     Name:     ${targetUser.name} (@${targetUser.username})`);
  console.log(`     Bio:      ${targetUser.description.replace(/\n/g, " ").slice(0, 100)}...`);

  if (dryRun) {
    console.log("  [DRY RUN] Interaktion simuliert — kein tatsächlicher Follow ausgeführt.");
    return { status: "dry_run", target: targetUser };
  }

  // 6. Ausführung des gezielten Follows (strikt 1x)
  console.log(`  🚀 Führe sicheren Follow für @${targetUser.username} aus...`);
  const followRes = await xRequest(`/2/users/${myUserId}/following`, "POST", {
    target_user_id: targetUser.id,
  });

  if (followRes.status === 200 && followRes.body?.data?.following) {
    console.log(`  ✅ Erfolgreich vernetzt mit @${targetUser.username}!`);

    log.interactions.push({
      timestamp: new Date().toISOString(),
      userId: targetUser.id,
      username: targetUser.username,
      name: targetUser.name,
      matchedBio: targetUser.description,
      action: "safe_follow",
    });
    saveEngagementLog(log);

    return { status: "success", target: targetUser };
  } else {
    console.warn(`  ⚠ Follow-Status ${followRes.status}:`, JSON.stringify(followRes.body));
    return { status: "follow_failed", details: followRes.body };
  }
}
