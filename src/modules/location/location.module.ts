import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity, DistrictEntity, WardEntity } from '../../common/entities';
import { SeederModule } from '../../seeder/seeder.module';
import { SharedModule } from '../../shared/shared.module';
import { LocationController } from './controllers/location.controller';
import { LocationService } from './services/location.service';

@Module({
    imports: [
        forwardRef(() => SharedModule),
        SeederModule,
        TypeOrmModule.forFeature([DistrictEntity, WardEntity, CityEntity])
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService]
})
export class LocationModule {}
