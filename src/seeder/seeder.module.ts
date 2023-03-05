import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity, DistrictEntity, WardEntity } from '../common/entities';
import { AppConfigService } from '../shared/services/app-config.service';
import { SharedModule } from '../shared/shared.module';
import { SeederService } from './seeder.service';

@Module({
    imports: [
        forwardRef(() => SharedModule),
        TypeOrmModule.forRootAsync({
            imports: [CityEntity, DistrictEntity, WardEntity],
            useFactory: (configService: AppConfigService) => configService.typeOrmPostgreSqlConfig,
            inject: [AppConfigService],
        }),
    ],
    providers: [
        SeederService,
    ],
    exports: [SeederService],
})
export class SeederModule {}
