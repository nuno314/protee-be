import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
        console.log(1111);
        try {
            if (this._req.user.role === RolesEnum.ADMIN) {
                createLocationDto.status = LocationStatusEnum.Published;
            } else {
                createLocationDto.status = LocationStatusEnum.Personal;
            }
            const location = await this._locationRepository.save(createLocationDto, {
                data: { request: this._req },
            });

            return location;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
    public async getPagedList(params: PaginationLocationDto): Promise<Location[]> {
        try {
            const queryBuilder = this._locationRepository.createQueryBuilder('location');
            const filter = params.filter ? params.filter : '';
            queryBuilder.where([{ name: ILike(`%${filter}%`) }]);
            const result = await queryBuilder.getMany();
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async update(dto: UpdateLocationDto): Promise<boolean> {
        const location = await this._locationRepository.findOneBy({ id: dto.id });

        if (!location) throw new NotFoundException('location_not_found');
        const status: string = dto.status;
        console.log(111, LocationStatusEnum[status]);
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
}
