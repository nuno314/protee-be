import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { Roles } from '../../../decorators/role.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/role.guard';
import { LocationDto } from '../dtos/domains/location.dto';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { GetNearlyLocationRequest } from '../dtos/requests/get-nearly-location.request';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { Location } from '../entities/location.entity';
import { LocationService } from '../services/location.service';

@ApiTags('location')
@Controller('location')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LocationController {
    constructor(private readonly _locationService: LocationService) {}

    @ApiOperation({ summary: 'Get locations for admin' })
    @Get('/system-user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getLocationAdmin(@Query() params: PaginationLocationDto): Promise<LocationDto[]> {
        return await this._locationService.getPagedListByAdmin(params);
    }
    @ApiOperation({ summary: 'Get locations for user' })
    @Get('/user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    // @Roles(RolesEnum.ADMIN)
    public async getLocationUser(@Query() params: PaginationLocationDto): Promise<LocationDto[]> {
        return await this._locationService.getPagedListByUser(params);
    }
    @ApiOperation({ summary: 'Admin update a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update location',
    })
    @Put('/system-user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async updateLocation(@Body() body: UpdateLocationDto): Promise<boolean> {
        return await this._locationService.adminUpdate(body);
    }
    @ApiOperation({ summary: 'User update a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update location',
    })
    @Put('/user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    public async userUpdateLocation(@Body() body: { locationId: string }): Promise<boolean> {
        return await this._locationService.userUpdate(body.locationId);
    }
    @ApiOperation({ summary: 'Create a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create a location',
    })
    @Post('/')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async createLocation(@Body() body: CreateLocationDto): Promise<CreateLocationDto> {
        return await this._locationService.create(body);
    }

    @ApiOperation({ summary: 'Get nearly dangerous location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get nearly dangerous location',
    })
    @Post('/get-nearly')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getNearlyLocation(@Body() body: GetNearlyLocationRequest): Promise<Location[]> {
        return await this._locationService.getNearlyLocation(body.lat, body.long);
    }
}
