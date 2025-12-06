import { useState } from "react";
import { Info, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProjectInfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating buttons in bottom left - always visible */}
      <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 flex items-center gap-2">
        <Button
          onClick={() => setIsOpen(true)}
          className="group shadow-2xl bg-primary/90 hover:bg-primary backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          size="lg"
        >
          <Info className="h-5 w-5 md:group-hover:mr-2 transition-all duration-300" />
          <span className="hidden md:inline md:max-w-0 md:overflow-hidden md:group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Scopri il Progetto
          </span>
        </Button>
        
        <Button
          asChild
          className="group shadow-2xl bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 border border-foreground/20"
          size="lg"
        >
          <a href="https://github.com/carellonicolo/carello-hub" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 md:group-hover:mr-2 transition-all duration-300" />
            <span className="hidden md:inline md:max-w-0 md:overflow-hidden md:group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              GitHub
            </span>
          </a>
        </Button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Scopri il Progetto
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
              <p className="text-foreground/90">
                Questa dashboard rappresenta un progetto innovativo che dimostra il potenziale dell'<strong>Intelligenza Artificiale</strong> applicata alla didattica e al lavoro quotidiano.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <h3 className="font-semibold text-lg mb-2 text-foreground">🎯 Obiettivo del Progetto</h3>
                <p className="text-foreground/80">
                  Utilizzare strumenti di AI generativa per creare applicazioni pratiche e funzionali che supportano:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>L'insegnamento e l'apprendimento in classe</li>
                  <li>La gestione efficiente delle attività quotidiane</li>
                  <li>L'accessibilità agli strumenti digitali</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <h3 className="font-semibold text-lg mb-2 text-foreground">💡 Perché l'IA?</h3>
                <p className="text-foreground/80">
                  L'Intelligenza Artificiale non è solo una tecnologia del futuro, ma uno <strong>strumento pratico per il presente</strong>. Questo progetto dimostra come l'IA possa:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>Accelerare lo sviluppo di soluzioni personalizzate</li>
                  <li>Rendere accessibili competenze tecniche avanzate</li>
                  <li>Migliorare la produttività nelle attività quotidiane</li>
                  <li>Favorire l'innovazione nella didattica moderna</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 p-4 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-lg mb-2 text-foreground">🚀 Applicazioni Pratiche</h3>
                <p className="text-foreground/80">
                  Ogni applicazione in questa dashboard è stata progettata per risolvere esigenze concrete in ambito educativo e professionale, dimostrando l'efficacia dell'IA come assistente intelligente nella creazione di strumenti digitali.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
                <h3 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  Open Source & Collaborazione
                </h3>
                <p className="text-foreground/80 mb-3">
                  Il codice sorgente di ogni applicazione è <strong>pubblicamente disponibile su GitHub</strong>. Questo progetto è completamente open source e ogni contributo è benvenuto!
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  <li>Contribuisci ad estendere le funzionalità</li>
                  <li>Migliora l'accessibilità per tutti</li>
                  <li>Condividi idee e proposte innovative</li>
                  <li>Rendi il progetto più utile per la comunità educativa</li>
                </ul>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Scopo del Progetto
                </h3>
                <p className="text-foreground/80">
                  Questo è un progetto <strong>senza scopo di lucro</strong>, nato con finalità esclusivamente <strong>didattiche e divulgative</strong>. L'obiettivo principale è promuovere la <strong>consapevolezza nell'utilizzo dell'Intelligenza Artificiale</strong>, dimostrando come questa tecnologia possa essere uno strumento accessibile, etico e utile per migliorare l'apprendimento e il lavoro quotidiano.
                </p>
              </div>

              <p className="text-sm text-muted-foreground italic pt-2 border-t border-border/50">
                Progetto sviluppato con il supporto di strumenti di AI generativa per dimostrare il potenziale della tecnologia nell'innovazione didattica e professionale.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectInfoButton;
