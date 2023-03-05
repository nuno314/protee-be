import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { ISwaggerConfigInterface } from '../../interfaces/swagger-config.interface';

export function setupSwagger(app: INestApplication, config: ISwaggerConfigInterface): OpenAPIObject {
    const options = new DocumentBuilder()
        .setTitle(config.title)
        .setDescription(config.description)
        .setVersion(config.version)
        .addBearerAuth()
        .addServer(`${config.scheme}://`)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(config.path, app, document);
    return document;
}
