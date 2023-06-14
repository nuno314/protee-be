import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyEntity } from '../../family/entities/family.entity';
import { FamilyMemberEntity } from '../../family/entities/family-member.entity';
import { LocationEntity } from '../../location/entities/location.entity';
import { UserLocationHistoryEntity } from '../../location/entities/user-location-history.entity';
import { LocationStatusEnum } from '../../location/enums/location-status.enum';
import { UserEntity } from '../../users/entities/users.entity';

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
        @InjectRepository(UserLocationHistoryEntity)
        private readonly _userLocationHistoryRepository: Repository<UserLocationHistoryEntity>
    ) {}

    public async getBasicFamilyAnalytics(): Promise<any> {
        const memberInfor = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });
        if (!memberInfor) throw new BadGatewayException('not_a_family_member');
        const response = {
            numberMembers: await this._familyMemberRepository.createQueryBuilder().where({ familyId: memberInfor.familyId }).getCount(),
            numberLocations: await this._locationRepository
                .createQueryBuilder()
                .where({ familyId: memberInfor.familyId })
                .orWhere({ status: LocationStatusEnum.Published })
                .getCount(),
            numberWarningTimes: Number(
                (
                    await this._userLocationHistoryRepository.query(`SELECT count(*)
            FROM user_location_history AS u
            INNER JOIN location_access_history AS p ON p.id = (
                SELECT id
                FROM location_access_history AS p2
                WHERE p2.user_location_history_id = u.id
                ORDER BY p.created_at DESC
                LIMIT 1
            )
            where p.id IS NOT NULL`)
                )[0]?.count || 0
            ),
        };
        return response;
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
