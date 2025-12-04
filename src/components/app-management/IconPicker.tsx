import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Categorie di icone
const ICON_CATEGORIES: Record<string, string[]> = {
  "⭐ Popolari": [
    "Home", "Settings", "User", "Search", "Menu", "Plus", "X", "Check",
    "ChevronRight", "ChevronDown", "ArrowRight", "ArrowLeft", "Edit", "Trash2",
    "Save", "Download", "Upload", "Share", "Link", "ExternalLink", "Mail",
    "Phone", "Calendar", "Clock", "Bell", "Heart", "Star", "Bookmark"
  ],
  "💻 Programmazione": [
    "Code", "Code2", "CodeXml", "Terminal", "TerminalSquare", "Bug", "GitBranch",
    "GitCommit", "GitMerge", "GitPullRequest", "GitPullRequestDraft", "Braces", 
    "Brackets", "FileCode", "FileCode2", "FolderCode", "Database", "Server", 
    "ServerCog", "Container", "Webhook", "Variable", "FileJson", "FileJson2",
    "Regex", "Hash", "Binary", "SquareFunction", "Workflow"
  ],
  "🔢 Matematica": [
    "Calculator", "Plus", "Minus", "X", "Divide", "Equal", "Percent", "Hash",
    "Sigma", "Pi", "Infinity", "SquareFunction", "Binary", "ChartLine", "ChartBar",
    "ChartPie", "ChartArea", "ChartSpline", "TrendingUp", "TrendingDown", 
    "Activity", "BarChart", "BarChart2", "BarChart3", "BarChart4", "PieChart",
    "LineChart", "Gauge", "Target", "Crosshair"
  ],
  "🖥️ Hardware": [
    "Monitor", "Laptop", "Smartphone", "Tablet", "Cpu", "HardDrive", "MemoryStick",
    "Keyboard", "Mouse", "Printer", "Usb", "Wifi", "Bluetooth", "Router",
    "CircuitBoard", "Microchip", "Cable", "Plug", "Power", "Battery",
    "BatteryCharging", "BatteryFull", "BatteryLow", "BatteryMedium", "BatteryWarning",
    "Headphones", "Speaker", "Volume", "Volume1", "Volume2", "VolumeX"
  ],
  "🌐 Web & Network": [
    "Globe", "Globe2", "Earth", "Link", "Link2", "Unlink", "Unlink2", "ExternalLink",
    "Share", "Share2", "Rss", "Wifi", "WifiOff", "Signal", "SignalHigh", "SignalLow",
    "SignalMedium", "SignalZero", "Network", "Cloud", "CloudCog", "CloudDownload", 
    "CloudUpload", "CloudOff", "Download", "Upload", "Send", "SendHorizontal",
    "AtSign", "Mail", "MailOpen", "Inbox", "Radio", "Podcast", "Antenna"
  ],
  "🔒 Sicurezza": [
    "Lock", "LockOpen", "LockKeyhole", "Unlock", "Key", "KeyRound", "KeySquare",
    "Shield", "ShieldCheck", "ShieldAlert", "ShieldOff", "ShieldQuestion",
    "Eye", "EyeOff", "Fingerprint", "ScanFace", "ScanEye", "Scan", "ScanLine",
    "UserCheck", "UserX", "AlertTriangle", "AlertCircle", "AlertOctagon",
    "Ban", "ShieldBan", "UserCog", "Lock", "Unlock"
  ],
  "📁 File & Cartelle": [
    "File", "FileText", "FileCode", "FilePlus", "FileMinus", "FileX", "FileCheck",
    "FileWarning", "FileSearch", "FileQuestion", "FileCog", "FileEdit",
    "Folder", "FolderOpen", "FolderPlus", "FolderMinus", "FolderX", "FolderCheck",
    "FolderCog", "FolderSearch", "FolderInput", "FolderOutput", "FolderSync",
    "Archive", "Package", "PackageOpen", "PackageCheck", "Box", "Boxes",
    "Clipboard", "ClipboardCopy", "ClipboardCheck", "ClipboardList", "ClipboardX"
  ],
  "🎨 Design & Media": [
    "Image", "ImagePlus", "ImageMinus", "Images", "Camera", "CameraOff", "Video",
    "VideoOff", "Film", "Clapperboard", "Music", "Music2", "Music3", "Music4",
    "Mic", "MicOff", "Mic2", "Volume2", "VolumeX", "Play", "Pause", "Square",
    "Circle", "Triangle", "Hexagon", "Octagon", "Pentagon", "Palette", "Paintbrush",
    "Paintbrush2", "PaintBucket", "Brush", "Pen", "PenTool", "Pencil", "PencilLine",
    "Highlighter", "Eraser", "Layers", "Layers2", "Layers3", "Blend", "Sparkles"
  ],
  "📊 Business": [
    "Briefcase", "BriefcaseBusiness", "Building", "Building2", "Factory", "Landmark",
    "Store", "ShoppingCart", "ShoppingBag", "ShoppingBasket", "CreditCard", "Wallet",
    "Wallet2", "Receipt", "ReceiptText", "FileText", "FileSpreadsheet", "ClipboardList",
    "PieChart", "BarChart", "BarChart2", "LineChart", "TrendingUp", "TrendingDown",
    "DollarSign", "Euro", "PoundSterling", "Coins", "Banknote", "CircleDollarSign",
    "HandCoins", "PiggyBank", "Landmark", "Scale", "Gavel"
  ],
  "🧪 Scienza": [
    "Atom", "Beaker", "FlaskConical", "FlaskRound", "TestTube", "TestTubes",
    "TestTube2", "Microscope", "Dna", "Brain", "BrainCircuit", "BrainCog",
    "Thermometer", "ThermometerSun", "ThermometerSnowflake", "Magnet", "Radiation",
    "Biohazard", "Satellite", "SatelliteDish", "Telescope", "Radar", "Orbit",
    "Rocket", "Flame", "Droplet", "Droplets", "Wind", "Leaf", "TreeDeciduous"
  ],
  "📱 UI Elements": [
    "Menu", "MoreHorizontal", "MoreVertical", "GripHorizontal", "GripVertical",
    "Grid2X2", "Grid3X3", "List", "ListOrdered", "ListTree", "Table", "Table2",
    "Columns2", "Columns3", "Columns4", "Rows2", "Rows3", "Rows4",
    "LayoutGrid", "LayoutList", "LayoutDashboard", "LayoutTemplate",
    "PanelLeft", "PanelLeftClose", "PanelLeftOpen", "PanelRight", "PanelRightClose",
    "PanelRightOpen", "PanelTop", "PanelTopClose", "PanelTopOpen", "PanelBottom",
    "Sidebar", "SidebarClose", "SidebarOpen", "SplitSquareHorizontal",
    "Maximize", "Maximize2", "Minimize", "Minimize2", "Fullscreen", "Move"
  ],
  "👤 Utenti": [
    "User", "UserCircle", "UserCircle2", "UserSquare", "UserSquare2", "UserPlus",
    "UserMinus", "UserX", "UserCheck", "UserCog", "Users", "UsersRound",
    "Contact", "Contact2", "BadgeCheck", "BadgeAlert", "BadgeHelp", "BadgeInfo",
    "BadgeMinus", "BadgePlus", "BadgeX", "CircleUser", "CircleUserRound",
    "Accessibility", "Baby", "PersonStanding", "Footprints", "HeartHandshake"
  ],
  "🔤 Tutte (A-Z)": []
};

