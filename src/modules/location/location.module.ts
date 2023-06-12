import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { UsersModule } from '../users/users.module';
import { LocationController } from './controllers/location.controller';
import { LocationEntity } from './entities/location.entity';
import { LocationAccessHistoryEntity } from './entities/location-access-history.entity';
import { NotificationGateway } from './gateway/notification.gateway';
import { LocationProfile } from './location.mapper';
import { LocationService } from './services/location.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('APP_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
        TypeOrmModule.forFeature([LocationEntity, LocationAccessHistoryEntity]),
        FamilyModule,
        UsersModule,
    ],
    controllers: [LocationController],
    providers: [LocationService, LocationProfile, NotificationGateway],
    exports: [LocationService, LocationProfile, NotificationGateway],
})
export class LocationModule {}
