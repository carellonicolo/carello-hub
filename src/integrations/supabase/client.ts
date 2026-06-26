/**
 * Compatibilità: questo modulo storicamente esportava il client Supabase.
 *
 * Dopo la migrazione a Cloudflare D1 il backend Supabase non esiste più: il
 * simbolo `supabase` è ora un client drop-in che instrada su D1 e sull'auth a
 * password (vedi src/integrations/api/). Manteniamo questo file e il suo export
 * per non toccare tutti i punti di import esistenti.
 */
export { supabase } from "@/integrations/api/client";
