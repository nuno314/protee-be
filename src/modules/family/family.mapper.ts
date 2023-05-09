/* eslint-disable simple-import-sort/imports */
import { Injectable } from '@nestjs/common';
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { FamilyEntity } from './entities/family.entity';
import { FamilyDto } from './dtos/domains/family.dto';

@Injectable()
export class FamilyProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: any) => {
            createMap(mapper, FamilyEntity, FamilyDto);
        };
    }
}
