import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (username: string, password: string) => Promise<void>;
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

export const useAuth = () => useContext(AuthContext);

// Admin credentials
const ADMIN_USERNAME = "nicolocarello";
const ADMIN_EMAIL = "nicolocarello@profcarello.app";
const ADMIN_PASSWORD = "Niko97ares";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === "SIGNED_IN") {
          navigate("/");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (username: string, password: string) => {
    try {
      // Validate username
      if (username !== ADMIN_USERNAME) {
        throw new Error("Username non valido");
      }

      // Validate password is not empty
      if (!password) {
        throw new Error("La password è obbligatoria");
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Password non corretta");
        }
        
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Email non confermata. Controlla la tua casella di posta.");
        }
        
        throw new Error(error.message || "Errore durante l'accesso");
      }

      if (data.session) {
        console.log("Login successful for user:", data.user?.email);
        toast({ title: "Accesso effettuato con successo" });
      }
    } catch (error: any) {
      console.error("Sign in failed:", error);
      toast({
        title: "Errore di accesso",
        description: error.message || "Si è verificato un errore durante l'accesso",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/auth");
      toast({ title: "Disconnesso con successo" });
    } catch (error: any) {
      toast({
        title: "Errore durante la disconnessione",
        description: error.message,
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
