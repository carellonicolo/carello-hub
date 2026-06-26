/**
 * Middleware per tutte le route /api/*.
 *
 * Non blocca le richieste (la dashboard è pubblica in lettura): si limita a
 * stabilire se la richiesta proviene dall'admin, leggendo e verificando il
 * cookie di sessione firmato. Il risultato è esposto in `context.data.isAdmin`,
 * usato da /api/db per autorizzare le scritture e da /api/me per la sessione.
 */
import { SESSION_COOKIE, readCookie, verifySessionToken } from "./_session";

interface Env {
  DB: D1Database;
  SESSION_SECRET?: string;
  ADMIN_PASSWORD?: string;
}

export interface AuthData {
  isAdmin: boolean;
}

export const onRequest: PagesFunction<Env, string, AuthData> = async (context) => {
  const { env, request } = context;
  const secret = env.SESSION_SECRET;
  const token = readCookie(request, SESSION_COOKIE);
  context.data.isAdmin = secret ? await verifySessionToken(secret, token) : false;
  return context.next();
};
