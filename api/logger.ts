import winston from 'winston';
import { env } from './config.ts';

const { combine, timestamp, errors, json } = winston.format;
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
    errors({ stack: true })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
