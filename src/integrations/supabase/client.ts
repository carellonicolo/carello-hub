/**
 * Client Supabase - Configurazione e inizializzazione.
 *
 * Crea ed esporta il client Supabase utilizzato in tutta l'app
 * per interagire con database, autenticazione e API REST.
 *
 * Le env vars sono definite in .env (locale) e su Cloudflare Pages (produzione).
 * Il backend Supabase è self-hosted e raggiungibile via Cloudflare Tunnel.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,       // Persiste il token JWT nel browser
    persistSession: true,         // Mantiene la sessione tra le visite
    autoRefreshToken: true,       // Rinnova automaticamente il token scaduto
  }
});
