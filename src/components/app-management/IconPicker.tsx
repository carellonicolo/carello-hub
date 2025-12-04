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

// Array senza duplicati - ogni icona appare una sola volta (700+ icone totali)
const COMMON_ICONS = Array.from(new Set([
  // ========== INFORMATICA E PROGRAMMAZIONE ==========
  
  // Code & Development Base (60 icone)
  "Code", "Code2", "CodeSquare", "CodeXml", "SquareCode", "SquareTerminal",
  "Brackets", "Braces", "BracketsDot", "Parentheses",
  "Terminal", "TerminalSquare", "Command", "Shell",
  "Bug", "BugOff", "BugPlay", "SearchCode",
  "Binary", "FileCode", "FileCode2", "FolderCode", "ScrollCode",
  "Regex", "Variable", "Function", "FunctionSquare", "Component",
  "Layers", "Layers2", "Layers3", "Puzzle", "Plugin", "Blocks",
  "Webhook", "WebhookOff", "Api", "Workflow", "WorkflowOff",
  "AppWindow", "AppWindowMac", "Bot", "BotOff", "BotMessageSquare",
  "Clipboard", "ClipboardCode", "ClipboardCopy", "ClipboardPaste", "ClipboardList",
  "ClipboardCheck", "ClipboardType", "ClipboardX",
  "Replace", "ReplaceAll", "Diff", "Merge", "Split",
  "SquareArrowOutUpRight", "SquareDashedBottom", "SquareDashedBottomCode",
  
  // Git & Version Control (25 icone)
  "GitBranch", "GitBranchPlus", "GitCommit", "GitCommitHorizontal", "GitCommitVertical",
  "GitCompare", "GitCompareArrows", "GitFork", "GitGraph", "GitMerge",
  "GitPullRequest", "GitPullRequestArrow", "GitPullRequestClosed",
  "GitPullRequestCreate", "GitPullRequestCreateArrow", "GitPullRequestDraft",
  "Github", "Gitlab", "History", "HistoryIcon",
  "Undo", "Undo2", "Redo", "Redo2", "RotateCcw",
  
  // File Types & Formats (50 icone)
  "File", "FileText", "FilePlus", "FilePlus2", "FileMinus", "FileEdit",
  "FileCheck", "FileCheck2", "FileX", "FileX2",
  "FileJson", "FileJson2", "FileCode", "FileCode2",
  "FileImage", "FileVideo", "FileAudio", "FileMusic", "FileSpreadsheet",
  "FileBadge", "FileBadge2", "FileClock", "FileDigit", "FileHeart",
  "FileKey", "FileKey2", "FileLock", "FileLock2",
  "FileOutput", "FileInput", "FileSearch", "FileSearch2",
  "FileStack", "FileSymlink", "FileTerminal", "FileType", "FileType2",
  "FileWarning", "FileDiff", "FileArchive", "FileSliders",
  "FilePen", "FilePenLine", "FileQuestion", "FileScan",
  "FileUp", "FileDown", "FileCog", "FileAxis3d", "FileBox",
  
  // Database & Server (45 icone)
  "Database", "DatabaseBackup", "DatabaseZap",
  "Server", "ServerCog", "ServerCrash", "ServerOff",
  "Container", "Boxes", "Package", "Package2", "PackageCheck",
  "PackageMinus", "PackageOpen", "PackagePlus", "PackageSearch", "PackageX",
  "Archive", "ArchiveRestore", "ArchiveX",
  "Cloud", "CloudAlert", "CloudCog", "CloudDownload", "CloudOff", "CloudUpload",
  "CloudDrizzle", "CloudFog", "CloudHail", "CloudLightning",
  "CloudMoon", "CloudMoonRain", "CloudRain", "CloudRainWind",
  "CloudSnow", "CloudSun", "CloudSunRain",
  "HardDrive", "HardDriveDownload", "HardDriveUpload",
  "Disc", "Disc2", "Disc3", "DiscAlbum", "Save", "SaveAll", "SaveOff",
  
  // Hardware & Electronics (70 icone)
  "Cpu", "MemoryStick", "CircuitBoard", "Microchip", "Chip",
  "Nfc", "QrCode", "Barcode", "ScanBarcode", "ScanLine",
  "Monitor", "MonitorCheck", "MonitorCog", "MonitorDot", "MonitorDown",
  "MonitorOff", "MonitorPause", "MonitorPlay", "MonitorSmartphone",
  "MonitorSpeaker", "MonitorStop", "MonitorUp", "MonitorX",
  "Laptop", "Laptop2", "LaptopMinimal", "LaptopMinimalCheck",
  "Smartphone", "SmartphoneCharging", "SmartphoneNfc", "TabletSmartphone",
  "Tablet", "Tv", "Tv2", "TvMinimal", "TvMinimalPlay",
  "Keyboard", "Mouse", "MousePointer", "MousePointer2", "MousePointerBan",
  "MousePointerClick", "Touchpad", "TouchpadOff",
  "Usb", "Cable", "Plug", "Plug2", "PlugZap", "PlugZap2", "Unplug",
  "Power", "PowerCircle", "PowerOff", "PowerSquare",
  "Battery", "BatteryCharging", "BatteryFull", "BatteryLow",
  "BatteryMedium", "BatteryWarning",
  "Printer", "PrinterCheck", "Projector", "Webcam", "Camera", "CameraOff",
  "Watch", "Headphones", "Headset", "Speaker", "Radio",
  
  // Network & Connectivity (40 icone)
  "Wifi", "WifiHigh", "WifiLow", "WifiOff", "WifiZero",
  "Bluetooth", "BluetoothConnected", "BluetoothOff", "BluetoothSearching",
  "Router", "Network", "Globe", "Globe2", "GlobeLock", "Earth", "EarthLock",
  "Link", "Link2", "Link2Off", "Unlink", "Unlink2", "ExternalLink",
  "Share", "Share2", "Forward", "Send", "SendHorizontal", "SendToBack",
  "Antenna", "Signal", "SignalHigh", "SignalLow", "SignalMedium", "SignalZero",
  "Rss", "Podcast", "Satellite", "SatelliteDish", "Radar", "RadioTower",
  
  // Security & Encryption (35 icone)
  "Lock", "LockKeyhole", "LockKeyholeOpen", "LockOpen", "Unlock",
  "Key", "KeyRound", "KeySquare",
  "Shield", "ShieldAlert", "ShieldBan", "ShieldCheck", "ShieldEllipsis",
  "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestion", "ShieldX",
  "Fingerprint", "ScanFace", "ScanEye", "Eye", "EyeOff", "EyeClosed",
  "UserCheck", "UserCog", "UserX", "Ban",
  "AlertCircle", "AlertTriangle", "AlertOctagon", "OctagonAlert", "TriangleAlert",
  "CircleAlert", "Info",
  
  // ========== MATEMATICA E SCIENZA ==========
  
  // Mathematical Symbols (50 icone)
  "Pi", "Sigma", "Omega", "Infinity", "Equal", "EqualNot", "EqualApproximately",
  "Plus", "PlusCircle", "PlusSquare", "CirclePlus", "SquarePlus",
  "Minus", "MinusCircle", "MinusSquare", "CircleMinus", "SquareMinus",
  "X", "XCircle", "XSquare", "CircleX", "SquareX",
  "Divide", "DivideCircle", "DivideSquare", "CircleDivide", "SquareDivide",
  "Percent", "Hash", "Asterisk", "AtSign", "Ampersand",
  "Slash", "SlashSquare", "Superscript", "Subscript",
  "Calculator", "Function", "FunctionSquare", "Variable",
  "Brackets", "Braces", "Parentheses", "BracketsDot",
  "TrendingUp", "TrendingDown", "TrendingUpDown",
  "ChevronUp", "ChevronDown", "ChevronsUpDown",
  
  // Charts & Data Visualization (45 icone)
  "ChartArea", "ChartBar", "ChartBarBig", "ChartBarDecreasing", "ChartBarIncreasing",
  "ChartBarStacked", "ChartCandlestick", "ChartColumn", "ChartColumnBig",
  "ChartColumnDecreasing", "ChartColumnIncreasing", "ChartColumnStacked",
  "ChartLine", "ChartNetwork", "ChartNoAxesColumn", "ChartNoAxesCombined",
  "ChartNoAxesGantt", "ChartPie", "ChartScatter", "ChartSpline",
  "BarChart", "BarChart2", "BarChart3", "BarChart4", "BarChartBig",
  "BarChartHorizontal", "BarChartHorizontalBig",
  "PieChart", "LineChart", "AreaChart", "CandlestickChart", "GanttChart",
  "Activity", "ActivitySquare", "Gauge", "GaugeCircle",
  "Table", "Table2", "TableProperties", "TableCellsMerge", "TableCellsSplit",
  "Grid", "Grid2x2", "Grid2x2Check", "Grid2x2Plus", "Grid2x2X", "Grid3x3",
  
  // Geometry & 3D (40 icone)
  "Square", "SquareCheck", "SquareCheckBig", "SquareDashed", "SquareDashedMousePointer",
  "Circle", "CircleCheck", "CircleCheckBig", "CircleDashed", "CircleDot",
  "CircleDotDashed", "CircleEllipsis", "CircleFadingArrowUp", "CircleFadingPlus",
  "Triangle", "TriangleAlert", "TriangleRight",
  "Pentagon", "Hexagon", "Octagon", "OctagonAlert", "OctagonMinus", "OctagonPause", "OctagonX",
  "Diamond", "DiamondMinus", "DiamondPercent", "DiamondPlus",
  "Star", "StarHalf", "StarOff", "Sparkle", "Sparkles",
  "Box", "BoxSelect", "Boxes", "Cuboid", "Cylinder",
  "Axis3d", "Move3d", "Rotate3d", "Scale3d", "Orbit", "Scaling",
  "Blend", "Spline",
  
  // Science & Laboratory (50 icone)
  "Atom", "Dna", "DnaOff", "FlaskConical", "FlaskConicalOff", "FlaskRound",
  "TestTube", "TestTube2", "TestTubes", "Beaker",
  "Microscope", "Telescope", "Binoculars",
  "Brain", "BrainCircuit", "BrainCog",
  "Lightbulb", "LightbulbOff", "Lamp", "LampCeiling", "LampDesk",
  "LampFloor", "LampWallDown", "LampWallUp",
  "Magnet", "Zap", "ZapOff", "Flame", "FlameKindling",
  "Thermometer", "ThermometerSnowflake", "ThermometerSun",
  "Radiation", "Biohazard", "Skull", "SkullIcon",
  "Waves", "AudioWaveform", "Wind", "Tornado",
  "Sunrise", "Sunset", "Sun", "SunDim", "SunMedium", "SunMoon", "SunSnow",
  "Moon", "MoonStar", "Eclipse",
  "Droplet", "Droplets", "CloudRain", "Snowflake",
  
  // ========== UI E DESIGN ==========
  
  // Layout & Structure (60 icone)
  "Layout", "LayoutDashboard", "LayoutGrid", "LayoutList", "LayoutTemplate",
  "LayoutPanelLeft", "LayoutPanelTop",
  "Sidebar", "SidebarClose", "SidebarOpen",
  "PanelLeft", "PanelLeftClose", "PanelLeftDashed", "PanelLeftOpen",
  "PanelRight", "PanelRightClose", "PanelRightDashed", "PanelRightOpen",
  "PanelTop", "PanelTopClose", "PanelTopDashed", "PanelTopOpen",
  "PanelBottom", "PanelBottomClose", "PanelBottomDashed", "PanelBottomOpen",
  "Columns", "Columns2", "Columns3", "Columns4",
  "Rows", "Rows2", "Rows3", "Rows4",
  "SplitSquareHorizontal", "SplitSquareVertical",
  "RectangleHorizontal", "RectangleVertical", "RectangleEllipsis",
  "Maximize", "Maximize2", "Minimize", "Minimize2",
  "ZoomIn", "ZoomOut", "Scan", "ScanLine", "ScanSearch", "ScanText",
  "Fullscreen", "Shrink", "Expand", "Move", "MoveDiagonal", "MoveDiagonal2",
  "MoveHorizontal", "MoveVertical", "GripHorizontal", "GripVertical", "Grip",
  "Separator", "SeparatorHorizontal", "SeparatorVertical",
  
  // Navigation (50 icone)
  "Home", "Search", "SearchCheck", "SearchCode", "SearchSlash", "SearchX",
  "Settings", "Settings2", "Cog", "SlidersHorizontal", "SlidersVertical",
  "Menu", "MenuSquare", "MoreHorizontal", "MoreVertical", "Ellipsis", "EllipsisVertical",
  "Filter", "FilterX", "SortAsc", "SortDesc", "ArrowUpDown", "ArrowDownUp",
  "ChevronRight", "ChevronLeft", "ChevronUp", "ChevronDown",
  "ChevronsLeft", "ChevronsRight", "ChevronsUp", "ChevronsDown", "ChevronsUpDown",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "ArrowUpLeft", "ArrowUpRight", "ArrowDownLeft", "ArrowDownRight",
  "CornerUpLeft", "CornerUpRight", "CornerDownLeft", "CornerDownRight",
  "RotateCw", "RotateCcw", "RefreshCw", "RefreshCcw", "Repeat", "Repeat1", "Repeat2", "Shuffle",
  
  // Arrows Extended (40 icone)
  "ArrowBigUp", "ArrowBigDown", "ArrowBigLeft", "ArrowBigRight",
  "ArrowBigUpDash", "ArrowBigDownDash", "ArrowBigLeftDash", "ArrowBigRightDash",
  "ArrowUpCircle", "ArrowDownCircle", "ArrowLeftCircle", "ArrowRightCircle",
  "ArrowUpSquare", "ArrowDownSquare", "ArrowLeftSquare", "ArrowRightSquare",
  "ArrowLeftRight", "ArrowUpFromDot", "ArrowUpFromLine",
  "ArrowDownToLine", "ArrowDownToDot", "ArrowUpToLine",
  "ArrowRightFromLine", "ArrowRightToLine", "ArrowLeftFromLine", "ArrowLeftToLine",
  "MoveUp", "MoveDown", "MoveLeft", "MoveRight",
  "Navigation", "Navigation2", "NavigationOff", "Compass",
  "Milestone", "Signpost", "SignpostBig",
  "CircleArrowUp", "CircleArrowDown", "CircleArrowLeft", "CircleArrowRight",
  
  // ========== BUSINESS E FINANZA ==========
  
  // Currency & Finance (45 icone)
  "DollarSign", "CircleDollarSign", "BadgeDollarSign",
  "Euro", "BadgeEuro", "PoundSterling", "BadgePoundSterling",
  "IndianRupee", "BadgeIndianRupee", "JapaneseYen", "BadgeJapaneseYen",
  "SwissFranc", "BadgeSwissFranc", "RussianRuble", "BadgeRussianRuble",
  "Bitcoin", "Coins", "Banknote", "Wallet", "WalletCards", "WalletMinimal",
  "CreditCard", "Receipt", "ReceiptText",
  "PiggyBank", "Vault", "Landmark", "LandmarkOff",
  "TrendingUp", "TrendingDown", "BarChart", "PieChart", "LineChart",
  "Scale", "Scale3d", "Gavel", "ScrollText",
  "Handshake", "HandshakeOff", "Award", "Trophy", "Medal",
  "Target", "Crosshair", "Focus", "Goal",
  
  // Business (40 icone)
  "Briefcase", "BriefcaseBusiness", "BriefcaseMedical", "BriefcaseConveyorBelt",
  "Building", "Building2", "BuildingIcon",
  "Store", "Warehouse", "Factory", "Hotel", "Castle", "Church", "School", "Library",
  "Presentation", "ChartNoAxesCombined", "BadgePercent",
  "IdCard", "BadgeCheck", "BadgeAlert", "BadgeHelp", "BadgeInfo",
  "Contact", "Contact2", "Users", "Users2", "UsersRound",
  "User", "User2", "UserPlus", "UserMinus", "UserCheck", "UserX", "UserCog",
  "UserCircle", "UserCircle2", "UserSquare", "UserSquare2",
  "UserRound", "UserRoundCheck", "UserRoundCog", "UserRoundMinus", "UserRoundPlus",
  
  // ========== MEDIA E COMUNICAZIONE ==========
  
  // Media Controls (40 icone)
  "Play", "PlayCircle", "PlaySquare", "Pause", "PauseCircle", "PauseOctagon",
  "Stop", "StopCircle", "SkipForward", "SkipBack", "FastForward", "Rewind",
  "Volume", "Volume1", "Volume2", "VolumeX", "VolumeOff",
  "Mic", "Mic2", "MicOff", "MicVocal",
  "Video", "VideoOff", "VideoIcon",
  "Music", "Music2", "Music3", "Music4",
  "Image", "ImageOff", "ImagePlus", "ImageMinus", "ImageDown", "ImageUp", "Images",
  "Film", "Clapperboard", "ClapperboardIcon",
  "AudioLines", "AudioWaveform", "Voicemail",
  
  // Communication (45 icone)
  "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming", "PhoneMissed",
  "PhoneOff", "PhoneOutgoing",
  "MessageSquare", "MessageCircle", "MessageSquareCode", "MessageSquareDashed",
  "MessageSquareDot", "MessageSquareHeart", "MessageSquareMore",
  "MessageSquarePlus", "MessageSquareQuote", "MessageSquareReply",
  "MessageSquareShare", "MessageSquareText", "MessageSquareWarning", "MessageSquareX",
  "MessageCircleCode", "MessageCircleDashed", "MessageCircleHeart",
  "MessageCircleMore", "MessageCirclePlus", "MessageCircleQuestion",
  "MessageCircleReply", "MessageCircleWarning", "MessageCircleX",
  "MessagesSquare", "Mail", "MailOpen", "MailPlus", "MailMinus", "MailCheck", "MailX",
  "MailQuestion", "MailSearch", "MailWarning", "Mails",
  "Inbox", "AtSign", "Reply", "ReplyAll",
  
  // Social (25 icone)
  "Github", "Gitlab", "Twitter", "Linkedin", "Facebook", "Instagram",
  "Youtube", "Twitch", "Chrome", "Firefox", "Figma", "Framer",
  "Slack", "Trello", "Dribbble", "Codepen", "Codesandbox",
  "Hash", "Verified", "BadgeCheck", "CheckCheck",
  "Heart", "HeartHandshake", "HeartCrack", "HeartOff",
  
  // ========== DOCUMENTI E TESTO ==========
  
  // Text & Typography (45 icone)
  "Type", "Heading", "Heading1", "Heading2", "Heading3", "Heading4", "Heading5", "Heading6",
  "TextCursor", "TextCursorInput", "TextQuote", "TextSelect", "Text",
  "Quote", "Pilcrow", "WholeWord",
  "Strikethrough", "Underline", "Bold", "Italic",
  "AlignLeft", "AlignCenter", "AlignRight", "AlignJustify",
  "AlignStartHorizontal", "AlignStartVertical",
  "AlignCenterHorizontal", "AlignCenterVertical",
  "AlignEndHorizontal", "AlignEndVertical",
  "ListOrdered", "ListChecks", "ListPlus", "ListMinus", "ListX",
  "ListTree", "ListTodo", "ListFilter", "ListCollapse", "ListEnd", "ListMusic",
  "ListRestart", "ListStart", "ListVideo",
  "Indent", "IndentDecrease", "IndentIncrease", "Outdent",
  
  // Documents (40 icone)
  "Folder", "FolderOpen", "FolderPlus", "FolderMinus", "FolderEdit",
  "FolderArchive", "FolderClosed", "FolderGit", "FolderGit2",
  "FolderHeart", "FolderInput", "FolderKey", "FolderLock",
  "FolderOutput", "FolderSearch", "FolderSearch2", "FolderSymlink",
  "FolderTree", "FolderUp", "FolderX", "FolderCheck", "FolderCog",
  "FolderDot", "FolderDown", "FolderKanban", "FolderOpenDot", "FolderPen",
  "FolderRoot", "FolderSync", "Folders",
  "Files", "Copy", "CopyCheck", "CopyPlus", "CopyMinus", "CopyX", "CopySlash",
  "Book", "BookOpen", "BookOpenCheck", "BookOpenText",
  "BookMarked", "BookCopy", "Notebook", "NotebookPen", "NotebookTabs", "NotebookText",
  
  // ========== TEMPO E CALENDARIO ==========
  
  // Time (40 icone)
  "Clock", "Clock1", "Clock2", "Clock3", "Clock4", "Clock5",
  "Clock6", "Clock7", "Clock8", "Clock9", "Clock10", "Clock11", "Clock12",
  "ClockAlert", "ClockArrowDown", "ClockArrowUp",
  "Alarm", "AlarmClock", "AlarmClockCheck", "AlarmClockMinus",
  "AlarmClockOff", "AlarmClockPlus", "AlarmCheck", "AlarmMinus", "AlarmPlus",
  "Timer", "TimerOff", "TimerReset", "Stopwatch",
  "Watch", "Hourglass", "History", "HistoryIcon",
  "Calendar", "CalendarDays", "CalendarCheck", "CalendarCheck2",
  "CalendarX", "CalendarX2", "CalendarClock", "CalendarRange",
  "CalendarArrowDown", "CalendarArrowUp", "CalendarCog", "CalendarFold",
  "CalendarHeart", "CalendarMinus", "CalendarMinus2", "CalendarOff",
  "CalendarPlus", "CalendarPlus2", "CalendarSearch",
  
  // ========== AZIONI E COMANDI ==========
  
  // Actions (35 icone)
  "Download", "Upload", "DownloadCloud", "UploadCloud",
  "Edit", "Edit2", "Edit3", "PenLine", "Pen", "PenTool", "Pencil", "PencilLine", "PencilRuler",
  "Trash", "Trash2", "Delete", "Eraser",
  "Check", "CheckCheck", "CheckCircle", "CheckCircle2", "CircleCheck", "CircleCheckBig",
  "X", "XCircle", "XOctagon", "CircleX", "OctagonX",
  "Plus", "PlusCircle", "PlusSquare", "CirclePlus", "SquarePlus",
  "Minus", "MinusCircle", "MinusSquare", "CircleMinus", "SquareMinus",
  
  // Notifications (25 icone)
  "Bell", "BellOff", "BellRing", "BellPlus", "BellMinus", "BellDot", "BellElectric",
  "AlertCircle", "AlertTriangle", "AlertOctagon",
  "Info", "HelpCircle", "HelpingHand", "CircleHelp",
  "CheckCircle", "CheckCircle2", "XCircle", "XOctagon",
  "BadgeCheck", "BadgeAlert", "BadgeX", "BadgeInfo", "BadgeHelp",
  "Siren", "Megaphone",
  
  // ========== TRASPORTI E VIAGGI ==========
  
  // Transportation (40 icone)
  "Car", "CarFront", "CarTaxiFront", "Truck", "Bus", "BusFront",
  "Train", "TrainFront", "TrainTrack", "TramFront",
  "Bike", "Ship", "Sailboat", "Boat", "Anchor",
  "Plane", "PlaneTakeoff", "PlaneLanding",
  "Rocket", "RocketIcon",
  "Fuel", "ParkingCircle", "ParkingCircleOff", "ParkingMeter", "ParkingSquare", "ParkingSquareOff",
  "Construction", "Cone", "HardHat", "Barricade",
  "Luggage", "Backpack", "Tent", "TentTree", "Caravan", "Fence",
  "TrafficCone", "Ambulance", "Siren",
  
  // Location (30 icone)
  "MapPin", "MapPinned", "MapPinOff", "MapPinPlus", "MapPinMinus", "MapPinCheck", "MapPinX",
  "Map", "MapIcon",
  "Navigation", "Navigation2", "NavigationOff",
  "Compass", "Locate", "LocateFixed", "LocateOff",
  "Pin", "PinOff", "Target", "Crosshair", "Focus",
  "Globe", "Globe2", "GlobeLock", "Earth", "EarthLock",
  "Mountain", "MountainSnow", "Palmtree", "TreePine", "TreeDeciduous", "Trees",
  
  // ========== STRUMENTI ==========
  
  // Tools (40 icone)
  "Wrench", "Hammer", "Drill", "Screwdriver", "Pickaxe",
  "Shovel", "Axe", "Saw", "Scissors", "ScissorsLineDashed",
  "Ruler", "RulerIcon",
  "Paintbrush", "PaintBucket", "PaintbrushVertical", "Palette", "Pipette",
  "Construction", "HardHat", "Cone", "Anvil",
  "Cog", "Settings", "Settings2", "SlidersHorizontal", "SlidersVertical",
  "Nut", "Combine", "Component", "Puzzle",
  "Magnet", "Stamp", "Wand", "Wand2", "WandSparkles",
  "Brush", "Crop", "Frame", "Aperture",
  "Loader", "Loader2", "LoaderCircle", "LoaderPinwheel",
  
  // ========== SHOPPING ==========
  
  // Shopping (30 icone)
  "ShoppingBag", "ShoppingBasket", "ShoppingCart",
  "Tag", "Tags", "Ticket", "TicketCheck", "TicketMinus", "TicketPercent",
  "TicketPlus", "TicketSlash", "TicketX",
  "Package", "Package2", "Gift", "GiftIcon", "Store", "Storefront",
  "QrCode", "Barcode", "ScanLine", "ScanBarcode",
  "CreditCard", "BadgePercent", "Percent", "DollarSign",
  "Receipt", "ReceiptText", "Wallet", "WalletCards",
  
  // ========== NATURA E METEO ==========
  
  // Weather (35 icone)
  "Sun", "SunMoon", "SunDim", "SunMedium", "SunSnow",
  "Moon", "MoonStar",
  "Cloud", "CloudRain", "CloudSnow", "CloudLightning", "Cloudy",
  "CloudDrizzle", "CloudFog", "CloudHail", "CloudMoonRain", "CloudSunRain",
  "Sunrise", "Sunset", "Droplet", "Droplets",
  "Wind", "Tornado", "Thermometer", "ThermometerSun", "ThermometerSnowflake",
  "Umbrella", "UmbrellaOff", "Waves", "Rainbow", "Snowflake", "Flame",
  "Haze", "Hurricane", "Cloudy",
  
  // Nature (30 icone)
  "Leaf", "LeafyGreen", "Sprout", "Clover",
  "Trees", "TreePine", "TreeDeciduous", "TreePalm",
  "Flower", "Flower2", "Cherry", "Grape", "Banana", "Apple", "Citrus", "Strawberry",
  "Bug", "Snail", "Bird", "Feather",
  "Fish", "Shell", "Turtle", "Rabbit", "Squirrel", "Dog", "Cat",
  "Bone", "Footprints", "Paw",
  
  // ========== CIBO ==========
  
  // Food & Drinks (35 icone)
  "Coffee", "Beer", "Wine", "BeerOff", "WineOff",
  "Pizza", "Apple", "Egg", "EggFried", "EggOff",
  "IceCream", "IceCreamBowl", "IceCreamCone",
  "Cake", "CakeSlice", "Cookie", "Sandwich",
  "UtensilsCrossed", "Utensils", "ChefHat",
  "Soup", "Salad", "Beef", "Ham", "Drumstick",
  "Popcorn", "Candy", "CandyCane", "Lollipop",
  "Milk", "MilkOff", "GlassWater", "CupSoda", "Martini",
  "Croissant", "Donut", "Wheat", "Carrot",
  
  // ========== SPORT ==========
  
  // Sports & Fitness (25 icone)
  "Dumbbell", "Trophy", "Medal", "Award",
  "Target", "Timer", "Stopwatch", "Flame", "Crown",
  "Bike", "Footprints",
  "Goal", "Volleyball", "Basketball", "Baseball", "Tennis",
  "Swords", "Sword", "ShieldCheck",
  "Heart", "HeartPulse", "Activity",
  "PersonStanding", "Accessibility", "Armchair",
  
  // ========== SALUTE ==========
  
  // Health (25 icone)
  "Heart", "HeartPulse", "HeartHandshake", "HeartCrack", "HeartOff",
  "Pill", "Syringe", "Stethoscope",
  "Hospital", "Ambulance", "Cross", "Activity", "ActivitySquare",
  "Thermometer", "ThermometerSun", "ThermometerSnowflake",
  "Microscope", "TestTube", "TestTubes", "Dna", "Brain",
  "Bone", "Skull", "Bandage",
  "BedDouble", "BedSingle",
  
  // ========== EMOJI E REAZIONI ==========
  
  // Emotions (30 icone)
  "Smile", "SmilePlus", "Laugh", "Frown", "Meh",
  "Annoyed", "Angry", "Confused",
  "ThumbsUp", "ThumbsDown", "Heart", "HeartHandshake",
  "Star", "StarHalf", "StarOff", "Sparkles", "Sparkle",
  "PartyPopper", "Flame", "Ghost", "Skull", "Crown",
  "Diamond", "Gem", "Rocket", "Zap",
  "Flag", "Bookmark", "BookmarkCheck", "BookmarkMinus", "BookmarkPlus",
  
  // ========== GAMING ==========
  
  // Gaming (20 icone)
  "Gamepad", "Gamepad2", "Joystick", "Dices",
  "Dice1", "Dice2", "Dice3", "Dice4", "Dice5", "Dice6",
  "Puzzle", "Sword", "Swords", "Shield", "ShieldCheck",
  "Trophy", "Medal", "Award", "Target", "Crosshair",
  
  // ========== MISC ==========
  
  // Miscellaneous (30 icone)
  "Hash", "Asterisk", "AtSign", "Command",
  "Paperclip", "Unplug", "Pin", "PinOff",
  "Loader", "Loader2", "LoaderCircle",
  "CircleDashed", "CircleDot", "CircleDotDashed",
  "GripHorizontal", "GripVertical", "Grip",
  "MoreHorizontal", "MoreVertical", "Ellipsis", "EllipsisVertical",
  "Space", "SquareAsterisk", "SquareSlash",
  "Asterisk", "Hash", "Quote", "TextQuote",
  "HandMetal", "Hand", "Handshake", "Pointer", "PointerOff",
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
                title={iconName}
              >
                <IconComponent className="h-5 w-5 mx-auto" />
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {value && (
        <p className="text-sm text-muted-foreground text-center">
          Selezionata: <span className="font-medium">{value}</span>
        </p>
      )}
    </div>
  );
};
