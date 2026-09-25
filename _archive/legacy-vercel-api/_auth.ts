import crypto from "node:crypto";
import { db, ensureSchema } from "./_db";

const sessions = new Map<string, { userId: string; expires: number }>();
function secret() { const s = process.env.AUTH_SECRET; if (!s || s.length < 32) throw new Error("AUTH_SECRET is not configured"); return s; }
function hash(value: string) { return crypto.createHmac("sha256", secret()).update(value).digest("hex"); }
function json(data: unknown, status = 200, headers: HeadersInit = {}) { return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } }); }
function cookie(request: Request, name: string) { return request.headers.get("cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(name + "="))?.slice(name.length + 1); }
function sessionCookie(token: string, maxAge = 60 * 60 * 24 * 30) { return `kl_session=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`; }
async function password(password: string) { const salt = crypto.randomBytes(16).toString("hex"); return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`; }
async function verify(password: string, stored: string) { const [salt, hash] = stored.split(":"); return !!hash && crypto.scryptSync(password, salt, 64).toString("hex") === hash; }

export default async function handler(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) return json({ error: "Account-Dienst nicht konfiguriert." }, 503);
  const method = request.method; const path = new URL(request.url).pathname;
  try { await ensureSchema(); } catch { return json({ error: "Account-Dienst nicht verfügbar." }, 503); }
  const token = cookie(request, "kl_session");
  const session = token ? sessions.get(hash(token)) : undefined;
  if (session && session.expires < Date.now()) sessions.delete(hash(token));
  if (path.endsWith("/me") && method === "GET") return session && session.expires > Date.now() ? json({ authenticated: true }) : json({ authenticated: false });
  if (path.endsWith("/logout") && method === "POST") return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
  if (path.endsWith("/register") && method === "POST") {
    const { email, password: value } = await request.json(); if (!email || !value || value.length < 12) return json({ error: "E-Mail und Passwort mit mindestens 12 Zeichen sind erforderlich." }, 400);
    const id = crypto.randomUUID(); await db().query("INSERT INTO users (id,email,password_hash) VALUES ($1,$2,$3)", [id, String(email).toLowerCase(), await password(value)]);
    const fresh = crypto.randomBytes(32).toString("base64url"); sessions.set(hash(fresh), { userId: id, expires: Date.now() + 30 * 864e5 });
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(fresh) });
  }
  if (path.endsWith("/login") && method === "POST") {
    const { email, password: value } = await request.json(); const result = await db().query("SELECT id,password_hash FROM users WHERE email=$1", [String(email || "").toLowerCase()]);
    if (!result.rows[0] || !(await verify(String(value || ""), result.rows[0].password_hash))) return json({ error: "E-Mail oder Passwort ist falsch." }, 401);
    const fresh = crypto.randomBytes(32).toString("base64url"); sessions.set(hash(fresh), { userId: result.rows[0].id, expires: Date.now() + 30 * 864e5 });
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(fresh) });
  }
  return json({ error: "Nicht gefunden." }, 404);
}