/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../../shared/services/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configServie: AppConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configServie.get('APP_SECRET'),
        });
    }

    async validate(payload: any) {
        return {
            id: payload.id,
            name: payload.name,
            email: payload.email || null,
            phoneNumber: payload.phoneNumber || null,
            role: payload.role || null
        };
    }
}
