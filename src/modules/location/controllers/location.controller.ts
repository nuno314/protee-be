import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationLocationDto } from '../../../common/dto/pagination-location.dto';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { Roles } from '../../../decorators/role.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/role.guard';
import { LocationDto } from '../dtos/domains/location.dto';
import { CreateLocationDto } from '../dtos/requests/create-location.dto';
import { UpdateLocationDto } from '../dtos/requests/update-location.dto';
import { LocationService } from '../services/location.service';

@ApiTags('location')
@Controller('location')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LocationController {
    constructor(private readonly _locationService: LocationService) {}
    @ApiOperation({ summary: 'Get locations' })
    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    // @Roles(RolesEnum.ADMIN)
    public async getLocations(@Query() params: PaginationLocationDto): Promise<LocationDto[]> {
        return await this._locationService.getPagedList(params);
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
    @UseGuards(RolesGuard)
    // @Roles(RolesEnum.ADMIN)
    public async createLocation(@Body() body: CreateLocationDto): Promise<CreateLocationDto> {
        return await this._locationService.create(body);
    }
}
