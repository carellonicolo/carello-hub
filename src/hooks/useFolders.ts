import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Folder {
  id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
}

export interface FolderFormData {
  name: string;
  color: string;
}

export const useFolders = () => {
  const queryClient = useQueryClient();

  const { data: folders = [], isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Folder[];
    },
  });

  const addFolderMutation = useMutation({
    mutationFn: async (folderData: FolderFormData) => {
      const position = folders.length;
      const { data, error } = await supabase
        .from("folders")
        .insert({ ...folderData, position })
        .select()
        .single();

      if (error) throw error;
      return data as Folder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({ title: "Cartella creata con successo" });
    },
    onError: () => {
      toast({ title: "Errore durante il salvataggio", variant: "destructive" });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FolderFormData }) => {
      const { error } = await supabase
        .from("folders")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({ title: "Cartella aggiornata con successo" });
    },
    onError: () => {
      toast({ title: "Errore durante l'aggiornamento", variant: "destructive" });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["apps"] }); // Refresh apps since folder_id is set to null
      toast({ title: "Cartella eliminata" });
    },
    onError: () => {
      toast({ title: "Errore durante l'eliminazione", variant: "destructive" });
    },
  });

  const reorderFoldersMutation = useMutation({
    mutationFn: async (reorderedFolders: Folder[]) => {
      for (let index = 0; index < reorderedFolders.length; index++) {
        const folder = reorderedFolders[index];
        const { error } = await supabase
          .from("folders")
          .update({ position: index })
          .eq("id", folder.id);

        if (error) throw error;
      }
    },
    onMutate: async (reorderedFolders) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);
      queryClient.setQueryData<Folder[]>(["folders"], reorderedFolders);
      return { previousFolders };
    },
    onError: (error, _, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
      console.error("Errore durante il riordinamento:", error);
      toast({
        title: "Errore durante il riordinamento",
        variant: "destructive"
      });
    },
  });

  return {
    folders,
    isLoading,
    addFolder: addFolderMutation.mutateAsync,
    updateFolder: updateFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    reorderFolders: reorderFoldersMutation.mutateAsync,
  };
};
