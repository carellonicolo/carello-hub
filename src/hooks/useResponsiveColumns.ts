import { useState, useEffect } from 'react';

/**
 * Hook per calcolare dinamicamente il numero di colonne in base alle dimensioni della finestra
 * Considera sia larghezza che altezza per ottimizzare lo spazio disponibile
 */
export const useResponsiveColumns = () => {
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const calculateColumns = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Logica basata sulla larghezza (standard)
            let cols = 3; // default mobile

            if (width >= 1024) {
                cols = 5; // lg screens
            } else if (width >= 768) {
                cols = 4; // md screens
            }

            // Adatta le colonne in base all'altezza dello schermo
            // Se lo schermo è basso, aumenta le colonne per distribuire orizzontalmente
            if (height < 700) {
                // Schermi molto bassi: aumenta significativamente le colonne
                cols = Math.min(cols + 2, 6);
            } else if (height < 900) {
                // Schermi mediamente bassi: aumenta di 1 colonna
                cols = Math.min(cols + 1, 6);
            }

            setColumns(cols);
        };

        // Calcola inizialmente
        calculateColumns();

        // Ricalcola al resize della finestra
        window.addEventListener('resize', calculateColumns);

        return () => window.removeEventListener('resize', calculateColumns);
    }, []);

    return columns;
};
