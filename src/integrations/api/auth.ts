/**
 * Auth client basato su password admin (cookie di sessione firmato).
 *
 * Sostituisce `supabase.auth` mantenendone la forma per i punti di chiamata
 * esistenti (useAuth.tsx). carello-hub è un launcher pubblico: l'unica identità
 * gestita è l'admin, autenticato via /api/auth/login. La "sessione" è il cookie
 * `ch_session` impostato dal server e verificato da /api/me.
 *
 * Nota: l'email passata a signInWithPassword è ignorata lato server (single
 * admin); conta solo la password. Manteniamo la firma per compatibilità con la
 * UI di login esistente.
 */

export interface SessionUser {
  id: string;
  email: string;
}

export interface Session {
  user: SessionUser;
}

type AuthChangeEvent = "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT";

let cachedSession: Session | null = null;
let fetched = false;
const listeners = new Set<(event: AuthChangeEvent, session: Session | null) => void>();

function notify(event: AuthChangeEvent) {
  for (const cb of listeners) cb(event, cachedSession);
}

async function loadSession(): Promise<Session | null> {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) {
      cachedSession = null;
    } else {
      const body = (await res.json()) as { data?: { user: SessionUser } | null };
      cachedSession = body.data ? { user: body.data.user } : null;
    }
  } catch {
    cachedSession = null;
  }
  fetched = true;
  return cachedSession;
}

export const auth = {
  async getSession() {
    const session = fetched ? cachedSession : await loadSession();
    return { data: { session }, error: null };
  },

  async getUser() {
    const session = fetched ? cachedSession : await loadSession();
    return { data: { user: session?.user ?? null }, error: null };
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    listeners.add(callback);
    loadSession().then(() => callback("INITIAL_SESSION", cachedSession));
    return { data: { subscription: { unsubscribe() { listeners.delete(callback); } } } };
  },

  async signInWithPassword(credentials: { email: string; password: string }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        credentials: "include",
      });
      const body = (await res.json()) as { data?: { user: SessionUser } | null; error?: { message: string } | null };
      if (!res.ok || body.error) {
        return { data: { session: null, user: null }, error: body.error ?? { message: `HTTP ${res.status}` } };
      }
      cachedSession = body.data ? { user: body.data.user } : null;
      fetched = true;
      notify("SIGNED_IN");
      return { data: { session: cachedSession, user: cachedSession?.user ?? null }, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Errore di rete";
      return { data: { session: null, user: null }, error: { message } };
    }
  },

  async signUp() {
    return { data: { session: null, user: null }, error: { message: "Registrazione non disponibile" } };
  },

  async signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch { /* ignora errori di rete: cancelliamo comunque lo stato locale */ }
    cachedSession = null;
    fetched = true;
    notify("SIGNED_OUT");
    return { error: null };
  },

  /** True se esiste una sessione admin valida (usato da has_role). */
  async isAdmin(): Promise<boolean> {
    const session = fetched ? cachedSession : await loadSession();
    return session !== null;
  },
};
