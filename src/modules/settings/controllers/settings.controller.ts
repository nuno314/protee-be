/* eslint-disable simple-import-sort/imports */
import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';

import { RolesGuard } from '../../../guards/role.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';

import { Roles } from '../../../decorators/role.decorator';
import { RolesEnum } from '../../../common/enums/roles.enum';

import { SettingsService } from '../services/settings.service';
import { SettingsEntity } from '../entities/settings.entity';
import { UpdateSettingDto } from '../dtos/requests/update-setting.dto';

@Controller('settings')
@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolesEnum.ADMIN)
export class SettingsController extends BaseController {
    constructor(private readonly _analytics: SettingsService) {
        super();
    }

    /* Method GET */
    @ApiOperation({ summary: 'Get radius setting' })
    @Get('radius')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getRadiusSetting(): Promise<SettingsEntity> {
        return await this._analytics.getRadiusSetting();
    }

    @ApiOperation({ summary: 'Set radius setting' })
    @Put('radius')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async setRadiusSetting(@Body() request: UpdateSettingDto): Promise<SettingsEntity> {
        return await this._analytics.setRadiusSetting(request);
    }
}
