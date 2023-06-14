/* eslint-disable simple-import-sort/imports */
import { Controller, Get, HttpCode, HttpStatus, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';

import { RolesGuard } from '../../../guards/role.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';

import { Roles } from '../../../decorators/role.decorator';
import { RolesEnum } from '../../../common/enums/roles.enum';

import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
@ApiTags('analytics')
@ApiBearerAuth()
export class AnalyticsController extends BaseController {
    constructor(private readonly _analytics: AnalyticsService) {
        super();
    }

    /* Method GET */
    @ApiOperation({ summary: 'Get number user' })
    @Get('admin/number-user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getNumberUser(): Promise<number> {
        return await this._analytics.getNumberUserByAdmin();
    }
    @ApiOperation({ summary: 'Get number family' })
    @Get('admin/number-family')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getNumberFamily(): Promise<number> {
        return await this._analytics.getNumberFamilyByAdmin();
    }
    @ApiOperation({ summary: 'Get number location' })
    @Get('admin/number-location')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getNumberLocation(): Promise<number> {
        return await this._analytics.getNumberLocationByAdmin();
    }

    // For Users
}
