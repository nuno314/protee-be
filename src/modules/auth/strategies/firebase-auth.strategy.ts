// // eslint-disable-next-line simple-import-sort/imports
// import * as firebase from 'firebase-admin';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AppConfigService } from './../../../shared/services/app-config.service';

// @Injectable()
// export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
//     private defaultApp: any;

//     constructor(configServie: AppConfigService) {
//         const props = {
//             projectId: configServie.get('FIREBASE_PROJECT_ID'),
//             privateKey: configServie.get('FIREBASE_PRIVATE_KEY'),
//             clientEmail: configServie.get('CLIENT_EMAIL'),
//         };
//         super({
//             jwtFromRequest: ExtractJwt.fromBodyField('firebaseToken'),
//         });
//         // eslint-disable-next-line import/namespace
//         this.defaultApp = firebase.initializeApp({
//             // eslint-disable-next-line import/namespace
//             credential: firebase.credential.cert(props),
//         });
//     }

//     async validate(token: string) {
//         const firebaseUser: any = await this.defaultApp
//             .auth()
//             .verifyIdToken(token, true)
//             .catch((err) => {
//                 console.log(err);
//                 throw new UnauthorizedException(err.message);
//             });

//         if (!firebaseUser) {
//             throw new UnauthorizedException();
//         }

//         return firebaseUser;
//     }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line
import { getAuth } from 'firebase-admin/auth';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
    constructor() {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromBodyField('firebaseToken'),
        });
    }
    async validate(token: string) {
        const auth = getAuth();
        const firebaseUser = await auth.verifyIdToken(token, true).catch((err) => {
            console.log('firebase auth: ', err);
            throw new UnauthorizedException(err.message);
        });
        if (!firebaseUser) {
            throw new UnauthorizedException();
        }
        return firebaseUser;
    }
}
