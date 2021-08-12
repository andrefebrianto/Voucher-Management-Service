const winston = require('winston');
require('winston-daily-rotate-file');

const transportInfo = new winston.transports.DailyRotateFile({
    filename: './log/info/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    level: "info"
});

const transportError = new winston.transports.DailyRotateFile({
    filename: './log/error/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: "error"
});

const logFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info => `${new Date(info.timestamp).toUTCString()} | ${info.level}: ${info.message} | [36mscope[39m: ${info.scope} | [35mdata[39m: ${JSON.stringify(info.data)}`
    )
);

const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        transportInfo,
        transportError
    ],
    format: logFormat
});

class LoggerService {
    static info(scope, message, data = null) {
        Logger.log('info', message, { scope, data });
    }

    static debug(scope, message, data = null) {
        Logger.log('debug', message, { scope, data });
    }

    static error(scope, message, data = null) {
        Logger.log('error', message, { scope, data });
    }
}

module.exports = LoggerService;
