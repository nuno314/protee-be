import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { StatusResponseDto } from '../../../common/dto/status-response.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { Roles } from '../../../decorators/role.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/role.guard';
import { LocationDto } from '../dtos/domains/location.dto';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { GetNearlyLocationRequest } from '../dtos/requests/get-nearly-location.request';
import { GetUserAccessLocationHistoryRequest } from '../dtos/requests/get-user-access-location.request';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { LocationAccessHistoryEntity } from '../entities/location-access-history.entity';
import { UserLocationHistoryEntity } from '../entities/user-location-history.entity';
import { LocationService } from '../services/location.service';

@ApiTags('location')
@Controller('location')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LocationController {
    constructor(private readonly _locationService: LocationService) {}

    @ApiOperation({ summary: 'Get user last location' })
    @Get('/user/last-location/:userId')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getUserLastLocation(@Param('userId') userId: string): Promise<{ result: UserLocationHistoryEntity }> {
        return await this._locationService.getUserLastLocation(userId);
    }
    @ApiOperation({ summary: 'Get locations for admin' })
    @Get('/user/location-history')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getUserAccessLocationHistory(
        @Query() params: GetUserAccessLocationHistoryRequest
    ): Promise<PaginationResponseDto<LocationAccessHistoryEntity>> {
        return await this._locationService.getUserAccessLocationHistory(params);
    }
    @ApiOperation({ summary: 'Get locations for admin' })
    @Get('/system-user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getLocationByAdmin(@Query() params: PaginationLocationDto): Promise<LocationDto[]> {
        return await this._locationService.getPagedListByAdmin(params);
    }
    @ApiOperation({ summary: 'Get locations for user' })
    @Get('/user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    public async getLocationByUser(@Query() params: PaginationLocationDto): Promise<LocationEntity[]> {
        return await this._locationService.getPagedListByUser(params);
    }
    @ApiOperation({ summary: 'Admin update status of location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update location',
    })
    @Put('/system-user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async updateStatusByAdmin(@Body() body: UpdateLocationDto): Promise<boolean> {
        return await this._locationService.adminUpdateLocation(body);
    }
    @ApiOperation({ summary: 'User publish a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update location',
    })
    @Put('/user')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    public async publishLocationByUser(@Body() body: { locationId: string }): Promise<StatusResponseDto> {
        return await this._locationService.userPublishLocation(body.locationId);
    }
    @ApiOperation({ summary: 'Create a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create a location',
    })
    @Post('/')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async createLocation(@Body() body: CreateLocationDto): Promise<LocationDto> {
        return await this._locationService.createLocation(body);
    }
    @ApiOperation({ summary: 'User remove a location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Remove a location',
    })
    @Post('/user-remove')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async removeLocationByUser(@Body() body: { locationId: string }): Promise<StatusResponseDto> {
        return await this._locationService.userRemoveLocation(body.locationId);
    }

    @ApiOperation({ summary: 'Get nearly dangerous location' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get nearly dangerous location',
    })
    @Post('/get-nearly')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getNearlyLocation(@Body() body: GetNearlyLocationRequest): Promise<LocationDto[]> {
        return await this._locationService.getNearlyLocation(body.lat, body.long);
    }
}
