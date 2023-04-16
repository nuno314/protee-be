/* eslint-disable simple-import-sort/imports */
import { Injectable } from '@nestjs/common';
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserEntity } from './entities/users.entity';
import { UserDto } from './dtos/domains/user.dto';
import { UpdateUserDto } from './dtos/requests/update-user.dto';

@Injectable()
export class UsersProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: any) => {
            createMap(
                mapper,
                UserEntity,
                UserDto,
            );
            createMap(
                mapper,
                UserEntity,
                UpdateUserDto,
            );
            createMap(
                mapper,
                UpdateUserDto,
                UserEntity,
            );
        };
    }
}
