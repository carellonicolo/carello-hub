# 📚 Carello Hub - Dashboard Educativa AI-Powered

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen?style=flat-square)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=flat-square)
![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=flat-square)
![Educational](https://img.shields.io/badge/Educational-Non--Profit-blue?style=flat-square)

**Una dashboard moderna e interattiva per applicazioni didattiche,
sviluppata con strumenti di Intelligenza Artificiale**

[📸 Demo](#-panoramica) • [✨ Caratteristiche](#-caratteristiche) • [🚀 Quick Start](#-quick-start) • [📖 Docs](#-struttura-del-progetto) • [🤝 Contribuisci](#-contribuisci)

</div>

---

## 🎯 Panoramica

**Carello Hub** è un progetto educativo **open source** che dimostra l'applicazione pratica dell'Intelligenza Artificiale nello sviluppo di applicazioni web moderne. La dashboard offre un'interfaccia elegante e intuitiva per organizzare e accedere rapidamente a strumenti educativi e risorse didattiche.

### 🎓 Scopo del Progetto

Questo progetto nasce con finalità esclusivamente **didattiche e divulgative**, senza scopo di lucro. L'obiettivo principale è:

- 🧠 **Promuovere la consapevolezza** nell'utilizzo dell'Intelligenza Artificiale
- 🛠️ **Dimostrare** come l'IA possa essere uno strumento accessibile ed etico
- 🚀 **Favorire l'innovazione** nella didattica moderna
- 📖 **Condividere conoscenze** attraverso codice open source di qualità

### 🌐 Open Source & Collaborazione

Il codice sorgente è **pubblicamente disponibile** e ogni contributo è benvenuto! Che tu sia uno studente, un insegnante o uno sviluppatore, puoi:

- ✅ Estendere le funzionalità
- ✅ Migliorare l'accessibilità
- ✅ Proporre nuove idee
- ✅ Correggere bug
- ✅ Migliorare la documentazione

---

## ✨ Caratteristiche

### 🎨 Design & UI/UX
- **Design glassmorphic iOS-style** con effetti di sfocatura e trasparenze
- **Animazioni fluide** con curve iOS spring per un'esperienza premium
- **Responsive design** ottimizzato (2-4-5 colonne su mobile/tablet/desktop)
- **Lazy loading** delle pagine per performance ottimali
- **Dark/Light theme** support

### 🔄 Drag & Drop Avanzato
- **Riordinamento intuitivo** con feedback visivo migliorato
- **Protezione anti-drag multipli** con debouncing (16ms)
- **Optimistic updates** per reattività UI
- **Persistenza automatica** con sincronizzazione real-time

### 🎨 Personalizzazione Totale
- **1000+ icone Lucide** SVG ottimizzate
- **Color picker avanzato** (12 preset + HSL personalizzato)
- **Testo personalizzabile** con ellipsis su nomi lunghi
- **Real-time preview** delle modifiche

### 🔐 Sicurezza & Performance
- **Autenticazione Supabase** con gestione ruoli (admin/user)
- **Row Level Security (RLS)** per protezione dati
- **React.memo** sui componenti critici
- **Code splitting** automatico per bundle ottimizzato
- **useMemo** per calcoli costosi
- **Bundle size ridotto** (rimosse 73.5% dipendenze UI non utilizzate)

---

## 🛠 Stack Tecnologico

### Core
- **[React 18](https://react.dev/)** - UI library con hooks moderni
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Build tool ultra-veloce con HMR
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS

### Backend & Data
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **[TanStack Query](https://tanstack.com/query/)** - Server state management con caching
- **[@dnd-kit](https://dnd-kit.com/)** - Drag and drop accessibile

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Componenti Radix UI pre-stilizzati
- **[Lucide React](https://lucide.dev/)** - 1000+ icone SVG ottimizzate
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** - Form validation

---

## 🚀 Quick Start

### Prerequisiti
- Node.js >= 18.x
- npm >= 9.x
- Account [Supabase](https://supabase.com/) gratuito

### Installazione

```bash
# 1. Clona il repository
git clone https://github.com/carellonicolo/carello-hub.git
cd carello-hub

# 2. Installa dipendenze
npm install

# 3. Configura variabili d'ambiente
cp .env.example .env
# Edita .env con le tue credenziali Supabase

# 4. Avvia dev server
npm run dev
```

### Configurazione Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Esegui le migration SQL da `supabase/migrations/`
3. Crea il primo admin:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id', 'admin');
```

4. Aggiorna `.env` con le credenziali (Dashboard → Settings → API)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Apri `http://localhost:8080`

---

## 📁 Struttura del Progetto

```
carello-hub/
├── src/
│   ├── components/
│   │   ├── AppIcon.tsx          # Icona app (memoized)
│   │   ├── StatusBar.tsx        # Barra con orologio
│   │   ├── ProjectInfoButton.tsx # Modal info progetto
│   │   ├── app-management/      # CRUD admin
│   │   └── ui/                  # shadcn components (13/49 utilizzati)
│   ├── hooks/
│   │   ├── useApps.ts           # App CRUD con React Query
│   │   ├── useAuth.tsx          # Auth context
│   │   └── useIsAdmin.ts        # Role verification
│   ├── pages/
│   │   ├── Index.tsx            # Dashboard (lazy loaded)
│   │   ├── Auth.tsx             # Login page
│   │   └── NotFound.tsx         # 404
│   ├── integrations/supabase/   # Supabase client
│   └── App.tsx                  # Root con lazy loading
├── supabase/migrations/         # DB schema
└── public/                      # Static assets
```

---

## 💻 Sviluppo

### Script Disponibili

```bash
npm run dev      # Dev server con HMR
npm run build    # Build produzione ottimizzata
npm run preview  # Preview build locale
npm run lint     # ESLint check
```

### Convenzioni

- **Componenti**: PascalCase (`AppIcon.tsx`)
- **Hooks**: camelCase con "use" (`useApps.ts`)
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
  ```bash
  feat: add search functionality
  fix: resolve color picker bug
  docs: update README
  ```

### Ottimizzazioni Implementate

✅ **Lazy Loading** - Route code-split per bundle ridotto
✅ **React.memo** - AppIcon memoized per evitare re-render
✅ **useMemo** - Hash calculation cachata in Index.tsx
✅ **Tree Shaking** - Rimosse 34/49 UI components non utilizzate
✅ **Debouncing** - Drag events ottimizzati (16ms)
✅ **Security Fix** - npm audit fix eseguito

---

## 🏗 Build & Deploy

### Build

```bash
npm run build
# Output: dist/ (ready per deploy)
```

### Deploy (Vercel - Consigliato)

```bash
npm i -g vercel
vercel
```

Configura env vars nel dashboard Vercel.

### Altri Hosting
- **Netlify**: Auto-deploy da GitHub
- **GitHub Pages**: Deploy manuale `dist/`
- **Custom**: Nginx/Apache servendo `dist/`

---

## 🤝 Contribuisci

Contributi, issue e PR sono i benvenuti! Leggi [CONTRIBUTING.md](./CONTRIBUTING.md).

### Quick Contribute

1. Fork il progetto
2. Branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add: Amazing feature'`
4. Push: `git push origin feature/AmazingFeature`
5. Apri una Pull Request

---

## 🔒 Sicurezza

Segnala vulnerabilità privatamente a: [info@nicolocarello.it](mailto:info@nicolocarello.it)

Non aprire issue pubbliche per problemi di sicurezza.

Vedi [SECURITY.md](./SECURITY.md) per dettagli.

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**.
Vedi [LICENSE.md](./LICENSE.md) per i dettagli.

```
MIT License - Copyright (c) 2025 Nicolo Carello
```

---

## 👤 Autore

**Prof. Nicolo Carello**

- 🌐 Website: [nicolocarello.it](https://nicolocarello.it)
- ✉️ Email: [info@nicolocarello.it](mailto:info@nicolocarello.it)
- 💼 GitHub: [@carellonicolo](https://github.com/carellonicolo)

*Professore abilitato per la scuola superiore ai sensi dell'art. 3 comma 8 del D.M 205/2023 – D.D.G. 3059/2024*

---

## 🙏 Ringraziamenti

- [shadcn/ui](https://ui.shadcn.com/) - Componenti UI accessibili
- [Lucide](https://lucide.dev/) - Icone SVG ottimizzate
- [@dnd-kit](https://dnd-kit.com/) - Drag & drop performante
- [Supabase](https://supabase.com/) - Backend potente
- Community Open Source 💙

---

## 📊 Statistiche

![Languages](https://img.shields.io/github/languages/count/carellonicolo/carello-hub?style=flat-square)
![Top Language](https://img.shields.io/github/languages/top/carellonicolo/carello-hub?style=flat-square)
![Code Size](https://img.shields.io/github/languages/code-size/carellonicolo/carello-hub?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/carellonicolo/carello-hub?style=flat-square)

---

<div align="center">

**⭐ Se questo progetto ti è stato utile, lascia una stella! ⭐**

*Sviluppato con ❤️ e AI per l'educazione del futuro*

[⬆ Torna su](#-carello-hub---dashboard-educativa-ai-powered)

</div>
