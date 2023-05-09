import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SystemUsersModule } from '../system-users/system-users.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { ResetPasswordRequestEntity } from './entities/reset-password-request.entity';
import { AuthProfile } from './mapper';
import { AuthService } from './services/auth.service';
import { FirebaseAuthStrategy } from './strategies/firebase-auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        SystemUsersModule,
        SharedModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('APP_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
        PassportModule,
        TypeOrmModule.forFeature([ResetPasswordRequestEntity]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, FirebaseAuthStrategy, AuthProfile],
    exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
