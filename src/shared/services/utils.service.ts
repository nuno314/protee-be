import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';

import { AppConfigService } from './app-config.service';

@Injectable()
export class UtilsService {
    constructor(private readonly _configService: AppConfigService) {}

    static removeVietnameseTones = (str: string): string => {
        const newStr = str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        return newStr;
    };
    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * generate random string
     * @param length
     */
    static generateRandomString(length: number): string {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .substr(0, length);
    }
    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    public static validateHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash || '');
    }

    public static getUtcNow(): Date {
        return new Date(new Date().toUTCString());
    }

    public static generateHashWithSalt(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }

    public static dateDiff(date1: Date, date2: Date, getBy: string): number {
        const diffInTime = date1.getTime() - date2.getTime();
        let result = 0;
        switch (getBy) {
            case 'month':
                result = Math.round(diffInTime / (1000 * 3600 * 24 * 30));
                break;
            case 'day':
                result = Math.round(diffInTime / (1000 * 3600 * 24));
                break;
            case 'hour':
                result = Math.round(diffInTime / (1000 * 3600));
                break;
            case 'minute':
                result = Math.round(diffInTime / (1000 * 60));
                break;
            case 'second':
                result = Math.round(diffInTime / 1000);
                break;
            default:
                break;
        }
        return result;
    }

    public static getUctDate(date: Date): Date {
        if (!date) return null;
        return new Date(date.toUTCString());
    }

    public static encodeBase64(str: string): string {
        return Buffer.from(str).toString('base64');
    }

    public static decodeBase64(str: string): string {
        return Buffer.from(str, 'base64').toString('utf8');
    }

    public static serializeQueryString(obj, prefix): string {
        const str = [];
        let p;
        for (p in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(p)) {
                const k = prefix ? prefix + '[' + p + ']' : p,
                    v = obj[p];

                str.push(
                    v !== null && typeof v === 'object'
                        ? this.serializeQueryString(v, k)
                        : encodeURIComponent(k) + '=' + encodeURIComponent(v)
                );
            }
        }

        return str.join('&');
    }

    public static mapToCamelCase(obj: any): any {
        /* eslint-disable */
        return _.mapKeys(obj, (value, key) => _.camelCase(key));
    }

    public formatCurrency(value: any): string {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    public getCdnPublicUrl(path: string): string {
        return `${this._configService.get(`S3_ENDPOINT`)}/${this._configService.get('AWS_S3_BUCKET')}/${path}`;
    }

    // calculate current price in close-down auction
    // delayedMilliseconds: time delay due to auction winner confirmation process
    public static calculateCurrentPrice(
        startPrice: number,
        priceStep: number,
        minPrice: number,
        startBidDate: Date | string,
        discountBaseTime: number, // minutes
        delayedMilliseconds: number, // milliseconds
    ): number {
        if (!startPrice || !priceStep || !startBidDate || !discountBaseTime || !minPrice) {
            return null;
        }
        const step = Number(priceStep);
        const min = Number(minPrice);
        const duration = (new Date().getTime() - new Date(startBidDate).getTime() - Number(delayedMilliseconds)) / 60000;
        const result = Number(startPrice) - Math.floor(duration / discountBaseTime) * step;
        if (result < min || result - min < step / 2) {
            // priceStep / 2 is greater than error due to floor and round operation
            return min;
        }
        return result;
    }

    // calculate the time left for next discount in down auction (milliseconds)
    public static calculateTimeLeftForNextDiscount(
        startBidDate: Date | string,
        discountBaseTime: number, // minutes
        delayedMilliseconds: number, // milliseconds
    ): number {
        if (!startBidDate || isNaN(delayedMilliseconds) || !discountBaseTime) {
            return null;
        }
        const delayedTime = Number(delayedMilliseconds);
        const baseTime = Number(discountBaseTime) * 60000;
        const startBidTime = new Date(startBidDate).getTime();
        const now = new Date().getTime();
        const result = baseTime - ((now - startBidTime - delayedTime) % baseTime);
        return result;
    }

    public static getConfirmExpectedPriceJobId(assetId: string, currentPrice: number): string {
        if (!assetId || !currentPrice) {
            return null;
        }
        return `${assetId}_${currentPrice}`;
    }
}
