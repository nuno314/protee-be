import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { LocationController } from './controllers/location.controller';
import { LocationEntity } from './entities/location.entity';
import { LocationProfile } from './location.mapper';
import { LocationService } from './services/location.service';

@Module({
    imports: [TypeOrmModule.forFeature([LocationEntity]), FamilyModule],
    controllers: [LocationController],
    providers: [LocationService, LocationProfile],
    exports: [LocationService, LocationProfile],
})
export class LocationModule {}
