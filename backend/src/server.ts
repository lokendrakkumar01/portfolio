import { connectDB } from './config/db';
import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDB();
  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    logger.info(`📡 API: ${config.SERVER_URL}/api/v1`);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully.');
    server.close(() => process.exit(0));
  });
};

startServer();
