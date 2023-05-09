// eslint-disable-next-line simple-import-sort/imports
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { AppConfigService } from './app-config.service';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private configService: AppConfigService) {}

    async sendResetPassword(email: string, url: string): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Protee - Yêu cầu đặt lại mật khẩu',
                template: './../email/resetPassword.hbs', // `.hbs` extension is appended automatically
                context: {
                    url,
                },
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
