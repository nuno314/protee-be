import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { AppConfigService } from './app-config.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
    private readonly _logger: winston.Logger;

    constructor(private readonly _configService: AppConfigService) {
        super(LoggerService.name);
        this._logger = winston.createLogger(_configService.winstonConfig);
        if (_configService.nodeEnv !== 'production') {
            this._logger.debug('Logging initialized at debug level');
        }
    }
    log(message: string): void {
        this._logger.info(message);
    }
    info(message: string): void {
        this._logger.info(message);
    }
    debug(message: string): void {
        this._logger.debug(message);
    }
    error(message: string, trace?: any, context?: string): void {
        // i think the trace should be JSON Stringified
        const errorMsg = `${context || ''} ${message} -> (${trace || 'trace not provided !'})`;
        this._logger.error(errorMsg);
        // newrelic.noticeError(new Error(errorMsg));
    }
    warn(message: string): void {
        this._logger.warn(message);
    }
}
