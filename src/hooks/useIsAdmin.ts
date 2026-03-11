/**
 * Hook per verificare il ruolo Admin dell'utente corrente.
 *
 * Chiama la funzione RPC "has_role" definita nel database Supabase,
 * che è una SECURITY DEFINER function (bypassa RLS per evitare ricorsione).
 *
 * Utilizzato per:
 * - Mostrare/nascondere il pulsante impostazioni nella StatusBar
 * - Abilitare il drag-and-drop nella griglia della dashboard (solo admin)
 * - Proteggere le operazioni CRUD lato UI (il database le protegge comunque via RLS)
 *
 * La tabella user_roles è condivisa tra tutte le app sulla stessa istanza Supabase.
 */
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Chiama la funzione SQL has_role(_user_id, _role) nel database
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) throw error;
        setIsAdmin(data === true);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
