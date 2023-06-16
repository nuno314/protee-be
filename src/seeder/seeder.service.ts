import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';

import { RolesEnum } from '../common/enums/roles.enum';
import { SettingsEntity } from '../modules/settings/entities/settings.entity';
import { SettingsCodeEnum } from '../modules/settings/enums/settings-type.enum';
import { SystemUserEntity } from '../modules/system-users/entities/system-users.entity';

@Injectable()
export class SeederService implements OnModuleInit {
    private _systemUserRepository: Repository<SystemUserEntity>;
    private _settingsRepository: Repository<SettingsEntity>;

    constructor(private readonly _dataSource: DataSource) {
        this._systemUserRepository = _dataSource.getRepository(SystemUserEntity);
        this._settingsRepository = _dataSource.getRepository(SettingsEntity);
    }

    async onModuleInit() {
        const seedSystemAdmin = await this.seedSystemAdmin();
        if (seedSystemAdmin) {
            console.log('Seed System admin Successfully');
        } else {
            console.log('Seed System admin Failure');
        }
        const seedRadiusSetting = await this.seedRadiusSetting();
        if (seedRadiusSetting) {
            console.log('Seed radius setting Successfully');
        } else {
            console.log('Seed radius setting Failure');
        }
    }

    public async seed(): Promise<boolean> {
        return true;
    }

    public async seedSystemAdmin(): Promise<boolean> {
        try {
            const adminEmail = 'protee@gmail.com';
            const existedSystemAdmin = await this._systemUserRepository.findOneBy({ email: adminEmail });

            if (existedSystemAdmin) {
                console.log('System admin already existed');
                return false;
            }

            const admin: SystemUserEntity = {
                email: adminEmail,
                password: bcrypt.hashSync('qwQW12!@'),
                role: RolesEnum.ADMIN,
            };
            return !!(await this._systemUserRepository.save(admin));
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public async seedRadiusSetting(): Promise<boolean> {
        try {
            const existedSetting = await this._settingsRepository.findOneBy({ code: SettingsCodeEnum.Radius });

            if (existedSetting) {
                console.log('Radius setting already existed');
                return false;
            }

            const setting: SettingsEntity = {
                code: SettingsCodeEnum.Radius,
                data: 500,
            };
            return !!(await this._settingsRepository.save(setting));
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
