// eslint-disable-next-line simple-import-sort/imports
import * as firebase from 'firebase-admin';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from './../../../shared/services/app-config.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
    private defaultApp: any;

    constructor(configServie: AppConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('firebaseToken'),
        });
        // eslint-disable-next-line import/namespace
        this.defaultApp = firebase.initializeApp({
            // eslint-disable-next-line import/namespace
            credential: firebase.credential.cert({
                projectId: configServie.get('FIREBASE_PROJECT_ID'),
                privateKey: configServie.get('FIREBASE_PRIVATE_KEY'),
                clientEmail: configServie.get('CLIENT_EMAIL'),
            }),
        });
    }

    async validate(token: string) {
        const firebaseUser: any = await this.defaultApp
            .auth()
            .verifyIdToken(token, true)
            .catch((err) => {
                console.log(err);
                throw new UnauthorizedException(err.message);
            });

        if (!firebaseUser) {
            throw new UnauthorizedException();
        }

        return firebaseUser;
    }
}
