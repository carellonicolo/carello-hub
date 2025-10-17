import * as Icons from "lucide-react";

interface AppIconProps {
  iconName: string;
  label: string;
  href: string;
  color?: string;
}

const AppIcon = ({ iconName, label, href, color = "hsl(var(--primary))" }: AppIconProps) => {
  const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
  
  if (!Icon) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
    >
      <div 
        className="relative w-20 h-20 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          backdropFilter: 'var(--backdrop-blur)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.18)',
        }}
      >
        <Icon className="w-10 h-10 text-white drop-shadow-md" strokeWidth={1.5} />
        <div 
          className="absolute inset-0 rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)',
          }}
        />
      </div>
      <span className="text-sm font-medium text-foreground drop-shadow-md text-center max-w-[80px] line-clamp-2">
        {label}
      </span>
    </a>
  );
};

export default AppIcon;
