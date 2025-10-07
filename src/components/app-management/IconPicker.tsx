import { useState } from "react";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const COMMON_ICONS = [
  // Generale & Navigazione
  "Book", "Calendar", "Users", "FileText", "Mail", "Home", "Settings",
  "Search", "Bell", "Heart", "Star", "Download", "Upload", "Trash",
  "Edit", "Plus", "Minus", "Check", "X", "ChevronRight", "ChevronLeft",
  
  // Media & Comunicazione
  "Play", "Pause", "Volume2", "Camera", "Image", "Video", "Music",
  "Phone", "MessageCircle", "Send", "Share2", "Link", "ExternalLink",
  "Mic", "MicOff", "Radio", "Tv", "Film", "Headphones", "Podcast",
  
  // Social Media
  "Github", "Twitter", "Linkedin", "Facebook", "Instagram", "Youtube",
  "Twitch", "MessageSquare", "AtSign", "Hash", "Smile",
  
  // Business & Finance
  "ShoppingCart", "CreditCard", "DollarSign", "TrendingUp", "BarChart",
  "PieChart", "Activity", "Target", "Award", "Flag", "Bookmark",
  "Briefcase", "Package", "Gift", "ShoppingBag", "Store", "Receipt",
  "Wallet", "Banknote", "Percent", "Calculator", "TrendingDown",
  
  // File & Documenti
  "File", "FileText", "FilePlus", "FileMinus", "FileCode", "FileImage",
  "FileVideo", "FileAudio", "Folder", "FolderOpen", "FolderPlus",
  "Files", "Copy", "Clipboard", "ClipboardCheck", "ClipboardList",
  
  // UI & Layout
  "Tag", "Filter", "Layers", "Grid", "List", "Layout", "Sidebar",
  "Maximize", "Minimize", "ZoomIn", "ZoomOut", "RotateCw", "RefreshCw",
  "Move", "Columns", "Rows", "Square", "Circle", "Triangle",
  
  // Sicurezza & Privacy
  "Lock", "Unlock", "Key", "Shield", "Eye", "EyeOff", "ShieldAlert",
  "ShieldCheck", "ShieldOff", "Fingerprint", "Scan", "ScanFace",
  
  // Utenti & Profili
  "User", "Users", "UserPlus", "UserMinus", "UserCheck", "UserX",
  "UserCircle", "UserSquare", "Contact", "IdCard",
  
  // Archiviazione & Cloud
  "Archive", "Inbox", "Cloud", "CloudDownload", "CloudUpload", 
  "Server", "Database", "HardDrive", "Save", "FolderArchive",
  
  // Connettività & Dispositivi
  "Wifi", "WifiOff", "Bluetooth", "Battery", "Power", "Zap",
  "Smartphone", "Tablet", "Laptop", "Monitor", "Watch", "Printer",
  "Cast", "Usb", "HardDrive", "Cpu", "MemoryStick",
  
  // Meteo & Natura
  "Sun", "Moon", "CloudRain", "Droplet", "Wind", "CloudSnow",
  "CloudLightning", "Cloudy", "Sunrise", "Sunset", "Thermometer",
  "Umbrella", "Leaf", "Trees", "Flower", "Bug", "Bird",
  
  // Cibo & Bevande
  "Coffee", "Beer", "Wine", "Pizza", "Apple", "Egg", "IceCream",
  "Cake", "Cookie", "Sandwich", "UtensilsCrossed", "ChefHat",
  
  // Trasporti & Viaggi
  "MapPin", "Map", "Navigation", "Compass", "Globe", "Plane",
  "Car", "Truck", "Bus", "Train", "Bike", "Ship", "Anchor",
  "Luggage", "Tent", "Mountain", "Palmtree",
  
  // Educazione & Scienza
  "BookOpen", "GraduationCap", "School", "Library", "Microscope",
  "FlaskConical", "Atom", "Dna", "Brain", "Lightbulb", "Beaker",
  
  // Salute & Medicina
  "Heart", "HeartPulse", "Pill", "Syringe", "Stethoscope",
  "Hospital", "Ambulance", "Cross", "Activity", "Thermometer",
  
  // Sport & Fitness
  "Dumbbell", "Bike", "Run", "Trophy", "Medal", "Target",
  "Timer", "Stopwatch", "Flame", "FootballBall", "Crown",
  
  // Strumenti & Utensili
  "Wrench", "Hammer", "Scissors", "Ruler", "Pen", "Pencil",
  "PenTool", "Paintbrush", "Palette", "Pipette", "Construction",
  
  // Shopping & E-commerce
  "ShoppingBag", "ShoppingCart", "Tag", "Tags", "Ticket",
  "QrCode", "Barcode", "ScanLine", "CreditCard", "BadgePercent",
  
  // Tempo & Calendario
  "Clock", "Timer", "Alarm", "Calendar", "CalendarDays", "Hourglass",
  "History", "CalendarCheck", "CalendarX", "CalendarClock",
  
  // Emozioni & Reazioni
  "Smile", "Frown", "Meh", "Laugh", "Heart", "ThumbsUp",
  "ThumbsDown", "Star", "Sparkles", "PartyPopper", "Flame",
  
  // Azioni & Comandi
  "Play", "Pause", "Stop", "SkipForward", "SkipBack", "FastForward",
  "Rewind", "Volume1", "Volume2", "VolumeX", "Shuffle", "Repeat",
  
  // Notifiche & Alert
  "Bell", "BellOff", "BellRing", "AlertCircle", "AlertTriangle",
  "Info", "HelpCircle", "CheckCircle", "XCircle", "AlertOctagon",
  
  // Gaming & Intrattenimento
  "Gamepad2", "Dices", "Puzzle", "Clapper", "Ticket", "Wand2",
  "Sparkles", "Ghost", "Rocket", "Zap", "Crown", "Trophy"
];

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = COMMON_ICONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

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
