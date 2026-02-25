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
        className="w-[104px] h-[104px] rounded-[1.375rem] flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-2xl group-active:scale-95 relative overflow-hidden"
        style={{
          background: folder.color,
          boxShadow: `0 8px 32px ${folder.color}40, 0 4px 16px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Frosted glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* App preview grid */}
        <div className="relative z-10 grid grid-cols-2 gap-1.5 p-2.5">
          {previewApps.map((app) => {
            const IconComponent = Icons[app.icon_name as keyof typeof Icons] as React.ComponentType<LucideProps>;
            return (
              <div
                key={app.id}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: app.color }}
              >
                {IconComponent && <IconComponent className="w-[18px] h-[18px] text-white" />}
              </div>
            );
          })}
          {/* Fill empty slots */}
          {Array.from({ length: Math.max(0, 4 - previewApps.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-9 h-9 rounded-lg bg-white/20"
            />
          ))}
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      <span
        className="text-base font-semibold text-foreground drop-shadow-md text-center max-w-[130px] truncate whitespace-nowrap block"
        title={folder.name}
      >
        {folder.name}
      </span>
    </button>
  );
};

export default FolderIcon;
