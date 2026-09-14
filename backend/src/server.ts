import { connectDB } from './config/db';
import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDB();
  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    logger.info(`📡 API: ${config.SERVER_URL}/api/v1`);

    // Keep-alive self ping to prevent Render free instance from sleeping
    const pingTarget = process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/health`
      : config.SERVER_URL && !config.SERVER_URL.includes('localhost')
      ? `${config.SERVER_URL}/health`
      : 'https://portfolio-backend-gbzu.onrender.com/health';

    if (config.NODE_ENV === 'production' || process.env.RENDER_EXTERNAL_URL) {
      const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
      setInterval(async () => {
        try {
          await fetch(pingTarget);
          logger.info(`[KeepAlive] Pinged ${pingTarget}`);
        } catch (err: any) {
          logger.warn(`[KeepAlive] Ping failed: ${err.message}`);
        }
      }, PING_INTERVAL);
      logger.info(`[KeepAlive] Self-ping active for ${pingTarget}`);
    }
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
