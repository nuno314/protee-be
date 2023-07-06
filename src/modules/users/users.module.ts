import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { FamilyMemberEntity } from '../family/entities/family-member.entity';
import { FamilyModule } from '../family/family.module';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './services/users.service';
import { UsersProfile } from './users.mapper';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([UserEntity, FamilyMemberEntity])],
    controllers: [UserController],
    providers: [UsersService, UsersProfile],
    exports: [UsersService, UsersProfile, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
