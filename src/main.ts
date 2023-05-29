import 'source-map-support/register';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import { json } from 'express';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from './shared/swagger/setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.use(json({ limit: '50mb' }));

    if (['development', 'staging'].includes(process.env.NODE_ENV || 'development')) {
        const swaggerConfig: any = {
            path: process.env.SWAGGER_PATH || '',
            title: process.env.SWAGGER_TITLE || 'Auction API',
            description: process.env.SWAGGER_DESCRIPTION,
            version: process.env.SWAGGER_VERSION || '0.0.1',
            scheme: process.env.SWAGGER_SCHEME === 'https' ? 'https' : 'http',
        };
        const document = setupSwagger(app, swaggerConfig);
        // fs.writeFileSync('./swagger.json', JSON.stringify(document));
        app.use('/swagger.json', (req, res) => {
            res.json(document);
        });
    }
    const origin = process.env.ORIGIN || '*';
    const corsOptions = {
        origin: origin,
        methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
        credentials: origin !== '*',
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN, secret, recaptchavalue',
    };
    app.use(cors(corsOptions));

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors();

    await app.listen(port, host);

    console.log(`server running on port ${host}:${port}`);
}
bootstrap();
