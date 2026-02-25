import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import FolderIcon from "@/components/FolderIcon";
import FolderModal from "@/components/FolderModal";
import ProjectInfoButton from "@/components/ProjectInfoButton";
import backgroundImage from "@/assets/dashboard-background.jpg";
import { useApps, App } from "@/hooks/useApps";
import { useFolders, Folder } from "@/hooks/useFolders";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useResponsiveColumns } from "@/hooks/useResponsiveColumns";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  DndContext,
  pointerWithin,
  MeasuringStrategy,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Prefix helpers to distinguish folders from apps in the sortable context
const FOLDER_PREFIX = "folder-";
const APP_PREFIX = "app-";
const toSortableId = (type: "folder" | "app", id: string) => `${type === "folder" ? FOLDER_PREFIX : APP_PREFIX}${id}`;
const parseSortableId = (sortableId: string): { type: "folder" | "app"; id: string } => {
  if (typeof sortableId === 'string' && sortableId.startsWith(FOLDER_PREFIX)) {
    return { type: "folder", id: sortableId.slice(FOLDER_PREFIX.length) };
  }
  if (typeof sortableId === 'string' && sortableId.startsWith(APP_PREFIX)) {
    return { type: "app", id: sortableId.slice(APP_PREFIX.length) };
  }
  // Fallback: assume app
  return { type: "app", id: String(sortableId) };
};

// Draggable App Icon component for admin users
const DraggableAppIcon = ({ app, index }: { app: App; index: number }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toSortableId("app", app.id),
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 500ms cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 0 : 1,
    scale: isDragging ? '0.95' : '1',
    willChange: 'transform, opacity, scale',
    animationDelay: `${index * 0.05}s`,
    animationFillMode: 'both' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`animate-fade-in ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      {...attributes}
      {...listeners}
    >
      <AppIcon
        iconName={app.icon_name}
        label={app.name}
        href={app.href}
        color={app.color}
      />
    </div>
  );
};

// Draggable Folder Icon component for admin users
const DraggableFolderIcon = ({ folder, apps, index, onClick }: { folder: Folder; apps: App[]; index: number; onClick: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toSortableId("folder", folder.id),
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 500ms cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 0 : 1,
    scale: isDragging ? '0.95' : '1',
    willChange: 'transform, opacity, scale',
    animationDelay: `${index * 0.05}s`,
    animationFillMode: 'both' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`animate-fade-in ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      {...attributes}
      {...listeners}
    >
      <FolderIcon
        folder={folder}
        apps={apps}
        onClick={onClick}
      />
    </div>
  );
};

