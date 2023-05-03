import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationController } from './controllers/location.controller';
import { Location } from './entities/location.entity';
import { LocationService } from './services/location.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule {}
