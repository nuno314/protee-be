import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProfileDto } from '../dto/response/profile.dto';
import { SystemUserEntity } from '../entities/system-users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SystemUserService {
    constructor(
        @InjectRepository(SystemUserEntity) private readonly _systemUsersRepository: Repository<SystemUserEntity>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
    }

    public async getProfile(id: string): Promise<ProfileDto> {
        const systemUser = await this._systemUsersRepository.findOneBy({ id: id });
        if (!systemUser) {
            throw new UnauthorizedException();
        }
        const response = this.mapper.map(systemUser, SystemUserEntity, ProfileDto);
        return response;
    }
}
