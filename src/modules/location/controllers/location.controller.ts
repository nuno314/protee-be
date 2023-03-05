import { Controller, Get, HttpStatus, Param, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';
import { LocationDto } from '../dtos/domains/location.dto';
import { LocationService } from '../services/location.service';

@Controller('location')
@ApiTags('location')
export class LocationController extends BaseController {
    constructor(private readonly _locationService: LocationService) {
        super();
    }

    // @ApiOperation({ summary: 'Get cities' })
    // @ApiResponse({ status: HttpStatus.OK })
    // @Version('1')
    // @Get('getCities')
    // async get(): Promise<LocationDto[]> {
    //     const cities = await this._locationService.getCities();
    //     return cities;
    // }

    // @ApiOperation({ summary: 'Get districts' })
    // @ApiResponse({ status: HttpStatus.OK })
    // @Get('getDistricts/:cityId')
    // async getDistricts(@Param('cityId') cityId: string): Promise<LocationDto[]> {
    //     const districts = await this._locationService.getDistricts(cityId);
    //     return districts;
    // }

    // @ApiOperation({ summary: 'Get wards' })
    // @ApiResponse({ status: HttpStatus.OK })
    // @Get('getWards/:districtId')
    // async getWards(@Param('districtId') districtId: string): Promise<LocationDto[]> {
    //     const wards = await this._locationService.getWards(districtId);
    //     return wards;
    // }
}
