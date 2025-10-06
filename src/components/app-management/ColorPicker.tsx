import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "hsl(0, 85%, 60%)",    // Red
  "hsl(217, 91%, 60%)",  // Blue
  "hsl(262, 83%, 58%)",  // Purple
  "hsl(35, 100%, 55%)",  // Orange
  "hsl(150, 70%, 45%)",  // Green
  "hsl(280, 70%, 60%)",  // Magenta
  "hsl(195, 85%, 55%)",  // Cyan
  "hsl(45, 95%, 55%)",   // Yellow
  "hsl(340, 80%, 55%)",  // Pink
  "hsl(160, 75%, 50%)",  // Teal
  "hsl(25, 85%, 60%)",   // Coral
  "hsl(240, 70%, 65%)",  // Indigo
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
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
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
          className="w-8 h-8 rounded border"
          style={{ background: value }}
        />
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
    </div>
  );
};
