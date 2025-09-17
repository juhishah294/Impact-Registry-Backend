import winston from 'winston';
import moment from 'moment';

// Custom format for clinical trials logging
const clinicalTrialsFormat = winston.format.combine(
  winston.format.timestamp({
    format: () => moment().format('YYYY-MM-DD HH:mm:ss')
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      service: 'clinical-trials-collector',
      ...meta
    });
  })
);

// Main application logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: clinicalTrialsFormat,
  defaultMeta: { service: 'clinical-trials-collector' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Audit logger for compliance tracking
const cirkleLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().format('YYYY-MM-DD HH:mm:ss')
    }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, userId, action, resource, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        userId,
        action,
        resource,
        service: 'clinical-trials-audit',
        compliance: true,
        ...meta
      });
    })
  ),
  defaultMeta: { service: 'clinical-trials-audit' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/audit.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));

  cirkleLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export { cirkleLogger, logger };
