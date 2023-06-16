import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SettingsController } from './controllers/settings.controller';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsService } from './services/settings.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([SettingsEntity])],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
