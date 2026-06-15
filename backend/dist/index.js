"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Endpoint maestro para la PWA Offline
// Descarga todas las recetas, ingredientes y precios en una sola petición
app.get('/api/sync', async (req, res) => {
    try {
        const recetasCompletas = await prisma.recetas.findMany({
            include: {
                receta_ingredientes: {
                    include: {
                        ingredientes: {
                            include: {
                                precios_supermercados: {
                                    include: {
                                        supermercados: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.json({
            status: 'success',
            data: recetasCompletas
        });
    }
    catch (error) {
        console.error("Error al sincronizar datos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
