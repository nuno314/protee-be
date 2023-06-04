/* eslint-disable simple-import-sort/imports */
import { Injectable } from '@nestjs/common';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { LocationDto } from './dtos/domains/location.dto';
import { LocationEntity } from './entities/location.entity';

@Injectable()
export class LocationProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: any) => {
            createMap(
                mapper,
                LocationEntity,
                LocationDto,
                forMember(
                    (d) => d.lat,
                    mapFrom((s) => Number(s.lat))
                ),
                forMember(
                    (d) => d.long,
                    mapFrom((s) => Number(s.long))
                )
            );
        };
    }
}
