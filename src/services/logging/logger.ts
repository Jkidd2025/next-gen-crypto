import pino from 'pino';

const pinoConfig = {
  browser: {
    asObject: true
  },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: undefined
};

export const logger = pino(pinoConfig);

export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error({ err: error, ...context }, error.message);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(context, message);
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn(context, message);
};

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(context, message);
};