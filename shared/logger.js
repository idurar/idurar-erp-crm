const path = require('path');
const { createLogger, format, transports } = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, label, printf, colorize, align } = format;



// log format
const customFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${level}: ${message} ${date.toDateString()} ${hour}:${minutes}:${seconds}`;
});
// transport
const generalTransport = new DailyRotateFile({
    level: 'info',
    filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'erp-crm-%DATE%-success.log'
    ),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
console.log({ generalTransport });

const errorTransport = new DailyRotateFile({
    level: 'error',
    filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'error',
        'erp-crm-%DATE%-error.log'
    ),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize({ all: true }),
        align(),
        timestamp(),
        customFormat
    ),
    transports: [
        generalTransport,
        errorTransport
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: customFormat,
    }));
}

module.exports = logger