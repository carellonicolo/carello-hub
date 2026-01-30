
# Piano: Sistema di Cartelle per Organizzare le App

## Panoramica
Implementeremo un sistema di cartelle che permette di raggruppare le icone delle app, simile all'esperienza iOS/Android. Le cartelle appariranno come icone speciali nella griglia e, cliccandoci sopra, si aprirà un popup che mostra le app contenute.

## Come Funzionerà

### Per l'utente finale:
1. Nella dashboard, le cartelle appariranno come icone con un'anteprima delle app contenute
2. Cliccando su una cartella, si aprirà un popup modale con le app al suo interno
3. Le cartelle avranno un nome personalizzabile e un colore di sfondo

### Per l'amministratore:
1. Nel pannello "Gestione App" ci sarà un nuovo pulsante "Aggiungi Cartella"
2. Quando si crea/modifica una cartella si potrà:
   - Dare un nome alla cartella
   - Scegliere un colore
   - Selezionare quali app includere
3. Le cartelle si potranno riordinare con drag-and-drop come le app
4. Si potranno spostare app dentro e fuori dalle cartelle

---

## Dettagli Tecnici

### 1. Modifiche al Database

Creeremo una nuova tabella `folders` e aggiungeremo un campo `folder_id` alla tabella `apps`:

```sql
-- Nuova tabella folders
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(217, 91%, 60%)',
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aggiungi campo folder_id alla tabella apps (nullable = app non in cartella)
ALTER TABLE public.apps 
ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;

-- Aggiungi campo position_in_folder per ordinare le app dentro le cartelle
ALTER TABLE public.apps 
ADD COLUMN position_in_folder INTEGER DEFAULT 0;

-- RLS per folders (stesse policy delle apps)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Folders are viewable by everyone" 
  ON public.folders FOR SELECT USING (true);

CREATE POLICY "Only admins can insert folders" 
  ON public.folders FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update folders" 
  ON public.folders FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete folders" 
  ON public.folders FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));
```

### 2. Nuovi File da Creare

| File | Descrizione |
|------|-------------|
| `src/hooks/useFolders.ts` | Hook per CRUD delle cartelle |
| `src/components/FolderIcon.tsx` | Componente icona cartella nella dashboard |
| `src/components/FolderModal.tsx` | Modal che mostra le app dentro una cartella |
| `src/components/app-management/FolderCard.tsx` | Card cartella nel pannello gestione |
| `src/components/app-management/FolderFormDialog.tsx` | Form per creare/modificare cartelle |
| `src/components/app-management/AppSelector.tsx` | Componente per selezionare app da mettere in cartella |

### 3. Modifiche ai File Esistenti

| File | Modifiche |
|------|-----------|
| `src/hooks/useApps.ts` | Aggiornare tipo App con folder_id, aggiungere funzione moveToFolder |
| `src/pages/Index.tsx` | Renderizzare cartelle insieme alle app, gestire click su cartella |
| `src/components/app-management/AppManagementSheet.tsx` | Aggiungere sezione gestione cartelle |
| `src/components/app-management/AppCard.tsx` | Mostrare in quale cartella si trova l'app |
| `src/components/app-management/AppFormDialog.tsx` | Aggiungere selezione cartella (opzionale) |

### 4. Struttura Dati

La griglia mostrerà un mix di:
- **App senza cartella** (folder_id = null) - ordinate per `position`
- **Cartelle** - ordinate per `position`

Le app con `folder_id` non appariranno nella griglia principale ma solo dentro la cartella.

### 5. Componente FolderIcon

L'icona della cartella mostrerà:
- Una griglia 2x2 con le prime 4 icone delle app contenute (come iOS)
- Il nome della cartella sotto
- Il colore di sfondo scelto

```text
┌─────────────┐
│ ┌──┐ ┌──┐  │
│ │A1│ │A2│  │
│ └──┘ └──┘  │
│ ┌──┐ ┌──┐  │
│ │A3│ │A4│  │
│ └──┘ └──┘  │
└─────────────┘
   Cartella
```

### 6. Flusso di Interazione

```text
Dashboard (pubblico)
        │
        ├── Click su App → Apre link esterno
        │
        └── Click su Cartella → Apre Modal
                                    │
                                    └── Click su App nella modal → Apre link esterno


Gestione (admin)
        │
        ├── [+] Aggiungi App
        │
        ├── [+] Aggiungi Cartella
        │
        ├── Lista App (drag-and-drop)
        │       └── Ogni app mostra: [📁 Nome cartella] se assegnata
        │
        └── Lista Cartelle (drag-and-drop)
                └── Ogni cartella mostra: numero app contenute
```

---

## Fasi di Implementazione

**Fase 1 - Database**
- Creare tabella `folders` con RLS
- Aggiungere colonne `folder_id` e `position_in_folder` a `apps`

**Fase 2 - Backend (Hooks)**
- Creare `useFolders.ts` con query e mutations
- Aggiornare `useApps.ts` per gestire folder_id

**Fase 3 - Gestione Cartelle (Admin)**
- Creare `FolderFormDialog.tsx` per form cartella
- Creare `FolderCard.tsx` per lista cartelle
- Aggiornare `AppManagementSheet.tsx` con sezione cartelle
- Aggiornare `AppFormDialog.tsx` con selezione cartella

**Fase 4 - Visualizzazione (Dashboard)**
- Creare `FolderIcon.tsx` con preview 2x2
- Creare `FolderModal.tsx` per contenuto cartella
- Aggiornare `Index.tsx` per mostrare cartelle e app insieme

**Fase 5 - Drag and Drop**
- Supportare riordinamento cartelle
- Opzionale: supportare drag di app dentro/fuori cartelle