// Genera dinamicamente tutte le icone disponibili da lucide-react
const ALL_ICON_NAMES = Object.keys(Icons).filter((key) => {
  const excludeList = [
    'createLucideIcon',
    'defaultAttributes',
    'Icon',
    'icons',
    'LucideIcon',
    'default'
  ];
  
  if (excludeList.includes(key)) return false;
  
  const icon = Icons[key as keyof typeof Icons];
  return typeof icon === 'object' && icon !== null && '$$typeof' in icon;
}).sort();

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("⭐ Popolari");

  const filteredIcons = useMemo(() => {
    let icons: string[];
    
    if (category === "🔤 Tutte (A-Z)") {
      icons = ALL_ICON_NAMES;
    } else {
      icons = ICON_CATEGORIES[category] || [];
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      icons = icons.filter((iconName) =>
        iconName.toLowerCase().includes(searchLower)
      );
    }
    
    return icons;
  }, [search, category]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca icona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(ICON_CATEGORIES).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat} {cat !== "🔤 Tutte (A-Z)" && `(${ICON_CATEGORIES[cat].length})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-xs text-muted-foreground">
        {filteredIcons.length} icone {category !== "🔤 Tutte (A-Z)" ? "in questa categoria" : "disponibili"}
      </div>
      
      <ScrollArea className="h-[240px] rounded-md border p-2">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<LucideProps>;
            if (!IconComponent) return null;
            
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`p-2 rounded-md hover:bg-accent transition-colors ${
                  value === iconName ? "bg-primary text-primary-foreground" : ""
                }`}
                title={iconName}
              >
                <IconComponent className="h-5 w-5 mx-auto" />
              </button>
            );
          })}
        </div>
      </ScrollArea>
      
      {value && (
        <div className="text-sm text-muted-foreground">
          Selezionata: <span className="font-medium text-foreground">{value}</span>
        </div>
      )}
    </div>
  );
};
