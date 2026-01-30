import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { App } from "@/hooks/useApps";
import { Folder } from "@/hooks/useFolders";

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
  apps: App[];
}

const FolderModal = ({ open, onOpenChange, folder, apps }: FolderModalProps) => {
  if (!folder) return null;

  const handleAppClick = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: folder.color }}
            >
              <Icons.Folder className="w-4 h-4 text-white" />
            </div>
            {folder.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {apps.length === 0 ? (
            <p className="col-span-3 text-center text-muted-foreground py-8">
              Nessuna app in questa cartella
            </p>
          ) : (
            apps.map((app) => {
              const IconComponent = Icons[app.icon_name as keyof typeof Icons] as React.ComponentType<LucideProps>;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.href)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
                    style={{
                      background: app.color,
                      boxShadow: `0 4px 16px ${app.color}40`,
                    }}
                  >
                    {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                  </div>
                  <span className="text-xs text-foreground/80 text-center truncate max-w-[70px]">
                    {app.name}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderModal;
