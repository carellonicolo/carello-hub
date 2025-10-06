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
  "Book", "Calendar", "Users", "FileText", "Mail", "Home", "Settings",
  "Search", "Bell", "Heart", "Star", "Download", "Upload", "Trash",
  "Edit", "Plus", "Minus", "Check", "X", "ChevronRight", "ChevronLeft",
  "Play", "Pause", "Volume2", "Camera", "Image", "Video", "Music",
  "Phone", "MessageCircle", "Send", "Share2", "Link", "ExternalLink",
  "Github", "Twitter", "Linkedin", "Facebook", "Instagram", "Youtube",
  "ShoppingCart", "CreditCard", "DollarSign", "TrendingUp", "BarChart",
  "PieChart", "Activity", "Target", "Award", "Flag", "Bookmark",
  "Tag", "Filter", "Layers", "Grid", "List", "Layout", "Sidebar",
  "Maximize", "Minimize", "ZoomIn", "ZoomOut", "RotateCw", "RefreshCw",
  "Lock", "Unlock", "Key", "Shield", "Eye", "EyeOff", "User",
  "Users", "UserPlus", "UserMinus", "UserCheck", "Archive", "Inbox",
  "Cloud", "CloudDownload", "CloudUpload", "Server", "Database", "HardDrive",
  "Wifi", "WifiOff", "Bluetooth", "Battery", "Power", "Zap",
  "Sun", "Moon", "CloudRain", "Droplet", "Wind", "Coffee",
  "Briefcase", "Package", "Gift", "ShoppingBag", "MapPin", "Map",
  "Navigation", "Compass", "Globe", "Plane", "Car", "Truck"
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
