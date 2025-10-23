# 🔧 Troubleshooting Guide

Questa guida copre i problemi più comuni e le loro soluzioni.

---

## 📑 Indice

- [Problemi di Installazione](#problemi-di-installazione)
- [Errori di Connessione Database](#errori-di-connessione-database)
- [Problemi di Autenticazione](#problemi-di-autenticazione)
- [Problemi con le App](#problemi-con-le-app)
- [Problemi di Build](#problemi-di-build)
- [Problemi di Performance](#problemi-di-performance)

---

## Problemi di Installazione

### ❌ `npm install` fallisce con errori ERESOLVE

**Sintomo:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Soluzione:**
```bash
# Opzione 1: Force install
npm install --force

# Opzione 2: Legacy peer deps
npm install --legacy-peer-deps

# Opzione 3: Pulisci cache e reinstalla
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ Errore "Module not found" dopo installazione

**Sintomo:**
```
Error: Cannot find module '@/components/...'
```

**Soluzione:**

1. Verifica `tsconfig.json` abbia i path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Restart del dev server:
```bash
# Ctrl+C per fermare
npm run dev
```

---

## Errori di Connessione Database

### ❌ "Invalid API key" o "Project not found"

**Sintomo:**
```
Error: Invalid API key
```

**Diagnosi:**
```bash
# Verifica file .env esista
cat .env

# Deve contenere:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1...
```

**Soluzione:**

1. Controlla che le variabili inizino con `VITE_` (richiesto da Vite)
2. Verifica i valori nel dashboard Supabase → Settings → API
3. Riavvia il dev server dopo aver modificato `.env`

### ❌ "relation 'apps' does not exist"

**Sintomo:**
```
PostgrestError: relation "public.apps" does not exist
```

**Soluzione:**

Lo schema del database non è stato creato. Esegui nel SQL Editor di Supabase:

```sql
-- 1. Crea enum
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- 2. Crea tabella apps
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) <= 20),
    icon_name TEXT NOT NULL,
    href TEXT NOT NULL CHECK (href ~ '^https?://'),
    color TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Crea tabella user_roles
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, role)
);

-- 4. Abilita RLS
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Crea policies (vedi README completo)
```

### ❌ RLS Policies che bloccano le operazioni

**Sintomo:**
```
new row violates row-level security policy for table "apps"
```

**Soluzione:**

Verifica di essere admin:
```sql
-- Nel SQL Editor
SELECT * FROM user_roles WHERE user_id = auth.uid();
```

Se non sei admin, aggiungi il ruolo:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('tuo-user-id', 'admin');
```

---

## Problemi di Autenticazione

### ❌ "User already registered" ma non riesco a fare login

**Causa:** Email non confermata (se email confirmation è abilitata)

**Soluzione:**

Disabilita email confirmation per sviluppo:

1. Dashboard Supabase → Authentication → Settings
2. Trova "Enable email confirmations"
3. Disabilita l'opzione
4. Riprova la registrazione

### ❌ Redirect loop infinito dopo login

**Sintomo:** La pagina continua a ricaricarsi

**Soluzione:**

Controlla `src/hooks/useAuth.tsx`:

```typescript
// Assicurati che il redirect non crei un loop
if (user && location.pathname === '/auth') {
  navigate('/');
}
```

### ❌ "Session expired" improvviso

**Causa:** Token JWT scaduto

**Soluzione:**

```typescript
// In src/integrations/supabase/client.ts
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,  // Auto-refresh
      persistSession: true,     // Persiste la sessione
    },
  }
);
```

---

## Problemi con le App

### ❌ Le icone non vengono visualizzate

**Sintomo:** Box vuoti al posto delle icone

**Diagnosi:**

```typescript
// In src/components/AppIcon.tsx
console.log('Icon name:', iconName);
console.log('Icon component:', Icon);
```

**Soluzione:**

1. Verifica che il nome dell'icona sia corretto (case-sensitive)
2. L'icona deve esistere in `lucide-react`
3. Prova con un'icona comune tipo "Home"

```typescript
// Test fallback icon
const Icon = icons[iconName as keyof typeof icons] || icons.HelpCircle;
```

### ❌ Drag and drop non funziona

**Sintomo:** Non riesco a trascinare le app

**Verifica:**

1. Sei loggato come admin?
2. Il pannello di gestione è aperto?
3. Browser supporta drag and drop?

**Debug:**

```typescript
// In AppManagementSheet.tsx
const isAdmin = useIsAdmin();
console.log('Is admin:', isAdmin);
console.log('Can drag:', isAdmin && apps.length > 0);
```

### ❌ I colori delle app non si salvano correttamente

**Sintomo:** Il colore scelto non viene mantenuto

**Soluzione:**

Verifica formato HSL:

```typescript
// Corretto ✅
color: "210 100% 50%"

// Sbagliato ❌
color: "hsl(210, 100%, 50%)"
color: "#3b82f6"
```

---

## Problemi di Build

### ❌ Build fallisce con errori TypeScript

**Sintomo:**
```
error TS2322: Type 'string' is not assignable to type 'never'
```

**Soluzione:**

```bash
# Verifica tipi
npm run type-check

# Se ci sono errori, fixali o usa:
npm run build -- --no-type-check  # SOLO per debug!
```

### ❌ Build enorme (>5MB)

**Diagnosi:**

```bash
npm run build
# Controlla dist/ size
du -sh dist/*
```

**Ottimizzazioni:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react', '@radix-ui/react-dialog'],
        }
      }
    }
  }
});
```

### ❌ Build funziona ma in produzione 404 sulle rotte

**Causa:** Server non configurato per SPA

**Soluzione Netlify:**
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Soluzione Vercel:**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Soluzione Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Problemi di Performance

### ❌ App lenta con molte icone

**Soluzione:**

Virtualizza la lista icone:

```bash
npm install @tanstack/react-virtual
```

```typescript
// In IconPicker.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// Virtualizza la grid
const parentRef = useRef<HTMLDivElement>(null);
const virtualizer = useVirtualizer({
  count: filteredIcons.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 64,
  overscan: 5,
});
```

### ❌ Re-render eccessivi

**Diagnosi:**

```bash
npm install @welldone-software/why-did-you-render
```

```typescript
// In main.tsx
if (import.meta.env.DEV) {
  const whyDidYouRender = await import('@welldone-software/why-did-you-render');
  whyDidYouRender.default(React);
}
```

**Soluzioni comuni:**

```typescript
// 1. Memoizza callbacks
const handleClick = useCallback(() => {
  // ...
}, [deps]);

// 2. Memoizza componenti
const AppCard = memo(({ app }) => {
  // ...
});

// 3. Usa useMemo per calcoli costosi
const sortedApps = useMemo(() => 
  apps.sort((a, b) => a.position - b.position),
  [apps]
);
```

---

## 🆘 Ulteriore Supporto

Se il problema persiste:

1. **Controlla i logs del browser** (F12 → Console)
2. **Controlla i logs Supabase** (Dashboard → Logs)
3. **Cerca nelle Issues GitHub** (potrebbero esserci soluzioni)
4. **Apri una nuova Issue** con:
   - Descrizione del problema
   - Passi per riprodurlo
   - Screenshot/logs
   - Info ambiente (OS, browser, Node version)

**Link Utili:**
- [Supabase Status](https://status.supabase.com/)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
