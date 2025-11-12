import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import backgroundImage from "@/assets/dashboard-background.jpg";
import { useApps, App } from "@/hooks/useApps";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
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
      duration: 350,
      easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 350ms cubic-bezier(0.25, 0.8, 0.25, 1)',
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 0 : 1,
    willChange: 'transform',
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
  const [isMutating, setIsMutating] = useState(false);
  const isProcessingDrag = useRef(false);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizza localApps con apps quando cambia (ma non durante il drag o il salvataggio)
  useEffect(() => {
    // ✅ NON sincronizzare se stiamo draggando o salvando
    if (!activeApp && !isMutating) {
      // Solo sincronizza se l'ordine è effettivamente diverso
      // Confronta gli ID in ordine per vedere se sono cambiati
      const localIds = localApps.map(app => app.id).join(',');
      const serverIds = apps.map(app => app.id).join(',');

      if (localIds !== serverIds || localApps.length !== apps.length) {
        setLocalApps(apps);
      }
    }
  }, [apps, activeApp, localApps, isMutating]);  // 🆕 Aggiungi isMutating alle dipendenze

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
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
      
      dragOverTimeoutRef.current = setTimeout(() => {
        setLocalApps((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }, 16);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 🛡️ PROTEZIONE: Se stiamo già processando un drag, ignora questa chiamata
    if (isProcessingDrag.current) {
      console.log('⚠️ Drag già in corso, ignorato');
      return;
    }
    
    console.log('🎯 DragEnd - active:', active.id, 'over:', over?.id);

    // ✅ CONTROLLO CORRETTO: Verifica se l'ordine è cambiato
    const hasOrderChanged = localApps.some((app, index) => {
      const originalApp = apps[index];
      return !originalApp || app.id !== originalApp.id;
    });

    console.log('🔍 Ordine cambiato?', hasOrderChanged);
    console.log('📦 Ordine locale:', localApps.map(a => a.name));
    console.log('📦 Ordine server:', apps.map(a => a.name));

    if (hasOrderChanged && over) {
      console.log('💾 Salvo il nuovo ordine...');
      
      // 🔒 ATTIVA la protezione
      isProcessingDrag.current = true;
      
      try {
        setIsMutating(true);
        await reorderApps(localApps);
        console.log('✅ Mutation completata con successo');
        
        setTimeout(() => {
          setActiveApp(null);
          setIsMutating(false);
          isProcessingDrag.current = false;  // 🔓 RILASCIA la protezione
          console.log('🔄 Reset completato');
        }, 300);  // 🆕 Aumentato a 300ms per sicurezza
      } catch (error) {
        console.error("❌ Errore nel riordinare le app:", error);
        setLocalApps(apps); // Rollback solo in caso di errore
        setActiveApp(null);
        setIsMutating(false);
        isProcessingDrag.current = false;  // 🔓 RILASCIA anche in caso di errore
      }
    } else {
      // Nessun cambio di ordine, semplicemente resetta lo stato
      console.log('⚪ Nessun cambio, reset dello stato');
      setActiveApp(null);
    }
  };

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
      frequency: 100,
    },
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
        <div className="text-center mb-16 animate-fade-in mt-20 md:mt-0">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-2xl mb-2">
            Prof. Carello
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-foreground/90 drop-shadow-lg">
            APP - DASHBOARD
          </p>
          <p className="text-sm md:text-base font-normal text-foreground/70 drop-shadow-lg mt-4 max-w-lg text-center">
            Professore abilitato per la scuola superiore ai sensi dell'art. 3 comma 8 del D.M 205/2023 – D.D.G. 3059/2024
          </p>
        </div>

        {/* Apps Grid */}
        {isLoading ? <div className="text-foreground/80 text-lg">Caricamento...</div> : apps.length === 0 ? <div className="text-center text-foreground/80">
            <p className="text-lg mb-2">Nessuna app configurata</p>
            <p className="text-sm">Clicca sull'icona impostazioni in alto per iniziare</p>
          </div> : isAdmin ? (
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              measuring={measuringConfig}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localApps.map((app) => app.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 lg:gap-12 animate-scale-in">
                  {localApps.map((app, index) => (
                    <DraggableAppIcon key={app.id} app={app} index={index} />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeApp ? (
                  <div 
                    className="cursor-grabbing opacity-90"
                    style={{
                      transform: 'scale(1.05) rotate(3deg)',
                      transition: 'transform 200ms ease-out',
                    }}
                  >
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 lg:gap-12 animate-scale-in">
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