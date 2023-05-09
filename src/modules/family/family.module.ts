import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { FamilyController } from './controllers/family.controller';
import { FamilyEntity } from './entities/family.entity';
import { FamilyProfile } from './family.mapper';
import { FamilyService } from './services/family.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([FamilyEntity])],
    controllers: [FamilyController],
    providers: [FamilyService, FamilyProfile],
    exports: [FamilyService, FamilyProfile, TypeOrmModule.forFeature([FamilyEntity])],
})
export class FamilyModule {}
