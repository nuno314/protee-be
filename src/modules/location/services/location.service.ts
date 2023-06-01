import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { LocationDto } from '../dtos/domains/location.dto';
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
        @InjectMapper() private readonly _mapper: Mapper
    ) {}

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        try {
            if (this._req.user.role === RolesEnum.ADMIN) {
                createLocationDto.status = LocationStatusEnum.Published;
            } else {
                createLocationDto.status = LocationStatusEnum.Personal;
            }
            const locationExist = await this._locationRepository.findOneBy({
                long: createLocationDto.long,
                lat: createLocationDto.lat,
                status: createLocationDto.status,
            });
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
    public async getPagedList(params: PaginationLocationDto): Promise<Location[]> {
        try {
            const queryBuilder = this._locationRepository.createQueryBuilder('location');
            const filter = params.filter ? params.filter : '';
            queryBuilder.andWhere([{ name: ILike(`%${filter}%`) }]);
            queryBuilder.orderBy(params.sortField, params.order === 'ASC' ? 'ASC' : 'DESC');

            if (this._req.user.role !== RolesEnum.ADMIN) {
                queryBuilder.andWhere((locations) => {
                    locations.where({ status: 'personal', createdBy: this._req.user.id });
                    locations.orWhere({ status: 'published' });
                });
            }
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
    public async adminUpdate(dto: UpdateLocationDto): Promise<boolean> {
        const location = await this._locationRepository.findOneBy({ id: dto.id });

        if (!location) throw new NotFoundException('location_not_found');
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
