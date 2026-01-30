import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface App {
  id: string;
  name: string;
  icon_name: string;
  href: string;
  color: string;
  position: number;
  folder_id: string | null;
  position_in_folder: number;
}

export interface AppFormData {
  name: string;
  icon_name: string;
  href: string;
  color: string;
}

export const useApps = () => {
  const queryClient = useQueryClient();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as App[];
    },
  });

  const addAppMutation = useMutation({
    mutationFn: async (appData: AppFormData) => {
      const position = apps.length;
      const { error } = await supabase
        .from("apps")
        .insert({ ...appData, position });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast({ title: "App aggiunta con successo" });
    },
    onError: () => {
      toast({ title: "Errore durante il salvataggio", variant: "destructive" });
    },
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AppFormData }) => {
      const { error } = await supabase
        .from("apps")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast({ title: "App aggiornata con successo" });
    },
    onError: () => {
      toast({ title: "Errore durante l'aggiornamento", variant: "destructive" });
    },
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("apps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toast({ title: "App eliminata" });
    },
    onError: () => {
      toast({ title: "Errore durante l'eliminazione", variant: "destructive" });
    },
  });

  const reorderAppsMutation = useMutation({
    mutationFn: async (reorderedApps: App[]) => {
      console.log('🔧 mutationFn chiamata con', reorderedApps.length, 'apps');

      // ✅ Esegui update in SEQUENZA per evitare race conditions
      for (let index = 0; index < reorderedApps.length; index++) {
        const app = reorderedApps[index];
        console.log(`📝 Aggiornando ${app.name} a posizione ${index}`);

        const { data, error } = await supabase
          .from("apps")
          .update({ position: index })
          .eq("id", app.id);

        if (error) {
          console.error(`❌ Errore update ${app.name}:`, error);
          throw error;
        }
        console.log(`✅ ${app.name} aggiornato con successo`, data);
      }
      console.log('🎉 Tutti gli update completati');
    },
    onMutate: async (reorderedApps) => {
      // ✅ OPTIMISTIC UPDATE: Aggiorna la cache PRIMA che il database risponda
      await queryClient.cancelQueries({ queryKey: ["apps"] });

      // Salva lo snapshot precedente per rollback
      const previousApps = queryClient.getQueryData<App[]>(["apps"]);

      // Aggiorna la cache con il nuovo ordine
      queryClient.setQueryData<App[]>(["apps"], reorderedApps);

      return { previousApps };
    },
    onSuccess: () => {
      // ✅ L'optimistic update ha già aggiornato la cache correttamente
      // Non serve refetch perché il database è stato aggiornato dalla mutationFn
    },
    onError: (error, _, context) => {
      // ❌ Rollback in caso di errore
      if (context?.previousApps) {
        queryClient.setQueryData(["apps"], context.previousApps);
      }
      console.error("Errore durante il riordinamento:", error);
      toast({
        title: "Errore durante il riordinamento",
        description: "Le modifiche non sono state salvate",
        variant: "destructive"
      });
    },
  });

  const moveAppsToFolderMutation = useMutation({
    mutationFn: async ({ appIds, folderId }: { appIds: string[]; folderId: string | null }) => {
      // First, remove all apps from this folder
      if (folderId) {
        const { error: clearError } = await supabase
          .from("apps")
          .update({ folder_id: null, position_in_folder: 0 })
          .eq("folder_id", folderId);
        if (clearError) throw clearError;
      }

      // Then, add selected apps to the folder
      for (let i = 0; i < appIds.length; i++) {
        const { error } = await supabase
          .from("apps")
          .update({ folder_id: folderId, position_in_folder: i })
          .eq("id", appIds[i]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
    onError: () => {
      toast({ title: "Errore durante l'aggiornamento", variant: "destructive" });
    },
  });

  return {
    apps,
    isLoading,
    addApp: addAppMutation.mutate,
    updateApp: updateAppMutation.mutate,
    deleteApp: deleteAppMutation.mutate,
    reorderApps: reorderAppsMutation.mutateAsync,
    moveAppsToFolder: moveAppsToFolderMutation.mutateAsync,
  };
};
