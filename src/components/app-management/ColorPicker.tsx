import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  // Rossi (6 sfumature)
  "hsl(0, 85%, 35%)", "hsl(0, 85%, 45%)", "hsl(0, 85%, 55%)", 
  "hsl(0, 85%, 65%)", "hsl(0, 70%, 75%)", "hsl(0, 60%, 85%)",
  
  // Arancioni (6 sfumature)
  "hsl(25, 90%, 40%)", "hsl(25, 90%, 50%)", "hsl(30, 95%, 55%)",
  "hsl(35, 100%, 55%)", "hsl(40, 95%, 65%)", "hsl(45, 90%, 75%)",
  
  // Gialli (6 sfumature)
  "hsl(45, 95%, 45%)", "hsl(48, 95%, 50%)", "hsl(50, 95%, 55%)",
  "hsl(52, 95%, 60%)", "hsl(55, 90%, 70%)", "hsl(58, 85%, 80%)",
  
  // Verdi (6 sfumature)
  "hsl(120, 60%, 30%)", "hsl(130, 65%, 40%)", "hsl(140, 70%, 45%)",
  "hsl(150, 70%, 50%)", "hsl(160, 60%, 60%)", "hsl(170, 55%, 70%)",
  
  // Ciano/Teal (6 sfumature)
  "hsl(175, 70%, 35%)", "hsl(180, 75%, 40%)", "hsl(185, 80%, 45%)",
  "hsl(190, 85%, 50%)", "hsl(195, 80%, 60%)", "hsl(200, 75%, 70%)",
  
  // Blu (6 sfumature)
  "hsl(210, 90%, 35%)", "hsl(215, 90%, 45%)", "hsl(220, 90%, 55%)",
  "hsl(225, 85%, 60%)", "hsl(230, 80%, 70%)", "hsl(235, 75%, 80%)",
  
  // Viola/Purple (6 sfumature)
  "hsl(260, 80%, 40%)", "hsl(265, 80%, 50%)", "hsl(270, 75%, 55%)",
  "hsl(275, 70%, 60%)", "hsl(280, 65%, 70%)", "hsl(285, 60%, 80%)",
  
  // Rosa/Magenta (6 sfumature)
  "hsl(320, 75%, 40%)", "hsl(330, 80%, 50%)", "hsl(340, 80%, 55%)",
  "hsl(345, 75%, 60%)", "hsl(350, 70%, 70%)", "hsl(355, 65%, 80%)",
  
  // Grigi (6 sfumature)
  "hsl(0, 0%, 15%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 45%)",
  "hsl(0, 0%, 60%)", "hsl(0, 0%, 75%)", "hsl(0, 0%, 90%)",
];

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [showCustom, setShowCustom] = useState(false);

  const hslToHex = (hsl: string): string => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return "#000000";

    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-9 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-6 rounded-md border-2 transition-all hover:scale-110 ${
              value === color ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ background: color }}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowCustom(!showCustom)}
        className="w-full"
      >
        {showCustom ? "Nascondi personalizzato" : "Personalizza colore"}
      </Button>

      {showCustom && (
        <div className="space-y-2">
          <Label htmlFor="custom-color">Colore personalizzato</Label>
          <Input
            id="custom-color"
            type="color"
            value={hslToHex(value)}
            onChange={(e) => onChange(hexToHsl(e.target.value))}
            className="h-12 cursor-pointer"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border"
          style={{ background: value }}
        />
        <span className="text-xs text-muted-foreground">{value}</span>
      </div>
    </div>
  );
};
