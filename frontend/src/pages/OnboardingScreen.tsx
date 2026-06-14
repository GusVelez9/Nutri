import { ArrowLeft, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function OnboardingScreen() {
    const navigate = useNavigate();
    const { setEntrenamiento, setPresupuesto } = useAppStore();
    const [presupuestoInput, setPresupuestoInput] = useState('');
    const [error, setError] = useState('');

    const handlePresupuestoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Solo permite números y como máximo un punto decimal
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            setPresupuestoInput(val);
            setError(''); // Limpia el error al escribir
        }
    };

    const handleSelection = (tipo: string) => {
        const presupuestoNum = parseFloat(presupuestoInput);
        if (isNaN(presupuestoNum) || presupuestoNum <= 0) {
            setError('Por favor, ingresa un presupuesto válido mayor a 0.');
            return;
        }
        
        setPresupuesto(presupuestoInput);
        setEntrenamiento(tipo);
        navigate('/dashboard');
    };

    const rutinas = [
        { id: 'pecho', nombre: 'Pecho y Tríceps', color: 'bg-blue-100 text-blue-700' },
        { id: 'piernas', nombre: 'Día de Piernas', color: 'bg-orange-100 text-orange-700' },
        { id: 'cardio', nombre: 'Cardio / HIIT', color: 'bg-red-100 text-red-700' },
        { id: 'descanso', nombre: 'Descanso Activo', color: 'bg-purple-100 text-purple-700' },
    ];

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 p-6 flex flex-col max-w-md mx-auto"
        >
            <button onClick={() => navigate(-1)} className="mb-8 text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft size={28} />
            </button>

            <h2 className="text-3xl font-black text-gray-800 mb-2">¿Qué entrenaste hoy?</h2>
            <p className="text-gray-500 mb-6 text-lg">Ajustaremos tus macros y presupuesto al instante.</p>

            <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-2">¿Cuál es tu presupuesto semanal?</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input 
                        type="text" 
                        value={presupuestoInput}
                        onChange={handlePresupuestoChange}
                        placeholder="Ej. 25.50" 
                        className={`w-full bg-white border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-2xl py-4 pl-8 pr-4 font-bold text-lg text-gray-800 outline-none focus:ring-2 transition-all shadow-sm`}
                    />
                </div>
                {error && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-red-500 text-sm font-bold mt-2"
                    >
                        {error}
                    </motion.p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {rutinas.map((rutina) => (
                    <button
                        key={rutina.id}
                        onClick={() => handleSelection(rutina.nombre)}
                        className={`${rutina.color} p-6 rounded-2xl font-bold text-xl flex justify-between items-center active:scale-95 transition-transform shadow-sm`}
                    >
                        {rutina.nombre}
                        <Dumbbell size={24} />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}