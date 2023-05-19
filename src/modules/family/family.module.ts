import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { FamilyController } from './controllers/family.controller';
import { FamilyEntity } from './entities/family.entity';
import { FamilyInviteCodeEntity } from './entities/family-invite-code.entity';
import { FamilyMemberEntity } from './entities/family-member.entity';
import { JoinFamilyRequestEntity } from './entities/join-family-request.entity';
import { FamilyProfile } from './family.mapper';
import { FamilyService } from './services/family.service';

@Module({
    imports: [
        SharedModule,
        UsersModule,
        TypeOrmModule.forFeature([FamilyEntity, FamilyMemberEntity, FamilyInviteCodeEntity, JoinFamilyRequestEntity]),
    ],
    controllers: [FamilyController],
    providers: [FamilyService, FamilyProfile],
    exports: [
        FamilyService,
        FamilyProfile,
        TypeOrmModule.forFeature([FamilyEntity, FamilyMemberEntity, FamilyInviteCodeEntity, JoinFamilyRequestEntity]),
    ],
})
export class FamilyModule {}
