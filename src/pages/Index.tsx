import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import backgroundImage from "@/assets/dashboard-background.jpg";
import { useApps, App } from "@/hooks/useApps";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
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

// Draggable App Icon component for admin users
interface DraggableAppIconProps {
  app: App;
  index: number;
}

const DraggableAppIcon = ({ app, index }: DraggableAppIconProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: app.id,
    transition: {
      duration: 200, // Durata transizione in ms (più veloce = più simile a iPhone)
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Easing fluido
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0 : 1, // Elemento originale completamente invisibile quando viene trascinato
    zIndex: isDragging ? 0 : 1,
    willChange: 'transform', // Ottimizzazione GPU per animazioni fluide
    animationDelay: `${index * 0.1}s`,
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

const Index = () => {
  const {
    apps,
    isLoading,
    reorderApps
  } = useApps();
  const { isAdmin } = useIsAdmin();
  const [activeApp, setActiveApp] = useState<App | null>(null);
  const [localApps, setLocalApps] = useState<App[]>(apps);

  // Sincronizza localApps con apps quando cambia (ma non durante il drag)
  useEffect(() => {
    if (!activeApp) {
      setLocalApps(apps);
    }
  }, [apps, activeApp]);

  // Inizializza localApps quando apps viene caricato la prima volta
  useEffect(() => {
    if (apps.length > 0 && localApps.length === 0) {
      setLocalApps(apps);
    }
  }, [apps]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Piccolo movimento necessario per iniziare il drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const app = apps.find((app) => app.id === active.id);
    if (app) {
      setActiveApp(app);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalApps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // localApps ha GIÀ l'ordine corretto grazie a handleDragOver!
      // Non serve ricalcolare con arrayMove, passa direttamente localApps
      reorderApps(localApps);
    } else {
      // Se non c'è stato un drop valido, ripristina l'ordine originale
      setLocalApps(apps);
    }

    setActiveApp(null);
  };
  return <div className="min-h-screen w-full relative overflow-hidden" style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-background/50 backdrop-blur-sm" />
      
      <StatusBar />
      
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-20">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-bold tracking-tight text-foreground drop-shadow-2xl mb-2">
            Prof. Carello
          </h1>
          <p className="text-2xl font-semibold text-foreground/90 drop-shadow-lg">
            APP
          </p>
        </div>

        {/* Apps Grid */}
        {isLoading ? <div className="text-foreground/80 text-lg">Caricamento...</div> : apps.length === 0 ? <div className="text-center text-foreground/80">
            <p className="text-lg mb-2">Nessuna app configurata</p>
            <p className="text-sm">Clicca sull'icona impostazioni in alto per iniziare</p>
          </div> : isAdmin ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localApps.map((app) => app.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 animate-scale-in">
                  {localApps.map((app, index) => (
                    <DraggableAppIcon key={app.id} app={app} index={index} />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeApp ? (
                  <div className="cursor-grabbing scale-110 opacity-90">
                    <AppIcon
                      iconName={activeApp.icon_name}
                      label={activeApp.name}
                      href={activeApp.href}
                      color={activeApp.color}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 animate-scale-in">
              {apps.map((app, index) => (
                <div key={app.id} className="animate-fade-in" style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}>
                  <AppIcon iconName={app.icon_name} label={app.name} href={app.href} color={app.color} />
                </div>
              ))}
            </div>
          )}
      </main>
    </div>;
};
export default Index;