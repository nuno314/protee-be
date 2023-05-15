/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

import { OTP_CONTENT } from '../../constant';
import { AppConfigService } from './app-config.service';
import { BaseHttpService } from './base-http.service';

@Injectable()
export class OtpService {
    static time = 1453853945;

    constructor(private readonly _httpService: BaseHttpService, private readonly _configService: AppConfigService) {}

    public static getOtpWindow(): number {
        return Number(process.env['APP_OTP_EXPIRED_IN']) / Number(process.env['SPEAKEASY_OTP_STEP']);
    }

    public static getOtpStep(): number {
        return Number(process.env['SPEAKEASY_OTP_STEP']);
    }

    public static generateSecret(): string {
        return speakeasy.generateSecret().base32;
    }

    public static generateOtp(secret: string, isDevelopment = false): string {
        const otpObject: any = {
            secret: secret,
            encoding: 'base32',
            step: this.getOtpStep(),
            window: this.getOtpWindow(),
        };
        if (isDevelopment) {
            otpObject.time = this.time;
        }
        const otp = speakeasy.totp(otpObject);
        return otp;
    }

    public static verifyOtp(otp: string, secret: string, isDevelopment = false) {
        const otpObject: any = {
            secret: secret,
            encoding: 'base32',
            token: otp,
            step: this.getOtpStep(),
            window: this.getOtpWindow(),
        };
        if (isDevelopment) {
            otpObject.time = this.time;
        }
        const result = speakeasy.totp.verifyDelta(otpObject);
        return result;
    }
}
