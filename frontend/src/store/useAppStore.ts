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
            const response = await fetch('https://nutri-j3ph.onrender.com/api/sync');
            const result = await response.json();

            if (result.status === 'success') {
                return result.data;
            }

        } catch (error) {
            console.error("Error fetching database:", error);
        }
    }    
}));
