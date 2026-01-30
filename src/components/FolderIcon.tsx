import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { App } from "@/hooks/useApps";
import { Folder } from "@/hooks/useFolders";

interface FolderIconProps {
  folder: Folder;
  apps: App[];
  onClick: () => void;
}

const FolderIcon = ({ folder, apps, onClick }: FolderIconProps) => {
  // Get up to 4 apps for the preview grid
  const previewApps = apps.slice(0, 4);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
    >
      <div
        className="w-[72px] h-[72px] md:w-24 md:h-24 rounded-[20px] md:rounded-[28px] flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-2xl group-active:scale-95 relative overflow-hidden"
        style={{
          background: folder.color,
          boxShadow: `0 8px 32px ${folder.color}40, 0 4px 16px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Frosted glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* App preview grid */}
        <div className="relative z-10 grid grid-cols-2 gap-1 p-2">
          {previewApps.map((app) => {
            const IconComponent = Icons[app.icon_name as keyof typeof Icons] as React.ComponentType<LucideProps>;
            return (
              <div
                key={app.id}
                className="w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center"
                style={{ background: app.color }}
              >
                {IconComponent && <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white" />}
              </div>
            );
          })}
          {/* Fill empty slots */}
          {Array.from({ length: Math.max(0, 4 - previewApps.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-6 h-6 md:w-8 md:h-8 rounded-md bg-white/20"
            />
          ))}
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      <span className="text-[11px] md:text-sm font-medium text-foreground/90 drop-shadow-lg text-center truncate max-w-[80px] md:max-w-[100px] group-hover:text-foreground transition-colors duration-300">
        {folder.name}
      </span>
    </button>
  );
};

export default FolderIcon;
