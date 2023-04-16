import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';

import { LoggerService } from '../shared/services/logger.service';

import { RolesEnum } from '../common/enums/roles.enum';
import { SystemUserEntity } from '../modules/system-users/entities/system-users.entity';

@Injectable()
export class SeederService implements OnModuleInit {
    private _systemUserRepository: Repository<SystemUserEntity>;

    constructor(
        private readonly _dataSource: DataSource,
        private readonly _logger: LoggerService
    ) {
        this._systemUserRepository = _dataSource.getRepository(SystemUserEntity);
    }

    async onModuleInit() {
        const seedSystemAdmin = await this.seedSystemAdmin();
        if (seedSystemAdmin) {
            this._logger.info('Seed System admin Successfully');
        } else {
            this._logger.error('Seed System admin Failure');
        }
    }

    public async seed(): Promise<boolean> {
        return true;
    }

    public async seedSystemAdmin(): Promise<boolean> {
        try {
            const adminEmail = 'protee@gmail.com';
            const existedSystemAdmin = await this._systemUserRepository.findOneBy({ email: adminEmail});

            if (existedSystemAdmin) {
                this._logger.info('System admin already existed');
                return false;
            }

            const admin: SystemUserEntity = {
                email: adminEmail,
                password: bcrypt.hashSync('qwQW12!@'),
                role: RolesEnum.ADMIN,
            };
            return !!(await this._systemUserRepository.save(admin));
        } catch (e) {
            this._logger.error(e);
            return false;
        }
    }
}
