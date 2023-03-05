import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { DB_CONNECTION } from '../../constant';
import { ISwaggerConfigInterface } from '../../interfaces/swagger-config.interface';
import { SnakeNamingStrategy } from '../typeorm/strategies/snake-naming.strategy';

@Injectable()
export class AppConfigService {
    constructor() {
        dotenv.config({
            path: `.env`,
        });

        for (const envName of Object.keys(process.env)) {
            process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
        }
        if (this.nodeEnv === 'development') {
            console.info(process.env);
        }
    }

    public get(key: string): string {
        return process.env[key];
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    public getBoolean(key: string): boolean {
        return Boolean(this.get(key));
    }

    get globalPrefix(): string {
        return this.get('GLOBAL_PREFIX') || '';
    }

    get nodeEnv(): string {
        return this.get('NODE_ENV') || 'development';
    }

    get swaggerConfig(): ISwaggerConfigInterface {
        return {
            path: this.get('SWAGGER_PATH') || '',
            title: this.get('SWAGGER_TITLE') || 'Auction API',
            description: this.get('SWAGGER_DESCRIPTION'),
            version: this.get('SWAGGER_VERSION') || '0.0.1',
            scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
        };
    }

    get eventStoreConfig() {
        return {
            protocol: this.get('EVENT_STORE_PROTOCOL') || 'http',
            connectionSettings: {
                defaultUserCredentials: {
                    username: this.get('EVENT_STORE_CREDENTIALS_USERNAME') || 'admin',
                    password: this.get('EVENT_STORE_CREDENTIALS_PASSWORD') || 'changeit',
                },
                verboseLogging: true,
                failOnNoServerResponse: true,
                // log: console, // TODO: improve Eventstore logger (separate chanel)
            },
            tcpEndpoint: {
                host: this.get('EVENT_STORE_HOSTNAME') || 'localhost',
                port: this.getNumber('EVENT_STORE_TCP_PORT') || 1113,
            },
            httpEndpoint: {
                host: this.get('EVENT_STORE_HOSTNAME') || 'localhost',
                port: this.getNumber('EVENT_STORE_HTTP_PORT') || 2113,
            },
            poolOptions: {
                min: this.getNumber('EVENT_STORE_POOLOPTIONS_MIN') || 1,
                max: this.getNumber('EVENT_STORE_POOLOPTIONS_MAX') || 10,
            },
        };
    }

    get winstonConfig(): winston.LoggerOptions {
        return {
            transports: [
                new DailyRotateFile({
                    level: 'debug',
                    filename: `./logs/${this.nodeEnv}/debug-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new DailyRotateFile({
                    level: 'error',
                    filename: `./logs/${this.nodeEnv}/error-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '30d',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({
                            format: 'DD-MM-YYYY HH:mm:ss',
                        }),
                        winston.format.simple(),
                    ),
                }),
            ],
            exitOnError: false,
        };
    }

    get newRelicConfig() {
        return {
            appName: this.get('NEW_RELIC_APP_NAME'),
            licenseKey: this.get('NEW_RELIC_LICENSE_KEY'),
        };
    }

    get gcpStorageBucket(): string {
        return this.get('GCP_STORAGE_BUCKET') || '';
    }

    get rabbitMQ() {
        return {
            user: this.get('RABBITMQ_USER') || '',
            password: this.get('RABBITMQ_PASSWORD') || '',
            host: this.get('RABBITMQ_HOST') || '',
            port: this.get('RABBITMQ_PORT') || '',
            transporter: this.get('RABBITMQ_TRANSPORTER') || 'amqp',
        };
    }

    get elasticSearch() {
        return {
            url: this.get('ES_HOST') || 'localhost',
            port: this.get('ES_PORT') || 6379,
            auth: this.getBoolean('ES_AUTH') || false,
            user: this.get('ES_USERNAME') || '',
            password: this.get('ES_PASSWORD') || '',
            indexPrefix: this.get('ES_PREFIX') || '',
        };
    }

    get redis() {
        return {
            host: this.get('REDIS_HOST') || 'localhost',
            port: this.get('REDIS_PORT') || 6379,
            pass: this.get('REDIS_PASSWORD'),
            db: this.get('REDIS_DB'),
        };
    }

