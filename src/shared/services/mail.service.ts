// eslint-disable-next-line simple-import-sort/imports
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { AppConfigService } from './app-config.service';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private configService: AppConfigService) {}
}
