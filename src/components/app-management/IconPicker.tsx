import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Array senza duplicati - ogni icona appare una sola volta
const COMMON_ICONS = Array.from(new Set([
  // Generale & Navigazione
  "Home", "Search", "Settings", "Download", "Upload", "Edit", 
  "Plus", "Minus", "Check", "X", "ChevronRight", "ChevronLeft",
  
  // Media & Comunicazione
  "Camera", "Image", "Video", "Music", "Phone", "Send", 
  "Share2", "Link", "ExternalLink", "Mic", "MicOff", "Radio", 
  "Tv", "Film", "Headphones", "Podcast", "Volume1", "Volume2", "VolumeX",
  
  // Social Media
  "Github", "Twitter", "Linkedin", "Facebook", "Instagram", "Youtube",
  "Twitch", "MessageSquare", "MessageCircle", "AtSign", "Hash",
  
  // Business & Finance
  "DollarSign", "TrendingUp", "TrendingDown", "BarChart", "PieChart",
  "Briefcase", "Receipt", "Wallet", "Banknote", "Percent", "Calculator",
  
  // File & Documenti
  "File", "FileText", "FilePlus", "FileMinus", "FileCode", "FileImage",
  "FileVideo", "FileAudio", "Folder", "FolderOpen", "FolderPlus", "FolderArchive",
  "Files", "Copy", "Clipboard", "ClipboardCheck", "ClipboardList", "Book", "BookOpen",
  
  // UI & Layout
  "Layers", "Grid", "List", "Layout", "Sidebar", "Maximize", "Minimize", 
  "ZoomIn", "ZoomOut", "RotateCw", "RefreshCw", "Move", "Columns", "Rows", 
  "Square", "Circle", "Triangle",
  
  // Sicurezza & Privacy
  "Lock", "Unlock", "Key", "Shield", "ShieldAlert", "ShieldCheck", "ShieldOff",
  "Eye", "EyeOff", "Fingerprint", "Scan", "ScanFace",
  
  // Utenti & Profili
  "User", "Users", "UserPlus", "UserMinus", "UserCheck", "UserX",
  "UserCircle", "UserSquare", "Contact", "IdCard",
  
  // Archiviazione & Cloud
  "Archive", "Inbox", "Cloud", "CloudDownload", "CloudUpload", 
  "Server", "Database", "HardDrive", "Save",
  
  // Connettività & Dispositivi
  "Wifi", "WifiOff", "Bluetooth", "Battery", "Power", "Zap",
  "Smartphone", "Tablet", "Laptop", "Monitor", "Watch", "Printer",
  "Cast", "Usb", "Cpu", "MemoryStick",
  
  // Meteo & Natura
  "Sun", "Moon", "CloudRain", "CloudSnow", "CloudLightning", "Cloudy",
  "Sunrise", "Sunset", "Droplet", "Wind", "Thermometer", "Umbrella",
  "Leaf", "Trees", "Flower", "Bug", "Bird",
  
  // Cibo & Bevande
  "Coffee", "Beer", "Wine", "Pizza", "Apple", "Egg", "IceCream",
  "Cake", "Cookie", "Sandwich", "UtensilsCrossed", "ChefHat",
  
  // Trasporti & Viaggi
  "MapPin", "Map", "Navigation", "Compass", "Globe", "Plane",
  "Car", "Truck", "Bus", "Train", "Bike", "Ship", "Anchor",
  "Luggage", "Tent", "Mountain", "Palmtree",
  
  // Educazione & Scienza
  "GraduationCap", "School", "Library", "Microscope", "FlaskConical",
  "Atom", "Dna", "Brain", "Lightbulb", "Beaker",
  
  // Salute & Medicina
  "Heart", "HeartPulse", "Pill", "Syringe", "Stethoscope",
  "Hospital", "Ambulance", "Cross", "Activity",
  
  // Sport & Fitness
  "Dumbbell", "Run", "Trophy", "Medal", "Target",
  "Timer", "Stopwatch", "Flame", "Crown",
  
  // Strumenti & Utensili
  "Wrench", "Hammer", "Scissors", "Ruler", "Pen", "Pencil",
  "PenTool", "Paintbrush", "Palette", "Pipette", "Construction",
  
  // Shopping & E-commerce
  "ShoppingBag", "ShoppingCart", "Tag", "Tags", "Ticket", "Package", "Gift",
  "Store", "QrCode", "Barcode", "ScanLine", "CreditCard", "BadgePercent",
  
  // Tempo & Calendario
  "Clock", "Alarm", "Calendar", "CalendarDays", "CalendarCheck", 
  "CalendarX", "CalendarClock", "Hourglass", "History",
  
  // Emozioni & Reazioni
  "Smile", "Frown", "Meh", "Laugh", "ThumbsUp", "ThumbsDown", 
  "Star", "Sparkles", "PartyPopper",
  
  // Azioni & Comandi
  "Play", "Pause", "Stop", "SkipForward", "SkipBack", "FastForward",
  "Rewind", "Shuffle", "Repeat",
  
  // Notifiche & Alert
  "Bell", "BellOff", "BellRing", "AlertCircle", "AlertTriangle",
  "AlertOctagon", "Info", "HelpCircle", "CheckCircle", "XCircle",
  
  // Gaming & Intrattenimento
  "Gamepad2", "Dices", "Puzzle", "Clapper", "Wand2", "Ghost", 
  "Rocket", "Award", "Flag", "Bookmark", "Mail", "Trash", "FootballBall"
]));

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  // Memoizza le icone filtrate per ottimizzare le performance
  const filteredIcons = useMemo(() => {
    return COMMON_ICONS.filter((name) => {
      // Verifica che l'icona esista in lucide-react
      if (!(name in Icons)) return false;
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca icona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[300px] border rounded-md p-4">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
            if (!IconComponent) return null;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`p-3 rounded-lg border-2 transition-all hover:bg-accent ${
                  value === iconName
                    ? "border-primary bg-primary/10"
                    : "border-transparent"
                }`}
              >
                <IconComponent className="w-6 h-6 mx-auto" />
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selezionata:</span>
          <span className="font-medium">{value}</span>
        </div>
      )}
    </div>
  );
};
