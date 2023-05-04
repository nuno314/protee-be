import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolesEnum } from '../../../common/enums/roles.enum';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { Location } from '../entities/location.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';

@Injectable()
export class LocationService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(Location)
        private readonly _locationRepository: Repository<Location>
    ) {}

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
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
}
