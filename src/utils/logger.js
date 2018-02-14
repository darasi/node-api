import * as fs from 'fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import config from '../config/app';

const tsFormat = () => new Date().toISOString();

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      timestamp: tsFormat
    }),
    new winston.transports.DailyRotateFile({
      prepend: true,
      level: config.LOGGING_LEVEL,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      filename: `${config.LOGGING_DIR}/-${config.LOGGING_LEVEL}, 'debug')}.log`
    })
  ]
});

export default logger;
