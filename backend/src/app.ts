import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config/env';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';
import apiRoutes from './routes/index';

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS setup allowing origin flexible checks for Render & localhost
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin === config.CLIENT_URL ||
      origin.includes('localhost') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitization
app.use(mongoSanitize());

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files (local storage uploads) with headers for inline PDF display
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    },
  })
);

// Rate limiting
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/v1', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
