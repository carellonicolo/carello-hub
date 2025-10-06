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
      const updates = reorderedApps.map((app, index) => 
        supabase.from("apps").update({ position: index }).eq("id", app.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  return {
    apps,
    isLoading,
    addApp: addAppMutation.mutate,
    updateApp: updateAppMutation.mutate,
    deleteApp: deleteAppMutation.mutate,
    reorderApps: reorderAppsMutation.mutate,
  };
};
