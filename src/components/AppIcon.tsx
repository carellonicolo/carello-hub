import * as Icons from "lucide-react";

interface AppIconProps {
  iconName: string;
  label: string;
  href: string;
  color?: string;
}

// Helper function to add opacity to HSL color
const addOpacityToHsl = (hsl: string, opacity: number): string => {
  // If it's already hsla, replace the opacity
  if (hsl.includes('hsla')) {
    return hsl.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }
  // Convert hsl to hsla
  return hsl.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
};

const AppIcon = ({ iconName, label, href, color = "hsl(var(--primary))" }: AppIconProps) => {
  const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;

  if (!Icon) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <div
        className="relative w-[104px] h-[104px] rounded-[1.375rem] flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${addOpacityToHsl(color, 0.95)}, ${addOpacityToHsl(color, 0.90)})`,
          backdropFilter: 'var(--backdrop-blur)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <Icon className="w-[52px] h-[52px] text-white drop-shadow-md" strokeWidth={1.5} />
        <div
          className="absolute inset-0 rounded-[1.375rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)',
          }}
        />
      </div>
      <span
        className="text-base font-semibold text-foreground drop-shadow-md text-center max-w-[130px] truncate whitespace-nowrap block"
        title={label}
      >
        {label}
      </span>
    </a>
  );
};

export default AppIcon;
