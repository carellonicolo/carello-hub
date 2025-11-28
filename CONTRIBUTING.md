# Guida ai Contributi

Grazie per l'interesse a contribuire a **Carello Hub**! 🎉

Questo progetto è open source e accoglie contributi di tutti: studenti, insegnanti, sviluppatori e chiunque sia interessato all'educazione e all'IA.

---

## 📋 Indice

- [Come Posso Contribuire?](#come-posso-contribuire)
- [Segnalare Bug](#-segnalare-bug)
- [Proporre Nuove Feature](#-proporre-nuove-feature)
- [Contribuire con Codice](#-contribuire-con-codice)
- [Convenzioni di Codice](#-convenzioni-di-codice)
- [Processo di Review](#-processo-di-review)
- [Community Guidelines](#-community-guidelines)

---

## Come Posso Contribuire?

Ci sono molti modi per contribuire al progetto:

### 🐛 Segnalare Bug
Hai trovato un problema? Apri una [issue](https://github.com/carellonicolo/carello-hub/issues/new).

### 💡 Proporre Feature
Hai un'idea per migliorare il progetto? Apri una [Discussion](https://github.com/carellonicolo/carello-hub/discussions/new?category=ideas).

### 📝 Migliorare la Documentazione
Documentazione chiara = progetto accessibile. PR per README, guide e commenti sono benvenute!

### 🔧 Scrivere Codice
Risolvi bug, implementa feature, ottimizza performance. Ogni contributo conta!

### 🎨 Design & UI/UX
Suggerimenti per migliorare l'interfaccia e l'esperienza utente.

### 🧪 Testing
Testa l'applicazione, segnala problemi, suggerisci test automatici.

---

## 🐛 Segnalare Bug

### Prima di Aprire una Issue

1. **Cerca issue esistenti** - Il bug potrebbe essere già stato segnalato
2. **Verifica la versione** - Usa l'ultima versione del progetto
3. **Raccogli informazioni** - Prepara dettagli su come riprodurre il bug

### Template Issue Bug

```markdown
## Descrizione del Bug
[Descrizione chiara e concisa del problema]

## Passi per Riprodurre
1. Vai a '...'
2. Clicca su '...'
3. Scrolla fino a '...'
4. Vedi errore

## Comportamento Atteso
[Cosa ti aspettavi che succedesse]

## Comportamento Effettivo
[Cosa è successo invece]

## Screenshot
[Se applicabile, aggiungi screenshot per aiutare a spiegare il problema]

## Ambiente
- **OS**: [es. macOS 14.0, Windows 11, Ubuntu 22.04]
- **Browser**: [es. Chrome 120, Firefox 121, Safari 17]
- **Node Version**: [es. v18.17.0]
- **npm Version**: [es. 9.6.7]

## Log/Errori Console
\`\`\`
[Incolla qui eventuali errori dalla console del browser o terminal]
\`\`\`

## Informazioni Aggiuntive
[Qualsiasi altra informazione che potrebbe essere rilevante]
```

---

## 💡 Proporre Nuove Feature

### Template Feature Request

Apri una [Discussion](https://github.com/carellonicolo/carello-hub/discussions/new?category=ideas):

```markdown
## Problema da Risolvere
[Quale problema risolve questa feature? Perché è importante?]

## Soluzione Proposta
[Come dovrebbe funzionare la feature? Descrivi il comportamento desiderato]

## Alternative Considerate
[Hai considerato altre soluzioni? Quali sono i pro e contro?]

## Use Case
[Fornisci esempi concreti di come questa feature verrebbe utilizzata]

## Mockup/Wireframe (Opzionale)
[Se hai sketch, mockup o wireframe, allegarli qui]

## Impatto
- [ ] Questa feature richiede breaking changes
- [ ] Questa feature richiede modifiche al database
- [ ] Questa feature richiede nuove dipendenze

## Disponibilità a Contribuire
- [ ] Sono disponibile a implementare questa feature
- [ ] Posso aiutare con testing/documentazione
- [ ] Solo suggerimento, non posso contribuire all'implementazione
```

---

## 🔧 Contribuire con Codice

### Setup Ambiente di Sviluppo

#### 1. Fork & Clone

```bash
# Fork il repository su GitHub tramite l'interfaccia web, poi:
git clone https://github.com/TUO-USERNAME/carello-hub.git
cd carello-hub

# Aggiungi upstream remote per sincronizzare con il repo originale
git remote add upstream https://github.com/carellonicolo/carello-hub.git

# Verifica i remote
git remote -v
```

#### 2. Installa Dipendenze

```bash
npm install
```

#### 3. Configura Supabase

Crea un progetto Supabase di test e configura `.env`:

```env
VITE_SUPABASE_URL=your-test-project-url
VITE_SUPABASE_ANON_KEY=your-test-anon-key
```

#### 4. Avvia Dev Server

```bash
npm run dev
```

### Workflow di Sviluppo

#### 1. Crea un Branch

```bash
# Sincronizza con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crea branch feature/bug
git checkout -b feature/nome-feature
# oppure
git checkout -b fix/nome-bug
```

**Convenzioni Branch:**
- `feature/` - Nuove funzionalità
- `fix/` - Bug fix
- `docs/` - Modifiche documentazione
- `refactor/` - Refactoring senza cambiare funzionalità
- `perf/` - Miglioramenti performance
- `test/` - Aggiunta/modifica test

#### 2. Sviluppa

Fai le tue modifiche seguendo le [Convenzioni di Codice](#-convenzioni-di-codice).

#### 3. Commit

Usa **[Conventional Commits](https://www.conventionalcommits.org/)**:

```bash
# Formato
<type>(<scope>): <description>

# Types
feat:     Nuova feature
fix:      Bug fix
docs:     Solo documentazione
style:    Formattazione (no logic change)
refactor: Refactoring
perf:     Performance improvement
test:     Aggiunta test
chore:    Manutenzione (deps, config, build)

# Esempi
git commit -m "feat(apps): add search functionality to dashboard"
git commit -m "fix(auth): resolve infinite redirect loop on login"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(hooks): extract auth logic to custom hook"
git commit -m "perf(index): optimize app list rendering with memo"
```

**Commit Guidelines:**
- Usa l'imperativo ("add" non "added")
- Prima riga max 72 caratteri
- Body opzionale per spiegare il "perché"
- Footer per breaking changes o issue references

Esempio commit completo:
```bash
git commit -m "feat(apps): add fuzzy search

Implement fuzzy search algorithm for app filtering.
Users can now search apps by name with typo tolerance.

Closes #42"
```

#### 4. Push

```bash
git push origin feature/nome-feature
```

#### 5. Apri Pull Request

Vai su GitHub e apri una PR usando questo template:

```markdown
## Descrizione
[Descrizione chiara delle modifiche e del problema risolto]

## Tipo di Cambiamento
- [ ] Bug fix (non-breaking change che risolve un issue)
- [ ] Nuova feature (non-breaking change che aggiunge funzionalità)
- [ ] Breaking change (fix o feature che causa breaking)
- [ ] Documentazione
- [ ] Refactoring
- [ ] Performance improvement

## Come Testare
1. [Passo 1]
2. [Passo 2]
3. [Verificare che...]

## Checklist
- [ ] Il codice segue le convenzioni del progetto
- [ ] Ho eseguito linting senza errori (`npm run lint`)
- [ ] TypeScript compila senza errori (`npm run build`)
- [ ] Ho testato le modifiche localmente
- [ ] Ho aggiornato la documentazione se necessario
- [ ] Le modifiche non generano nuovi warning
- [ ] Ho testato su browser multipli (Chrome, Firefox, Safari)
- [ ] Le modifiche sono responsive (mobile, tablet, desktop)

## Screenshot/Video (se applicabile)
[Aggiungi screenshot o video delle modifiche UI]

## Note per i Reviewer
[Eventuali note particolari per chi farà review]

## Issue Correlate
Closes #[numero-issue]
```

---

## 📝 Convenzioni di Codice

### TypeScript/JavaScript

#### Naming Conventions

```typescript
// ✅ Componenti React: PascalCase
const AppIcon = () => { }
const StatusBar = () => { }

// ✅ Hooks: camelCase con prefisso "use"
const useApps = () => { }
const useAuth = () => { }

// ✅ Costanti: UPPER_SNAKE_CASE
const MAX_APP_NAME_LENGTH = 20;
const DEFAULT_COLOR = "hsl(217, 91%, 60%)";

// ✅ Funzioni: camelCase
const calculatePosition = () => { }
const formatDate = () => { }

// ✅ Interfacce/Types: PascalCase (con "Props" suffix per props)
interface App {
  id: string;
  name: string;
}

interface AppIconProps {
  iconName: string;
  color: string;
}

// ✅ Enums: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

#### Best Practices

```typescript
// ❌ Evita - any types
const [data, setData] = useState<any>(null);

// ✅ Preferisci - tipi espliciti
const [data, setData] = useState<App[] | null>(null);

// ❌ Evita - optional chaining mancante
return <div>{data.map(...)}</div>;

// ✅ Preferisci - gestione null/undefined
if (!data) return <LoadingSpinner />;
return <div>{data.map(...)}</div>;

// ❌ Evita - dipendenze useEffect mancanti
useEffect(() => {
  fetchData(userId);
}); // warning: missing dependencies

// ✅ Preferisci - dipendenze corrette
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ Evita - prop drilling
<Child userId={userId} userName={userName} userEmail={userEmail} ... />

// ✅ Preferisci - oggetto o context
<Child user={user} />
// oppure
<UserContext.Provider value={user}>

// ✅ Usa React.memo per componenti costosi
export const AppIcon = memo(({ iconName, label }: Props) => {
  // ...
});

// ✅ Usa useMemo per calcoli costosi
const sortedApps = useMemo(
  () => apps.sort((a, b) => a.position - b.position),
  [apps]
);

// ✅ Usa useCallback per funzioni passate come props
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### CSS/Tailwind

```tsx
// ✅ Usa Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-primary text-white">

// ✅ Raggruppa classi correlate
<div className="
  flex items-center justify-center
  w-full h-screen
  bg-gradient-to-r from-primary to-secondary
  text-white font-bold
">

// ✅ Usa arbitrary values quando necessario
<div className="w-[104px] h-[104px] max-w-[130px]">

// ❌ Evita - style inline quando possibile usare Tailwind
<div style={{ width: '104px', height: '104px' }}>

// ✅ Eccezione - stili dinamici o valori da props
<div style={{ background: color }}>
```

### File Structure

```
src/
├── components/
│   ├── AppIcon.tsx           # PascalCase per componenti
│   └── app-management/       # kebab-case per cartelle
│       ├── AppCard.tsx
│       └── ColorPicker.tsx
├── hooks/
│   ├── useApps.ts            # camelCase per hooks
│   └── useAuth.tsx
├── lib/
│   └── utils.ts              # kebab-case per utilities
└── pages/
    └── Index.tsx             # PascalCase per pages/routes
```

---

## 🔍 Processo di Review

### Cosa Aspettarsi

1. **Automated Checks** - GitHub Actions eseguirà:
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Build test

2. **Human Review** - Un maintainer reviewerà:
   - Qualità del codice
   - Aderenza alle convenzioni
   - Test coverage
   - Documentazione

3. **Feedback** - Potremmo richiedere modifiche:
   - Sii aperto al feedback
   - Discuti in modo costruttivo
   - Fai domande se qualcosa non è chiaro

4. **Merge** - Una volta approvata, la PR verrà mergiata!

### Tempi di Review

- **Bug critici**: 1-2 giorni
- **Feature**: 3-7 giorni
- **Documentazione**: 1-3 giorni

> 💡 **Tip**: PR piccole e focalizzate vengono reviewate più velocemente!

---

## 🤝 Community Guidelines

### Codice di Condotta

#### ✅ Comportamenti Incoraggiati

- **Sii rispettoso** - Tratta tutti con gentilezza e rispetto
- **Sii inclusivo** - Accoglie contributori di tutti i background
- **Sii costruttivo** - Fornisci feedback utile e specifico
- **Sii paziente** - Non tutti hanno lo stesso livello di esperienza
- **Sii professionale** - Mantieni un tono cordiale nelle discussioni

#### ❌ Comportamenti Non Accettabili

- **Molestie** - Di qualsiasi tipo verso chiunque
- **Discriminazione** - Basata su età, genere, etnia, religione, etc.
- **Trolling** - Commenti provocatori o off-topic
- **Spam** - Pubblicità non richiesta o contenuti ripetitivi
- **Violenza** - Minacce o linguaggio violento

### Reporting

Se osservi o subisci comportamenti inappropriati:
- 📧 Email privata: info@nicolocarello.it
- Tutte le segnalazioni verranno trattate con riservatezza

---

## 💬 Hai Domande?

### Canali di Supporto

- 📖 **Documentazione**: Leggi il [README.md](./README.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/carellonicolo/carello-hub/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/carellonicolo/carello-hub/issues)
- 📧 **Email**: info@nicolocarello.it

### FAQ

**Q: È il mio primo contributo open source. Da dove inizio?**
A: Benvenuto! Inizia con issue etichettate "good first issue" o "help wanted". Non esitare a fare domande!

**Q: Posso lavorare su una feature non ancora approvata?**
A: È meglio aprire prima una Discussion per discutere la feature. Così evitiamo lavoro su cose che potrebbero non essere accettate.

**Q: Quanto tempo ci vuole per una review?**
A: Dipende dalla complessità. In generale 1-7 giorni. Se passano più di 7 giorni, fai un ping gentile sulla PR.

**Q: La mia PR è stata rifiutata. E ora?**
A: Non scoraggiarti! Leggi il feedback, fai domande, e considera di aprire una nuova PR con le modifiche richieste.

**Q: Posso contribuire se non sono uno sviluppatore?**
A: Assolutamente! Documentazione, design, testing, traduzioni sono tutti contributi preziosi.

---

## 🙏 Grazie!

Ogni contributo, grande o piccolo, è apprezzato. Insieme possiamo rendere questo progetto migliore per tutti!

**Happy Contributing! 🎉**

---

*Ultima modifica: Gennaio 2025*
