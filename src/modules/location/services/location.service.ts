import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { FamilyService } from '../../family/services/family.service';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { Location } from '../entities/location.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';

@Injectable()
export class LocationService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(Location)
        private readonly _locationRepository: Repository<Location>,
        @InjectMapper() private readonly _mapper: Mapper,
        private readonly _configService: AppConfigService,
        private readonly _familyService: FamilyService
    ) {}

    public async getNearlyLocation(latitude: number, longitude: number): Promise<Location[]> {
        try {
            const radius = Number(this._configService.get('RADIUS')) || 500; // In meters
            const userId = this._req.user.id;
            const memberInformation = await this._familyService.getMemberInformationByUserId(userId);
            const locations = await this._locationRepository.query(
                `Select *,
                    st_distancesphere(st_makepoint(${latitude}, ${longitude}),st_makepoint(location.lat, location.long)) as distance
                from location
                where 
                    st_dwithin(st_makepoint(${latitude}, ${longitude}), st_makepoint(location.lat, location.long), ${radius / 100000})
                    AND 
                        (location.status = ${LocationStatusEnum.Published}
                            OR (location.status IN(${LocationStatusEnum.Personal}, ${LocationStatusEnum.WaitingPublish})    
                                    AND (
                                        location.created_by = ${userId}
                                        ${memberInformation ? 'OR location.family_id = ' + memberInformation.familyId : ''}
                                    )
                                )
                        )
                order by distance`
            );
            return locations;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
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
            });
            if (createLocationDto.familyId) {
                query.andWhere({ familyId: createLocationDto.familyId });
            }
            const locationExist = await query.getOne();
            if (locationExist) {
                throw new BadRequestException('location_does_exist');
            }
            const location = await this._locationRepository.save(createLocationDto, {
                data: { request: this._req },
            });
            return location;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByAdmin(params: PaginationLocationDto): Promise<Location[]> {
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
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async getPagedListByUser(params: PaginationLocationDto): Promise<Location[]> {
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
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async adminUpdate(dto: UpdateLocationDto): Promise<boolean> {
        const location = await this._locationRepository.findOneBy({ id: dto.id });

        if (!location) throw new NotFoundException('location_not_found');
        if (location.status !== LocationStatusEnum.Published) throw new ForbiddenException('no_permission');
        const status: string = dto.status;
        const updateLocation = { ...location, status: LocationStatusEnum[status] };

        try {
            const result = await this._locationRepository.save(updateLocation, {
                data: { request: this._req },
            });
            return !!result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    public async userUpdate(locationId: string): Promise<boolean> {
        const location = await this._locationRepository.findOneBy({ id: locationId });

        if (!location) throw new NotFoundException('location_not_found');
        if (
            (location.status !== LocationStatusEnum.Personal && location.status !== LocationStatusEnum.WaitingPublish) ||
            location.createdBy !== this._req.user.id
        )
            throw new ForbiddenException('no_permission');

        const updateLocation = { ...location, status: LocationStatusEnum.WaitingPublish };

        try {
            const result = await this._locationRepository.save(updateLocation, {
                data: { request: this._req },
            });
            return !!result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
