# Prof. Carello APP Hub

<div align="center">

**Una dashboard moderna e personalizzabile per centralizzare l'accesso alle applicazioni e risorse educative**

[Features](#-features) • [Demo](#-demo) • [Installazione](#-installazione) • [Configurazione](#%EF%B8%8F-configurazione) • [Deployment](#-deployment)

</div>

---

## 📋 Indice

- [Descrizione](#-descrizione)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisiti](#-prerequisiti)
- [Installazione](#-installazione)
- [Configurazione](#%EF%B8%8F-configurazione)
- [Utilizzo](#-utilizzo)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Database Schema](#-database-schema)
- [API e Integrazioni](#-api-e-integrazioni)
- [Deployment](#-deployment)
- [Sviluppo](#-sviluppo)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Descrizione

**Prof. Carello APP Hub** è un'applicazione web moderna progettata per fornire un punto di accesso centralizzato a risorse educative, strumenti didattici e applicazioni esterne. Pensata per un ambiente educativo, l'applicazione offre un'interfaccia pulita e intuitiva per studenti e docenti.

### Caratteristiche Principali

- **Dashboard Personalizzabile**: Interfaccia visiva con icone colorate e link rapidi
- **Gestione Admin**: Pannello di amministrazione per la configurazione delle app
- **Drag and Drop**: Riordino intuitivo delle applicazioni tramite trascinamento (solo admin)
- **Autenticazione Sicura**: Sistema di login con gestione ruoli (admin/user)
- **Responsive Design**: Ottimizzato per desktop, tablet e mobile
- **Animazioni Fluide**: Transizioni e animazioni per una UX piacevole

---

## ✨ Features

### Per gli Utenti

- ✅ **Accesso Rapido**: Clicca sulle icone per aprire le applicazioni esterne
- ✅ **Interfaccia Intuitiva**: Design pulito con sfondo personalizzato e animazioni
- ✅ **Responsive**: Funziona perfettamente su tutti i dispositivi
- ✅ **Status Bar**: Visualizzazione di data, ora e stato di login

### Per gli Amministratori

- 🔧 **Gestione Completa delle App**: Aggiungi, modifica ed elimina applicazioni
- 🎨 **Personalizzazione Icone**: Scegli tra 600+ icone Lucide React
- 🌈 **Scelta Colori**: 12 colori predefiniti + color picker HSL personalizzato
- 🔄 **Drag and Drop**: Riordina le app direttamente nella dashboard
- 📊 **Pannello Admin**: Sheet laterale dedicato per la gestione
- ⚡ **Aggiornamenti Real-time**: Modifiche istantanee visibili agli utenti

---

## 🛠 Tech Stack

### Frontend

| Tecnologia | Versione | Descrizione |
|-----------|----------|-------------|
| [React](https://react.dev/) | 18.3 | Libreria UI con hooks e context |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety e migliore DX |
| [Vite](https://vitejs.dev/) | 5.4 | Build tool veloce con HMR |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Componenti UI pre-stilizzati |

### Backend & Database

| Tecnologia | Descrizione |
|-----------|-------------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service (PostgreSQL, Auth, RLS) |
| PostgreSQL | Database relazionale |
| Row Level Security | Sicurezza a livello di database |

### Librerie Principali

| Libreria | Scopo |
|---------|-------|
| `@dnd-kit/core` | Drag and drop system |
| `@tanstack/react-query` | Data fetching e caching |
| `react-router-dom` | Routing client-side |
| `react-hook-form` | Gestione form |
| `zod` | Schema validation |
| `lucide-react` | Libreria icone (600+) |
| `sonner` | Toast notifications |

---

## 📦 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** (v18.0.0 o superiore)
- **npm** (v9.0.0 o superiore) o **yarn**
- Account **Supabase** (gratuito)
- Git

Verifica le versioni installate:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installazione

### 1. Clona il Repository

```bash
git clone https://github.com/carellonicolo/carello-hub.git
cd carello-hub
```

### 2. Installa le Dipendenze

```bash
npm install
```

### 3. Configura le Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```bash
cp .env.example .env
```

Modifica il file `.env` con le tue credenziali Supabase (vedi [Configurazione](#%EF%B8%8F-configurazione)).

### 4. Avvia il Server di Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:8080`

---

## ⚙️ Configurazione

### Setup Supabase

#### 1. Crea un Progetto Supabase

Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto.

#### 2. Configura il Database

Esegui le seguenti query SQL nell'SQL Editor di Supabase:

```sql
-- Crea l'enum per i ruoli
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Tabella apps
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) <= 20),
    icon_name TEXT NOT NULL,
    href TEXT NOT NULL CHECK (href ~ '^https?://'),
    color TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Indice per ordinamento veloce
CREATE INDEX idx_apps_position ON apps(position);

-- Tabella user_roles
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, role)
);

-- RLS per apps (tutti possono leggere, solo admin possono modificare)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apps are viewable by everyone"
    ON apps FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert apps"
    ON apps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update apps"
    ON apps FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete apps"
    ON apps FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS per user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Funzione RPC per verificare il ruolo
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 3. Crea il Primo Admin

Dopo aver creato il tuo account utente tramite l'applicazione, esegui:

```sql
-- Sostituisci con il tuo user_id (lo trovi in Authentication > Users)
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

#### 4. Configura le Variabili d'Ambiente

Nel file `.env` inserisci i tuoi dettagli Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id
```

Trovi questi valori in **Project Settings > API** nel dashboard Supabase.

---

## 💻 Utilizzo

### Modalità Sviluppo

```bash
npm run dev
```

Avvia il server di sviluppo con hot-reload su `http://localhost:8080`

### Build per Produzione

```bash
npm run build
```

Crea una build ottimizzata nella cartella `dist/`

### Preview della Build

```bash
npm run preview
```

Testa la build di produzione localmente

### Linting

```bash
npm run lint
```

Esegue ESLint per verificare la qualità del codice

---

## 📁 Struttura del Progetto

```
carello-hub/
├── src/
│   ├── assets/                    # Immagini e risorse statiche
│   │   └── dashboard-background.jpg
│   ├── components/                # Componenti React
│   │   ├── app-management/        # Gestione app (admin)
│   │   │   ├── AppCard.tsx        # Card app nel pannello admin
│   │   │   ├── AppFormDialog.tsx  # Form per creare/modificare app
│   │   │   ├── AppManagementSheet.tsx  # Pannello laterale admin
│   │   │   ├── ColorPicker.tsx    # Selettore colori
│   │   │   ├── IconPicker.tsx     # Selettore icone
│   │   │   └── DeleteConfirmDialog.tsx
│   │   ├── ui/                    # Componenti UI shadcn
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ... (70+ componenti)
│   │   ├── AppIcon.tsx            # Componente icona app
│   │   └── StatusBar.tsx          # Barra superiore con orologio
│   ├── hooks/                     # Custom React hooks
│   │   ├── useApps.ts             # CRUD operations per apps
│   │   ├── useAuth.tsx            # Gestione autenticazione
│   │   └── useIsAdmin.ts          # Verifica ruolo admin
│   ├── integrations/              # Integrazioni esterne
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       └── types.ts           # TypeScript types
│   ├── lib/                       # Utility functions
│   │   └── utils.ts
│   ├── pages/                     # Route components
│   │   ├── Index.tsx              # Dashboard principale
│   │   ├── Auth.tsx               # Pagina login
│   │   └── NotFound.tsx           # 404
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Stili globali
├── public/                        # File statici pubblici
├── .env                           # Variabili d'ambiente (non committare!)
├── .env.example                   # Template per .env
├── package.json                   # Dipendenze e script
├── tsconfig.json                  # Config TypeScript
├── vite.config.ts                 # Config Vite
├── tailwind.config.ts             # Config Tailwind
├── components.json                # Config shadcn/ui
└── README.md                      # Questo file
```

---

## 🗄 Database Schema

### Tabella `apps`

Memorizza le applicazioni visualizzate nella dashboard.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Nome dell'app (max 20 caratteri) |
| `icon_name` | TEXT | Nome dell'icona Lucide React |
| `href` | TEXT | URL esterno (deve iniziare con http/https) |
| `color` | TEXT | Colore in formato HSL |
| `position` | INTEGER | Ordine di visualizzazione |
| `created_at` | TIMESTAMP | Data di creazione |

### Tabella `user_roles`

Gestisce i ruoli degli utenti.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key a `auth.users` |
| `role` | app_role | Enum: 'admin' o 'user' |
| `created_at` | TIMESTAMP | Data di creazione |

### RPC Functions

- **`has_role(user_id, role)`**: Verifica se un utente ha un ruolo specifico

---

## 🔌 API e Integrazioni

### Supabase Client

Il client Supabase è configurato in `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

### React Query

Tutte le operazioni CRUD usano React Query per:
- Caching automatico dei dati
- Invalidazione della cache dopo mutazioni
- Gestione degli stati di loading/error

Esempio da `useApps.ts`:

```typescript
const { data: apps = [], isLoading } = useQuery({
  queryKey: ["apps"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw error;
    return data;
  },
});
```

---

## 🌐 Deployment

### Deploy su Vercel (Consigliato)

1. Crea un account su [Vercel](https://vercel.com)
2. Installa la CLI di Vercel:

```bash
npm i -g vercel
```

3. Deploy:

```bash
vercel
```

4. Configura le variabili d'ambiente nel dashboard Vercel:
   - Settings > Environment Variables
   - Aggiungi le variabili del file `.env`

5. I deploy successivi avvengono automaticamente ad ogni push su `main`

### Deploy su Netlify

1. Crea un file `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Collega il repository su [Netlify](https://netlify.com)
3. Configura le variabili d'ambiente
4. Deploy automatico ad ogni push

### Deploy Manuale

```bash
# Build
npm run build

# La cartella dist/ contiene i file statici
# Caricala sul tuo hosting (Apache, Nginx, ecc.)
```

**Configurazione Nginx** (esempio):

```nginx
server {
    listen 80;
    server_name tuodominio.com;
    root /var/www/carello-hub/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 👨‍💻 Sviluppo

### Best Practices

1. **Commit Semantici**: Usa conventional commits (feat, fix, docs, etc.)
2. **TypeScript Strict**: Mantieni la type safety
3. **ESLint**: Correggi tutti i warning prima di committare
4. **Component Composition**: Preferisci componenti piccoli e riutilizzabili
5. **Custom Hooks**: Estrai la logica complessa in hooks personalizzati

### Convenzioni di Codice

- **Componenti**: PascalCase (es. `AppIcon.tsx`)
- **Hooks**: camelCase con prefisso "use" (es. `useApps.ts`)
- **File CSS**: kebab-case
- **Costanti**: UPPER_SNAKE_CASE

### Aggiungere Nuove Features

1. Crea un branch dalla `main`:
   ```bash
   git checkout -b feature/nome-feature
   ```

2. Sviluppa la feature con commit frequenti

3. Testa localmente

4. Crea una Pull Request su GitHub

### Debug

```bash
# Logs di React Query
# Aggiungi in src/App.tsx:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Nel componente:
<ReactQueryDevtools initialIsOpen={false} />
```

---

## 🗺 Roadmap

### Versione Futura

- [ ] **Ricerca App**: Campo di ricerca nella dashboard
- [ ] **Categorie**: Organizzare app in categorie
- [ ] **Statistiche**: Tracciare le app più utilizzate
- [ ] **PWA**: Supporto Progressive Web App
- [ ] **Dark Mode Toggle**: Pulsante per cambiare tema
- [ ] **Multi-lingua**: Supporto inglese e altre lingue
- [ ] **Descrizioni App**: Campo descrizione con tooltip
- [ ] **Bookmarks**: Sistema di preferiti per utente
- [ ] **Notifiche**: Annunci push per nuove app
- [ ] **Export/Import**: Backup delle configurazioni

---

## 🤝 Contributing

I contributi sono benvenuti! Per contribuire:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### Segnalare Bug

Apri una [issue su GitHub](https://github.com/carellonicolo/carello-hub/issues) con:
- Descrizione del problema
- Passi per riprodurlo
- Comportamento atteso vs reale
- Screenshot (se applicabile)
- Info ambiente (browser, OS, versione Node)

---

## 📄 License

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

---

## 👤 Autore

**Prof. Carello**

- GitHub: [@carellonicolo](https://github.com/carellonicolo)
- Progetto: [carello-hub](https://github.com/carellonicolo/carello-hub)

---

## 🙏 Riconoscimenti

- [shadcn/ui](https://ui.shadcn.com/) per i componenti UI
- [Lucide](https://lucide.dev/) per le icone
- [Supabase](https://supabase.com/) per il backend
- [Vite](https://vitejs.dev/) per il build tool
- Community Open Source

---

<div align="center">

**Realizzato con ❤️ per l'educazione**

[⬆ Torna su](#prof-carello-app-hub)

</div>
