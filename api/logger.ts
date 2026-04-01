import winston from 'winston';

const logLevel = process.env.LOG_LEVEL ?? 'info';

const { combine, timestamp, errors, json } = winston.format;
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: logLevel,
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
