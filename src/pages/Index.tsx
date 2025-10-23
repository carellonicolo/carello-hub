import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import backgroundImage from "@/assets/dashboard-background.jpg";
import { useApps, App } from "@/hooks/useApps";
import { useIsAdmin } from "@/hooks/useIsAdmin";
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
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    animationDelay: `${index * 0.1}s`,
    animationFillMode: 'both' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`animate-fade-in ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:scale-105 transition-transform'}`}
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
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={apps.map((app) => app.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 animate-scale-in">
                  {apps.map((app, index) => (
                    <DraggableAppIcon key={app.id} app={app} index={index} />
                  ))}
                </div>
              </SortableContext>
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