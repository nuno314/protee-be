/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { SystemUserDto } from './dto/domains/system-user.dto';
import { SystemUserEntity } from './entities/system-users.entity';

@Injectable()
export class SystemUserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: any) => {
            createMap(
                mapper,
                SystemUserEntity,
                SystemUserDto,
            );
        };
    }
}
