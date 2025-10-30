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
import { IconPicker } from "./IconPicker";
import { ColorPicker } from "./ColorPicker";
import { App, AppFormData } from "@/hooks/useApps";

const appSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio").max(20, "Massimo 20 caratteri"),
  href: z
    .string()
    .url("Inserisci un URL valido")
    .max(2048, "URL troppo lungo (massimo 2048 caratteri)")
    .regex(/^https?:\/\//, "Deve essere un link esterno (http:// o https://)"),
  icon_name: z.string().min(1, "Seleziona un'icona"),
  color: z.string().regex(/^hsl\(/, "Formato colore non valido"),
});

interface AppFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AppFormData) => void;
  editingApp?: App | null;
}

export const AppFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingApp,
}: AppFormDialogProps) => {
  const form = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: "",
      href: "",
      icon_name: "",
      color: "hsl(217, 91%, 60%)",
    },
  });

  useEffect(() => {
    if (editingApp) {
      form.reset({
        name: editingApp.name,
        href: editingApp.href,
        icon_name: editingApp.icon_name,
        color: editingApp.color,
      });
    } else {
      form.reset({
        name: "",
        href: "",
        icon_name: "",
        color: "hsl(217, 91%, 60%)",
      });
    }
  }, [editingApp, form]);

  const handleSubmit = (data: AppFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingApp ? "Modifica App" : "Aggiungi Nuova App"}
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
                    <Input placeholder="Es: Registro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icona</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onChange={field.onChange} />
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

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <Button type="submit">
                {editingApp ? "Salva modifiche" : "Aggiungi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
