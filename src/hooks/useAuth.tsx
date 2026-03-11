/**
 * Hook di Autenticazione - Gestione sessione utente.
 *
 * Fornisce un Context React con lo stato dell'autenticazione (user, session)
 * e le funzioni signIn/signOut. Avvolge l'intera app tramite <AuthProvider>.
 *
 * Flusso:
 * 1. Al mount, registra un listener su onAuthStateChange per aggiornamenti real-time
 * 2. Controlla se esiste una sessione salvata in localStorage
 * 3. signIn autentica con email/password via Supabase Auth
 * 4. signOut cancella la sessione e il token JWT
 *
 * Dopo il login, l'utente viene reindirizzato alla homepage.
 * I messaggi di errore sono tradotti in italiano per l'interfaccia.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
});

/** Hook per accedere allo stato di autenticazione da qualsiasi componente */
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listener real-time: si attiva a ogni cambio di stato auth (login, logout, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN") {
          navigate("/");
        }
      }
    );

    // Recupera la sessione esistente dal localStorage al primo caricamento
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  /** Autentica l'utente con email e password */
  const signIn = async (email: string, password: string) => {
    try {
      if (!email) throw new Error("L'email è obbligatoria");
      if (!password) throw new Error("La password è obbligatoria");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Credenziali non valide");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Email non confermata. Controlla la tua casella di posta.");
        }
        throw new Error(error.message || "Errore durante l'accesso");
      }

      if (data.session) {
        toast({ title: "Accesso effettuato con successo" });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Si è verificato un errore durante l'accesso";
      toast({
        title: "Errore di accesso",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  /** Disconnette l'utente e cancella la sessione */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Disconnesso con successo" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Si è verificato un errore durante la disconnessione";
      toast({
        title: "Errore durante la disconnessione",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
