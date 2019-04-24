import {Injectable, NestMiddleware, MiddlewareFunction, Logger} from '@nestjs/common';
import * as moment from 'moment-timezone';

const enum LogType {
    REQUEST = 'REQUEST',
    RESPONSE = 'RESPONSE',
    RESPONSE_ERROR = 'RESPONSE_ERROR'
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('RequestLogger');

    getResponseTime(startTimestamp: number) {
        return `${moment(startTimestamp).millisecond()}ms`;
    }

    getRemoteAddress(req) {
        return req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
    }

    getLogType(type: LogType) {
        switch (type) {
            case LogType.REQUEST:
                return '-->';
            case LogType.RESPONSE:
            case LogType.RESPONSE_ERROR:
                return '<--';
            default:
                return '---';
        }
    }

    log(type: LogType, req: any, startTimestamp: number, statusCode: number = null) {
        const logContent = [this.getLogType(type), req.method, req.originalUrl, this.getRemoteAddress(req)];

        if (type === LogType.RESPONSE) {
            logContent.push(statusCode);
        }

        if (type === LogType.RESPONSE_ERROR) {
            logContent.push('ERROR');
        }

        if (type === LogType.RESPONSE) {
            logContent.push(this.getResponseTime(startTimestamp));
        }

        this.logger.log(logContent.join(' '));
    }

    resolve(): MiddlewareFunction {
        return async (req, res, next) => {
            const startTimestamp = Date.now();

            this.log(LogType.REQUEST, req, startTimestamp);

            res.on('finish', () => {
                this.log(LogType.RESPONSE, req, startTimestamp, res.statusCode);
            });

            try {
                await next();
            } catch (error) {
                // log uncaught downstream errors
                const statusCode = error ? (error.isBoom ? error.output.statusCode : error.status || 500) : 404;

                this.log(LogType.RESPONSE_ERROR, req, startTimestamp, statusCode);

                throw error;
            }
        };
    }
}
