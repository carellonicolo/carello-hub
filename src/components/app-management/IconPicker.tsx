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

// Genera dinamicamente tutte le icone disponibili da lucide-react (~1400+ icone)
const ALL_ICON_NAMES = Object.keys(Icons).filter((key) => {
  // Escludi exports non-icone (utility functions, tipi, etc.)
  const excludeList = [
    'createLucideIcon',
    'defaultAttributes',
    'Icon',
    'icons',
    'LucideIcon',
    'default'
  ];
  
  if (excludeList.includes(key)) return false;
  
  // Verifica che sia un componente React valido
  const icon = Icons[key as keyof typeof Icons];
  return typeof icon === 'object' && icon !== null && '$$typeof' in icon;
}).sort();

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    return ALL_ICON_NAMES.filter((iconName) =>
      iconName.toLowerCase().includes(searchLower)
    );
  }, [search]);

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
      <div className="text-xs text-muted-foreground">
        {filteredIcons.length} icone disponibili
      </div>
      <ScrollArea className="h-[280px] rounded-md border p-2">
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
