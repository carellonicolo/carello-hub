import { GripVertical, Pencil, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Folder as FolderType } from "@/hooks/useFolders";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FolderCardProps {
  folder: FolderType;
  appCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const FolderCard = ({ folder, appCount, onEdit, onDelete }: FolderCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border rounded-lg"
    >
      <button
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: folder.color }}
      >
        <Folder className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{folder.name}</p>
        <p className="text-sm text-muted-foreground">
          {appCount} {appCount === 1 ? 'app' : 'app'}
        </p>
      </div>

      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
