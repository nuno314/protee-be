import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(Location)
        private readonly _locationRepository: Repository<Location>
    ) {}

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        try {
            const location = await this._locationRepository.save(createLocationDto, {
                data: { request: this._req },
            });

            return location;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
