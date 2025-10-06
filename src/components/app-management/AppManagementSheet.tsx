import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppCard } from "./AppCard";
import { AppFormDialog } from "./AppFormDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useApps, App, AppFormData } from "@/hooks/useApps";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface AppManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppManagementSheet = ({
  open,
  onOpenChange,
}: AppManagementSheetProps) => {
  const { apps, addApp, updateApp, deleteApp, reorderApps } = useApps();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [deletingApp, setDeletingApp] = useState<App | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = apps.findIndex((app) => app.id === active.id);
      const newIndex = apps.findIndex((app) => app.id === over.id);
      const reordered = arrayMove(apps, oldIndex, newIndex);
      reorderApps(reordered);
    }
  };

  const handleAddClick = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleDeleteClick = (app: App) => {
    setDeletingApp(app);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: AppFormData) => {
    if (editingApp) {
      updateApp({ id: editingApp.id, data });
    } else {
      addApp(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingApp) {
      deleteApp(deletingApp.id);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Gestione App</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Button onClick={handleAddClick} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Nuova App
            </Button>

            <div className="space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={apps.map((app) => app.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {apps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onEdit={() => handleEditClick(app)}
                      onDelete={() => handleDeleteClick(app)}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {apps.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nessuna app configurata. Aggiungi la tua prima app!
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AppFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        editingApp={editingApp}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        appName={deletingApp?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
