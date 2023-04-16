import 'source-map-support/register';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { json } from 'express';
import * as morgan from 'morgan'; // HTTP request logger

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppConfigService } from './shared/services/app-config.service';
import { LoggerService } from './shared/services/logger.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './shared/swagger/setup';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
    app.setGlobalPrefix('api');

    const loggerService = app.select(SharedModule).get(LoggerService);
    app.useLogger(loggerService);
    app.use(
        morgan('combined', {
            stream: {
                write: (message) => {
                    loggerService.log(message);
                },
            },
        }),
    );

    // app.use(helmet());
    // app.use(
    //     rateLimit({
    //         windowMs: 15 * 60 * 1000, // 15 minutes
    //         max: 100, // limit each IP to 100 requests per windowMs
    //     }),
    // );

    const reflector = app.get(Reflector);

    app.useGlobalFilters(new HttpExceptionFilter(loggerService));
    // app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector), new NewRelicInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            // exceptionFactory: errors => new BadRequestException(errors),
            // dismissDefaultMessages: true,//TODO: disable in prod (if required)
            validationError: {
                target: false,
            },
        }),
    );

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.use(json({ limit: '50mb' }));

    const configService = app.select(SharedModule).get(AppConfigService);

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        const document = setupSwagger(app, configService.swaggerConfig);
        // fs.writeFileSync('./swagger.json', JSON.stringify(document));
        app.use('/swagger.json', (req, res) => {
            res.json(document);
        });
    }

    const port = configService.getNumber('PORT') || 3000;
    const host = configService.get('HOST') || '0.0.0.0';
    const origin = configService.get('ORIGIN') || '*';
    const corsOptions = {
        origin: origin,
        methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
        credentials: origin !== '*',
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN, secret, recaptchavalue',
    };
    app.use(cors(corsOptions));

    // const redisIoAdapter = new RedisIoAdapter(app);
    // const redisOptions: RedisClientOptions = {
    //     url: `redis://${configService.redis.host}:${configService.redis.port}`,
    // };

    // console.log(`redis://${configService.redis.host}:${configService.redis.port}`)
    // await redisIoAdapter.connectToRedis(redisOptions);

    // app.useWebSocketAdapter(redisIoAdapter);

    await app.listen(port, host);

    console.log(`server running on port ${host}:${port}`);
    loggerService.warn(`server running on port ${host}:${port}`);
}
bootstrap();
