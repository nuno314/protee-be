import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ILike, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { StatusResponseDto } from '../../../common/dto/status-response.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { FamilyRoleEnum } from '../../family/enums/family-role.enum';
import { FamilyService } from '../../family/services/family.service';
import { ChatGateway } from '../../message/gateway/chat.gateway';
import { CreateNotificationDto } from '../../notification/dto/requests';
import { NotificationTypeEnum } from '../../notification/enums/notification-type.enum';
import { NotificationService } from '../../notification/services/notification.service';
import { SettingsService } from '../../settings/services/settings.service';
import { UsersService } from '../../users/services/users.service';
import { LocationDto } from '../dtos/domains/location.dto';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { GetUserAccessLocationHistoryRequest } from '../dtos/requests/get-user-access-location.request';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { LocationAccessHistoryEntity } from '../entities/location-access-history.entity';
import { UserLocationHistoryEntity } from '../entities/user-location-history.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';

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
        private readonly _socketGateway: ChatGateway,
        private readonly _userService: UsersService,
        @InjectRepository(UserLocationHistoryEntity)
        private readonly _userLocationHistoryRepository: Repository<UserLocationHistoryEntity>,
        private readonly _settingsService: SettingsService,
        private readonly _notificationService: NotificationService
    ) {}

    public async getUserAccessLocationHistory(
        request: GetUserAccessLocationHistoryRequest
    ): Promise<PaginationResponseDto<LocationAccessHistoryEntity>> {
        const requestMemberInfor = await this._familyService.getMemberInformationByUserId(this._req.user.id);
        if (requestMemberInfor?.role !== FamilyRoleEnum.Parent) throw new ForbiddenException();

        const targetMemberInfor = await this._familyService.getMemberInformationByUserId(request.userId);
        if (requestMemberInfor?.familyId !== targetMemberInfor?.familyId) throw new ForbiddenException();

        const targetUserInfor = await this._userService.getById(request.userId);
        if (!targetUserInfor) throw new NotFoundException('user_not_found');

        try {
            let builder = this._locationAccessHistoryRepository.createQueryBuilder('access');

            builder = builder
                .leftJoinAndSelect('access.userLocationHistory', 'history')
                .where(`access.createdBy = '${request.userId}'`)
                .andWhere(`history.family_id = '${targetMemberInfor?.familyId}'`);
            if (request.fromDate) {
                builder = builder.andWhere(`access.createdAt >= '${request.fromDate}'`);
                // builder = builder.andWhere(`access.createdAt >= '${moment(request.fromDate).startOf('day').format()}'`);
            }
            if (request.toDate) {
                builder = builder.andWhere(`access.createdAt <= '${request.toDate}'`);
                // builder = builder.andWhere(`access.createdAt <= '${moment(request.toDate).endOf('day').format()}'`);
            }
            builder = builder
                .skip(request.skip || (Number(request.page) - 1) * Number(request.take))
                .take(request.take)
                .orderBy('access.createdAt', 'DESC');

            const [data, total] = await builder.getManyAndCount();

            if (!data?.length)
                return {
                    data: [],
                    total: 0,
                    take: 0,
                    page: 0,
                };

            const locationIds = data.map((x) => x.locationId);
            const locations = await this._locationRepository.find({
                where: { id: In(locationIds) },
                select: { name: true, lat: true, long: true, id: true, description: true, icon: true },
            });

            data.map((x) => {
                x.user = {
                    name: targetUserInfor.name,
                    avt: targetUserInfor.avt,
                };
                x.userLocationHistory = {
                    ...x.userLocationHistory,
                    currentLat: Number(x.userLocationHistory?.currentLat),
                    currentLong: Number(x.userLocationHistory?.currentLong),
                };
                x.location = locations.find((y) => y.id === x.locationId);
                x.location = {
                    ...x.location,
                    lat: Number(x.location?.lat),
                    long: Number(x.location?.long),
                };
            });

            return {
                data: data,
                total: total,
            };
        } catch (error) {
            console.log(error);
            return {
                data: [],
                total: 0,
                take: 0,
                page: 0,
            };
        }
    }

    public async getUserLastLocation(userId: string): Promise<{ result: UserLocationHistoryEntity }> {
        const requestMemberInfor = await this._familyService.getMemberInformationByUserId(this._req.user.id);
        if (requestMemberInfor?.role !== FamilyRoleEnum.Parent) throw new ForbiddenException();

        const targetMemberInfor = await this._familyService.getMemberInformationByUserId(userId);
        if (requestMemberInfor?.familyId !== targetMemberInfor?.familyId) throw new ForbiddenException();

        const result = await this._userLocationHistoryRepository
            .createQueryBuilder()
            .where({ createdBy: userId, familyId: targetMemberInfor.familyId })
            .orderBy('created_at', 'DESC')
            .getOne();

        if (!result) return { result: null };

        const targetUserInfor = await this._userService.getById(userId);
        result.user = targetUserInfor;
        return { result: result };
    }

    public async getNearlyLocation(latitude: number, longitude: number): Promise<LocationDto[]> {
        const radiusSettings = await this._settingsService.getRadiusSetting();
        const radius = Number(radiusSettings?.data) || 500; // In meters
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

        try {
            const userLocationHistoryDto: UserLocationHistoryEntity = {
                currentLat: latitude,
                currentLong: longitude,
                createdBy: userId,
                familyId: memberInformation?.familyId,
            };

            const userLocationHistory = await this._userLocationHistoryRepository.save(userLocationHistoryDto, {
                data: { request: this._req },
            });
            const user = await this._userService.getById(userId);
            userLocationHistory.user = user;

            const noti: any = {
                user,
                currentLocation: userLocationHistory,
            };
            this._socketGateway.emitNotificationToRoom(noti, `parent_${memberInformation.familyId}`);
            if (locations.length) {
                // const ids = locations.map((i) => i.id);
                // const point = moment().subtract(3, 'minutes').format();

                // const recentWarningLocation = await this._locationAccessHistoryRepository
                //     .createQueryBuilder()
                //     .where({ locationId: In(ids), createdAt: MoreThanOrEqual(point) })
                //     .getMany();

                // const recentWarningLocationIds = (recentWarningLocation || []).map((x) => x.locationId);

                // const needWarningLocations = locations.filter((x) => !recentWarningLocationIds.includes(x.id));

                // if (needWarningLocations?.length) {
                // }
                const accessHistoryItems: LocationAccessHistoryEntity[] = (locations || []).map((item) => {
                    return {
                        createdBy: userId,
                        locationId: item.id,
                        userLocationHistoryId: userLocationHistory.id,
                        distance: parseInt(item.distance.toString()),
                    };
                });

                await this._locationAccessHistoryRepository.save(accessHistoryItems, {
                    data: { request: this._req },
                });
                noti.dangerousLocations = locations;
                this._socketGateway.emitWarningToRoom(noti, `parent_${memberInformation.familyId}`);
            }
        } catch (e) {
            console.log(e);
        }
        return this._mapper.mapArray(locations || [], LocationEntity, LocationDto);
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
            if (location.familyId) {
                const allMembers = await this._familyService.getFamilyMembers();
                const actor = await this._userService.getById(this._req.user.id);
                allMembers.forEach((mem) => {
                    if (mem.userId !== this._req.user.id) {
                        const notiRequest: CreateNotificationDto = {
                            title: `${actor.name} đã thêm ${location.name} vào vị trí nguy hiểm`,
                            content: '',
                            isRead: false,
                            type: NotificationTypeEnum.AddLocation,
                            userId: mem.user.id,
                            familyId: mem.familyId,
                            data: {
                                locationId: location.id,
                                locationName: location.name,
                                createdByUserId: this._req.user.id,
                                createdByUser: {
                                    name: actor.name,
                                    id: actor.id,
                                    avt: actor.avt,
                                },
                            },
                        };
                        this._notificationService.create(notiRequest);
                    }
                });
            }
            return this._mapper.map(location, LocationEntity, LocationDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByAdmin(params: PaginationLocationDto): Promise<LocationEntity[]> {
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
            const users = await this._userService.getUsersById(result.map((temp) => temp.createdBy));
            return result.map((location) => {
                return {
                    ...location,
                    lat: Number(location.lat),
                    long: Number(location.long),
                    user:
                        users.filter((value) => {
                            return value.id == location.createdBy;
                        })[0] || null,
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByUser(params: PaginationLocationDto): Promise<LocationEntity[]> {
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
                // locations.orWhere({ status: LocationStatusEnum.WaitingPublish, createdBy: this._req.user.id });
                if (memberInformation) {
                    locations.orWhere({ status: LocationStatusEnum.Personal, familyId: memberInformation.familyId });
                    // locations.orWhere({ status: LocationStatusEnum.WaitingPublish, familyId: memberInformation.familyId });
                }
            });
            const result = await queryBuilder.getMany();
            const users = await this._userService.getUsersById(result.map((temp) => temp.createdBy));
            return result.map((location) => {
                return {
                    ...location,
                    lat: Number(location.lat),
                    long: Number(location.long),
                    user:
                        users.filter((value) => {
                            return value.id == location.createdBy;
                        })[0] || null,
                };
            });
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
        if (location.status !== LocationStatusEnum.Personal || (location.createdBy !== this._req.user.id && !location.familyId))
            throw new ForbiddenException('no_permission');
        if (location.createdBy !== this._req.user.id) {
            if (location.familyId) {
                const requestMemberInfor = await this._familyService.getMemberInformationByUserId(this._req.user.id);
                const memberCreatedLocation = await this._familyService.getMemberInformationByUserId(location.createdBy);
                if (
                    requestMemberInfor.role !== FamilyRoleEnum.Parent ||
                    memberCreatedLocation.role !== FamilyRoleEnum.Child ||
                    requestMemberInfor.familyId !== location.familyId
                ) {
                    throw new ForbiddenException('no_permission');
                }
            } else {
                throw new ForbiddenException('no_permission');
            }
        }
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