    get redisForBull() {
        return {
            host: this.get('REDIS_HOST'),
            port: Number(this.get('REDIS_PORT')),
            pass: this.get('REDIS_PASSWORD'),
            db: Number(this.get('REDIS_DB')),
        };
    }

    get typeOrmPostgreSqlConfig(): TypeOrmModuleOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}', __dirname + '/../../common/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];
        const subscribers = [__dirname + '/../../shared/**/*.subscriber{.ts,.js}'];

        if ((module as any).hot) {
            const entityContext = (require as any).context('./../../modules', true, /\.entity\.ts$/);
            entities = entityContext.keys().map((id) => {
                const entityModule = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = (require as any).context('./../../migrations', false, /\.ts$/);
            migrations = migrationContext.keys().map((id) => {
                const migrationModule = migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }

        return {
            entities,
            migrations,
            subscribers,
            type: 'postgres',
            host: this.get('DATABASE_HOST'),
            port: this.getNumber('DATABASE_PORT'),
            username: this.get('DATABASE_USERNAME'),
            password: this.get('DATABASE_PASSWORD'),
            database: this.get('DATABASE_NAME'),
            extra:
                this.get('DATABASE_SSL')?.toString() !== 'false'
                    ? {
                          ssl: {
                              rejectUnauthorized: false,
                          },
                      }
                    : {},
            migrationsRun: false,
            logging: this.nodeEnv === 'development',
            namingStrategy: new SnakeNamingStrategy(),
        };
    }

    get postgreSqlConfig(): PostgresConnectionOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];
        const subscribers = [__dirname + '/../../shared/**/*.subscriber{.ts,.js}'];

        if ((module as any).hot) {
            const entityContext = (require as any).context('./../../modules', true, /\.entity\.ts$/);
            entities = entityContext.keys().map((id) => {
                const entityModule = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = (require as any).context('./../../migrations', false, /\.ts$/);
            migrations = migrationContext.keys().map((id) => {
                const migrationModule = migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }

        return {
            entities,
            migrations,
            subscribers,
            name: 'default',
            type: 'postgres',
            host: this.get('DATABASE_HOST'),
            port: this.getNumber('DATABASE_PORT'),
            username: this.get('DATABASE_USERNAME'),
            password: this.get('DATABASE_PASSWORD'),
            database: this.get('DATABASE_NAME'),
            extra:
                this.get('DATABASE_SSL')?.toString() !== 'false'
                    ? {
                          ssl: {
                              rejectUnauthorized: false,
                          },
                      }
                    : {},
            migrationsRun: false,
            logging: this.nodeEnv === 'development',
            namingStrategy: new SnakeNamingStrategy(),
        };
    }

    get cron() {
        return Number.parseInt(this.get('CRON'));
    }

    get cubeConfig() {
        return {
            url: this.get('CUBE_URL') || '',
            token: this.get('CUBE_TOKEN') || '',
        };
    }

    get portal() {
        return this.get('PORTAL_URL');
    }

    get mqtt() {
        return {
            host: this.get('MQTT_HOST'),
            port: this.getNumber('MQTT_PORT'),
        };
    }

    get smsProvider(): string {
        return this.get('SMS_PROVIDER') || '';
    }

    get smsVietguys(): Record<string, string | number> {
        return {
            url: this.get('SMS_ENDPOINT') || '',
            username: this.get('SMS_USERNAME') || '',
            passCode: this.get('SMS_PASSWORD') || '',
            bid: this.get('SMS_BID') || '',
            from: this.get('SMS_FROM') || '',
            template: this.get('SMS_BIRTHDAY_COUPON_TMPL') ?? '',
        };
    }

    get smsTwilio(): Record<string, string> {
        return {
            accountSid: this.get('TWILIO_ACCOUNT_SID'),
            authToken: this.get('TWILIO_AUTH_TOKEN'),
            fromPhoneNumber: this.get('TWILIO_PHONE_NUMBER'),
            messagingServiceSid: this.get('TWILIO_SERVICE_SID'),
            template: this.get('SMS_BIRTHDAY_COUPON_TMPL') ?? '',
        };
    }

    get smsStringee(): Record<string, string | number> {
        return {
            url: this.get('SMS_ENDPOINT') || '',
            token: this.get('SMS_STRINGEE_TOKEN') || '',
            from: this.get('SMS_FROM') || '',
        };
    }
}
