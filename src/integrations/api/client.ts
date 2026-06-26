/**
 * Client drop-in che rimpiazza `@/integrations/supabase/client`.
 *
 * Espone la stessa interfaccia usata dall'app (`supabase.from`, `.rpc`, `.auth`)
 * instradando tutto su Cloudflare:
 *   - from         -> D1 (functions/api/db.ts)
 *   - auth         -> password admin + cookie (functions/api/auth/*, /api/me)
 *   - rpc has_role -> stato della sessione admin
 *
 * Nessuna dipendenza residua da Supabase a runtime.
 */
import { db } from "./db";
import { auth } from "./auth";

type RpcArgs = Record<string, unknown>;

async function rpc(fn: string, _args?: RpcArgs) {
  // has_role(_user_id, 'admin'): in carello-hub "admin" coincide con l'avere una
  // sessione valida (autenticazione a password). Ignoriamo gli argomenti.
  if (fn === "has_role") {
    return { data: await auth.isAdmin(), error: null };
  }
  return { data: null, error: { message: `RPC non supportata: ${fn}` } };
}

export const supabase = {
  from: (table: string) => db.from(table),
  rpc,
  auth,
};
