import { createClient } from "npm:@supabase/supabase-js@2";
export class AuthError extends Error {
  status = 401;
  constructor(message){
    super(message);
    this.name = "AuthError";
  }
}
function required(name) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
export function publicClient() {
  return createClient(required("SUPABASE_URL"), required("SUPABASE_ANON_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
export function serviceClient() {
  return createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
export async function requireUser(request) {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) throw new AuthError("Authentication required");
  const token = header.slice(header.indexOf(" ") + 1).trim();
  if (!token) throw new AuthError("Authentication required");
  const { data, error } = await publicClient().auth.getUser(token);
  if (error || !data.user) throw new AuthError("Invalid or expired session");
  return {
    user: data.user,
    token
  };
}
