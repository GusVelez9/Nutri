// frontend/src/pages/ImpactScreen.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function ImpactScreen() {
    const navigate = useNavigate();
    const { fetchDatabase, isLoaded } = useAppStore();

    useEffect(() => {
        fetchDatabase();
    }, [fetchDatabase]);

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6"
        >
            {/* Encabezado */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-black text-green-600 tracking-tight mb-2">
                    NutriESPE
                </h1>

                <p className="text-xl text-gray-600 font-medium">
                    Tu dieta y bolsillo bajo control
                </p>
            </div>

            {/* Métricas de Impacto */}
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md mb-8 border border-gray-100">

                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
                    <span className="text-gray-500 font-semibold text-lg">
                        Usuarios Activos
                    </span>

                    <span className="text-3xl font-black text-gray-800">
                        25
                    </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
                    <span className="text-gray-500 font-semibold text-lg">
                        Planes Generados
                    </span>

                    <span className="text-3xl font-black text-blue-500">
                        560
                    </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
                    <span className="text-gray-500 font-semibold text-lg">
                        Ahorro Promedio
                    </span>

                    <span className="text-3xl font-black text-green-500">
                        30%
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold text-lg">
                        CO₂ Reducido
                    </span>

                    <span className="text-3xl font-black text-cyan-500">
                        180 kg
                    </span>
                </div>

            </div>

            {/* Mensaje adicional */}
            <div className="text-center mb-8">
                <p className="text-gray-500">
                    Más de <strong>560 planes nutricionales</strong> generados
                    para estudiantes y deportistas.
                </p>

                <p className="text-gray-500 mt-2">
                    Ahorro colectivo estimado superior a <strong>$1250</strong>.
                </p>
            </div>

            {/* Botón */}
            <button
                onClick={() => navigate('/onboarding')}
                disabled={!isLoaded}
                className={`font-bold text-xl py-5 px-8 rounded-2xl shadow-lg active:scale-95 transition-all w-full max-w-sm flex items-center justify-center gap-2 ${
                    isLoaded
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                {isLoaded ? 'Generar mi Plan Ahora' : 'Cargando catálogo...'}

                <ChevronRight size={24} />
            </button>
        </motion.div>
    );
}