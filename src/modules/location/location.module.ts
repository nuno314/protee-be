import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { MessageModule } from '../message/message.module';
import { UsersModule } from '../users/users.module';
import { LocationController } from './controllers/location.controller';
import { LocationEntity } from './entities/location.entity';
import { LocationAccessHistoryEntity } from './entities/location-access-history.entity';
import { LocationProfile } from './location.mapper';
import { LocationService } from './services/location.service';

@Module({
    imports: [TypeOrmModule.forFeature([LocationEntity, LocationAccessHistoryEntity]), MessageModule, FamilyModule, UsersModule],
    controllers: [LocationController],
    providers: [LocationService, LocationProfile],
    exports: [LocationService, LocationProfile],
})
export class LocationModule {}
