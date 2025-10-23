# 🎓 Prof. Carello APP Hub

<div align="center">

**Una dashboard moderna e personalizzabile per centralizzare l'accesso alle applicazioni e risorse educative**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Installazione](#-installazione-rapida) • [Configurazione](#%EF%B8%8F-configurazione) • [Utilizzo](#-utilizzo) • [Deployment](#-deployment) • [Contributing](#-contributing)

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

**Prof. Carello APP Hub** è una soluzione web all-in-one progettata specificamente per ambienti educativi moderni. Nata dall'esigenza di centralizzare l'accesso a molteplici applicazioni didattiche distribuite su domini diversi, questa dashboard offre un'esperienza utente fluida e intuitiva per studenti e docenti.

### 🎯 Problema Risolto

In un'aula informatica con decine di applicazioni web distribuite su diversi domini, ricordare ogni indirizzo diventa un problema. **APP Hub** risolve questa sfida fornendo un'unica interfaccia configurabile che si apre automaticamente all'avvio del browser, permettendo accesso immediato a tutti gli strumenti didattici necessari.

### ✨ Caratteristiche Principali

#### Per gli Studenti
- 🚀 **Accesso Immediato**: Dashboard che si apre automaticamente all'avvio del browser
- 🎨 **Interfaccia Intuitiva**: Design pulito con icone colorate e navigazione semplice
- 📱 **Responsive Design**: Funziona perfettamente su desktop, tablet e smartphone
- ⏱️ **Status Bar Dinamica**: Visualizzazione in tempo reale di ora, data e stato di login
- 🔍 **Ricerca Visiva**: Trova rapidamente le app tramite icone riconoscibili

#### Per gli Amministratori
- 🔧 **Gestione Completa**: Pannello admin dedicato per configurare la dashboard
- 🎨 **Personalizzazione Totale**: Oltre 600 icone Lucide React + color picker HSL
- 🔄 **Drag & Drop**: Riordina le app con trascinamento intuitivo
- 🌈 **Sistema di Colori**: 12 colori predefiniti + selezione HSL personalizzata
- ⚡ **Real-time Updates**: Modifiche istantaneamente visibili a tutti gli utenti
- 🔐 **Sicurezza Integrata**: Row Level Security (RLS) per protezione dei dati
- 📊 **Database Management**: Gestione completa tramite interfaccia Supabase

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

