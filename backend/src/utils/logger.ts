import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';


if (!fs.existsSync('logs')) fs.mkdirSync('logs');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    zippedArchive: true,
    level: 'info',
});

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            ),
        }),
        dailyRotateFileTransport,
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
});

export default logger;