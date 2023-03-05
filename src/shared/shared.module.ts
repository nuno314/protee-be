import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { CustomerProvider } from '../decorators/customer.factory';
import { LocationModule } from '../modules/location/location.module';
import { AppConfigService } from './services/app-config.service';
import { BaseHttpService } from './services/base-http.service';
import { LoggerService } from './services/logger.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { S3Service } from './services/s3.service';
import { UtilsService } from './services/utils.service';
import { ValidatorService } from './services/validator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const providers = [
    CustomerProvider,
    AppConfigService,
    LoggerService,
    ValidatorService,
    UtilsService,
    MailService,
    BaseHttpService,
    S3Service,
    OtpService,
];

@Global()
@Module({
    providers,
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    port: configService.get('MAIL_PORT') || 465,
                    secure: false, // use TLS
                    auth: {
                        user: configService.get('MAIL_USERNAME'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"${configService.get('MAIL_FROMNAME')}" <${configService.get('MAIL_FROMADDRESS')}>`,
                },
                template: {
                    dir: path.join(__dirname, '../templates/email'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
        forwardRef(() => LocationModule),
        HttpModule.registerAsync({
            useFactory: async (configService: AppConfigService) => ({
                timeout: configService.getNumber('HTTP_TIMEOUT') || 3000,
                maxRedirects: configService.getNumber('HTTP_MAX_REDIRECTS') || 50,
            }),
            inject: [AppConfigService],
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
    ],
    exports: [...providers, HttpModule, AutomapperModule],
})
export class SharedModule {}