const Index = () => {
  const { apps, isLoading, reorderApps } = useApps();
  const { folders, reorderFolders } = useFolders();
  const { isAdmin } = useIsAdmin();
  const columns = useResponsiveColumns();
  const [activeItem, setActiveItem] = useState<{ type: "app" | "folder"; data: App | Folder } | null>(null);
  const [localApps, setLocalApps] = useState<App[]>(apps);
  const [localFolders, setLocalFolders] = useState<Folder[]>(folders);
  const [isMutating, setIsMutating] = useState(false);
  const isProcessingDrag = useRef(false);
  const [openFolder, setOpenFolder] = useState<Folder | null>(null);

  // Filter apps not in any folder
  const appsNotInFolder = useMemo(() => apps.filter(app => !app.folder_id), [apps]);
  const localAppsNotInFolder = useMemo(() => localApps.filter(app => !app.folder_id), [localApps]);

  // Get apps inside a specific folder
  const getAppsInFolder = useCallback((folderId: string) => {
    return apps
      .filter(app => app.folder_id === folderId)
      .sort((a, b) => a.position_in_folder - b.position_in_folder);
  }, [apps]);

  // Build the unified sortable items list: folders first, then apps
  const sortableItems = useMemo(() => [
    ...localFolders.map(f => toSortableId("folder", f.id)),
    ...localAppsNotInFolder.map(a => toSortableId("app", a.id)),
  ], [localFolders, localAppsNotInFolder]);

  // Sync local state with server
  const serverAppsHash = useMemo(() =>
    JSON.stringify(apps.map(app => ({ id: app.id, color: app.color, name: app.name, icon_name: app.icon_name, href: app.href }))),
    [apps]
  );
  const serverFoldersHash = useMemo(() =>
    JSON.stringify(folders.map(f => ({ id: f.id, name: f.name, color: f.color }))),
    [folders]
  );

  useEffect(() => {
    if (!activeItem && !isMutating) {
      const localHash = JSON.stringify(localApps.map(app => ({ id: app.id, color: app.color, name: app.name, icon_name: app.icon_name, href: app.href })));
      if (localHash !== serverAppsHash || localApps.length !== apps.length) {
        setLocalApps(apps);
      }
    }
  }, [apps, activeItem, localApps, isMutating, serverAppsHash]);

  useEffect(() => {
    if (!activeItem && !isMutating) {
      const localHash = JSON.stringify(localFolders.map(f => ({ id: f.id, name: f.name, color: f.color })));
      if (localHash !== serverFoldersHash || localFolders.length !== folders.length) {
        setLocalFolders(folders);
      }
    }
  }, [folders, activeItem, localFolders, isMutating, serverFoldersHash]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const parsed = parseSortableId(String(event.active.id));
    if (parsed.type === "app") {
      const app = apps.find(a => a.id === parsed.id);
      if (app) setActiveItem({ type: "app", data: app });
    } else {
      const folder = folders.find(f => f.id === parsed.id);
      if (folder) setActiveItem({ type: "folder", data: folder });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeParsed = parseSortableId(String(active.id));
    const overParsed = parseSortableId(String(over.id));

    // Only allow reordering within the same type
    if (activeParsed.type !== overParsed.type) return;

    if (activeParsed.type === "folder") {
      setLocalFolders(items => {
        const oldIndex = items.findIndex(f => f.id === activeParsed.id);
        const newIndex = items.findIndex(f => f.id === overParsed.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    } else {
      setLocalApps(items => {
        const oldIndex = items.findIndex(a => a.id === activeParsed.id);
        const newIndex = items.findIndex(a => a.id === overParsed.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over } = event;
    if (isProcessingDrag.current) return;

    const activeParsed = activeItem;
    if (!activeParsed || !over) {
      setActiveItem(null);
      return;
    }

    isProcessingDrag.current = true;

    if (activeParsed.type === "folder") {
      const hasChanged = localFolders.some((f, i) => f.id !== folders[i]?.id);
      if (hasChanged) {
        try {
          setIsMutating(true);
          await reorderFolders(localFolders);
        } catch (error) {
          console.error("❌ Errore nel riordinare le cartelle:", error);
          setLocalFolders(folders);
        }
      }
    } else {
      const hasChanged = localApps.some((a, i) => a.id !== apps[i]?.id);
      if (hasChanged) {
        try {
          setIsMutating(true);
          await reorderApps(localApps);
        } catch (error) {
          console.error("❌ Errore nel riordinare le app:", error);
          setLocalApps(apps);
        }
      }
    }

    setTimeout(() => {
      setActiveItem(null);
      setIsMutating(false);
      isProcessingDrag.current = false;
    }, 300);
  };

  const dropAnimationConfig = {
    duration: 450,
    easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
  };

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
      frequency: 100,
    },
  };

  const renderDragOverlay = () => {
    if (!activeItem) return null;
    const overlayStyle = {
      transform: 'scale(1.1) rotate(3deg)',
      opacity: 0.9,
      filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))',
      transition: 'all 300ms cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    };

    if (activeItem.type === "app") {
      const app = activeItem.data as App;
      return (
        <div className="cursor-grabbing" style={overlayStyle}>
          <AppIcon iconName={app.icon_name} label={app.name} href={app.href} color={app.color} />
        </div>
      );
    } else {
      const folder = activeItem.data as Folder;
      return (
        <div className="cursor-grabbing" style={overlayStyle}>
          <FolderIcon folder={folder} apps={getAppsInFolder(folder.id)} onClick={() => {}} />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-background/50 backdrop-blur-sm" />
      <StatusBar />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start md:justify-center px-6 pb-20 pt-20 md:pt-0">
        <div className="text-center mb-4 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-2xl mb-1 md:mb-2">
            Prof. Carello
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-foreground/90 drop-shadow-lg">
            APP - DASHBOARD
          </p>
          <p className="hidden md:block text-sm md:text-base font-normal text-foreground/70 drop-shadow-lg mt-2 md:mt-4 max-w-lg text-center px-4">
            Professore abilitato per la scuola superiore ai sensi dell'art. 3 comma 8 del D.M 205/2023 – D.D.G. 3059/2024
          </p>
        </div>

        {isLoading ? (
          <div className="text-foreground/80 text-lg">Caricamento...</div>
        ) : (appsNotInFolder.length === 0 && folders.length === 0) ? (
          <div className="text-center text-foreground/80">
            <p className="text-lg mb-2">Nessuna app configurata</p>
            <p className="text-sm">Clicca sull'icona impostazioni in alto per iniziare</p>
          </div>
        ) : isAdmin ? (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            measuring={measuringConfig}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
              <div
                className="grid gap-4 md:gap-8 lg:gap-12 animate-scale-in"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {localFolders.map((folder, index) => (
                  <DraggableFolderIcon
                    key={folder.id}
                    folder={folder}
                    apps={getAppsInFolder(folder.id)}
                    index={index}
                    onClick={() => setOpenFolder(folder)}
                  />
                ))}
                {localAppsNotInFolder.map((app, index) => (
                  <DraggableAppIcon key={app.id} app={app} index={localFolders.length + index} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig} adjustScale={true}>
              {renderDragOverlay()}
            </DragOverlay>
          </DndContext>
        ) : (
          <div
            className="grid gap-4 md:gap-8 lg:gap-12 animate-scale-in"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {folders.map((folder, index) => (
              <div key={folder.id} className="animate-fade-in" style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}>
                <FolderIcon
                  folder={folder}
                  apps={getAppsInFolder(folder.id)}
                  onClick={() => setOpenFolder(folder)}
                />
              </div>
            ))}
            {appsNotInFolder.map((app, index) => (
              <div key={app.id} className="animate-fade-in" style={{
                animationDelay: `${(folders.length + index) * 0.1}s`,
                animationFillMode: 'both'
              }}>
                <AppIcon iconName={app.icon_name} label={app.name} href={app.href} color={app.color} />
              </div>
            ))}
          </div>
        )}
      </main>

      <FolderModal
        open={!!openFolder}
        onOpenChange={(open) => !open && setOpenFolder(null)}
        folder={openFolder}
        apps={openFolder ? getAppsInFolder(openFolder.id) : []}
      />

      <ProjectInfoButton />

      <footer className="fixed bottom-[22px] md:bottom-[26px] left-1/2 -translate-x-1/2 z-40">
        <a
          href="mailto:info@nicolocarello.it"
          className="text-foreground/60 hover:text-foreground text-sm transition-colors duration-200 drop-shadow-md backdrop-blur-sm bg-background/20 px-3 py-1.5 rounded-lg hover:bg-background/30"
        >
          info@nicolocarello.it
        </a>
      </footer>
    </div>
  );
};

export default Index;
