import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/environment.js';
// import { connectDatabase } from './config/database.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Import routes when ready
// import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
// import adoptionRoutes from './routes/adoptionRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to Database
// connectDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Simple setup (customize as needed)
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'PawBuddy API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
const apiPrefix = `${env.API_PREFIX}/${env.API_VERSION}`;

// Uncomment when routes are ready
// app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/pets`, petRoutes);
// app.use(`${apiPrefix}/adoptions`, adoptionRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 API: http://localhost:${PORT}${apiPrefix}`);
});

export default app;