| Tecnologia | Versione | Descrizione | Perché Scelto |
|-----------|----------|-------------|---------------|
| [React](https://react.dev/) | 18.3 | Libreria UI con hooks e context | Ecosystem maturo, performance ottimali, riutilizzabilità componenti |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety e migliore DX | Riduce bug in produzione, autocomplete IDE, documentazione integrata |
| [Vite](https://vitejs.dev/) | 5.4 | Build tool veloce con HMR | Startup istantaneo, HMR velocissimo, build ottimizzate |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework | Sviluppo rapido, bundle CSS minimo, design system coerente |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Componenti UI pre-stilizzati | Accessibili (a11y), personalizzabili, no bundle bloat |

### Backend & Database

| Tecnologia | Descrizione | Caratteristiche Chiave |
|-----------|-------------|------------------------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service | PostgreSQL managed, Auth integrata, API REST/GraphQL auto-generate |
| PostgreSQL | Database relazionale enterprise-grade | ACID compliance, estensioni potenti, scalabilità |
| Row Level Security (RLS) | Sicurezza a livello di database | Policies granulari, zero-trust architecture, protezione nativa |

### Librerie Principali

| Libreria | Versione | Scopo | Benefici |
|---------|----------|-------|----------|
| `@dnd-kit/core` | ^6.3.1 | Sistema drag and drop | Accessibile, performante, touch support |
| `@dnd-kit/sortable` | ^10.0.0 | Ordinamento drag and drop | Strategie multiple, animazioni fluide |
| `@tanstack/react-query` | ^5.83.0 | Data fetching e state management | Cache intelligente, sincronizzazione automatica, DevTools |
| `react-router-dom` | ^6.30.1 | Routing client-side | Nested routes, lazy loading, data loading |
| `react-hook-form` | ^7.61.1 | Gestione form avanzata | Validazione, performance, UX ottimale |
| `zod` | ^3.25.76 | Schema validation TypeScript-first | Type inference, composizione, error messages |
| `lucide-react` | ^0.462.0 | 600+ icone SVG ottimizzate | Tree-shakeable, personalizzabili, accessibili |
| `sonner` | ^1.7.4 | Toast notifications eleganti | Design moderno, animazioni fluide, promise support |

### Architettura e Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  Components Layer                                        │
│  ├─ UI Components (shadcn/ui)                          │
│  ├─ Business Components (AppIcon, StatusBar, etc.)     │
│  └─ App Management Components (Admin Panel)            │
├─────────────────────────────────────────────────────────┤
│  State Management Layer                                  │
│  ├─ React Query (Server State)                         │
│  ├─ React Context (Auth State)                         │
│  └─ React Router (Navigation State)                    │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  ├─ Supabase Client                                     │
│  ├─ Custom Hooks (useApps, useAuth, useIsAdmin)       │
│  └─ Type-safe API calls                                 │
├─────────────────────────────────────────────────────────┤
│  Backend (Supabase)                                      │
│  ├─ PostgreSQL Database                                 │
│  ├─ Row Level Security (RLS)                           │
│  ├─ Authentication (Email/Password)                     │
│  └─ Real-time Subscriptions (optional)                  │
└─────────────────────────────────────────────────────────┘
```

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

## 🚀 Installazione Rapida

### Metodo 1: Setup Completo (Consigliato per sviluppo)

#### 1️⃣ Clona il Repository

```bash
git clone https://github.com/carellonicolo/carello-hub.git
cd carello-hub
```

#### 2️⃣ Installa le Dipendenze

```bash
# Con npm
npm install

# Con yarn (alternativa)
yarn install

# Con bun (più veloce)
bun install
```

#### 3️⃣ Configura le Variabili d'Ambiente

Crea il file `.env` dalla template:

```bash
cp .env.example .env
```

Compila il file `.env` con i dati del tuo progetto Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tuoprogetto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=tuoprogetto
```

> 💡 **Dove trovare queste informazioni?**  
> Dashboard Supabase → Project Settings → API

#### 4️⃣ Setup del Database

Vai su [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) ed esegui lo script SQL completo fornito nella sezione [Configurazione Database](#setup-database).

#### 5️⃣ Avvia il Server di Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:8080` (o la porta configurata)

#### 6️⃣ Crea il Primo Utente Admin

1. Apri l'app nel browser
2. Vai su `/auth` e registrati
3. Copia il tuo `user_id` dalla dashboard Supabase (Authentication → Users)
4. Esegui nel SQL Editor:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('tuo-user-id-qui', 'admin');
```

### Metodo 2: Quick Start con Docker (Opzionale)

```bash
# Avvia Supabase locale
npx supabase start

# In un altro terminale
npm run dev
```

### Verifica Installazione

Esegui questi comandi per verificare che tutto funzioni:

```bash
# Test build
npm run build

# Test linting
npm run lint

# Verifica tipi TypeScript
npm run type-check
```

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

### Comandi Disponibili

| Comando | Descrizione | Quando Usarlo |
|---------|-------------|---------------|
| `npm run dev` | Avvia il server di sviluppo con HMR | Durante lo sviluppo quotidiano |
| `npm run build` | Crea una build ottimizzata per produzione | Prima del deployment |
| `npm run preview` | Testa la build in locale | Per testare le ottimizzazioni di produzione |
| `npm run lint` | Esegue ESLint su tutto il progetto | Prima di committare o in CI/CD |
| `npm run type-check` | Verifica i tipi TypeScript | Debug di errori di tipo |

### Workflow di Sviluppo Consigliato

#### 1. Sviluppo Quotidiano

```bash
# Avvia il dev server
npm run dev

# In un altro terminale, watch dei tipi
npm run type-check -- --watch
```

Il browser si aprirà automaticamente su `http://localhost:8080` con hot-reload attivo.

#### 2. Prima di Committare

```bash
# Verifica linting
npm run lint

# Fix automatico problemi di linting
npm run lint -- --fix

# Verifica che la build funzioni
npm run build

# Test della build locale
npm run preview
```

#### 3. Aggiungere Nuove Applicazioni (Admin)

1. Login come admin
2. Clicca sul pulsante "Gestisci Apps" nella StatusBar
3. Nel pannello laterale, clicca "Aggiungi Nuova App"
4. Compila il form:
   - **Nome**: Max 20 caratteri (es. "Google Classroom")
   - **URL**: Deve iniziare con `https://` o `http://`
   - **Icona**: Scegli tra 600+ icone o cerca per nome
   - **Colore**: Seleziona da palette o usa il color picker HSL
5. Salva e trascina per riordinare

#### 4. Riordinare le Applicazioni (Admin)

```
┌────────────────────────────────────┐
│  Pannello Gestione Apps            │
├────────────────────────────────────┤
│  [≡] App 1  [✏️] [🗑️]              │  ← Trascina da qui
│  [≡] App 2  [✏️] [🗑️]              │
│  [≡] App 3  [✏️] [🗑️]              │
│  [≡] App 4  [✏️] [🗑️]              │
└────────────────────────────────────┘
```

Le modifiche vengono salvate automaticamente e sono immediatamente visibili a tutti gli utenti.

### Debugging

#### React Query DevTools

Aggiungi temporaneamente in `src/App.tsx` per debug delle query:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* ... resto del codice */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

#### Supabase Logs

Monitora le query e gli errori:

```bash
# Nel dashboard Supabase
Project → Logs → Postgres Logs
```

#### Console Browser

Abilita log dettagliati in `src/integrations/supabase/client.ts`:

```typescript
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      debug: true, // Abilita debug auth
    },
  }
);
```

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

### Panoramica

Il database utilizza PostgreSQL tramite Supabase con Row Level Security (RLS) per garantire accesso sicuro e granulare ai dati.

```
┌──────────────┐         ┌──────────────┐
│   auth.users │         │   apps       │
│  (Supabase)  │         │  (Public)    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │                        │
       │                        │
       │                        │
   ┌───┴────────┐              │
   │ user_roles │──────────────┘
   │  (Public)  │  (controllo accesso)
   └────────────┘
```

### Tabella `apps`

Memorizza le applicazioni visualizzate nella dashboard pubblica.

| Campo | Tipo | Constraint | Descrizione |
|-------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificatore unico dell'app |
| `name` | TEXT | NOT NULL, CHECK (length ≤ 20) | Nome visualizzato (max 20 caratteri) |
| `icon_name` | TEXT | NOT NULL | Nome icona da Lucide React (es. "Home") |
| `href` | TEXT | NOT NULL, CHECK (regex http/https) | URL di destinazione |
| `color` | TEXT | NOT NULL | Colore HSL (es. "210 100% 50%") |
| `position` | INTEGER | NOT NULL | Ordine di visualizzazione (min = primo) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Timestamp creazione |

**Indici:**
```sql
CREATE INDEX idx_apps_position ON apps(position);  -- Ordinamento veloce
```

**Policies RLS:**
- ✅ `SELECT`: Chiunque può visualizzare le app (public dashboard)
- 🔒 `INSERT`: Solo admin possono creare app
- 🔒 `UPDATE`: Solo admin possono modificare app
- 🔒 `DELETE`: Solo admin possono eliminare app

### Tabella `user_roles`

Gestisce i ruoli degli utenti per il controllo degli accessi.

| Campo | Tipo | Constraint | Descrizione |
|-------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificatore unico |
| `user_id` | UUID | FOREIGN KEY → auth.users(id) ON DELETE CASCADE | Riferimento all'utente Supabase |
| `role` | app_role | ENUM ('admin', 'user') | Ruolo assegnato |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Timestamp assegnazione ruolo |

**Constraints:**
```sql
UNIQUE(user_id, role)  -- Un utente può avere lo stesso ruolo una sola volta
```

**Policies RLS:**
- 🔒 `SELECT`: Gli utenti possono vedere solo i propri ruoli
- ❌ `INSERT/UPDATE/DELETE`: Non gestiti via applicazione (solo DB admin)

### Enum `app_role`

```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');
```

Definisce i ruoli disponibili nel sistema.

### RPC Functions

#### `has_role(user_id, role)`

Funzione helper per verificare se un utente ha un ruolo specifico.

```sql
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

**Utilizzo nelle RLS Policies:**
```sql
CREATE POLICY "Only admins can insert apps"
    ON apps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

### Diagramma ER Completo

```
┌─────────────────────────────────┐
│         auth.users              │
│  (Gestito da Supabase Auth)     │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ email: TEXT                     │
│ created_at: TIMESTAMPTZ         │
│ ...                             │
└────────────┬────────────────────┘
             │
             │ 1:N
             │
┌────────────┴────────────────────┐
│        user_roles               │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ user_id: UUID (FK) ────────────┐│
│ role: app_role                  ││
│ created_at: TIMESTAMPTZ         ││
└─────────────────────────────────┘│
                                   │
              Controlla            │
              Accesso a            │
                                   │
┌──────────────────────────────────┴┐
│             apps                   │
├────────────────────────────────────┤
│ id: UUID (PK)                      │
│ name: TEXT (max 20)                │
│ icon_name: TEXT                    │
│ href: TEXT (URL)                   │
│ color: TEXT (HSL)                  │
│ position: INTEGER                  │
│ created_at: TIMESTAMPTZ            │
└────────────────────────────────────┘
```

### Query SQL Utili

#### Ottenere tutte le app ordinate per posizione
```sql
SELECT * FROM apps 
ORDER BY position ASC;
```

#### Verificare se un utente è admin
```sql
SELECT has_role('user-uuid-qui', 'admin');
```

#### Contare il numero di admin
```sql
SELECT COUNT(DISTINCT user_id) as admin_count
FROM user_roles
WHERE role = 'admin';
```

#### Trovare app senza posizione duplicata
```sql
SELECT position, COUNT(*) as count
FROM apps
GROUP BY position
HAVING COUNT(*) > 1;
```

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

### ✅ v1.0 - Completato

- [x] Dashboard pubblica con grid responsive
- [x] Sistema di autenticazione con ruoli
- [x] CRUD completo applicazioni
- [x] Drag & drop per riordino
- [x] 600+ icone Lucide React
- [x] Color picker HSL personalizzato
- [x] Row Level Security (RLS)
- [x] Status bar con orologio real-time
- [x] Gestione admin tramite sheet laterale

### 🚧 v1.1 - In Sviluppo

- [ ] **Ricerca App**: Campo di ricerca full-text nella dashboard
  - Algoritmo fuzzy search
  - Highlight dei risultati
  - Keyboard shortcuts (Cmd+K / Ctrl+K)
  
- [ ] **Categorie**: Organizzazione delle app
  - Tab per categoria nella dashboard
  - Filtro rapido per categoria
  - Colori categoria personalizzati
  - Drag & drop tra categorie
  
- [ ] **Dark Mode Toggle**: Switcher tema nell'UI
  - Pulsante in StatusBar
  - Rispetta preferenza sistema
  - Animazione smooth al cambio tema
  - Persistenza della scelta

### 🔮 v1.2 - Pianificato

- [ ] **Statistiche Utilizzo**: Analytics integrata
  - Contatore click per app
  - Dashboard analytics per admin
  - Grafici con recharts
  - Export dati CSV
  
- [ ] **PWA Support**: Progressive Web App
  - Service Worker per offline
  - App installabile
  - Push notifications
  - Icone adaptive per mobile
  
- [ ] **Descrizioni App**: Tooltip informativi
  - Campo descrizione nel form
  - Hover tooltip con Radix UI
  - Supporto Markdown
  - Anteprima in edit mode

### 🌟 v2.0 - Futuro

- [ ] **Multi-lingua**: i18n completa
  - Italiano (default)
  - Inglese
  - Framework react-i18next
  - Detección automática lingua browser
  
- [ ] **Bookmarks Personali**: Sistema preferiti per utente
  - Sezione "I Miei Preferiti"
  - Star/unstar app
  - Sincronizzazione cloud
  - Accesso rapido keyboard
  
- [ ] **Gruppi e Permessi**: Multi-tenancy
  - Ruoli personalizzati
  - Gruppi di utenti
  - App visibili solo a certi gruppi
  - Inviti via email
  
- [ ] **Notifiche Push**: Sistema annunci
  - Notifiche per nuove app
  - Messaggi broadcast admin
  - Notifiche manutenzione
  - Web Push API
  
- [ ] **Temi Personalizzati**: Branding completo
  - Upload logo custom
  - Color scheme personalizzato
  - Font customizzabili
  - CSS override per scuole
  
- [ ] **API Pubblica**: REST API documentata
  - Endpoint CRUD apps
  - Rate limiting
  - API keys per integrations
  - Documentazione OpenAPI/Swagger
  
- [ ] **Backup/Import/Export**: Gestione configurazioni
  - Export JSON completo
  - Import da file
  - Backup automatici schedulati
  - Restore point-in-time

### 🎯 Idee in Valutazione

- 🤔 **Widgets Dashboard**: Meteo, calendario, news
- 🤔 **Integrazione OAuth**: Login con Google/Microsoft
- 🤔 **App Suggerite**: AI-powered recommendations
- 🤔 **Temi Stagionali**: Sfondi automatici per festività
- 🤔 **Accessibilità Avanzata**: Screen reader, high contrast
- 🤔 **Mobile App Nativa**: React Native per iOS/Android

---

### 📊 Priorità Features

```
Alta Priorità    ███████████████████░░  (v1.1)
├─ Ricerca      ████████████████████
├─ Categorie    ███████████████████░
└─ Dark Toggle  ██████████████████░░

Media Priorità   ████████████░░░░░░░░  (v1.2)
├─ Statistiche  ████████████████░░░░
├─ PWA          ███████████░░░░░░░░░
└─ Descrizioni  ██████████░░░░░░░░░░

Bassa Priorità   ██████░░░░░░░░░░░░░░  (v2.0+)
└─ Multi-lingua, Bookmarks, Gruppi, ecc.
```

---

### 🗳️ Vota le Feature

Hai un'idea o vuoi votare le feature? Apri una [Discussion su GitHub](https://github.com/carellonicolo/carello-hub/discussions) nella categoria "Ideas"!

---

## 🤝 Contributing

Grazie per il tuo interesse nel contribuire a **Prof. Carello APP Hub**! 🎉

### Come Contribuire

#### 🐛 Segnalare Bug

Apri una [issue su GitHub](https://github.com/carellonicolo/carello-hub/issues/new) con:

**Template Bug Report:**
```markdown
## Descrizione Bug
[Descrizione chiara e concisa del problema]

## Passi per Riprodurre
1. Vai a '...'
2. Clicca su '...'
3. Scrolla fino a '...'
4. Vedi errore

## Comportamento Atteso
[Cosa ti aspettavi che succedesse]

## Comportamento Attuale
[Cosa è successo invece]

## Screenshot
[Se applicabile, aggiungi screenshot]

## Ambiente
- OS: [es. macOS 14.0]
- Browser: [es. Chrome 120]
- Node: [es. v18.17.0]
- npm: [es. 9.6.7]

## Log/Errori
```
[Incolla qui eventuali errori dalla console]
```

## Note Aggiuntive
[Qualsiasi altra informazione utile]
```

#### 💡 Proporre Nuove Feature

Apri una [Discussion](https://github.com/carellonicolo/carello-hub/discussions/new?category=ideas) nella categoria "Ideas":

**Template Feature Request:**
```markdown
## Problema da Risolvere
[Quale problema risolve questa feature?]

## Soluzione Proposta
[Come dovrebbe funzionare?]

## Alternative Considerate
[Hai considerato altre soluzioni?]

## Use Case
[Esempi concreti di utilizzo]

## Mockup/Wireframe
[Se hai sketch o mockup, allegarli qui]
```

#### 🔧 Contribuire con Codice

##### 1. Setup Ambiente

```bash
# Fork il repository su GitHub, poi clona il tuo fork
git clone https://github.com/TUO-USERNAME/carello-hub.git
cd carello-hub

# Aggiungi upstream remote
git remote add upstream https://github.com/carellonicolo/carello-hub.git

# Installa dipendenze
npm install

# Crea branch per la feature
git checkout -b feature/nome-feature
```

##### 2. Sviluppo

**Convenzioni di Codice:**

```typescript
// ✅ Componenti: PascalCase
const AppIcon = ({ name, color }: AppIconProps) => { ... }

// ✅ Hooks: camelCase con prefisso "use"
const useApps = () => { ... }

// ✅ Costanti: UPPER_SNAKE_CASE
const MAX_APP_NAME_LENGTH = 20;

// ✅ Interfacce/Types: PascalCase con "Props" suffix
interface AppIconProps {
  name: string;
  color: string;
}

// ✅ File: kebab-case o PascalCase (secondo convenzione cartella)
src/components/app-management/AppCard.tsx  // PascalCase componenti
src/hooks/useApps.ts                        // camelCase hooks
src/lib/utils.ts                            // kebab-case utils
```

**Commit Messages (Conventional Commits):**

```bash
# Formato
<type>(<scope>): <description>

# Types
feat:     Nuova feature
fix:      Bug fix
docs:     Modifiche documentazione
style:    Formattazione codice (no logic change)
refactor: Refactoring (no feature/fix)
perf:     Miglioramenti performance
test:     Aggiunta/modifica test
chore:    Manutenzione (deps, config, etc.)

# Esempi
git commit -m "feat(apps): add search functionality to dashboard"
git commit -m "fix(auth): resolve infinite redirect loop on login"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(hooks): extract reusable auth logic to custom hook"
```

**Best Practices:**

```typescript
// ❌ Evita
function MyComponent() {
  const [data, setData] = useState(null); // any type
  useEffect(() => {
    fetchData().then(d => setData(d)); // missing deps
  });
  return <div>{data.map(...)}</div>; // no optional chaining
}

// ✅ Preferisci
function MyComponent() {
  const [data, setData] = useState<Data[] | null>(null); // typed
  
  useEffect(() => {
    fetchData().then(setData);
  }, []); // empty deps = run once
  
  if (!data) return <LoadingSpinner />; // loading state
  
  return (
    <div>
      {data.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
}
```

##### 3. Testing

```bash
# Verifica linting
npm run lint

# Fix automatico problemi
npm run lint -- --fix

# Type checking
npm run type-check

# Build test
npm run build

# Preview build
npm run preview
```

##### 4. Pull Request

```bash
# Push al tuo fork
git push origin feature/nome-feature

# Apri PR su GitHub con questo template:
```

**Template Pull Request:**
```markdown
## Descrizione
[Descrizione delle modifiche]

## Tipo di Cambiamento
- [ ] Bug fix (non-breaking change che risolve un issue)
- [ ] Nuova feature (non-breaking change che aggiunge funzionalità)
- [ ] Breaking change (fix o feature che causa breaking)
- [ ] Documentazione

## Come Testare
1. [Passo 1]
2. [Passo 2]
3. [Verificare che...]

## Checklist
- [ ] Il mio codice segue le convenzioni del progetto
- [ ] Ho eseguito linting (`npm run lint`)
- [ ] Ho verificato i tipi TypeScript (`npm run type-check`)
- [ ] Ho testato la build (`npm run build`)
- [ ] Ho aggiornato la documentazione se necessario
- [ ] Le mie modifiche non generano nuovi warning
- [ ] Ho verificato su più browser (Chrome, Firefox, Safari)

## Screenshot (se applicabile)
[Aggiungi screenshot delle modifiche UI]

## Issue Correlate
Closes #[numero-issue]
```

#### 📝 Contribuire alla Documentazione

Anche miglioramenti alla documentazione sono benvenuti!

```bash
# Modifiche al README
edit README.md

# Nuove guide
create docs/GUIDE-NAME.md

# Commit
git commit -m "docs: add guide for custom themes"
```

### 🏆 Contributors

Grazie a tutti i contributor! 🙌

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Verrà popolata automaticamente -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

### 📜 Codice di Condotta

Partecipando a questo progetto, accetti di rispettare il nostro [Code of Conduct](CODE_OF_CONDUCT.md).

**In sintesi:**
- ✅ Sii rispettoso e inclusivo
- ✅ Fornisci feedback costruttivo
- ✅ Accetta critiche con grazia
- ❌ No molestie, discriminazione, trolling
- ❌ No spam o pubblicità non richiesta

### 💬 Bisogno di Aiuto?

- 📖 Leggi la [documentazione completa](README.md)
- 🐛 Consulta la [guida troubleshooting](TROUBLESHOOTING.md)
- 💡 Unisciti alle [Discussions](https://github.com/carellonicolo/carello-hub/discussions)
- 📧 Contatta il maintainer: [Email](mailto:your-email@example.com)

---

<div align="center">

**Fatto con ❤️ da [Prof. Carello](https://github.com/carellonicolo) e [Contributors](https://github.com/carellonicolo/carello-hub/graphs/contributors)**

</div>

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

**Realizzato da Prof. Carello. Per altre informazioni contattarlo per email a: info@nicolocarello.it*

[⬆ Torna su](#prof-carello-app-hub)

</div>
