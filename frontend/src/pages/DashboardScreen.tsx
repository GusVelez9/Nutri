import { useState } from 'react';
import { ArrowLeft, Utensils, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function DashboardScreen() {
    const navigate = useNavigate();
    const { entrenamiento, dbData } = useAppStore();
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    // Tomamos la primera receta de nuestra base de datos descargada
    // Buscamos la receta cuyo "tipo_entrenamiento" coincida con el botón que presionó el usuario
    // Buscamos la receta cuyo "tipo_entrenamiento" coincida con el botón que presionó el usuario
    const receta = dbData && dbData.length > 0
        ? dbData.find((r: any) => r.tipo_entrenamiento === entrenamiento) || dbData[0]
        : null;

    // Función auxiliar para asignar unidad de medida lógica según el nombre del ingrediente
    const getUnidad = (nombre: string): string => {
        const n = nombre.toLowerCase();
        if (n.includes('pollo') || n.includes('carne') || n.includes('res') || n.includes('cerdo') || n.includes('pechuga') || n.includes('lomo') || n.includes('filete')) return 'kg';
        if (n.includes('arroz') || n.includes('pasta') || n.includes('fideo') || n.includes('lenteja') || n.includes('frijol') || n.includes('avena') || n.includes('harina') || n.includes('quinoa')) return 'libras';
        if (n.includes('huevo') || n.includes('manzana') || n.includes('banano') || n.includes('banana') || n.includes('naranja') || n.includes('tomate') || n.includes('papa') || n.includes('aguacate') || n.includes('limón') || n.includes('limon') || n.includes('cebolla') || n.includes('zanahoria') || n.includes('plátano') || n.includes('platano')) return 'unidades';
        if (n.includes('leche') || n.includes('agua') || n.includes('aceite') || n.includes('jugo') || n.includes('caldo') || n.includes('yogur') || n.includes('yogurt')) return 'ml';
        if (n.includes('sal') || n.includes('azúcar') || n.includes('azucar') || n.includes('pimienta') || n.includes('canela') || n.includes('comino') || n.includes('orégano') || n.includes('oregano') || n.includes('ajo')) return 'g';
        if (n.includes('queso') || n.includes('mantequilla') || n.includes('jamón') || n.includes('jamon') || n.includes('atún') || n.includes('atun')) return 'g';
        return 'unidades';
    };

    // Calculamos el total estimado restando los ingredientes que ya están marcados
    const calcularTotal = (): string => {
        if (!receta || !receta.receta_ingredientes) return '0.00';
        const total = receta.receta_ingredientes.reduce((sum: number, item: any, index: number) => {
            // Si está marcado, no sumamos su precio al "Total Estimado"
            if (checkedItems[index]) return sum;

            const cantidad = Number(item.cantidad) || 0;
            // Simulamos un precio si no viene de la BD (ej. $1.50)
            const precio = Number(item.ingredientes?.precio_unitario) || 1.50;
            return sum + (cantidad * precio);
        }, 0);
        return total.toFixed(2);
    };

    const handleCheck = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const totalEstimado = calcularTotal();


    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 p-6 flex flex-col max-w-md mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Plan Generado</p>
                    <h2 className="text-2xl font-black text-gray-800">{entrenamiento}</h2>
                </div>
                <button onClick={() => navigate(-1)} className="bg-gray-200 p-2 rounded-full text-gray-600">
                    <ArrowLeft size={20} />
                </button>
            </div>

            {receta ? (
                <>
                    {/* Receta Dinámica desde PostgreSQL */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-3 rounded-xl text-green-600">
                                <Utensils size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{receta.nombre}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 font-medium">
                            Tiempo de prep: <span className="text-gray-800 font-bold">{receta.tiempo_preparacion_min} min</span>
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">{receta.instrucciones}</p>
                    </div>

                    {/* Lista de Compras Dinámica */}
                    <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                        <ShoppingCart size={24} />
                        Lista de Súper
                    </h3>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Sincronizado con Santa María</p>

                        <div className="space-y-4">
                            {/* Aquí hacemos un "mapeo" de los ingredientes que vienen de la base de datos */}
                            {receta.receta_ingredientes.map((item: any, index: number) => {
                                const precioSimulado = Number(item.ingredientes?.precio_unitario) || 1.50;
                                const subtotal = (Number(item.cantidad) * precioSimulado).toFixed(2);
                                
                                return (
                                    <label key={index} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={checkedItems[index] || false}
                                            onChange={() => handleCheck(index)}
                                            className="w-6 h-6 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-all" 
                                        />
                                        <span className={`flex-1 font-medium transition-colors ${checkedItems[index] ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                            {item.cantidad} {getUnidad(item.ingredientes.nombre)} de {item.ingredientes.nombre}
                                        </span>
                                        <span className={`text-sm font-bold transition-colors ${checkedItems[index] ? 'text-gray-300 line-through' : 'text-gray-400'}`}>
                                            ${subtotal}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500 font-semibold">Total Estimado</span>
                            <span className="text-2xl font-black text-green-600">${totalEstimado}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-10">
                    <p className="text-gray-500">Cargando datos de la base de datos...</p>
                </div>
            )}

            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 px-6 rounded-2xl shadow-md w-full flex items-center justify-center gap-2 mt-auto">
                Comparar Precios (Premium $2.99)
            </button>
        </motion.div>
    );
}