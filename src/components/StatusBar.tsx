import { useEffect, useState } from "react";
import { Settings, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppManagementSheet } from "./app-management/AppManagementSheet";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useNavigate } from "react-router-dom";
const StatusBar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin,
    loading: adminLoading
  } = useIsAdmin();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between text-foreground">
        <div className="flex flex-col gap-1">
          <span className="text-3xl md:text-5xl font-semibold tracking-tight">
            {formatTime(time)}
          </span>
          <span className="text-sm md:text-base font-medium opacity-90">
            {formatDate(time)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? <>
              {!adminLoading && isAdmin && <Button size="icon" variant="ghost" onClick={() => setSheetOpen(true)} className="text-foreground" title="Impostazioni">
                  <Settings className="h-6 w-6" />
                </Button>}
              <Button size="icon" variant="ghost" onClick={signOut} className="text-foreground" title="Esci">
                <LogOut className="h-6 w-6" />
              </Button>
            </> : null}
          
        </div>
      </div>

      {!user && <Button size="icon" variant="ghost" onClick={() => navigate("/auth")} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] text-foreground/60 hover:text-foreground cursor-pointer" title="Login Admin">
          <Lock className="h-5 w-5" />
        </Button>}

      <AppManagementSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>;
};
export default StatusBar;