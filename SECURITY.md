# Security Policy

## 🔒 Reporting a Vulnerability

La sicurezza di **Carello Hub** è una priorità. Se scopri una vulnerabilità di sicurezza, ti chiediamo di aiutarci a proteggere gli utenti seguendo questa procedura.

### 📧 Come Segnalare

**NON aprire una issue pubblica su GitHub** per problemi di sicurezza.

Invia invece una segnalazione privata a:
- **Email**: [info@nicolocarello.it](mailto:info@nicolocarello.it)
- **Oggetto**: `[SECURITY] Vulnerabilità in Carello Hub`

### 📝 Cosa Includere nella Segnalazione

Per aiutarci a comprendere e risolvere rapidamente il problema, includi:

1. **Descrizione della Vulnerabilità**
   - Tipo di vulnerabilità (XSS, SQL Injection, CSRF, etc.)
   - Impatto potenziale
   - Componenti/file interessati

2. **Passi per Riprodurre**
   - Istruzioni dettagliate step-by-step
   - Screenshot o video se utili
   - Payload o proof-of-concept (se applicabile)

3. **Ambiente**
   - Versione del progetto
   - Browser/OS
   - Configurazione Supabase (se rilevante)

4. **Impatto Stimato**
   - Gravità (Critica, Alta, Media, Bassa)
   - Numero di utenti potenzialmente affetti
   - Possibilità di exploit remoto

### ⏱️ Tempi di Risposta

- **Conferma ricezione**: Entro 48 ore
- **Analisi iniziale**: Entro 7 giorni
- **Fix e rilascio patch**: Variabile in base alla gravità
  - **Critica**: 1-7 giorni
  - **Alta**: 7-14 giorni
  - **Media**: 14-30 giorni
  - **Bassa**: 30-60 giorni

### 🎖️ Riconoscimenti

I ricercatori di sicurezza che segnalano vulnerabilità in modo responsabile verranno:
- Ringraziati pubblicamente (se lo desiderano)
- Menzionati nel changelog della patch
- Aggiunti alla lista dei contributori

Se preferisci rimanere anonimo, rispetteremo la tua scelta.

---

## 🛡️ Vulnerabilità Note

### Vulnerabilità Corrette

#### [2025-01-28] HIGH - Glob Package Vulnerability
- **CVE**: Related to glob package
- **Impatto**: Potenziale DoS in fase di build
- **Fix**: Aggiornamento dipendenze via `npm audit fix`
- **Versione Fixata**: Current
- **Riferimento**: Commit e509e38

### Vulnerabilità Monitorate (Non Critiche)

#### Moderate - esbuild (v0.21.3) / optionalDependencies
- **Impatto**: Solo ambiente di sviluppo
- **Stato**: Monitorato, aggiornamento programmato
- **Mitigazione**: Non esposto in produzione

---

## 🔐 Best Practices di Sicurezza

### Per Contributori

#### 1. Non Committare Segreti
❌ **MAI** committare:
- File `.env` con credenziali reali
- API keys
- Token di accesso
- Password o hash
- Certificati privati

✅ Usa `.env.example` con valori placeholder.

#### 2. Validazione Input
```typescript
// ❌ BAD - No validation
const updateApp = (name: string) => {
  db.execute(`UPDATE apps SET name = '${name}'`); // SQL Injection!
}

// ✅ GOOD - Use prepared statements
const updateApp = (name: string) => {
  supabase.from('apps').update({ name }).eq('id', id);
}
```

#### 3. Sanitizzazione Output
```typescript
// ❌ BAD - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - Escaped by React
<div>{userInput}</div>
```

#### 4. Autenticazione e Autorizzazione
- ✅ Usa sempre Row Level Security (RLS) in Supabase
- ✅ Valida i permessi lato server, non solo client
- ✅ Implementa rate limiting per API sensibili

#### 5. Dipendenze
- ✅ Esegui `npm audit` regolarmente
- ✅ Mantieni dipendenze aggiornate
- ✅ Usa `package-lock.json` per build riproducibili

### Per Utenti Finali

#### 1. Configurazione Supabase
- ✅ Usa RLS su tutte le tabelle
- ✅ Limita i permessi dell'anon key
- ✅ Abilita MFA per account admin
- ✅ Monitora i log di accesso

#### 2. Deploy Sicuro
```bash
# ❌ Non esporre variabili sensibili
VITE_SUPABASE_SERVICE_ROLE_KEY=xxx # Mai in frontend!

# ✅ Solo chiavi pubbliche
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx # Questa è sicura, ha RLS
```

#### 3. HTTPS Obbligatorio
- ✅ Usa sempre HTTPS in produzione
- ✅ Configura HSTS headers
- ✅ Forza redirect HTTP → HTTPS

---

## 🔍 Security Checklist

### Pre-Deploy Checklist

- [ ] `npm audit` eseguito e vulnerabilità critiche risolte
- [ ] Nessun segreto committato nel repository
- [ ] File `.env` in `.gitignore`
- [ ] RLS abilitato su tutte le tabelle Supabase
- [ ] HTTPS configurato
- [ ] Headers di sicurezza configurati (CSP, HSTS, X-Frame-Options)
- [ ] Input validation implementata su tutti i form
- [ ] Output escaping verificato
- [ ] Autenticazione testata
- [ ] Autorizzazione testata (user/admin roles)
- [ ] Rate limiting configurato (se applicabile)
- [ ] Backup database configurato
- [ ] Monitoring e alerting attivo

### Post-Deploy Monitoring

- [ ] Log di accesso monitorati
- [ ] Errori di autenticazione tracciati
- [ ] Tentativi di SQL injection/XSS loggati
- [ ] Performance anomale investigate
- [ ] Aggiornamenti di sicurezza applicati tempestivamente

---

## 📚 Risorse Utili

### OWASP Top 10 (2021)
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

### Link Utili
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [React Security Best Practices](https://react.dev/learn/escape-hatches#security-pitfalls)
- [npm Security Best Practices](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)

---

## 🤝 Security Contact

- **Email**: [info@nicolocarello.it](mailto:info@nicolocarello.it)
- **PGP Key**: Available on request
- **Response Time**: Entro 48 ore per segnalazioni critiche

---

## 📄 Disclosure Policy

Questo progetto segue una **Responsible Disclosure Policy**:

1. Segnala privatamente la vulnerabilità
2. Attendiamo almeno 90 giorni prima di disclosure pubblica
3. Coordiniamo la disclosure con il reporter
4. Rilasciamo una patch prima della disclosure pubblica
5. Pubblichiamo un security advisory post-fix

Rispettare questa policy protegge gli utenti e permette di fixare i problemi prima che vengano sfruttati.

---

## 🙏 Grazie

Grazie per aiutare a mantenere **Carello Hub** sicuro per tutti!

---

*Ultima modifica: Gennaio 2025*
