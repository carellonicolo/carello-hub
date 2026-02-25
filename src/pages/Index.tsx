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
  closestCenter,
  MeasuringStrategy,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
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

// Unified grid item
type GridItem =
  | { type: "folder"; data: Folder; sortableId: string }
  | { type: "app"; data: App; sortableId: string };

const FOLDER_PREFIX = "folder-";
const APP_PREFIX = "app-";

const makeSortableId = (item: GridItem) => item.sortableId;

const DraggableGridItem = ({ item, index, onFolderClick, getAppsInFolder }: {
  item: GridItem;
  index: number;
  onFolderClick: (folder: Folder) => void;
  getAppsInFolder: (folderId: string) => App[];
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.sortableId,
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
      {item.type === "app" ? (
        <AppIcon
          iconName={item.data.icon_name}
          label={item.data.name}
          href={item.data.href}
          color={item.data.color}
        />
      ) : (
        <FolderIcon
          folder={item.data}
          apps={getAppsInFolder(item.data.id)}
          onClick={() => onFolderClick(item.data)}
        />
      )}
    </div>
  );
};

const Index = () => {
  const { apps, isLoading, reorderApps } = useApps();
  const { folders, reorderFolders } = useFolders();
  const { isAdmin } = useIsAdmin();
  const columns = useResponsiveColumns();
  const [activeItem, setActiveItem] = useState<GridItem | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const isProcessingDrag = useRef(false);
  const [openFolder, setOpenFolder] = useState<Folder | null>(null);

  const appsNotInFolder = useMemo(() => apps.filter(app => !app.folder_id), [apps]);

  const getAppsInFolder = useCallback((folderId: string) => {
    return apps
      .filter(app => app.folder_id === folderId)
      .sort((a, b) => a.position_in_folder - b.position_in_folder);
  }, [apps]);

  // Build unified grid items from server data
  const serverGridItems = useMemo((): GridItem[] => [
    ...folders.map(f => ({ type: "folder" as const, data: f, sortableId: `${FOLDER_PREFIX}${f.id}` })),
    ...appsNotInFolder.map(a => ({ type: "app" as const, data: a, sortableId: `${APP_PREFIX}${a.id}` })),
  ], [folders, appsNotInFolder]);

  const [localItems, setLocalItems] = useState<GridItem[]>(serverGridItems);

  // Sync local items with server when not dragging
  useEffect(() => {
    if (!activeItem && !isMutating) {
      const localIds = localItems.map(i => i.sortableId).join(",");
      const serverIds = serverGridItems.map(i => i.sortableId).join(",");
      if (localIds !== serverIds || localItems.length !== serverGridItems.length) {
        setLocalItems(serverGridItems);
      }
    }
  }, [serverGridItems, activeItem, isMutating, localItems]);

  const sortableIds = useMemo(() => localItems.map(makeSortableId), [localItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = localItems.find(i => i.sortableId === String(event.active.id));
    if (item) setActiveItem(item);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isProcessingDrag.current) return;

    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }

    const oldIndex = localItems.findIndex(i => i.sortableId === String(active.id));
    const newIndex = localItems.findIndex(i => i.sortableId === String(over.id));

    if (oldIndex === -1 || newIndex === -1) {
      setActiveItem(null);
      return;
    }

    const nextItems = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(nextItems);
    isProcessingDrag.current = true;

    // Extract new folder order and app order from unified list
    const newFolderOrder = nextItems.filter(i => i.type === "folder").map(i => i.data as Folder);
    const newAppOrder = nextItems.filter(i => i.type === "app").map(i => i.data as App);

    const foldersChanged = newFolderOrder.some((f, i) => f.id !== folders[i]?.id);
    const appsChanged = newAppOrder.some((a, i) => a.id !== appsNotInFolder[i]?.id);

    try {
      setIsMutating(true);

      if (foldersChanged) {
        await reorderFolders(newFolderOrder);
      }

      if (appsChanged) {
        // Reconstruct full apps list: reordered non-folder apps + apps in folders (unchanged)
        const appsInFolders = apps.filter(a => a.folder_id);
        const fullApps = [...newAppOrder, ...appsInFolders];
        await reorderApps(fullApps);
      }
    } catch (error) {
      console.error("❌ Errore nel riordinamento:", error);
      setLocalItems(serverGridItems);
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
            collisionDetection={closestCenter}
            measuring={measuringConfig}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
              <div
                className="grid gap-4 md:gap-8 lg:gap-12 animate-scale-in"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {localItems.map((item, index) => (
                  <DraggableGridItem
                    key={item.sortableId}
                    item={item}
                    index={index}
                    onFolderClick={setOpenFolder}
                    getAppsInFolder={getAppsInFolder}
                  />
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
