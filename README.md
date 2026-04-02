# Carello Hub

> Dashboard educativa per l'organizzazione e l'accesso a strumenti didattici

[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![GitHub stars](https://img.shields.io/github/stars/carellonicolo/carello-hub?style=social)](https://github.com/carellonicolo/carello-hub)
[![GitHub issues](https://img.shields.io/github/issues/carellonicolo/carello-hub)](https://github.com/carellonicolo/carello-hub/issues)

## Panoramica

Carello Hub e una dashboard educativa moderna per organizzare e accedere rapidamente a tutti gli strumenti didattici della collezione. Funziona come un portale centralizzato che raggruppa simulatori, calcolatori e applicazioni educative in un'interfaccia drag-and-drop personalizzabile, con autenticazione utente e sincronizzazione in tempo reale tramite Supabase.

La piattaforma e pensata per educatori e sviluppatori che desiderano un punto di accesso unico alle proprie risorse didattiche, con la possibilita di riorganizzare e personalizzare la disposizione delle applicazioni.

## Funzionalita Principali

- **Dashboard personalizzabile** — Disposizione delle app con drag-and-drop grazie a @dnd-kit
- **Autenticazione** — Login e gestione utenti tramite Supabase Auth
- **Sincronizzazione real-time** — Le personalizzazioni vengono salvate e sincronizzate in tempo reale
- **Ruoli utente** — Supporto per ruoli admin e utente standard
- **Ricerca** — Filtro rapido tra le applicazioni disponibili
- **Tema chiaro/scuro** — Supporto completo per dark mode
- **Responsive** — Ottimizzato per desktop, tablet e mobile

## Tech Stack

| Tecnologia | Utilizzo |
|:--|:--|
| ![React](https://img.shields.io/badge/React_18-61dafb?logo=react&logoColor=white) | Framework UI |
| ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?logo=typescript&logoColor=white) | Linguaggio tipizzato |
| ![Vite](https://img.shields.io/badge/Vite_5-646cff?logo=vite&logoColor=white) | Build tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white) | Styling |
| ![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white) | Backend e Auth |
| ![React Query](https://img.shields.io/badge/React_Query-ff4154) | Data fetching |
| ![dnd-kit](https://img.shields.io/badge/dnd--kit-6c63ff) | Drag and drop |

## Requisiti

- **Node.js** >= 18
- **npm** >= 9 (oppure bun)
- **Supabase** — Un progetto Supabase configurato (per le funzionalita di backend)

## Installazione

```bash
git clone https://github.com/carellonicolo/carello-hub.git
cd carello-hub
npm install
npm run dev
```

L'applicazione sara disponibile su `http://localhost:8080`.

## Utilizzo

1. Accedi con le tue credenziali o crea un nuovo account
2. Visualizza la dashboard con tutte le applicazioni disponibili
3. Trascina e riordina le app secondo le tue preferenze
4. Clicca su un'app per accedere direttamente allo strumento

## Struttura del Progetto

```
carello-hub/
├── src/
│   ├── components/     # Componenti React (cards, dashboard, layout)
│   ├── lib/            # Client Supabase e utilities
│   ├── pages/          # Pagine dell'applicazione
│   └── hooks/          # Custom hooks
├── public/             # Asset statici
├── index.html          # Entry point HTML
└── vite.config.ts      # Configurazione Vite
```

## Deploy

```bash
npm run build
```

Deployabile su Vercel (consigliato), Cloudflare Pages o Netlify. Richiede le variabili d'ambiente Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Contribuire

I contributi sono benvenuti! Consulta le [linee guida per contribuire](CONTRIBUTING.md) per maggiori dettagli.

## Licenza

Distribuito con licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli completi.

## Autore

**Nicolo Carello**
- GitHub: [@carellonicolo](https://github.com/carellonicolo)
- Website: [nicolocarello.it](https://nicolocarello.it)

---

<sub>Sviluppato con l'ausilio dell'intelligenza artificiale.</sub>

## Progetti Correlati

Questo progetto fa parte di una collezione di strumenti didattici e applicazioni open-source:

| Progetto | Descrizione |
|:--|:--|
| [DFA Visual Editor](https://github.com/carellonicolo/AFS) | Editor visuale per automi DFA |
| [Turing Machine](https://github.com/carellonicolo/Turing-Machine) | Simulatore di Macchina di Turing |
| [Scheduler](https://github.com/carellonicolo/Scheduler) | Simulatore di scheduling CPU |
| [Subnet Calculator](https://github.com/carellonicolo/Subnet) | Calcolatore subnet IPv4/IPv6 |
| [Base Converter](https://github.com/carellonicolo/base-converter) | Suite di conversione multi-funzionale |
| [Gioco del Lotto](https://github.com/carellonicolo/giocodellotto) | Simulatore Lotto e SuperEnalotto |
| [MicroASM](https://github.com/carellonicolo/microasm) | Simulatore assembly |
| [Flow Charts](https://github.com/carellonicolo/flow-charts) | Editor di diagrammi di flusso |
| [Cypher](https://github.com/carellonicolo/cypher) | Toolkit di crittografia |
| [Snake](https://github.com/carellonicolo/snake) | Snake game retro |
| [Pong](https://github.com/carellonicolo/pongcarello) | Pong game |
| [Calculator](https://github.com/carellonicolo/calculator-carello) | Calcolatrice scientifica |
| [IPSC Score](https://github.com/carellonicolo/IPSC) | Calcolatore punteggi IPSC |
| [Quiz](https://github.com/carellonicolo/quiz) | Piattaforma quiz scolastici |
| [Prof Carello](https://github.com/carellonicolo/prof-carello) | Gestionale lezioni private |
| [DOCSITE](https://github.com/carellonicolo/DOCSITE) | Piattaforma documentale |
