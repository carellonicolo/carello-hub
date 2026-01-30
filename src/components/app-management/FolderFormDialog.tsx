import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { Folder, FolderFormData } from "@/hooks/useFolders";
import { App } from "@/hooks/useApps";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

const folderSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio").max(20, "Massimo 20 caratteri"),
  color: z.string().regex(/^hsl\(/, "Formato colore non valido"),
  selectedApps: z.array(z.string()),
});

type FolderFormValues = z.infer<typeof folderSchema>;

interface FolderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FolderFormData, selectedAppIds: string[]) => void;
  editingFolder?: Folder | null;
  apps: App[];
  appsInFolder: string[];
}

export const FolderFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingFolder,
  apps,
  appsInFolder,
}: FolderFormDialogProps) => {
  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      color: "hsl(217, 91%, 60%)",
      selectedApps: [],
    },
  });

  useEffect(() => {
    if (editingFolder) {
      form.reset({
        name: editingFolder.name,
        color: editingFolder.color,
        selectedApps: appsInFolder,
      });
    } else {
      form.reset({
        name: "",
        color: "hsl(217, 91%, 60%)",
        selectedApps: [],
      });
    }
  }, [editingFolder, form, appsInFolder]);

  const handleSubmit = (data: FolderFormValues) => {
    onSubmit(
      { name: data.name, color: data.color },
      data.selectedApps
    );
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingFolder ? "Modifica Cartella" : "Nuova Cartella"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Es: Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedApps"
              render={() => (
                <FormItem>
                  <FormLabel>App nella cartella</FormLabel>
                  <ScrollArea className="h-48 border rounded-md p-3">
                    <div className="space-y-2">
                      {apps.map((app) => {
                        const IconComponent = Icons[app.icon_name as keyof typeof Icons] as React.ComponentType<LucideProps>;
                        return (
                          <FormField
                            key={app.id}
                            control={form.control}
                            name="selectedApps"
                            render={({ field }) => (
                              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                                <Checkbox
                                  checked={field.value?.includes(app.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, app.id]);
                                    } else {
                                      field.onChange(current.filter((id) => id !== app.id));
                                    }
                                  }}
                                />
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: app.color }}
                                >
                                  {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                                </div>
                                <span className="text-sm truncate">{app.name}</span>
                              </div>
                            )}
                          />
                        );
                      })}
                      {apps.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nessuna app disponibile
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <Button type="submit">
                {editingFolder ? "Salva modifiche" : "Crea Cartella"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
