import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SystemUserController } from './controllers/system-users.controller';
import { SystemUserEntity } from './entities/system-users.entity';
import { SystemUserService } from './services/system-users.service';
import { SystemUserProfile } from './system-users.mapper';

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([SystemUserEntity]),
    ],
    controllers: [SystemUserController],
    providers: [SystemUserProfile, SystemUserService],
    exports: [SystemUserService, SystemUserProfile, TypeOrmModule.forFeature([SystemUserEntity]),],
})
export class SystemUsersModule {}
