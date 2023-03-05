/* eslint-disable simple-import-sort/imports */
import { Injectable } from '@nestjs/common';
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

@Injectable()
export class AuthProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: any) => {};
    }
}
