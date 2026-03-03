import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/environment.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sendError } from './utils/response.js';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import petRoutes from './modules/pets/pets.routes.js';
import bookingRoutes from './modules/bookings/bookings.routes.js';
import favouriteRoutes from './modules/favourites/favourites.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app: Express = express();

// ============================================================================
// Middleware
// ============================================================================

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: 'Too many authentication attempts, please try again later',
});

app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// Swagger/OpenAPI Documentation
// ============================================================================

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PawBuddy - Pet Adoption API',
      version: '1.0.0',
      description: 'Backend API for Pet Adoption Web Application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/*/*.routes.ts'],
};

const swaggerDocument = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// ============================================================================
// Routes
// ============================================================================

const apiPrefix = env.API_PREFIX;

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes with stricter rate limiting
app.use(`${apiPrefix}/auth`, authLimiter, authRoutes);

// API routes
app.use(`${apiPrefix}/pets`, petRoutes);
app.use(`${apiPrefix}/bookings`, bookingRoutes);
app.use(`${apiPrefix}/favourites`, favouriteRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// ============================================================================
// 404 Handler
// ============================================================================

app.use((req: Request, res: Response) => {
  sendError(res, 'Route not found', undefined, 404);
});

// ============================================================================
// Error Handler (must be last)
// ============================================================================

app.use(errorHandler);

export default app;
