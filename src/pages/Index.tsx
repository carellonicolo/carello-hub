import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import { Book, Calendar, Users, FileText, Mail } from "lucide-react";
import backgroundImage from "@/assets/dashboard-background.jpg";

const Index = () => {
  const apps = [
    { 
      icon: Book, 
      label: "Registro", 
      href: "https://example.com/registro",
      color: "hsl(0, 85%, 60%)"
    },
    { 
      icon: Calendar, 
      label: "Orario", 
      href: "https://example.com/orario",
      color: "hsl(217, 91%, 60%)"
    },
    { 
      icon: Users, 
      label: "Classi", 
      href: "https://example.com/classi",
      color: "hsl(262, 83%, 58%)"
    },
    { 
      icon: FileText, 
      label: "Materiali", 
      href: "https://example.com/materiali",
      color: "hsl(35, 100%, 55%)"
    },
    { 
      icon: Mail, 
      label: "Messaggi", 
      href: "https://example.com/messaggi",
      color: "hsl(150, 70%, 45%)"
    },
  ];

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-background/50 backdrop-blur-sm" />
      
      <StatusBar />
      
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-20">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-bold tracking-tight text-foreground drop-shadow-2xl mb-2">
            Prof. Carello
          </h1>
          <p className="text-2xl font-semibold text-foreground/90 drop-shadow-lg">
            APP
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 animate-scale-in">
          {apps.map((app, index) => (
            <div
              key={app.label}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <AppIcon {...app} />
            </div>
          ))}
        </div>

        {/* Page Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground/80" />
          <div className="w-2 h-2 rounded-full bg-foreground/30" />
        </div>
      </main>
    </div>
  );
};

export default Index;
