import { HttpService } from '@nestjs/axios';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AppConfigService } from '../shared/services/app-config.service';

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(private readonly httpService: HttpService, private readonly configService: AppConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const { headers } = context.switchToHttp().getRequest();
            const url = this.configService.get('GOOGLE_CAPCHA_URL');
            const secret = this.configService.get('GOOGLE_CAPCHA_SECRET');
            const { data } = await this.httpService.post(`${url}?response=${headers.recaptchavalue}&secret=${secret}`).toPromise();

            if (!data.success) {
                throw new BadRequestException();
            }

            return true;
        } catch (err) {
            throw new BadRequestException();
        }
    }
}
