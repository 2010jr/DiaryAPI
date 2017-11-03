const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf } = format;
const defaultFormat = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'common' }),
    timestamp(),
    defaultFormat,
  ),
  transports: [
    new transports.File({
      level: 'error',
      filename: 'error.log',
      humanReadableUnhandledException: true,
      maxsize: 100000,
      maxFiles: 10,
      tailable: true,
      prepend: true,
    }),
    new transports.File({
      filename: 'combined.log',
      humanReadableUnhandledException: true,
      maxsize: 100000,
      maxFiles: 10,
      tailable: true,
      prepend: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      format.splat(),
      defaultFormat,
    ),
    colorize: true,
    humanReadableUnhandledException: true,
  }));
}
module.exports = logger;
