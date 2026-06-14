// backend/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint maestro para la PWA Offline
// Descarga todas las recetas, ingredientes y precios en una sola petición
app.get('/api/sync', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error("Error al sincronizar datos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});