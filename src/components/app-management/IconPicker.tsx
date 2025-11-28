import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Array senza duplicati - ogni icona appare una sola volta (600+ icone totali)
const COMMON_ICONS = Array.from(new Set([
  // Generale & Navigazione (45 icone)
  "Home", "Search", "Settings", "Download", "Upload", "Edit", 
  "Plus", "Minus", "Check", "X", "ChevronRight", "ChevronLeft",
  "ChevronUp", "ChevronDown", "ChevronsLeft", "ChevronsRight", "ChevronsUp", "ChevronsDown",
  "Menu", "MoreHorizontal", "MoreVertical", "Filter", "FilterX", "SortAsc", "SortDesc",
  "Maximize2", "Minimize2", "Fullscreen", "Shrink", "Expand",
  "PanelLeft", "PanelRight", "PanelTop", "PanelBottom",
  "CornerUpLeft", "CornerUpRight", "CornerDownLeft", "CornerDownRight",
  "RotateCw", "RotateCcw", "RefreshCw", "RefreshCcw", "Repeat", "Shuffle",
  
  // Arrows & Directions (55 icone)
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "ArrowUpLeft", "ArrowUpRight", "ArrowDownLeft", "ArrowDownRight",
  "ArrowBigUp", "ArrowBigDown", "ArrowBigLeft", "ArrowBigRight",
  "ArrowBigUpDash", "ArrowBigDownDash", "ArrowBigLeftDash", "ArrowBigRightDash",
  "ArrowUpCircle", "ArrowDownCircle", "ArrowLeftCircle", "ArrowRightCircle",
  "ArrowUpSquare", "ArrowDownSquare", "ArrowLeftSquare", "ArrowRightSquare",
  "ArrowUpDown", "ArrowLeftRight", "ArrowUpFromDot", "ArrowUpFromLine",
  "ArrowDownToLine", "ArrowDownToDot", "ArrowUpToLine",
  "ArrowRightFromLine", "ArrowRightToLine", "ArrowLeftFromLine", "ArrowLeftToLine",
  "MoveUp", "MoveDown", "MoveLeft", "MoveRight", "Move", "MoveDiagonal", "MoveDiagonal2",
  "MoveHorizontal", "MoveVertical", "Move3d",
  "Navigation", "Navigation2", "NavigationOff", "Compass",
  "TrendingUp", "TrendingDown", "Milestone", "Signpost", "SignpostBig",
  
  // Media & Comunicazione (65 icone)
  "Camera", "CameraOff", "Image", "ImageOff", "ImagePlus", "ImageMinus", 
  "Video", "VideoOff", "Music", "Music2", "Music3", "Music4",
  "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming", "PhoneMissed", 
  "PhoneOff", "PhoneOutgoing", "Send", "SendHorizontal", "SendToBack",
  "Share", "Share2", "Link", "Link2", "ExternalLink", "Unlink", "Unlink2",
  "Mic", "Mic2", "MicOff", "MicVocal", "Radio", "Tv", "Tv2",
  "Film", "Clapperboard", "Headphones", "Headset", "Podcast",
  "Volume", "Volume1", "Volume2", "VolumeX",
  "Play", "PlayCircle", "PlaySquare", "Pause", "PauseCircle", "PauseOctagon",
  "Stop", "StopCircle", "SkipForward", "SkipBack", "FastForward", "Rewind",
  "Airplay", "Cast", "Disc", "Disc2", "Disc3", "DiscAlbum",
  "AudioLines", "AudioWaveform", "Voicemail", "Signal", "SignalHigh",
  "SignalLow", "SignalMedium", "SignalZero", "Rss", "Antenna",
  "Satellite", "SatelliteDish", "Radar", "Megaphone", "Speaker", "Podcast",
  
  // Social Media & Branding (40 icone)
  "Github", "Gitlab", "Twitter", "Linkedin", "Facebook", "Instagram", 
  "Youtube", "Twitch", "MessageSquare", "MessageCircle", "MessageSquareCode",
  "MessageSquareDashed", "MessageSquareDot", "MessageSquareHeart",
  "MessageSquarePlus", "MessageSquareQuote", "MessageSquareShare",
  "AtSign", "Hash", "Chrome", "Firefox", "Figma", "Framer",
  "Slack", "Trello", "Dribbble", "Codepen", "Codesandbox",
  "Mail", "MailOpen", "MailPlus", "MailMinus", "MailCheck", "MailX",
  "Inbox", "Send", "Reply", "ReplyAll", "Forward", "Archive",
  
  // Business & Finance (60 icone)
  "DollarSign", "CircleDollarSign", "BadgeDollarSign",
  "Euro", "BadgeEuro", "PoundSterling", "BadgePoundSterling",
  "IndianRupee", "JapaneseYen", "Bitcoin", "Coins", "Banknote",
  "TrendingUp", "TrendingDown", "BarChart", "BarChart2", "BarChart3", "BarChart4",
  "PieChart", "LineChart", "AreaChart", "CandlestickChart",
  "Activity", "Briefcase", "Receipt", "Wallet", "WalletCards",
  "BadgePercent", "Percent", "Calculator",
  "CreditCard", "Landmark", "LandmarkOff", "Building", "Building2",
  "Store", "Warehouse", "Factory", "Hotel", "Castle", "Church",
  "PiggyBank", "Vault", "Scale", "Gavel", "ScrollText",
  "Handshake", "HandshakeOff", "Award", "Trophy", "Medal",
  "Target", "Crosshair", "Focus", "Gauge", "GaugeCircle",
  "ArrowUpCircle", "ArrowDownCircle", "Equal", "Minus", "Plus",
  "BadgePlus", "BadgeMinus", "BadgeCheck", "BadgeX", "BadgeAlert",
  
  // File & Documenti (70 icone)
  "File", "FileText", "FilePlus", "FileMinus", "FileEdit", "FileCheck",
  "FileX", "FileX2", "FileCode", "FileCode2", "FileJson",
  "FileImage", "FileVideo", "FileAudio", "FileMusic", "FileSpreadsheet",
  "FileBadge", "FileClock", "FileDigit", "FileHeart", "FileKey",
  "FileLock", "FileLock2", "FileOutput", "FileInput", "FileSearch",
  "FileSearch2", "FileStack", "FileSymlink", "FileTerminal", "FileType",
  "FileType2", "FileWarning", "FileDiff", "FileArchive",
  "Folder", "FolderOpen", "FolderPlus", "FolderMinus", "FolderEdit",
  "FolderArchive", "FolderClosed", "FolderGit", "FolderGit2",
  "FolderHeart", "FolderInput", "FolderKey", "FolderLock",
  "FolderOutput", "FolderSearch", "FolderSearch2", "FolderSymlink",
  "FolderTree", "FolderUp", "FolderX", "FolderCheck", "FolderCog",
  "Files", "Copy", "CopyCheck", "CopyPlus", "CopyMinus", "CopyX",
  "Clipboard", "ClipboardCheck", "ClipboardCopy", "ClipboardList",
  "ClipboardPaste", "ClipboardType", "ClipboardX",
  "Book", "BookOpen", "BookMarked", "BookCopy", "Notebook", "NotebookPen",
  
  // UI & Layout (75 icone)
  "Layers", "Layers2", "Layers3", "Grid", "Grid2x2", "Grid3x3",
  "List", "ListOrdered", "ListChecks", "ListPlus", "ListMinus", "ListX",
  "ListTree", "Layout", "LayoutDashboard", "LayoutGrid", "LayoutList",
  "LayoutTemplate", "LayoutPanelLeft", "LayoutPanelTop",
  "Sidebar", "SidebarClose", "SidebarOpen",
  "PanelLeftClose", "PanelLeftOpen", "PanelRightClose", "PanelRightOpen",
  "PanelTopClose", "PanelTopOpen", "PanelBottomClose", "PanelBottomOpen",
  "Maximize", "Minimize", "ZoomIn", "ZoomOut", "Scan", "ScanLine",
  "Columns", "Columns2", "Columns3", "Rows", "Rows2", "Rows3", "Rows4",
  "SplitSquareHorizontal", "SplitSquareVertical",
  "Square", "Circle", "Triangle", "Octagon", "Pentagon", "Hexagon",
  "Diamond", "Box", "BoxSelect", "Package", "Package2", "PackageCheck",
  "PackageMinus", "PackagePlus", "PackageX", "PackageOpen", "PackageSearch",
  "RectangleHorizontal", "RectangleVertical", "Aperture", "Album",
  "Frame", "Crop", "ScanBarcode", "ScanFace", "ScanEye", "Orbit", "Scaling",
  
  // Sicurezza & Privacy (35 icone)
  "Lock", "LockOpen", "LockKeyhole", "LockKeyholeOpen",
  "Unlock", "Key", "KeyRound", "KeySquare",
  "Shield", "ShieldAlert", "ShieldBan", "ShieldCheck", "ShieldEllipsis",
  "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestion", "ShieldX",
  "Eye", "EyeOff", "EyeClosed", "Fingerprint", "Scan", "ScanFace", "ScanEye",
  "UserCheck", "UserCog", "UserX", "Ban", "ShieldClose",
  "AlertCircle", "AlertTriangle", "AlertOctagon", "Info",
  
  // Utenti & Profili (30 icone)
  "User", "User2", "Users", "Users2", "UserPlus", "UserMinus",
  "UserCheck", "UserX", "UserCog", "UserCircle", "UserCircle2",
  "UserSquare", "UserSquare2", "Contact", "Contact2", "IdCard",
  "BadgeCheck", "BadgeAlert", "BadgeHelp", "BadgeInfo",
  "Smile", "UserRound", "UserRoundCheck", "UserRoundCog",
  "UserRoundMinus", "UserRoundPlus", "UserRoundSearch", "UserRoundX",
  "UsersRound", "Baby",
  
  // Archiviazione & Cloud (35 icone)
  "Archive", "ArchiveRestore", "ArchiveX", "Inbox", "InboxCheck",
  "Cloud", "CloudCog", "CloudDownload", "CloudUpload", "CloudOff",
  "CloudDrizzle", "CloudFog", "CloudHail", "CloudLightning",
  "CloudMoon", "CloudMoonRain", "CloudRain", "CloudRainWind",
  "CloudSnow", "CloudSun", "CloudSunRain",
  "Server", "ServerCog", "ServerCrash", "ServerOff",
  "Database", "DatabaseBackup", "DatabaseZap",
  "HardDrive", "HardDriveDownload", "HardDriveUpload",
  "Save", "SaveAll", "Download", "Upload",
  
  // Connettività & Dispositivi (45 icone)
  "Wifi", "WifiOff", "Bluetooth", "BluetoothConnected", "BluetoothOff",
  "BluetoothSearching", "Battery", "BatteryCharging", "BatteryFull",
  "BatteryLow", "BatteryMedium", "BatteryWarning", "Power", "PowerOff",
  "Zap", "ZapOff", "Smartphone", "Tablet", "Laptop", "Laptop2",
  "Monitor", "MonitorOff", "MonitorSmartphone", "MonitorSpeaker",
  "Watch", "Printer", "Cast", "Usb", "Cpu", "MemoryStick",
  "HardDrive", "Keyboard", "Mouse", "MousePointer", "MousePointer2",
  "Touchpad", "TouchpadOff", "Plug", "Plug2", "PlugZap",
  "Cable", "Router", "Webcam", "Projector", "Tv",
  
  // Meteo & Natura (50 icone)
  "Sun", "SunMoon", "SunDim", "SunMedium", "SunSnow",
  "Moon", "MoonStar", "CloudRain", "CloudSnow", "CloudLightning",
  "Cloudy", "CloudDrizzle", "CloudFog", "CloudHail",
  "Sunrise", "Sunset", "Droplet", "Droplets", "Wind", "Tornado",
  "Thermometer", "ThermometerSun", "ThermometerSnowflake", "Umbrella",
  "Waves", "Rainbow", "Snowflake", "Flame",
  "Leaf", "Sprout", "Trees", "TreePine", "TreeDeciduous",
  "Flower", "Flower2", "Bug", "Bird", "Feather",
  "Shell", "Turtle", "Rabbit", "Squirrel", "Dog", "Cat",
  "Fish", "Bone", "Footprints", "Paw", "Egg",
  
  // Cibo & Bevande (45 icone)
  "Coffee", "Beer", "Wine", "BeerOff", "WineOff",
  "Pizza", "Apple", "Egg", "IceCream", "IceCream2",
  "Cake", "CakeSlice", "Cookie", "Sandwich",
  "UtensilsCrossed", "Utensils", "ForkKnife", "ChefHat",
  "Soup", "Salad", "Beef", "Popcorn", "Candy", "CandyCane",
  "Lollipop", "Milk", "MilkOff", "Glass", "GlassWater",
  "CupSoda", "Martini", "Cherry", "Grape", "Banana",
  "Citrus", "Strawberry", "Carrot", "Wheat", "Ham",
  "Drumstick", "LeafyGreen", "Croissant", "Donut", "Dessert",
  
  // Trasporti & Viaggi (45 icone)
  "MapPin", "MapPinned", "MapPinOff", "Map", "Navigation", "Navigation2",
  "Compass", "Globe", "Globe2", "Plane", "PlaneTakeoff", "PlaneLanding",
  "Car", "CarFront", "CarTaxiFront", "Truck", "Bus", "BusFront",
  "Train", "TrainFront", "TrainTrack", "Bike", "Ship", "Sailboat",
  "Anchor", "Luggage", "Backpack", "Tent", "Mountain", "MountainSnow",
  "Palmtree", "Route", "RouteOff", "Milestone", "Signpost",
  "Locate", "LocateFixed", "LocateOff", "Pin", "PinOff",
  "Target", "Crosshair", "Focus", "Radar",
  
  // Educazione & Scienza (35 icone)
  "GraduationCap", "School", "Library", "BookOpen", "BookMarked",
  "Microscope", "FlaskConical", "FlaskRound", "TestTube", "TestTubes",
  "TestTube2", "Atom", "Dna", "Brain", "BrainCircuit", "BrainCog",
  "Lightbulb", "LightbulbOff", "Beaker", "Binary",
  "Pi", "Sigma", "Infinity", "Equal", "Plus", "Minus",
  "Divide", "X", "Asterisk", "Calculator", "Function",
  "Variable", "Brackets", "Parentheses", "Pilcrow",
  
  // Salute & Medicina (30 icone)
  "Heart", "HeartPulse", "HeartHandshake", "HeartCrack", "HeartOff",
  "Pill", "Pills", "Syringe", "Stethoscope",
  "Hospital", "Ambulance", "Cross", "Activity",
  "Thermometer", "ThermometerSun", "ThermometerSnowflake",
  "Microscope", "TestTube", "TestTubes", "Dna", "Brain",
  "Bone", "Skull", "Bandage", "Tablets",
  "CirclePlus", "CircleMinus", "FirstAid", "Bed", "BedDouble",
  
  // Sport & Fitness (25 icone)
  "Dumbbell", "Weight", "Run", "Trophy", "Medal",
  "Target", "Timer", "Stopwatch", "Flame", "Crown",
  "Award", "Bike", "Football", "Goal", "Tennis",
  "Volleyball", "Basketball", "Baseball", "Golf",
  "Hockey", "Rugby", "TableTennis", "Badminton", "Boxing", "Karate",
  
  // Strumenti & Utensili (40 icone)
  "Wrench", "Hammer", "Drill", "Screwdriver", "Pickaxe",
  "Shovel", "Axe", "Saw", "Scissors", "Ruler", "RulerSquare",
  "Pen", "Pencil", "PenTool", "PenLine", "Paintbrush", "PaintBucket",
  "Palette", "Pipette", "Construction", "HardHat", "Cone",
  "Barricade", "Fence", "Anvil", "Cog", "Settings2",
  "Sliders", "SlidersHorizontal", "Nut", "Bolt",
  "Combine", "Component", "Puzzle", "Magnet", "Stamp",
  "Wand", "Wand2", "Eraser", "Brush",
  
  // Shopping & E-commerce (35 icone)
  "ShoppingBag", "ShoppingBasket", "ShoppingCart", "Tag", "Tags",
  "Ticket", "Package", "Package2", "Gift", "Store",
  "QrCode", "Barcode", "ScanLine", "ScanBarcode",
  "CreditCard", "BadgePercent", "Percent", "DollarSign",
  "Receipt", "Wallet", "WalletCards", "CircleDollarSign",
  "BadgeDollarSign", "Euro", "PoundSterling",
  "TrendingUp", "TrendingDown", "BarChart", "ShoppingBag",
  "PackageCheck", "PackagePlus", "PackageMinus", "PackageX", "PackageOpen", "PackageSearch",
  
  // Tempo & Calendario (35 icone)
  "Clock", "Clock1", "Clock2", "Clock3", "Clock4", "Clock5",
  "Clock6", "Clock7", "Clock8", "Clock9", "Clock10", "Clock11", "Clock12",
  "Alarm", "AlarmClock", "AlarmClockCheck", "AlarmClockMinus",
  "AlarmClockOff", "AlarmClockPlus", "AlarmCheck", "AlarmMinus",
  "AlarmPlus", "AlarmSmoke", "Timer", "TimerOff", "TimerReset",
  "Stopwatch", "Watch", "Hourglass", "History",
  "Calendar", "CalendarDays", "CalendarCheck", "CalendarCheck2",
  "CalendarX", "CalendarX2", "CalendarClock", "CalendarRange",
  
  // Emozioni & Reazioni (40 icone)
  "Smile", "SmilePlus", "Laugh", "Grin", "Frown", "Meh",
  "Annoyed", "Angry", "Confused", "Dizzy", "Surprised",
  "ThumbsUp", "ThumbsDown", "Heart", "HeartHandshake",
  "Star", "StarHalf", "StarOff", "Sparkles", "Sparkle",
  "PartyPopper", "Flame", "Ghost", "Skull", "Crown",
  "Diamond", "Gem", "Rocket", "Zap", "Award", "Trophy",
  "Medal", "Flag", "Bookmark", "BookmarkCheck", "BookmarkMinus",
  "BookmarkPlus", "BookmarkX", "MessageHeart", "Cake", "Gift",
  
  // Azioni & Comandi (30 icone)
  "Play", "PlayCircle", "PlaySquare", "Pause", "PauseCircle", "PauseOctagon",
  "Stop", "StopCircle", "SkipForward", "SkipBack", "FastForward", "Rewind",
  "Repeat", "Repeat1", "Repeat2", "Shuffle", "RotateCw", "RotateCcw",
  "RefreshCw", "RefreshCcw", "Power", "PowerOff",
  "Maximize", "Minimize", "Maximize2", "Minimize2",
  "Volume", "Volume1", "Volume2", "VolumeX",
  
  // Notifiche & Alert (25 icone)
  "Bell", "BellOff", "BellRing", "BellPlus", "BellMinus",
  "AlertCircle", "AlertTriangle", "AlertOctagon",
  "Info", "HelpCircle", "HelpingHand",
  "CheckCircle", "CheckCircle2", "XCircle", "XOctagon",
  "BadgeCheck", "BadgeAlert", "BadgeX", "BadgeInfo",
  "BadgeHelp", "CircleAlert", "CircleCheck", "CircleX",
  "OctagonAlert", "TriangleAlert",
  
  // Gaming & Intrattenimento (35 icone)
  "Gamepad", "Gamepad2", "Joystick", "Dices",
  "Dice1", "Dice2", "Dice3", "Dice4", "Dice5", "Dice6",
  "Puzzle", "Sword", "Swords", "Shield", "ShieldCheck",
  "Trophy", "Medal", "Award", "Target", "Crosshair",
  "Focus", "Sparkles", "Wand2", "Ghost", "Skull",
  "Crown", "Flame", "Rocket", "Zap", "PartyPopper",
  "Clapper", "Film", "Ticket", "Popcorn", "Flag",
  
  // Code & Development (50 icone)
  "Code", "Code2", "CodeSquare", "Brackets", "Braces",
  "Terminal", "TerminalSquare", "Bug", "BugOff", "BugPlay",
  "Binary", "FileCode", "FileCode2", "FolderCode",
  "Regex", "Variable", "Function", "Component",
  "Package", "PackageCheck", "PackageMinus", "PackagePlus", "PackageX",
  "PackageOpen", "PackageSearch", "Boxes", "Container",
  "Layers", "Layers2", "Layers3", "Puzzle", "Plugin",
  "Webhook", "Api", "Database", "DatabaseBackup", "DatabaseZap",
  "Server", "ServerCog", "ServerCrash", "ServerOff",
  "HardDrive", "HardDriveDownload", "HardDriveUpload",
  "Cpu", "MemoryStick", "GitBranch", "GitCommit", "GitPullRequest",
  "GitMerge", "Github", "Gitlab",
  
  // Text & Typography (35 icone)
  "Type", "Heading", "Heading1", "Heading2", "Heading3",
  "Heading4", "Heading5", "Heading6", "TextCursor", "TextCursorInput",
  "TextQuote", "TextSelect", "Quote", "Pilcrow",
  "Strikethrough", "Underline", "Bold", "Italic",
  "AlignLeft", "AlignCenter", "AlignRight", "AlignJustify",
  "ListOrdered", "ListChecks", "ListPlus", "ListMinus", "ListX",
  "Indent", "Outdent", "WrapText", "RemoveFormatting",
  "CaseSensitive", "CaseUpper", "CaseLower", "ALargeSmall",
  
  // Accessibility & Inclusion (20 icone)
  "Accessibility", "EarOff", "Ear", "Eye", "EyeOff", "EyeClosed",
  "Glasses", "Languages", "Speech", "Subtitles",
  "ALargeSmall", "CaseSensitive", "CaseUpper", "CaseLower",
  "Volume", "Volume1", "Volume2", "VolumeX", "Mic", "MicOff",
  
  // Misc & Varie (30 icone)
  "Trash", "Trash2", "Delete", "Eraser",
  "Mail", "MailOpen", "Send", "Reply", "Forward",
  "Bookmark", "BookmarkCheck", "BookmarkPlus",
  "Pin", "PinOff", "Paperclip", "Unplug",
  "Loader", "Loader2", "LoaderCircle",
  "CircleDashed", "CircleDot", "CircleDotDashed",
  "Separator", "GripHorizontal", "GripVertical",
  "MoreHorizontal", "MoreVertical", "Ellipsis",
  "EllipsisVertical", "Command",
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
            const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<LucideProps>;
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
