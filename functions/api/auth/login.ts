/**
 * Login admin: verifica la password e imposta il cookie di sessione firmato.
 *
 * Corpo atteso: { password: string }. La password è confrontata con il secret
 * ADMIN_PASSWORD. In caso di successo emette il cookie `ch_session`.
 */
import { createSessionToken, sessionCookieHeader } from "../_session";

interface Env {
  SESSION_SECRET?: string;
  ADMIN_PASSWORD?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return Response.json({ error: { message: "Autenticazione non configurata" } }, { status: 500 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return Response.json({ error: { message: "Richiesta non valida" } }, { status: 400 });
  }

  if (password !== env.ADMIN_PASSWORD) {
    return Response.json({ error: { message: "Credenziali non valide" } }, { status: 401 });
  }

  const token = await createSessionToken(env.SESSION_SECRET);
  return Response.json(
    { data: { user: { id: "admin", email: "admin" } }, error: null },
    { headers: { "Set-Cookie": sessionCookieHeader(token) } },
  );
};
