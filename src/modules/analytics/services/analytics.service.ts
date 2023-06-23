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
import { StatisticUserDto } from '../dtos/responses/statistic.user.dto';

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
        const numberWarningTimesData = await this._userLocationHistoryRepository.query(`select count(c) as count from (
            select count(*) as c
            from location_access_history
            group by user_location_history_id
        ) as temp`);
        const response = {
            numberMembers: await this._familyMemberRepository.createQueryBuilder().where({ familyId: memberInfor.familyId }).getCount(),
            numberLocations: await this._locationRepository
                .createQueryBuilder()
                .where({ familyId: memberInfor.familyId })
                .orWhere({ status: LocationStatusEnum.Published })
                .getCount(),
            numberWarningTimes: Number(numberWarningTimesData[0]?.count) || 0,
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
    public async getStatisticUserByAdmin(): Promise<StatisticUserDto[]> {
        const result: StatisticUserDto[] = await this._userRepository.query(
            `SELECT count(*) as quantity, to_char(created_at, 'YYYY-MM') as time
                 FROM users 
                GROUP BY to_char(created_at, 'YYYY-MM')
                ORDER BY to_char(created_at, 'YYYY-MM')`
        );
        return result;
    }
}
