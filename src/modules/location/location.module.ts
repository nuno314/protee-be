import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { MessageModule } from '../message/message.module';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';
import { LocationController } from './controllers/location.controller';
import { LocationEntity } from './entities/location.entity';
import { LocationAccessHistoryEntity } from './entities/location-access-history.entity';
import { UserLocationHistoryEntity } from './entities/user-location-history.entity';
import { LocationProfile } from './location.mapper';
import { LocationService } from './services/location.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationEntity, LocationAccessHistoryEntity, UserLocationHistoryEntity]),
        MessageModule,
        FamilyModule,
        UsersModule,
        SettingsModule,
    ],
    controllers: [LocationController],
    providers: [LocationService, LocationProfile],
    exports: [
        LocationService,
        LocationProfile,
        TypeOrmModule.forFeature([LocationEntity, LocationAccessHistoryEntity, UserLocationHistoryEntity]),
    ],
})
export class LocationModule {}
