import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppCard } from "./AppCard";
import { FolderCard } from "./FolderCard";
import { AppFormDialog } from "./AppFormDialog";
import { FolderFormDialog } from "./FolderFormDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useApps, App, AppFormData } from "@/hooks/useApps";
import { useFolders, Folder, FolderFormData } from "@/hooks/useFolders";
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
import { Separator } from "@/components/ui/separator";

interface AppManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppManagementSheet = ({
  open,
  onOpenChange,
}: AppManagementSheetProps) => {
  const { apps, addApp, updateApp, deleteApp, reorderApps, moveAppsToFolder } = useApps();
  const { folders, addFolder, updateFolder, deleteFolder, reorderFolders } = useFolders();
  
  const [formOpen, setFormOpen] = useState(false);
  const [folderFormOpen, setFolderFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingApp, setDeletingApp] = useState<App | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndApps = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = apps.findIndex((app) => app.id === active.id);
      const newIndex = apps.findIndex((app) => app.id === over.id);
      const reordered = arrayMove(apps, oldIndex, newIndex);
      reorderApps(reordered);
    }
  };

  const handleDragEndFolders = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = folders.findIndex((f) => f.id === active.id);
      const newIndex = folders.findIndex((f) => f.id === over.id);
      const reordered = arrayMove(folders, oldIndex, newIndex);
      reorderFolders(reordered);
    }
  };

  const handleAddClick = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const handleAddFolderClick = () => {
    setEditingFolder(null);
    setFolderFormOpen(true);
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleEditFolderClick = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderFormOpen(true);
  };

  const handleDeleteClick = (app: App) => {
    setDeletingApp(app);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFolderClick = (folder: Folder) => {
    setDeletingFolder(folder);
    setDeleteFolderDialogOpen(true);
  };

  const handleFormSubmit = (data: AppFormData) => {
    if (editingApp) {
      updateApp({ id: editingApp.id, data });
    } else {
      addApp(data);
    }
  };

  const handleFolderFormSubmit = async (data: FolderFormData, selectedAppIds: string[]) => {
    console.log('📁 handleFolderFormSubmit - editing:', !!editingFolder, 'selectedApps:', selectedAppIds);
    if (editingFolder) {
      updateFolder({ id: editingFolder.id, data });
      await moveAppsToFolder({ appIds: selectedAppIds, folderId: editingFolder.id });
    } else {
      const newFolder = await addFolder(data);
      console.log('📁 Nuova cartella creata:', newFolder);
      if (newFolder && selectedAppIds.length > 0) {
        await moveAppsToFolder({ appIds: selectedAppIds, folderId: newFolder.id });
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingApp) {
      deleteApp(deletingApp.id);
    }
  };

  const handleDeleteFolderConfirm = () => {
    if (deletingFolder) {
      deleteFolder(deletingFolder.id);
    }
  };

  const getAppsInFolder = (folderId: string) => {
    return apps.filter(app => app.folder_id === folderId);
  };

  const getAppsInFolderIds = (folderId: string) => {
    return getAppsInFolder(folderId).map(app => app.id);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Gestione App</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={handleAddClick} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Nuova App
              </Button>
              <Button onClick={handleAddFolderClick} variant="outline" className="flex-1">
                <FolderPlus className="w-4 h-4 mr-2" />
                Nuova Cartella
              </Button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {/* Folders Section */}
              {folders.length > 0 && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Cartelle</h3>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEndFolders}
                    >
                      <SortableContext
                        items={folders.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {folders.map((folder) => (
                            <FolderCard
                              key={folder.id}
                              folder={folder}
                              appCount={getAppsInFolder(folder.id).length}
                              onEdit={() => handleEditFolderClick(folder)}
                              onDelete={() => handleDeleteFolderClick(folder)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                  <Separator />
                </>
              )}

              {/* Apps Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">App</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndApps}
                >
                  <SortableContext
                    items={apps.map((app) => app.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {apps.map((app) => (
                        <AppCard
                          key={app.id}
                          app={app}
                          folderName={folders.find(f => f.id === app.folder_id)?.name}
                          onEdit={() => handleEditClick(app)}
                          onDelete={() => handleDeleteClick(app)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {apps.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nessuna app configurata. Aggiungi la tua prima app!
                  </p>
                )}
              </div>
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

      <FolderFormDialog
        open={folderFormOpen}
        onOpenChange={setFolderFormOpen}
        onSubmit={handleFolderFormSubmit}
        editingFolder={editingFolder}
        apps={apps}
        appsInFolder={editingFolder ? getAppsInFolderIds(editingFolder.id) : []}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        appName={deletingApp?.name || ""}
        onConfirm={handleDeleteConfirm}
      />

      <DeleteConfirmDialog
        open={deleteFolderDialogOpen}
        onOpenChange={setDeleteFolderDialogOpen}
        appName={deletingFolder?.name || ""}
        onConfirm={handleDeleteFolderConfirm}
      />
    </>
  );
};
