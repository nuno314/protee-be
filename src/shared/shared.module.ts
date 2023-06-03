import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { CustomerProvider } from '../decorators/customer.factory';
import { AppConfigService } from './services/app-config.service';
import { BaseHttpService } from './services/base-http.service';
import { FirebaseService } from './services/firebase.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { UtilsService } from './services/utils.service';
import { ValidatorService } from './services/validator.service';

const providers = [
    FirebaseService,
    CustomerProvider,
    AppConfigService,
    ValidatorService,
    UtilsService,
    MailService,
    BaseHttpService,
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
