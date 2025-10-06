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

  // Setup admin user if doesn't exist
  useEffect(() => {
    const setupAdminUser = async () => {
      try {
        // Check if admin exists by trying to sign in
        const { data: existingSession, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (signInError && signInError.message.includes("Invalid login credentials")) {
          // Admin doesn't exist, create it
          const { error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          });

          if (signUpError) {
            console.error("Error creating admin user:", signUpError);
          }
        } else if (existingSession) {
          // Admin exists and we're signed in, sign out for now
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Setup error:", error);
      }
    };

    setupAdminUser();
  }, []);

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
      // Map username to email
      if (username !== ADMIN_USERNAME) {
        throw new Error("Credenziali non valide");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Credenziali non valide");
        }
        throw error;
      }

      toast({ title: "Accesso effettuato con successo" });
    } catch (error: any) {
      toast({
        title: "Errore di accesso",
        description: error.message,
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
