import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateSettingDto } from '../dtos/requests/update-setting.dto';
import { SettingsEntity } from '../entities/settings.entity';
import { SettingsCodeEnum } from '../enums/settings-type.enum';

@Injectable()
export class SettingsService {
    constructor(
        @Inject(REQUEST) private readonly _req: any,
        @InjectRepository(SettingsEntity) private readonly _settingsRepository: Repository<SettingsEntity>
    ) {}

    public async getRadiusSetting(): Promise<SettingsEntity> {
        return await this._settingsRepository.findOneBy({ code: SettingsCodeEnum.Radius });
    }

    public async setRadiusSetting(request: UpdateSettingDto): Promise<SettingsEntity> {
        const setting = await this._settingsRepository.findOneBy({ code: SettingsCodeEnum.Radius });

        if (!setting) throw new NotFoundException('setting_not_found');

        setting.data = Number(request.data);
        setting.updatedBy = this._req.user.id;
        return await this._settingsRepository.save(setting, { data: { request: this._req } });
    }
}
