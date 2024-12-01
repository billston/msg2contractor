import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { swaggerSpec } from './config/swagger.js';
import { initDatabase } from './database/config.js';
import { receptorRoutes } from './routes/receptor.routes.js';
import { grupoRoutes } from './routes/grupo.routes.js';
import { comunicadoRoutes } from './routes/comunicado.routes.js';
import { notificacionRoutes } from './routes/notificacion.routes.js';

// Load environment variables
config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize database connection
await initDatabase();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files
app.use('/archivos', express.static(join(__dirname, '../archivos')));

// Routes
app.use('/api/receptores', receptorRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/comunicados', comunicadoRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});