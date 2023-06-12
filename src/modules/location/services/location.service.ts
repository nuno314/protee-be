import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { StatusResponseDto } from '../../../common/dto/status-response.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { FamilyService } from '../../family/services/family.service';
import { UsersService } from '../../users/services/users.service';
import { LocationDto } from '../dtos/domains/location.dto';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { LocationAccessHistoryEntity } from '../entities/location-access-history.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';
import { NotificationGateway } from '../gateway/notification.gateway';

@Injectable()
export class LocationService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(LocationEntity)
        private readonly _locationRepository: Repository<LocationEntity>,
        @InjectRepository(LocationAccessHistoryEntity)
        private readonly _locationAccessHistoryRepository: Repository<LocationAccessHistoryEntity>,
        @InjectMapper() private readonly _mapper: Mapper,
        private readonly _configService: AppConfigService,
        private readonly _familyService: FamilyService,
        private readonly _notificationGateway: NotificationGateway,
        private readonly _userService: UsersService
    ) {}

    public async getNearlyLocation(latitude: number, longitude: number): Promise<LocationDto[]> {
        try {
            const radius = Number(this._configService.get('RADIUS')) || 500; // In meters
            const userId = this._req.user.id;
            const memberInformation = await this._familyService.getMemberInformationByUserId(userId);
            const locations: LocationEntity[] = await this._locationRepository.query(
                `Select *,
                    st_distancesphere(st_makepoint(${latitude}, ${longitude}),st_makepoint(location.lat, location.long)) as distance
                from location
                where 
                    st_dwithin(st_makepoint(${latitude}, ${longitude}), st_makepoint(location.lat, location.long), ${radius / 100000})
                    AND 
                        (location.status = '${LocationStatusEnum.Published}'
                            OR (location.status IN('${LocationStatusEnum.Personal}', '${LocationStatusEnum.WaitingPublish}')    
                                    AND (
                                        location.created_by = '${userId}'
                                        ${memberInformation ? "OR location.family_id = '" + memberInformation.familyId + "'" : ''}
                                    )
                                )
                        )
                order by distance`
            );
            const accessHistoryItems: LocationAccessHistoryEntity[] = (locations || []).map((item) => {
                return {
                    userId,
                    createdBy: userId,
                    locationId: item.id,
                    currentLat: latitude,
                    currentLong: longitude,
                    distance: item.distance,
                };
            });

            await this._locationAccessHistoryRepository.save(accessHistoryItems, {
                data: { request: this._req },
            });
            const user = await this._userService.getById(userId);
            const noti = {
                user,
                locations,
            };
            this._notificationGateway.emitNotificationToRoom(noti, `parent_${memberInformation.familyId}`);
            return this._mapper.mapArray(locations || [], LocationEntity, LocationDto);
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async createLocation(createLocationDto: CreateLocationDto): Promise<LocationDto> {
        try {
            if (this._req.user.role === RolesEnum.ADMIN) {
                createLocationDto.status = LocationStatusEnum.Published;
            } else {
                createLocationDto.status = LocationStatusEnum.Personal;
                const memberInformation = await this._familyService.getMemberInformationByUserId(this._req.user.id);
                createLocationDto.familyId = memberInformation?.familyId;
            }
            const query = this._locationRepository.createQueryBuilder().where({
                long: createLocationDto.long,
                lat: createLocationDto.lat,
                status: createLocationDto.status,
                createdBy: this._req.user.id,
            });
            if (createLocationDto.familyId) {
                query.andWhere({ familyId: createLocationDto.familyId });
            }
            const locationExist = await query.getOne();
            if (locationExist) {
                throw new BadRequestException('location_does_exist');
            }
            createLocationDto.createdBy = this._req.user.id;
            const location = await this._locationRepository.save(createLocationDto, {
                data: { request: this._req },
            });
            return this._mapper.map(location, LocationEntity, LocationDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByAdmin(params: PaginationLocationDto): Promise<LocationDto[]> {
        try {
            const queryBuilder = this._locationRepository.createQueryBuilder('location');
            const filter = params.filter ? params.filter : '';
            queryBuilder.andWhere([{ name: ILike(`%${filter}%`) }]);
            queryBuilder.orderBy(params.sortField, params.order === 'ASC' ? 'ASC' : 'DESC');
            if (params.status) {
                const status = params.status ? params.status : '';
                queryBuilder.andWhere({ status: status });
            }

            const result = await queryBuilder.getMany();
            return this._mapper.mapArray(result, LocationEntity, LocationDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByUser(params: PaginationLocationDto): Promise<LocationDto[]> {
        try {
            const queryBuilder = this._locationRepository.createQueryBuilder('location');
            const filter = params.filter ? params.filter : '';
            queryBuilder.andWhere([{ name: ILike(`%${filter}%`) }]);
            queryBuilder.orderBy(params.sortField, params.order === 'ASC' ? 'ASC' : 'DESC');
            if (params.status) {
                const status = params.status ? params.status : '';
                queryBuilder.andWhere({ status: status });
            }
            let memberInformation;
            if (this._req.user.role !== RolesEnum.ADMIN) {
                memberInformation = await this._familyService.getMemberInformationByUserId(this._req.user.id);
            }
            queryBuilder.andWhere((locations) => {
                locations.where({ status: LocationStatusEnum.Personal, createdBy: this._req.user.id });
                locations.orWhere({ status: LocationStatusEnum.Published });
                locations.orWhere({ status: LocationStatusEnum.WaitingPublish, createdBy: this._req.user.id });
                if (memberInformation) {
                    locations.orWhere({ status: LocationStatusEnum.Personal, familyId: memberInformation.familyId });
                    locations.orWhere({ status: LocationStatusEnum.WaitingPublish, familyId: memberInformation.familyId });
                }
            });
            const result = await queryBuilder.getMany();
            return this._mapper.mapArray(result, LocationEntity, LocationDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async adminUpdateLocation(dto: UpdateLocationDto): Promise<boolean> {
        if (LocationStatusEnum[dto.status] === undefined) throw new ForbiddenException('wrong_input');
        const location = await this._locationRepository.findOneBy({ id: dto.id });
        if (!location) throw new NotFoundException('location_not_found');
        if (
            location.status === LocationStatusEnum.Personal ||
            LocationStatusEnum[dto.status] === LocationStatusEnum.WaitingPublish ||
            ((location.status === LocationStatusEnum.Published || location.status === LocationStatusEnum.Hidden) &&
                LocationStatusEnum[dto.status] === LocationStatusEnum.Personal)
        )
            throw new ForbiddenException('no_permission');
        try {
            const result = await this._locationRepository.save(
                { ...location, status: LocationStatusEnum[dto.status], updatedBy: this._req.user.id },
                {
                    data: { request: this._req },
                }
            );
            return !!result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    public async userPublishLocation(locationId: string): Promise<StatusResponseDto> {
        const location = await this._locationRepository.findOneBy({ id: locationId });

        if (!location) throw new NotFoundException('location_not_found');
        if (
            (location.status !== LocationStatusEnum.Personal && location.status !== LocationStatusEnum.WaitingPublish) ||
            location.createdBy !== this._req.user.id
        )
            throw new ForbiddenException('no_permission');

        try {
            const result = await this._locationRepository.save(
                { ...location, status: LocationStatusEnum.WaitingPublish, updatedBy: this._req.user.id },
                {
                    data: { request: this._req },
                }
            );
            return { result: !!result };
        } catch (err) {
            console.log(err);
            return { result: false };
        }
    }
    public async userRemoveLocation(locationId: string): Promise<StatusResponseDto> {
        const location = await this._locationRepository.findOneBy({ id: locationId });
        if (!location) throw new NotFoundException('location_not_found');
        if (location.status !== LocationStatusEnum.Personal || location.createdBy !== this._req.user.id)
            throw new ForbiddenException('no_permission');
        try {
            const result =
                (await this._locationRepository.softRemove(location)) &&
                (await this._locationRepository.save({ ...location, createdBy: null }));
            return { result: !!result };
        } catch (err) {
            console.log(err);
            return { result: false };
        }
    }
}
