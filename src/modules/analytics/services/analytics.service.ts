import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyEntity } from '../../family/entities/family.entity';
import { LocationEntity } from '../../location/entities/location.entity';
import { LocationStatusEnum } from '../../location/enums/location-status.enum';
import { UserEntity } from '../../users/entities/users.entity';
import { REQUEST } from '@nestjs/core';
import { FamilyMemberEntity } from '../../family/entities/family-member.entity';
import { LocationAccessHistoryEntity } from '../../location/entities/location-access-history.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @Inject(REQUEST) private readonly _req: any,
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        @InjectRepository(FamilyEntity)
        private readonly _familyRepository: Repository<FamilyEntity>,
        @InjectRepository(LocationEntity)
        private readonly _locationRepository: Repository<LocationEntity>,
        @InjectRepository(FamilyMemberEntity)
        private readonly _familyMemberRepository: Repository<FamilyMemberEntity>,
        @InjectRepository(LocationAccessHistoryEntity)
        private readonly _locationAccessHistoryEntity: Repository<LocationAccessHistoryEntity>
    ) {}

    public async getBasicFamilyAnalytics(): Promise<any> {
        const memberInfor = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });
        if (!memberInfor) throw new BadGatewayException('not_a_family_member');
        const response = {
            numberMembers: await this._familyMemberRepository.createQueryBuilder().where({ familyId: memberInfor.familyId }).getCount(),
            numberLocations: await this._locationRepository.createQueryBuilder().where({ familyId: memberInfor.familyId }).getCount(),
            numberWarningTimes: await this._locationAccessHistoryEntity.createQueryBuilder('log').where({ })
        } 
    }

    public async getNumberUserByAdmin(): Promise<number> {
        return await this._userRepository.count();
    }

    public async getNumberFamilyByAdmin(): Promise<number> {
        return await this._familyRepository.count();
    }

    public async getNumberLocationByAdmin(): Promise<number> {
        return await this._locationRepository.createQueryBuilder().where({ status: LocationStatusEnum.Published }).getCount();
    }
}
