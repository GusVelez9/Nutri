// frontend/src/store/useAppStore.ts
import { create } from 'zustand';



interface AppStore {
    entrenamiento: string | null;
    presupuesto: string | null;
    dbData: any | null; // Aquí vivirá todo nuestro catálogo offline
    isLoaded: boolean;
    setPresupuesto: (presupuesto: string) => void;
    setEntrenamiento: (entrenamiento: string) => void;
    fetchDatabase: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
    entrenamiento: null,
    presupuesto: null,
    dbData: null,
    isLoaded: false,
    setPresupuesto: (presupuesto) => set({ presupuesto }),
    setEntrenamiento: (entrenamiento) => set({ entrenamiento }),

    // Esta función hace la magia de conectarse al backend
    fetchDatabase: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/sync');
            const result = await response.json();

            if (result.status === 'success') {
                set({ dbData: result.data, isLoaded: true });
                console.log("✅ ¡Catálogo descargado y listo para modo offline!", result.data);
            }
        } catch (error) {
            console.error("❌ Error conectando al backend:", error);
        }
    }
}));