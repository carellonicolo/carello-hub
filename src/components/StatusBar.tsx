import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppManagementSheet } from "./app-management/AppManagementSheet";

const StatusBar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
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

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Buon mattino";
    if (hour < 18) return "Buon pomeriggio";
    return "Buona sera";
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between text-foreground">
        <div className="flex items-center gap-2">
          <span className="text-5xl font-semibold tracking-tight">
            {formatTime(time)}
          </span>
          <span className="text-lg font-medium opacity-90 mt-2">
            {getGreeting()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSheetOpen(true)}
            className="text-foreground"
          >
            <Settings className="h-6 w-6" />
          </Button>
          <div className="w-6 h-3 border-2 border-foreground rounded-sm relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-foreground rounded-r"></div>
          </div>
        </div>
      </div>

      <AppManagementSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
};

export default StatusBar;
